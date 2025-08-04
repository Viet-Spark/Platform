<script>
    import { goto } from '$app/navigation';
    import { userData } from '$lib/stores/userStore';
    import { authUser } from '$lib/stores/authStore';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { teamHandlers, teamLoading, teams } from '$lib/stores/teamStore';
    import TeamForm from '$lib/components/TeamForm.svelte';
    import { curProgram } from '$lib/stores/programStore';

    // Redirect if not admin
    $: if ($authUser && !$userData?.isAdmin) {
        goto('/');
    }

    let teamId = $page.params.id; 
    let loading = false;
    let error = '';
    let team = null; 

    $: if ($teams.length > 0) {
        team = $teams.find(team => team.id === teamId); 
    }

    async function handleSubmit(event) {
        team = event.detail; 
        try {
            // Upload logo
            let teamLogoUrl = team.logoUrl
            if (team.logoFileTemp) {
                const newUrl = await teamHandlers.uploadTeamLogo(team.logoFileTemp, teamId); 
                teamLogoUrl = newUrl; 
            }
            console.log('Preparing team data to submit...');
            const dataToSubmit = {
                ...team, 
                logoUrl: teamLogoUrl, 
                programId: $curProgram.id
            }
            // Remove all temporary fields and blob URLs
            delete dataToSubmit.logoFileTemp; 

            console.log("Team Data to submit:", dataToSubmit);

            await teamHandlers.updateTeam(teamId, dataToSubmit)
            console.log('Team saved successfully');
        } catch (e) {
            error = e.message || 'Failed to save team';
            console.error('Error saving team:', error);
        } 
        goto(`/admin/programs/edit/${$curProgram.id}/teams`); 
    }
</script>

<section class="min-h-[50vh] bg-gray-50 py-12">
    {#if $teamLoading}
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

                <!-- Team -->
                <div class="space-y-6">
                    <div class="rounded-md border p-6 mb-4">
                        <TeamForm
                            team={team}
                            isEditing={true}
                            on:submit={(e) => handleSubmit(e)}
                            loading={loading}
                            error={error}
                            handleCancel={() => goto(`/admin/programs/edit/${$curProgram.id}/teams`)} disabled={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    {/if}
</section>