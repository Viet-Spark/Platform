<script>
    import { goto } from '$app/navigation';
    import { userData, userLoading } from '$lib/stores/userStore';
    import { authUser } from '$lib/stores/authStore';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { teams, teamLoading} from '$lib/stores/teamStore';
    import { workshopHandlers, workshopLoading, workshops } from '$lib/stores/workshopStore';
    import WorkshopForm from '$lib/components/WorkshopForm.svelte';
    import { curProgram, programLoading, programHandlers } from '$lib/stores/programStore';
    
    // Redirect if not admin
    $: if (!$userLoading && $authUser && $userData && !$userData.isAdmin) {
        goto('/');
    }
    let loading = false;
    let error = '';
    let programTeams = []; 
    let workshopId = $page.params.id; 
    let workshop = null; 

    $: if ($teams) {
        programTeams = $teams.filter(team => $curProgram.teamIds.includes(team.id)); 
    }

    $: if ($workshops) {
        workshop = $workshops.find(workshop => workshop.id === workshopId); 
    }

    async function handleSubmit(event) {
        loading = true; 
        error = ''; 
        let workshop = event.detail; 
        try {
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

            workshop.startTime = new Date(workshop.startTime); 
            workshop.endTime = new Date(workshop.endTime); 

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
            goto(`/admin/programs/edit/${$curProgram.id}/workshops`); 
            loading = false; 
        } 
    }
</script>

<section class="min-h-[50vh]">
    {#if $programLoading || $workshopLoading || loading}
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

                <!-- Workshop -->
                <div class="space-y-6">
                    <WorkshopForm
                        workshop={workshop}
                        isEditing={false}
                        on:submit={(e) => handleSubmit(e)}
                        loading={loading}
                        error={error}
                        teams={programTeams}
                        handleCancel={() => goto(`/admin/programs/edit/${$curProgram.id}/workshops`)} disabled={loading}
                    />
                </div>
            </div>
        </div>
    {/if}
</section>