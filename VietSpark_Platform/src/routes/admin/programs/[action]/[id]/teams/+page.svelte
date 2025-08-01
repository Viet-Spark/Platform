<script>
    import { goto } from '$app/navigation';
    import { userData, getUser } from '$lib/stores/userStore';
    import { authUser } from '$lib/stores/authStore';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { programHandlers, programLoading, curProgram } from '$lib/stores/programStore';
    import { teamHandlers, teamLoading, teams } from '$lib/stores/teamStore';
    import defaultProfile from '$lib/images/About/placeHolderAvatar.jpg';


    // Redirect if not admin
    $: if ($authUser && !$userData?.isAdmin) {
        goto('/');
    }

    let programTeams = []; 

    onMount(() => {
        updateProgramTeams(); 
    })

    $: if (loading) {
        updateProgramTeams(); 
    }

    let loading = false;
    let error = '';

	async function handleDelete(id) {
		if (confirm('Are you sure you want to delete this team?')) {
			await teamHandlers.deleteTeam(id); 
		}
        let teamIds = $curProgram.teamIds.filter(i => i != id); 
        let programData = {
            ...$curProgram, 
            teamIds: teamIds
        }
        await programHandlers.updateProgram($curProgram.id, programData); 
        loading = true;
	}

    async function updateProgramTeams() {
        await programHandlers.getProgram($curProgram.id);
        let baseTeams = $teams.filter(team => team.programId === $curProgram.id); 
        // Get manager information by user ID
        if (baseTeams.length > 0) {
            programTeams = await Promise.all(
                baseTeams.map(async t => {
                    const managerData = await getUser(t.manager);
                    return { ...t, manager: {...managerData}};
                })
            ); 
        }
        loading = false; 
    }
</script>

<section class="container mx-auto">
    {#if $programLoading || $teamLoading}
        <div class="flex h-screen items-center justify-center">
            <p class="text-xl">Loading...</p>
        </div>

    {:else}
		<div class="flex flex-col items-center justify-center bg-primary text-white p-4 mb-8">
			<h1 class="text-2xl font-bold">Teams</h1>
			<p>Manage {$curProgram.title} Teams</p>
		</div>

		<div class="mb-8 flex items-center justify-end">
			<a
				href="/admin/programs/edit/{$curProgram.id}/teams/new"
				class="bg-primary hover:bg-primary-dark rounded-md px-4 py-2 text-white"
			>
				Add New Team
			</a>
		</div>

		{#if programTeams.length === 0}
			<div class="rounded-lg bg-gray-100 p-8 text-center">
				<p class="text-gray-600">No teams found. Add your first team!</p>
			</div>
		{:else}
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Logo</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Count</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        {#each programTeams as team}
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    {#if team.logoUrl}
                                        <img src={team.logoUrl} alt={team.name} class="w-10 h-10 rounded-full object-cover">
                                    {:else}
                                        <img src={defaultProfile} alt={team.name} class="w-10 h-10 rounded-full object-cover">
                                    {/if}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{team.name}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-500">{team.manager?.name || ""}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm inline-flex leading-5 font-medium text-gray-900">{team.users.length}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                        {team.status}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex space-x-2 justify-start">
                                        <a
                                            href="/admin/programs/edit/{$curProgram.id}/teams/edit/{team.id}"
                                            class="text-blue-600 hover:text-blue-800"
                                        >
                                            Edit
                                        </a>
                                        <button
                                            on:click={() => handleDelete(team.id)}
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

