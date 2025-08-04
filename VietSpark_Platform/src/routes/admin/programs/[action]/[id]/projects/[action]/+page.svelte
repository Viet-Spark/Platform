<script>
    import { goto } from '$app/navigation';
    import { userData } from '$lib/stores/userStore';
    import { authUser } from '$lib/stores/authStore';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
	import { projectHandlers, projectLoading, projects} from '$lib/stores/projectStore';
    import ProjectForm from '$lib/components/ProjectForm.svelte';
    import { teamHandlers, teamLoading, teams } from '$lib/stores/teamStore';
    import { curProgram, programHandlers } from '$lib/stores/programStore';
    // Redirect if not admin
    $: if ($authUser && !$userData?.isAdmin) {
        goto('/');
    }

    let loading = false;
    let error = '';
    let programTeams = []; 

    $: if ($teams && $curProgram) {
        programTeams = $teams.filter(team => $curProgram.teamIds.includes(team.id)); 
    }

    async function handleSubmit(event) {
        let project = event.detail; 
        let projectId = ""; 
        try {
            projectId = await projectHandlers.createProject({
                name: project.title
            })
            // Upload images
            let projectImagesUrls = project.imageUrls.filter(url => !url.startsWith('data:') && !url.startsWith('blob:')); // Keep existing URLs
            if (project.imageTempFiles?.length > 0) {
                const newUrls = await projectHandlers.uploadMultipleImages(project.imageTempFiles, projectId);
                projectImagesUrls = [...projectImagesUrls, ...newUrls];
            }
            console.log('Preparing project data to submit...');
            const dataToSubmit = {
                ...project, 
                imageUrls: projectImagesUrls
            }
            // Remove all temporary fields and blob URLs
            delete dataToSubmit.imageTempFiles; 

            console.log("Project Data to submit:", dataToSubmit);

            await projectHandlers.updateProject(projectId, dataToSubmit)
            console.log('Project saved successfully');
        } catch (e) {
            error = e.message || 'Failed to save project';
            console.error('Error saving project:', error);
        } finally{
            let projectIds = [...$curProgram.projectIds, projectId]; 
            if ($curProgram) {
                const updatedProgramData = {
                    ...$curProgram, 
                    projectIds: projectIds
                }
                await programHandlers.updateProgram($curProgram.id, updatedProgramData); 
                console.log('Program saved successfully');
            }
            goto(`/admin/programs/edit/${$curProgram.id}/projects`); 
        }
        
    }
</script>

<section class="min-h-[50vh] bg-gray-50 py-12">
    {#if $projectLoading}
        <div class="flex h-screen items-center justify-center">
            <p class="text-xl">Loading...</p>
        </div>
    {:else}
        <div class="container mx-auto px-4">
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

                <!-- Project -->
                <div class="space-y-6">
                    <div class="rounded-md border p-6 mb-4">
                        <ProjectForm
                            isEditing={false}
                            on:submit={(e) => handleSubmit(e)}
                            loading={loading}
                            error={error}
                            teams={programTeams}
                            handleCancel={() =>  goto(`/admin/programs/edit/${$curProgram.id}/projects`)} disabled={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    {/if}
</section>