<script>
    import { goto } from '$app/navigation';
    import { userData, userLoading} from '$lib/stores/userStore';
    import { authUser } from '$lib/stores/authStore';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { teamHandlers, teamLoading, teams } from '$lib/stores/teamStore';
    import TeamForm from '$lib/components/TeamForm.svelte';
    import { curProgram, programHandlers} from '$lib/stores/programStore';
    import { applications, applicationLoading, applicationHandlers } from '$lib/stores/applicationStore';

    let teamId = $page.params.teamId; 
    $: programId = $page.params.id;

    let loading = true;
    let error = '';
    let team = null; 

    onMount(async () => {
        loading = true;
        try {
            await programHandlers.getProgram(programId);
            // Wait for teams to be fetched fresh
            team = await teamHandlers.getTeam(teamId); 
            if (!$userData?.id) {
                console.log("User not ready");
                return;
            }

            let user = team.users.find((u) => u.userId === $userData.id); 
            if (!user && team?.manager?.userId !== $userData.id) {
                goto(`/programs/${programId}`);
            }
        } catch (e) {
            error = 'Failed to load team.';
        } finally {
            loading = false;
        }
    });

    async function handleSubmit(event) {
        loading = true;
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
                logoUrl: teamLogoUrl
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

                {#if team}
                    <!-- Team -->
                    <div class="space-y-6">
                        <TeamForm
                            team={team}
                            isEditing={true}
                            on:submit={(e) => handleSubmit(e)}
                            loading={loading}
                            error={error}
                            handleCancel={() => goto(`/programs/${programId}/participant`)} disabled={loading}
                        />
                    </div>
                {:else}
                    <div class="flex h-screen items-center justify-center">
                        <p class="text-xl">Team not found.</p>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</section>