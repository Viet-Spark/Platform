<script>
    import { goto } from '$app/navigation';
    import { userData, userLoading } from '$lib/stores/userStore';
    import { authUser } from '$lib/stores/authStore';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { programHandlers, programLoading, curProgram } from '$lib/stores/programStore';
    import { teamHandlers, teamLoading, teams } from '$lib/stores/teamStore';
    import defaultProfile from '$lib/images/About/placeHolderAvatar.jpg';

    $: if (!$userLoading && $authUser && $userData && !$userData.isAdmin) {
        goto('/');
    }

    let programTeams = [];
    let loading = true;
    let error = '';
    $: programId = $page.params.programId;

    onMount(async () => {
        await updateProgramTeams();
    });

    // React to teams store changes to keep programTeams in sync
    $: if ($teams) {
        programTeams = $teams.filter(team => team.programId === programId);
    }

    async function handleDelete(id) {
        if (confirm('Are you sure you want to delete this team?')) {
            loading = true;
            try {
                await teamHandlers.deleteTeam(id);
                let teamIds = $curProgram.teamIds.filter(i => i != id);
                let programData = { ...$curProgram, teamIds };
                await programHandlers.updateProgram($curProgram.id, programData);
                await updateProgramTeams();
            } catch (e) {
                error = 'Failed to delete team.';
            } finally {
                loading = false;
            }
        }
    }

    async function updateProgramTeams() {
        loading = true;
        try {
            await programHandlers.getProgram(programId);
            // Wait for teams to be fetched fresh
            await teamHandlers.getTeams(); 
            programTeams = $teams.filter(team => team.programId === programId);
        } catch (e) {
            error = 'Failed to load teams.';
        } finally {
            loading = false;
        }
    }
</script>

<section class="container mx-auto">
    {#if loading}
        <div class="flex h-screen items-center justify-center">
            <span>Loading...</span>
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
                <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-center">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Team Logo</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Member Count</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        {#each programTeams as team}
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    {#if team.logoUrl}
                                        <img src={team.logoUrl} alt={team.name} class="w-10 h-10 rounded-full object-cover mx-auto">
                                    {:else}
                                        <img src={defaultProfile} alt={team.name} class="w-10 h-10 rounded-full object-cover mx-auto">
                                    {/if}
                                </td>
                                <td class="py-4 whitespace-nowrap">
                                    <div class="text-sm inline-flex font-medium text-gray-900">{team.name}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm inline-flex font-medium text-gray-900">{team.manager?.name || ""}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm inline-flex font-medium text-gray-900">{team.users.length}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs font-semibold rounded-full
                                    {(team.status === "Active") ? "text-green-500" : (team.status === "Completed" ? "text-grey-700" : "text-red-500")}"
                                    >
                                        {team.status}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex space-x-2 justify-center">
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

