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
	import { applicationHandlers, applications } from '$lib/stores/applicationStore';

    let loading = true;
    let error = '';
    let id = $page.params.id; 
    let application = {
        id: '',
        programId: '',
        name: '', 
        role: '',
        title: '',
        userId: '',
        reasons: '',
        resume: '',
        resumeTempFile: null,
        email: '',
        status: 'Pending',
        links: {}
    }

    onMount(async () => {
        if (!$authUser && browser) {
			console.log('User is not logged in');
			goto('/login');
		}
        application = $applications.find((a) => a.id === id); 
        if ($authUser.uid !== application.userId) {
            console.log("User does not have permission to view other people's application");
			goto('/');
        }
        await programHandlers.getProgram(application.programId); 
        loading = false; 
	});

    async function handleSubmit(event) {
        let application = event.detail; 
        let applicationId = application.id; 
        let role = application.role; 
        try {
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
            goto(`/profile`); 
        }
        
    }
</script>

<section class="min-h-[50vh] p-6">
    {#if $profileLoading || loading}
        <div class="flex h-screen items-center justify-center">
            <p class="text-xl">Loading...</p>
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

                <!-- Application -->
                <div class="space-y-6">
                    <div>
                        <ApplicationForm
                            application={application}
                            isEditing={true}
                            on:submit={(e) => handleSubmit(e)}
                            loading={loading}
                            error={error}
                            role={application.role}
                            programId={application.programId}
                            handleCancel={() =>  goto(`/profile/`)} disabled={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    {/if}
</section>