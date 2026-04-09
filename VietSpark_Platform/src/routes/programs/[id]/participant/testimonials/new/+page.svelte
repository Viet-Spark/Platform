<script>
    import { goto } from '$app/navigation';
    import { userData, userLoading, getUsers } from '$lib/stores/userStore';
    import { authUser } from '$lib/stores/authStore';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { testimonialHandlers, testimonialLoading, testimonials } from '$lib/stores/testimonialStore';
    import TestimonialForm from '$lib/components/TestimonialForm.svelte';
    import { curProgram, programLoading, programHandlers } from '$lib/stores/programStore';
    import { applications, applicationLoading, applicationHandlers } from '$lib/stores/applicationStore';

    let loading = true;
    let error = '';
    $: programId = $page.params.id;

    onMount(async () => {
        try {
            loading = true;
            await programHandlers.getProgram(programId);
            await applicationHandlers.getApplications();
            await getUsers(); 

            // Find this user's application for this program
			const ids = ($userData?.applicationIds || []).slice();
			let myApplication = $applications.find((a) => ids.includes(a.id) && a.programId === programId && a.status === 'Approved') || null;

			if (!myApplication) {
				goto(`/programs/${programId}`);
			}
        } catch (e) {
            error = 'Failed to load testimonial.';
        } finally {
            loading = false;
        }
    })

    async function handleSubmit(event) {
        loading = true; 
        let testimonial = event.detail; 
        let testimonialId = ""; 
        try {
            testimonialId = await testimonialHandlers.createTestimonial({
                authorName: testimonial.authorName
            })
            // Upload cover image
            let coverImageUrl = testimonial.authorCoverImage;
			if (testimonial.coverTempFile) {
				coverImageUrl = await testimonialHandlers.uploadCoverImage(testimonial.coverTempFile, testimonialId);
			}
            // Upload video
            let testimonialVideoUrl = testimonial.videoUrl; 
            if (testimonial.videoTempFile) {
                const newUrl = await testimonialHandlers.uploadTestimonialsVideo(testimonial.videoTempFile, testimonialId); 
                testimonialVideoUrl = newUrl; 
            }
            // Upload images
            let testimonialImageUrls = testimonial.imageUrls.filter(url => !url.startsWith('data:') && !url.startsWith('blob:')); // Keep existing URLs
            if (testimonial.imageTempFiles?.length > 0) {
                const newUrls = await testimonialHandlers.uploadTestimonialsImages(testimonial.imageTempFiles, testimonialId);
                testimonialImageUrls = [...testimonialImageUrls, ...newUrls];
            }
            console.log('Preparing testimonial data to submit...');
            console.log($userData); 
            const dataToSubmit = {
                ...testimonial, 
                authorCoverImage: coverImageUrl,
                imageUrls: testimonialImageUrls, 
                videoUrl: testimonialVideoUrl, 
                submitterId: $userData.id, 
                source: 'Form'
            }
            // Remove all temporary fields and blob URLs
            delete dataToSubmit.coverTempFile;
            delete dataToSubmit.videoTempFile; 
            delete dataToSubmit.imageTempFiles;

            console.log("Testimonial Data to submit:", dataToSubmit);

            await testimonialHandlers.updateTestimonial(testimonialId, dataToSubmit)
            console.log('Testimonial saved successfully');
        } catch (e) {
            error = e.message || 'Failed to save Testimonial';
            console.error('Error saving Testimonial:', error);
        } finally {
            let testimonialIds = [...$curProgram.testimonialIds, testimonialId]; 
            if ($curProgram) {
                const updatedProgramData = {
                    ...$curProgram, 
                    testimonialIds: testimonialIds
                }
                await programHandlers.updateProgram($curProgram.id, updatedProgramData); 
                console.log('Program saved successfully');
            }
            goto(`/programs/${programId}/participant/testimonials/${testimonialId}`); 
            loading = false; 
        } 
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

                <!-- Testimonial -->
                <div class="space-y-6">
                    <TestimonialForm
                        isEditing={false}
                        on:submit={(e) => handleSubmit(e)}
                        loading={loading}
                        error={error}
                        handleCancel={() => goto(`/programs/${programId}/participant`)}  disabled={loading}
                    />
                </div>
            </div>
        </div>
    {/if}
</section>