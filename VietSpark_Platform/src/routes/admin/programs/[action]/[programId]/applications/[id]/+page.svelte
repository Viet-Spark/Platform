<script>
    import { goto } from '$app/navigation';
	import { authUser, logout, authLoading } from '$lib/stores/authStore';
	import { userData, userLoading, userError, getUserData, updateUserData } from '$lib/stores/userStore';
	import { profileData, profileLoading, profileError, getUserProfile, uploadProfileImage, updateUserProfile } from '$lib/stores/profileStore';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { curProgram, programHandlers, programLoading } from '$lib/stores/programStore';
    import ApplicationForm from '$lib/components/ApplicationForm.svelte';
	import { applicationHandlers, applicationLoading, applications } from '$lib/stores/applicationStore';

    let loading = true;
    let error = '';
    let programId = $page.params.programId; 
    let id = $page.params.id; 

    let application = null;

    $: if (!$userLoading && $authUser && $userData && !$userData.isAdmin) {
        goto('/');
    }

    onMount(async () => {
        await programHandlers.getProgram(programId); 
        application = await applicationHandlers.getApplication(id); 
        loading = false; 
	});

    async function handleSubmit(event) {
        let applicationData = event.detail;  // renamed to avoid shadowing outer `application`
        let applicationId = applicationData.id;
        let role = applicationData.role;
        try {
            let resumeFile = applicationData.resume;
            if (applicationData.resumeTempFile) {
                const newUrl = await applicationHandlers.uploadResume(applicationData.resumeTempFile, applicationId);
                resumeFile = newUrl;
            }
            const dataToSubmit = {
                ...applicationData,
                resume: resumeFile,
                title: $curProgram.title + ' ' + role.charAt(0).toUpperCase() + role.slice(1) + ' Application',
            }
            delete dataToSubmit.resumeTempFile;
            await applicationHandlers.updateApplication(applicationId, dataToSubmit);
        } catch (e) {
            error = e.message || 'Failed to save application';
            console.error('Error saving application:', error);
        } finally {
            goto(`/admin/programs/edit/${applicationData.programId}/${role+'s'}`);
        }
    }
</script>

<section class="min-h-[50vh] p-6">
    {#if loading || $applicationLoading }
        <div class="flex h-screen items-center justify-center">
            <p class="text-xl">Loading...</p>
        </div>
    {:else if application}
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
                            displayStatus={true}
                            error={error}
                            role={application.role}
                            programId={programId}
                            handleCancel={() =>  goto(`/admin/programs/edit/${programId}/${application.role+'s'}`)} 
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <div class="flex h-screen items-center justify-center">
            <p class="text-xl">Application not found.</p>
        </div>
    {/if}
</section>