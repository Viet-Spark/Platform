<script>
    import { goto } from '$app/navigation';
    import { userData, getUser } from '$lib/stores/userStore';
    import { authUser } from '$lib/stores/authStore';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { testimonialHandlers, testimonialLoading, testimonials } from '$lib/stores/testimonialStore';
    import TestimonialForm from '$lib/components/TestimonialForm.svelte';
    import { curProgram } from '$lib/stores/programStore';

    // Redirect if not admin
    $: if ($authUser && !$userData?.isAdmin) {
        goto('/');
    }

    let testimonialId = $page.params.id; 
    let loading = false;
    let error = '';
    let testimonial = null; 

    $: if ($testimonials.length > 0) {
        updateProgramTestimonial(); 
    }

    async function updateProgramTestimonial() {
        testimonial = $testimonials.find(testimonial => testimonial.id === testimonialId); 
        console.log("Testimonial", testimonial); 
        // Get author information based on IDs
        if (testimonial?.authorId) {
            const author = await getUser(testimonial.authorId);
            testimonial = {...testimonial, ...author}
        }
        
    }

    async function handleSubmit(event) {
        testimonial = event.detail; 
        try {
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
                imageUrls: testimonialImageUrls, 
                videoUrl: testimonialVideoUrl
            }
            // Remove all temporary fields and blob URLs
            delete dataToSubmit.videoTempFile; 
            delete dataToSubmit.imageTempFiles;
            delete dataToSubmit.name; 
            delete dataToSubmit.displayName; 
            delete dataToSubmit.email; 
            delete dataToSubmit.profileImage; 

            console.log("Testimonial Data to submit:", dataToSubmit);

            await testimonialHandlers.updateTestimonial(testimonialId, dataToSubmit)
            console.log('Testimonial saved successfully');
        } catch (e) {
            error = e.message || 'Failed to save Testimonial';
            console.error('Error saving Testimonial:', error);
        } finally {
            goto(`/admin/programs/edit/${$curProgram.id}/testimonials`); 
        }
    }
</script>

<section class="min-h-[50vh] bg-gray-50 py-12">
    {#if $testimonialLoading}
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

                <!-- Testimonial -->
                <div class="space-y-6">
                    <div class="rounded-md border p-6 mb-4">
                        <TestimonialForm
                            testimonial={testimonial}
                            isEditing={true}
                            on:submit={(e) => handleSubmit(e)}
                            loading={loading}
                            error={error}
                            handleCancel={() => goto(`/admin/programs/edit/${$curProgram.id}/testimonials`)} disabled={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    {/if}
</section>