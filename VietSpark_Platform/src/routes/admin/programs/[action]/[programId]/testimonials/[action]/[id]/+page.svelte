<script>
    import { goto } from '$app/navigation';
    import { userData, userLoading } from '$lib/stores/userStore';
    import { authUser } from '$lib/stores/authStore';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { testimonialHandlers, testimonialLoading, testimonials } from '$lib/stores/testimonialStore';
    import TestimonialForm from '$lib/components/TestimonialForm.svelte';
    import { curProgram, programHandlers } from '$lib/stores/programStore';

    // Redirect if not admin
    $: if (!$userLoading && $authUser && $userData && !$userData.isAdmin) {
        goto('/');
    }

    let testimonialId = $page.params.id; 
    let programId = $page.params.programId; 

    let loading = true;
    let error = '';
    let testimonial = null; 

    onMount(async () => {
        loading = true;
        try {
            await programHandlers.getProgram(programId);
            testimonial = await testimonialHandlers.getTestimonial(testimonialId); 
        } catch (e) {
            error = 'Failed to load team.';
        } finally {
            loading = false;
        }
    });

    async function handleSubmit(event) {
        loading = true; 
        testimonial = event.detail; 
        try {
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
            const dataToSubmit = {
                ...testimonial, 
                authorCoverImage: coverImageUrl,
                imageUrls: testimonialImageUrls, 
                videoUrl: testimonialVideoUrl, 
                submitterId: $userData.id
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
            goto(`/admin/programs/edit/${programId}/testimonials`); 
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

                {#if testimonial}
                    <!-- Testimonial -->
                    <div class="space-y-6">
                        <TestimonialForm
                            testimonial={testimonial}
                            isEditing={true}
                            on:submit={(e) => handleSubmit(e)}
                            loading={loading}
                            error={error}
                            handleCancel={() => goto(`/admin/programs/edit/${programId}/testimonials`)} disabled={loading}
                        />
                    </div>
                {:else}
                    <div class="flex h-screen items-center justify-center">
                        <p class="text-xl">Testimonial not found.</p>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</section>