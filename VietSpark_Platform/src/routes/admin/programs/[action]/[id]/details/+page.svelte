<script>
    import { goto } from '$app/navigation';
    import { userData } from '$lib/stores/userStore';
    import { authUser } from '$lib/stores/authStore';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import MarkdownEditor from '$lib/components/MarkdownEditor.svelte';
    import MediaUploader from '$lib/components/MediaUploader.svelte';
    import { programHandlers, programLoading, curProgram} from '$lib/stores/programStore';
    import { validateFile, validateImageFile, validateVideoFile} from '$lib/utils/validator.js';

    // Redirect if not admin
    $: if ($authUser && !$userData?.isAdmin) {
        goto('/');
    }

    let loading = false;
    let error = '';
    let formData = null; 

    $: if ($curProgram) {
        formData = {...$curProgram}; 
    }

    // Handle cover image upload
    function handleCoverImageUpload(event) {
        const [file] = event.detail.files;
        const validationError = validateImageFile(file);
        if (validationError) {
            uploadError = validationError;
            return;
        }
        formData.coverTempFile = file;
        const reader = new FileReader();
        reader.onloadend = () => {
            formData.coverUrl = reader.result;
        };
        reader.readAsDataURL(file);
    }

    // Handle gallery images upload
    function handleGalleryImagesUpload(event) {
        formData.imageTempFiles = [...formData.imageTempFiles, ...event.detail.files];
        event.detail.files.forEach(file => {
            const validationError = validateImageFile(file);
            if (validationError) {
                error = validationError;
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                formData.imageUrls = [...formData.imageUrls, reader.result];
            };
            reader.readAsDataURL(file);
        });
    }

    async function handleSubmit() {
        loading = true;
        error = '';

        try {
            // Upload cover image
            let coverImageUrl = formData.coverUrl;
			if (formData.coverTempFile) {
				coverImageUrl = await programHandlers.uploadCoverImage(formData.coverTempFile, program.id);
			}

            // Upload gallery images
			let imagesUrls = formData.imageUrls.filter(url => !url.startsWith('data:') && !url.startsWith('blob:')); // Keep existing URLs
			if (formData.imageTempFiles?.length > 0) {
				const newUrls = await programHandlers.uploadImages(formData.imageTempFiles, program.id);
				imagesUrls = [...imagesUrls, ...newUrls];
			}
            console.log('Preparing data to submit...');
            const dataToSubmit = {
                ...formData, 
                imageUrls: imagesUrls, 
                coverUrl: coverImageUrl, 
            }
            // Remove all temporary fields and blob URLs
            delete dataToSubmit.imageTempFiles; 
            delete dataToSubmit.coverTempFile;

            console.log("Detail:", dataToSubmit);

            await programHandlers.updateProgram(program.id, dataToSubmit)
            console.log('Program saved successfully');
            goto(`/admin/programs/`);
        } catch (e) {
            error = e.message || 'Failed to edit program';
            console.error('Error saving program:', error);
        } finally {
            loading = false;
        }
    }
</script>

<section class="min-h-[50vh] bg-gray-50 py-12">
{#if $programLoading}
    <div class="flex h-screen items-center justify-center">
        <p class="text-xl">Loading...</p>
    </div>
{:else}
    <div class="container mx-auto px-4">
        <div class="rounded-lg bg-white p-6 shadow-md">
            <form on:submit={handleSubmit} class="space-y-6">

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

                <!-- Program Details -->
                <div class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="title" class="block text-sm font-bold text-gray-700">Program Title</label>
                            <input
                                type="text"
                                id="title"
                                bind:value={formData.title}
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label for="startDate" class="block text-sm font-bold text-gray-700">Start Date</label>
                            <input
                                type="date"
                                id="startDate"
                                bind:value={formData.startDate}
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label for="endDate" class="block text-sm font-bold text-gray-700">End Date</label>
                            <input
                                type="date"
                                id="endDate"
                                bind:value={formData.endDate}
                                required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label for="presentationDate" class="block text-sm font-bold text-gray-700">Presentation Date</label>
                            <input
                                type="date"
                                id="presentationDate"
                                bind:value={formData.presentationDate}
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label for="description" class="block text-sm font-bold text-gray-700">Description</label>
                        <MarkdownEditor
                            bind:value={formData.description}
                            id="description"
                            placeholder=""
                            onInput={(newValue) => {
                                formData.description = newValue;
                            }}
                        />
                    </div>

                    <!-- Cover Image -->
                    <div>
                        <label for="coverImage" class="block text-sm font-bold text-gray-700">Cover Image</label>
                        {#if formData.coverUrl}
                            <div class="mt-2 relative">
                                <img
                                    src={formData.coverUrl}
                                    alt="Cover"
                                    class="w-full h-64 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    aria-label="Remove Image Cover"
                                    class="absolute top-2 right-2 rounded-full p-1 bg-white text-red-500 hover:text-red-800 shadow-sm"
                                    on:click={() => {
                                        formData.coverUrl = '';
                                        formData.coverTempFile = null;
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        {/if}
                        <div class="mt-2">
                            <MediaUploader
                                type="cover"
                                on:upload={handleCoverImageUpload}
                                id="coverImage"
                            />
                        </div>
                    </div>

                    <!-- Gallery Images -->
                    <div>
                        <label for="galleryImages" class="block text-sm font-bold text-gray-700">Gallery Images</label>
                        {#if formData.imageUrls.length > 0}
                            <div class="mt-2 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
                                {#each formData.imageUrls as image, imageIndex}
                                    <div class="relative bg-gray-100 rounded-lg p-2">
                                        <img
                                            src={image}
                                            alt="Gallery"
                                            class="rounded-lg object-cover bg-white h-40 w-40"
                                        />
                                        <button
                                            type="button"
                                            aria-label="Remove Images"
                                            class="absolute top-1 right-1 rounded-full p-1 bg-white text-red-500 hover:text-red-800 shadow-sm"
                                            on:click={() => {
                                                formData.imageUrls = formData.imageUrls.filter((_, i) => i !== imageIndex);
                                                if (formData.imageTempFiles?.[imageIndex]) {
                                                    formData.imageTempFiles = formData.imageTempFiles.filter((_, i) => i !== imageIndex);
                                                }
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                {/each}
                            </div>
                        {/if}
                        <div class="mt-2">
                            <MediaUploader
                                type="gallery"
                                on:upload={handleGalleryImagesUpload}
                                id="galleryImages"
                                multiple
                                maxFiles={10}
                            />
                        </div>
                    </div>
                </div>

                <!-- Form Actions -->
                <div class="flex justify-end space-x-4 pt-6">
                    <button
                        type="button"
                        class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        on:click={() => goto(`/admin/programs/`)} disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark text-sm font-medium"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Update Program'}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
</section>

