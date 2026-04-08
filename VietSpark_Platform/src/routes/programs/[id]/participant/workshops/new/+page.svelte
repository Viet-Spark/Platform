<script>
    import { goto } from '$app/navigation';
    import { userData, userLoading, getUsers} from '$lib/stores/userStore';
    import { authUser } from '$lib/stores/authStore';
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

    onMount(async () => {
        try {
            loading = true;
            await programHandlers.getProgram(programId);
            await applicationHandlers.getApplications();
            await getUsers(); 

            // Find this user's application for this program
			const ids = ($userData?.applicationIds || []).slice();
			let myApplication = $applications.find((a) => ids.includes(a.id) && a.programId === programId && a.status === 'Approved') || null;

			if (!myApplication) {
				goto(`/programs/${programId}`);
			}
            await teamHandlers.getTeams();
            programTeams = $teams.filter(team => $curProgram.teamIds.includes(team.id)); 

        } catch (e) {
            error = e?.message || 'Failed to load workshop.';
        } finally {
            loading = false;
        }
    })

    async function handleSubmit(event) {
        loading = true; 
        error = ''; 
        let workshop = event.detail; 
        let workshopId = ""; 
        try {
            workshopId = await workshopHandlers.createWorkshop({
                title: workshop.title
            })
            // Upload cover image
            let coverImageUrl = workshop.coverUrl;
			if (workshop.coverTempFile) {
				coverImageUrl = await workshopHandlers.uploadCoverImage(workshop.coverTempFile, workshopId);
			}

            // Upload images
            let workshopImageUrls = workshop.imageUrls.filter(url => !url.startsWith('data:') && !url.startsWith('blob:')); // Keep existing URLs
            if (workshop.tempFiles?.length > 0) {
                const newUrls = await workshopHandlers.uploadWorkshopsImages(workshop.tempFiles, workshopId);
                workshopImageUrls = [...workshopImageUrls, ...newUrls];
            }

            if (workshop.startTime) {
                workshop.startTime = new Date(workshop.startTime); 
            }
            if (workshop.endTime) {
                workshop.endTime = new Date(workshop.endTime); 
            }
            if (workshop.registrationDeadline) {
                workshop.registrationDeadline = new Date(workshop.registrationDeadline); 
            }

            console.log('Preparing workshop data to submit...');

            const dataToSubmit = {
                ...workshop, 
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
            let workshopIds = [...$curProgram.workshopIds, workshopId]; 
            if ($curProgram) {
                const updatedProgramData = {
                    ...$curProgram, 
                    workshopIds: workshopIds
                }
                await programHandlers.updateProgram($curProgram.id, updatedProgramData); 
                console.log('Program saved successfully');
            }
            goto(`/programs/${programId}/participant/workshops/${workshopId}`); 
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
        <div class="container mx-auto md:my-5">
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

                <!-- Workshop -->
                <div class="space-y-6">
                    <WorkshopForm
                        isEditing={false}
                        on:submit={(e) => handleSubmit(e)}
                        loading={loading}
                        error={error}
                        teams={programTeams}
                        handleCancel={() => goto(`/programs/${programId}/participant/`)} disabled={loading}
                    />
                </div>
            </div>
        </div>
    {/if}
</section>