<script>
    import { goto } from '$app/navigation';
    import { userData, userLoading } from '$lib/stores/userStore';
    import { authUser } from '$lib/stores/authStore';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
	import { projectHandlers, projectLoading, projects} from '$lib/stores/projectStore';
    import ProjectForm from '$lib/components/ProjectForm.svelte';
    import { teamHandlers, teamLoading, teams } from '$lib/stores/teamStore';
    import { curProgram, programHandlers } from '$lib/stores/programStore';

    $: programId = $page.params.id;
    $: projectId = $page.params.projectId; 
    $: teamId = $page.params.teamId; 

    let loading = true;
    let error = '';
    let project = null; 

    onMount(async () => {
        loading = true;
        try {
            await programHandlers.getProgram(programId);
            // Wait for projects to be fetched fresh
            project = await projectHandlers.getProject(projectId); 
            let team = await teamHandlers.getTeam(teamId); 
            if (!$userData?.id) {
                console.log("User not ready");
                return;
            }

            let user = team.users.find((u) => u.userId === $userData.id); 
            if (!user && team?.manager?.userId !== $userData.id) {
                goto(`/programs/${programId}`);
            }
        } catch (e) {
            error = 'Failed to load project.';
        } finally {
            loading = false;
        }
    });

    async function handleSubmit(event) {
        loading = true; 
        project = event.detail; 
        try {
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
        } 
        goto(`/programs/${programId}/participant`); 
        loading = false; 
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
                
                {#if project}
                    <!-- Project -->
                    <div class="space-y-6">
                        <ProjectForm
                            project={project}
                            isEditing={true}
                            on:submit={(e) => handleSubmit(e)}
                            loading={loading}
                            error={error}
                            handleCancel={() =>  goto(`/programs/${programId}/participant`)} disabled={loading}
                        />
                    </div>
                {:else}
                    <div class="flex h-screen items-center justify-center">
                        <p class="text-xl">Project not found.</p>
                    </div>
                {/if}

            </div>
        </div>
    {/if}
</section>