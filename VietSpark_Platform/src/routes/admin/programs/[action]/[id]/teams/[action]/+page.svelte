<script>
    import { goto } from '$app/navigation';
    import { userData } from '$lib/stores/userStore';
    import { authUser } from '$lib/stores/authStore';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { programHandlers, programLoading, curProgram } from '$lib/stores/programStore';
    import { teamHandlers, teamLoading, teams } from '$lib/stores/teamStore';
    import TeamForm from '$lib/components/TeamForm.svelte';
    import { applications, applicationLoading } from '$lib/stores/applicationStore';

    // Redirect if not admin
    $: if ($authUser && !$userData?.isAdmin) {
        goto('/');
    }
    let loading = false;
    let error = '';
    let availableApplicants = []; 

    $: if ($applications) {
        availableApplicants = $applications.filter((app) => app.programId === $curProgram.id && app.status === "Approved"); 
    }

    async function handleSubmit(event) {
        loading = true; 
        let team = event.detail;
        let teamId = ""; 
        try {
            teamId = await teamHandlers.createTeam({
                name: team.name
            })
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
        } finally {
            let teamIds = [...$curProgram.teamIds, teamId]; 
            if ($curProgram) {
                const updatedProgramData = {
                    ...$curProgram, 
                    teamIds: teamIds
                }
                await programHandlers.updateProgram($curProgram.id, updatedProgramData); 
                console.log('Program saved successfully');
            }
            goto(`/admin/programs/edit/${$curProgram.id}/teams`); 
            loading = false; 
        }   
    }
</script>

<section class="min-h-[50vh]">
    {#if $programLoading || $teamLoading || loading || $applicationLoading}
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

                <!-- Team -->
                <div class="space-y-6">
                    <TeamForm
                        isEditing={false}
                        availableApplicants={availableApplicants}
                        on:submit={(e) => handleSubmit(e)}
                        loading={loading}
                        error={error}
                        handleCancel={() => goto(`/admin/programs/edit/${$curProgram.id}/teams`)} disabled={loading}
                    />
                </div>
            </div>
        </div>
    {/if}
</section>