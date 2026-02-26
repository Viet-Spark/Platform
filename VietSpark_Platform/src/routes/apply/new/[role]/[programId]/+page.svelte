<script>
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
	import { authUser, logout, authLoading } from '$lib/stores/authStore';
	import { userData, userLoading, userError, getUserData, updateUserData } from '$lib/stores/userStore';
	import { profileData, profileLoading, profileError, getUserProfile, uploadProfileImage, updateUserProfile } from '$lib/stores/profileStore';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { curProgram, programHandlers } from '$lib/stores/programStore';
    import ApplicationForm from '$lib/components/ApplicationForm.svelte';
	import { applicationHandlers } from '$lib/stores/applicationStore';

    let loading = false;
    let error = '';
    let role = $page.params.role; 
    let programId = $page.params.programId; 

    onMount(async () => {
        if (!$authUser && browser) {
			console.log('User is not logged in');
			goto('/login');
		}
        await programHandlers.getProgram(programId); 
	});

    async function handleSubmit(event) {
        let application = event.detail; 
        let applicationId = ""; 
        try {
            applicationId = await applicationHandlers.createApplication({
                name: application.name
            })
            // Upload file
            let resumeFile = application.resume; 
            if (application.resumeTempFile) {
                const newUrl = await applicationHandlers.uploadResume(application.resumeTempFile, applicationId); 
                resumeFile = newUrl; 
            }
            console.log('Preparing application data to submit...');
            const dataToSubmit = {
                ...application, 
                resume: resumeFile, 
                userId: $authUser.uid, 
                programId: programId, 
                role: role, 
                title: $curProgram.title + role.charAt(0).toUpperCase() + role.slice(1) + ' Application',
            }
            // Remove all temporary fields and blob URLs
            delete dataToSubmit.resumeTempFile; 

            console.log("Application Data to submit:", dataToSubmit);

            await applicationHandlers.updateApplication(applicationId, dataToSubmit); 
            console.log('Application saved successfully');
        } catch (e) {
            error = e.message || 'Failed to save application';
            console.error('Error saving application:', error);
        } finally{
            let mentorApplicantIds = [...$curProgram.mentorApplicantIds || []]; 
            let menteeApplicantIds = [...$curProgram.menteeApplicantIds || []]; 
            let managerApplicantIds = [...$curProgram.managerApplicantIds || []]; 
            if (role === "mentor" && !mentorApplicantIds.includes(applicationId)) {
                mentorApplicantIds = [...mentorApplicantIds, applicationId]; 
            } else if (role === "mentee" && !menteeApplicantIds.includes(applicationId)) {
                menteeApplicantIds = [...menteeApplicantIds, applicationId]; 
            } else if (role === "manager" && !managerApplicantIds.includes(applicationId)) {
                managerApplicantIds = [...managerApplicantIds, applicationId]; 
            }
            if ($curProgram) {
                const updatedProgramData = {
                    ...$curProgram, 
                    mentorApplicantIds: mentorApplicantIds, 
                    menteeApplicantIds: menteeApplicantIds, 
                    managerApplicantIds: managerApplicantIds
                }
                await programHandlers.updateProgram($curProgram.id, updatedProgramData); 
                console.log('Program saved successfully');
            }
            goto(`/profile`); 
            if ($authUser && $userData) {
                let userApplicationIds = [...$userData.applicationIds || []];
                userApplicationIds = [...userApplicationIds, applicationId];
                const updatedUserData = {
                    ...$userData, 
                    applicationIds: userApplicationIds
                }
                await updateUserData($authUser.uid, updatedUserData); 
                console.log('User data saved successfully'); 
            }
        }
        
    }
</script>

<section class="min-h-[50vh] p-6">
    {#if $profileLoading}
        <div class="flex h-screen items-center justify-center">
            <p class="text-xl">Loading...</p>
        </div>
    {:else}
        <div class="container mx-auto lg:w-3/4 justify-center">
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

                <!-- Application -->
                <div class="space-y-6">
                    <div>
                        <ApplicationForm
                            isEditing={false}
                            on:submit={(e) => handleSubmit(e)}
                            loading={loading}
                            error={error}
                            role={role}
                            programId={programId}
                            handleCancel={() =>  goto(`/profile/`)} disabled={loading}
                        />
                    </div>
                </div>
            </div>

        </div>
    {/if}
</section>