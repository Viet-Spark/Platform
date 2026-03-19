<script>
    import { goto } from '$app/navigation';
    import { userData, userLoading } from '$lib/stores/userStore';
    import { authUser } from '$lib/stores/authStore';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { programHandlers, programLoading, curProgram } from '$lib/stores/programStore';
	import { projectHandlers, projectLoading, projects} from '$lib/stores/projectStore';
	import { teamHandlers, teams } from '$lib/stores/teamStore';
    // Redirect if not admin
    $: if (!$userLoading && $authUser && $userData && !$userData.isAdmin) {
        goto('/');
    }

    $: programId = $page.params.programId;
    let programProjects = []; 
    let programTeams = []; 
    let loading = true;
    let error = '';
    let teamNames = {}; 

    onMount(async () => {
        getProgramAndProjects(); 
    })

    $: if ($teams) {
        for (const team of $teams) {
            teamNames[team.id] = team.name || '';
        }
    }

    async function getProgramAndProjects() {
        loading = true;
        try {
            await programHandlers.getProgram(programId);
            // Wait for projects to be fetched fresh
            await projectHandlers.getProjects(); 
            programProjects = $projects.filter((project => $curProgram.projectIds.includes(project.id))); 
            await teamHandlers.getTeams(); 
        } catch (e) {
            error = 'Failed to load teams.';
        } finally {
            loading = false;
        }
    }

    async function handleDelete(id) {
		if (confirm('Are you sure you want to delete this project?')) {
			await projectHandlers.deleteProject(id); 
		} 
        let projectIds = $curProgram.projectIds.filter(i => i != id); 
        let programData = {
            ...$curProgram, 
            projectIds: projectIds
        }
        await programHandlers.updateProgram(programId, programData); 
        loading = true;
	}

</script>

<section class="container mx-auto">
    {#if loading}
        <div class="flex h-screen items-center justify-center">
            <span>Loading...</span>
        </div>

    {:else}
		<div class="flex flex-col items-center justify-center bg-primary text-white p-4 mb-8">
			<h1 class="text-2xl font-bold">Projects</h1>
			<p>Manage {$curProgram.title} Projects</p>
		</div>

		<div class="mb-8 flex items-center justify-end">
			<a
				href="/admin/programs/edit/{$curProgram.id}/projects/new"
				class="bg-primary hover:bg-primary-dark rounded-md px-4 py-2 text-white"
			>
				Add New Project
			</a>
		</div>

		{#if programProjects.length === 0}
			<div class="rounded-lg bg-gray-100 p-8 text-center">
				<p class="text-gray-600">No projects found. Add your first project!</p>
			</div>
		{:else}
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-center">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        {#each programProjects as project}
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{project.title}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{teamNames[project.teamId]}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{project.startDate}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{project.endDate}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs font-semibold rounded-full
                                    {(project.status === "In Progress") ? "text-green-500" : (project.status === "Paused" ? "text-red-500" : "text-grey-700")}"
                                    >
                                        {project.status}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex space-x-2 justify-center">
                                        <a
                                            href="/admin/programs/edit/{programId}/projects/edit/{project.id}"
                                            class="text-blue-600 hover:text-blue-800"
                                        >
                                            Edit
                                        </a>
                                        <button
                                            on:click={() => handleDelete(project.id)}
                                            class="text-red-600 hover:text-red-800"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
		{/if}
	{/if}
</section>

