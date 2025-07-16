<script>
    import { createEventDispatcher } from 'svelte';
    import MarkdownEditor from './MarkdownEditor.svelte';
    import { page } from '$app/stores';
	import { goto } from '$app/navigation'; 
    import MediaUploader from '$lib/components/MediaUploader.svelte';

    export let blog = {
        title: '',
        description: '',
        readTime: '',
        tags: [],
        author: '',
        authorTitle: '', 
        authorImage: null,
        images: [], // URLs or existing images
        content: '', 
        tempImagesFiles: [], 
        authorImageFile: null,
        published: false
    };
    export let loading = false;
    export let error = '';
    export let isEditing; 

    const dispatch = createEventDispatcher();

    let formData = { ...blog };
    let imagePreviews = [...(blog.images || [])]; // URLs for preview
    let tagInput = '';

    let popularTags = [
        "Industry Xplained", "Tech Summit", "Break Into Tech", "Mentorship", "Diversity"
    ];

    function validateFile(file, { allowedTypes, maxSizeMB }) {
		if (!file) return 'No file provided';
		
		if (!allowedTypes.includes(file.type)) {
			return `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`;
		}

		const maxSizeBytes = maxSizeMB * 1024 * 1024;
		if (file.size > maxSizeBytes) {
			return `File size must be less than ${maxSizeMB}MB`;
		}

		return null;
	}

    function validateImageFile(file) {
		const validationError = validateFile(file, {
			allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
			maxSizeMB: 2
		});
		return validationError;
	}

    // Handle file input change
    function handleFileChange(event) {
        formData.tempImagesFiles = [...formData.tempImagesFiles, ...event.detail.files]; 
        // Create temporary preview URLs
        event.detail.files.forEach(file => {
            const validationError = validateImageFile(file);
			if (validationError) {
				error = validationError;
				return;
			}
            const reader = new FileReader();
			reader.onloadend = () => {
				formData.images = [...formData.images, reader.result];
			};
			reader.readAsDataURL(file);
        })
    }

    // Function to handle author profile image change
    function handleAuthorImageUpload(event) {
        const [file] = event.detail.files;
		const validationError = validateImageFile(file);
		if (validationError) {
			uploadError = validationError;
			return;
		}
		// Cleanup previous cover image blob URL if exists
		if (formData.authorImage && formData.authorImage.startsWith('blob:')) {
			URL.revokeObjectURL(formData.authorImage);
		}
		formData.authorImageFile = file;
		// Create temporary preview URL
		const reader = new FileReader();
		reader.onloadend = () => {
			formData.authorImage = reader.result;
		};
		reader.readAsDataURL(file);
    }

    // Tag management
    function addTag() {
        const tag = tagInput.trim();
        if (tag && !formData.tags.includes(tag)) {
        formData.tags = [...formData.tags, tag];
        }
        tagInput = '';
    }

    function removeTag(idx) {
        formData.tags = formData.tags.filter((_, i) => i !== idx);
    }

    function addSuggestedTag(tag) {
        if (!formData.tags.includes(tag)) {
            formData.tags = [...formData.tags, tag];
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        dispatch('submit', { ...formData });
    }
</script>

<h1 class="flex flex-col items-center justify-center bg-primary text-white p-4 mb-8">
    {isEditing ? 'Edit Blog' : 'Create New Blog'}
</h1>
<section class="min-h-[50vh] bg-gray-50 py-12">
    <div class="container mx-auto px-4">
        <div class="rounded-lg bg-white p-6 shadow-md">
            <form on:submit={handleSubmit} class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <!-- Title -->
                    <div>
                        <label for="title" class="block font-semibold mb-1">Title</label>
                        <input 
                            type="text" 
                            id="title"
                            bind:value={formData.title}
                            required
                            placeholder="Blog Title"
                            class="w-full border rounded px-3 py-2" />
                            
                    </div>

                    <!-- Author -->
                    <div>
                        <label for="author" class="block font-semibold mb-1">Author</label>
                        <input 
                            id="author" 
                            type="text"
                            bind:value={formData.author} 
                            class="w-full border rounded px-3 py-2" 
                            placeholder="Blog Author"/>
                    </div>

                    <!-- Author Title -->
                    <div>
                        <label for="authorTitle" class="block font-semibold mb-1">Author Title</label>
                        <input 
                            id="authorTitle" 
                            type="text"
                            bind:value={formData.authorTitle} 
                            class="w-full border rounded px-3 py-2" 
                            placeholder="Blog Author Title"/>
                    </div>

                    <!-- Read Time -->
                    <div>
                        <label for="readingTime" class="block font-semibold mb-1">Time To Read (in Minutes)</label>
                        <input 
                            id="readingTime"
                            type="number" 
                            bind:value={formData.readTime} 
                            placeholder="0"
                            class="w-full border rounded px-3 py-2" />
                    </div>               
                </div>

                <!-- Author Profile Image -->
                <div>
                    <label for="authorImage" class="block font-semibold mb-1">Author Image</label>
                    <div>
                        {#if formData.authorImage}
                            <div class="mt-2 h-40 w-40 relative">
                                <img
                                    src={formData.authorImage}
                                    alt="Author {formData.author} Image"
                                    class="rounded-full object-cover h-40 w-40 border-gray-100 border-2"
                                />
                                <button
                                    type="button"
                                    class="absolute top-1 right-1 rounded-full p-1 bg-white text-red-500 hover:text-red-800 shadow-sm"
                                    on:click={() => {
                                        formData.authorImage = '';
                                        formData.authorImageFile = null;
                                    }}
                                    aria-label="Remove author image"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        {:else}
                            <MediaUploader
                                type="authorImage"
                                on:upload={handleAuthorImageUpload}
                                id="authorImage"
                            />
                        {/if}
                    </div>
                </div>

                <!-- Description -->
                <div>
                    <label for="description" class="block font-semibold mb-1">Description</label>
                    <input 
                        id="description"
                        type="text"
                        bind:value={formData.description} 
                        placeholder="Blog Short Description"
                        class="w-full border rounded px-3 py-2"/>
                </div>

                <!-- Tags -->
                <div>
                    <label for="tags" class="block font-semibold mb-1">Tags</label>
                    <div class="flex space-x-2 mb-2">
                        <input type="text" bind:value={tagInput} class="flex-1 border rounded px-3 py-2" placeholder="Add tag..." on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                        <button type="button" on:click={addTag} class="bg-primary text-white px-3 py-2 rounded">Add</button>
                    </div>
                    <!-- Suggested Tags -->
                    <div class="flex flex-wrap gap-2 mb-2">
                        {#each popularTags as tag}
                            <button
                                type="button"
                                class="bg-gray-100 border border-gray-300 rounded-full px-3 py-1 text-sm hover:bg-primary hover:text-white transition"
                                on:click={() => addSuggestedTag(tag)}
                                disabled={formData.tags.includes(tag)}
                            >
                                {tag}
                            </button>
                        {/each}
                    </div>
                    <div class="flex flex-wrap gap-2">
                        {#each formData.tags as tag, idx}
                            <span class="bg-gray-300 rounded-full px-3 py-1 flex items-center">
                                {tag}
                                <button type="button" class="ml-2 text-red-500" on:click={() => removeTag(idx)}>&times;</button>
                            </span>
                        {/each}
                    </div>
                </div>
            
                <!-- Images -->
                <div>
                    <label for="images" class="block font-semibold mb-1">Images</label>
                    <div class="mt-1">
                        <MediaUploader
                            type="gallery"
                            id="images"
                            multiple
                            maxFiles={20}
                            on:upload={handleFileChange}
                        />
                    </div>
                    <div class="mt-2 grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-7">
                        {#if formData.images.length > 0}
                            {#each formData.images as image, index}
                                <div class="relative bg-gray-100 rounded-lg p-2">
                                    <img
                                        src={image}
                                        alt="Gallery preview"
                                        class="aspect-square rounded-lg bg-white object-cover"
                                    />
                                    <button
                                        type="button"
                                        on:click={() => formData.images = formData.images.filter((_, i) => i !== index)}
                                        class="absolute top-1 right-1 rounded-full p-1 bg-white text-red-500 hover:text-red-800 shadow-sm"
                                        aria-label="Remove image"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>	
                                    </button>
                                </div>
                            {/each}
                        {/if}
                    </div>
                </div>
            
                <!-- Content (Markdown Editor) -->
                <div>
                    <label for="content" class="block font-semibold mb-1">Content</label>
                    <MarkdownEditor 
                        id="content" 
                        bind:value={formData.content} 
                        placeholder=""
                        onInput={(newValue) => {
                            formData.content = newValue;
                        }}
                        />
                </div>
            
                {#if error}
                    <div class="text-red-600">{error}</div>
                {/if}
                <div class="flex justify-end">
                    <button type="button" class="bg-gray-300 text-gray-800 px-6 py-2 rounded mr-2" on:click={() => goto('/admin/blog')} disabled={loading}>
                        Cancel
                    </button>
                    <button type="submit" class="bg-primary text-white px-6 py-2 rounded" disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
                
            </form> 
        </div> 
    </div>
</section>