<script>
    import { goto } from '$app/navigation';
    import { getUserData, userData, userLoading } from '$lib/stores/userStore';
    import { authLoading, authUser } from '$lib/stores/authStore';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { teams, teamLoading, teamHandlers} from '$lib/stores/teamStore';
    import { workshopHandlers, workshopLoading, workshops } from '$lib/stores/workshopStore';
    import WorkshopForm from '$lib/components/WorkshopForm.svelte';
    import { curProgram, programLoading, programHandlers } from '$lib/stores/programStore';
    import { applications, applicationLoading, applicationHandlers } from '$lib/stores/applicationStore';

    let loading = true;
    let error = '';
    let programTeams = []; 

    $: programId = $page.params.id;
    $: workshopId = $page.params.workshopId;

    let workshop = null; 

    async function waitForAuthReady(timeoutMs = 15000) {
        const start = Date.now();
        while ($authLoading) {
            if (Date.now() - start > timeoutMs) return false;
            await new Promise((r) => setTimeout(r, 50));
        }
        return true;
    }

    async function ensureUserDataLoaded() {
        const authReady = await waitForAuthReady();
        if (!authReady) return false;
        if (!$authUser?.uid) return false;
        if (!$userData) {
            await getUserData($authUser.uid);
        }
        if ($userData && !$userData.id) {
            userData.update((cur) => (cur ? { ...cur, id: $authUser.uid } : cur));
        }
        return Boolean($userData);
    }

    onMount(async () => {
        try {
            loading = true;
            const ok = await ensureUserDataLoaded();
            if (!ok) {
                // Don't redirect while auth/userData is still loading; only redirect if user is not signed in.
                if (!$authLoading && !$authUser?.uid) {
                    goto(`/programs/${programId}`);
                } else {
                    error = 'Loading your profile... Please try again in a moment.';
                }
                return;
            }
            await programHandlers.getProgram(programId);
            await applicationHandlers.getApplications();
            
			// Find this user's application for this program
			const ids = ($userData?.applicationIds || []).slice();
			let myApplication = $applications.find((a) => ids.includes(a.id) && a.programId === programId && a.status === 'Approved') || null;

			if (!myApplication) {
				goto(`/programs/${programId}`);
			}

            if (!workshopId) {
                error = 'Missing workshop ID.';
                loading = false;
                return;
            }
            await teamHandlers.getTeams();
            programTeams = $teams.filter(team => $curProgram.teamIds.includes(team.id)); 
			const data = await workshopHandlers.getWorkshop(workshopId);

			if (!data) {
				error = 'Workshop not found.';
				return;
			}
            workshop = data;
        } catch (e) {
            error = e?.message || 'Failed to load workshop.';
        } finally {
            loading = false;
        }
    });

    async function handleSubmit(event) {
        loading = true; 
        error = ''; 
        let workshopData = event.detail; 
        try {
            // Upload cover image
            let coverImageUrl = workshopData.coverUrl;
			if (workshopData.coverTempFile) {
				coverImageUrl = await workshopHandlers.uploadCoverImage(workshopData.coverTempFile, workshopId);
			}

            // Upload images
            let workshopImageUrls = workshopData.imageUrls.filter(url => !url.startsWith('data:') && !url.startsWith('blob:')); // Keep existing URLs
            if (workshopData.tempFiles?.length > 0) {
                const newUrls = await workshopHandlers.uploadWorkshopsImages(workshopData.tempFiles, workshopId);
                workshopImageUrls = [...workshopImageUrls, ...newUrls];
            }
            if (workshopData.startTime) {
                workshopData.startTime = new Date(workshopData.startTime); 
            }
            if (workshopData.endTime) {
                workshopData.endTime = new Date(workshopData.endTime); 
            }
            if (workshopData.registrationDeadline) {
                workshopData.registrationDeadline = new Date(workshopData.registrationDeadline); 
            }
            console.log('Preparing workshop data to submit...');

            const dataToSubmit = {
                ...workshopData, 
                coverUrl: coverImageUrl,
                imageUrls: workshopImageUrls
            }
            // Remove all temporary fields and blob URLs
            delete dataToSubmit.tempFiles; 
            delete dataToSubmit.coverTempFile; 

            console.log("Workshop Data to submit:", dataToSubmit);

            await workshopHandlers.updateWorkshop(workshopId, dataToSubmit)
            console.log('Workshop saved successfully');
        } catch (e) {
            error = e.message || 'Failed to save Workshop';
            console.error('Error saving Workshop:', error);
        } finally {
            goto(`/programs/${programId}/participant/workshops/${workshop.id}`); 
            loading = false; 
        } 
    }
</script>

<section class="min-h-[50vh]">
    {#if loading}
        <div class="flex h-screen items-center justify-center">
            <span>Loading...</span>
        </div>
    {:else}
        <div class="container mx-auto">
            <div class="rounded-lg bg-white p-6 shadow-md">
                <!-- Error Display -->
                {#if error}
                    <div class="rounded-md bg-red-50 p-4">
                        <div class="flex">
                            <div class="ml-3">
                                <h3 class="text-sm font-medium text-red-800">Error</h3>
                                <div class="mt-2 text-sm text-red-700">{error}</div>
                            </div>
                        </div>
                    </div>
                {/if}

                {#if workshop}
                    <!-- Workshop -->
                    <div class="space-y-6">
                        <WorkshopForm
                            workshop={workshop}
                            isEditing={true}
                            on:submit={(e) => handleSubmit(e)}
                            loading={loading}
                            error={error}
                            teams={programTeams}
                            handleCancel={() => goto(`/programs/${programId}/participant/`)} disabled={loading}
                        />
                    </div>
                {:else}
                    <div class="flex h-screen items-center justify-center">
                        <p class="text-xl">Workshop not found.</p>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</section>