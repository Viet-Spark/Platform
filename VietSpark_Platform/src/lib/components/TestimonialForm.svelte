<script>
    import { createEventDispatcher } from 'svelte';
    import MediaUploader from '$lib/components/MediaUploader.svelte';
    import { usersList, getUsers, getUser } from '$lib/stores/userStore';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { validateFile, validateImageFile, validateVideoFile} from '$lib/utils/validator.js';
    import MarkdownEditor from '$lib/components/MarkdownEditor.svelte';

    export let testimonial = {
        id: '',
        authorId: '',
        quote: '',
        highlight: '',
        videoUrl: '',
        videoTempFile: null,
        imageUrls: [],
        imageTempFiles: [],
        moderationStatus: 'Pending',
        visibility: 'Internal',
        authorTitle: '',
        authorOrganization: '',
        authorLocation: '',
        source: 'Survey',
        outcomeSummary: '',
        displayFormat: 'Text',
        tags: [],
        editorNotes: ''
    };
    export let loading = false;
    export let error = '';
    export let isEditing = false;
    export let handleCancel = () => {}; 

    const dispatch = createEventDispatcher();
    let formData = { ...testimonial };
    let tagInput = '';

    let availableSources = ['Form', 'Survey', 'Interview', 'Email'];
    let visibilityOptions = ['Public', 'Internal', 'Private'];
    let statusOptions = ['Approved', 'Pending', 'Rejected'];
    let formatOptions = ['Text', 'Video', 'Carousel'];
    let authorId = ''; 

    onMount(() => {
        getUsers();
    });

    $: if (testimonial) {
        authorId = testimonial.authorId || ''; 
    }

    // Tag management
    function addTag() {
        if (!formData.tags) {
            formData.tags = []; 
        }
        const tag = tagInput.trim();
        if (tag && !formData.tags.includes(tag)) {
            formData.tags = [...formData.tags, tag];
        }
        tagInput = '';
    }
    function removeTag(idx) {
        formData.tags = formData.tags.filter((_, i) => i !== idx);
    }

    // Images upload
    function handleImagesUpload(event) {
        formData.imageTempFiles = [...(formData.imageTempFiles || []), ...event.detail.files]; 
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

    // Video upload
    function handleVideoUpload(event) {
		const { files } = event.detail; 
        const [file] = files; 

        const validationError = validateVideoFile(file);
        if (validationError) {
            error = validationError;
            console.warn("Video validation failed:", error);
            return;
        }
        // Store the file and its preview URL
        formData.videoTempFile = file; 
        const previewUrl = URL.createObjectURL(file);
        formData.videoUrl = previewUrl;

	}

    async function updateAuthor(authorId) {
        const userInfo = await getUser(authorId); 
        formData = {
            ...formData, 
            ...userInfo, 
            authorId: authorId
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        dispatch('submit', { ...formData });
    }
</script>

<h1 class="flex flex-col items-center justify-center bg-primary text-white p-4 mb-8">
    {isEditing ? 'Edit Testimonial' : 'Create New Testimonial'}
</h1>
<section class="min-h-[50vh] bg-gray-50 py-12">
    <div class="container mx-auto px-4">
        <div class="rounded-lg bg-white p-6 shadow-md">
            <form on:submit={handleSubmit} class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Author -->
                    <div>
                        <label for="authorId" class="block font-semibold mb-1">Author</label>
                        <select id="authorId" value={formData.authorId} on:change={(e) => updateAuthor(e.target.value)} required class="w-full border rounded px-3 py-2">
                        <option value="">Select author</option>
                        {#if $usersList}
                            {#each $usersList as user}
                            <option value={user.uid}>{user.name || user.displayName} {(user.name || user.displayName) ? "-" : ""} {user.email}</option>
                            {/each}
                        {/if}
                        </select>
                    </div>

                    <!-- Author Title -->
                    <div>
                        <label for="authorTitle" class="block font-semibold mb-1">Author Title</label>
                        <input type="text" id="authorTitle" bind:value={formData.authorTitle} placeholder="Author Title" class="w-full border rounded px-3 py-2" />
                    </div>

                    <!-- Author Organization -->
                    <div>
                        <label for="authorOrganization" class="block font-semibold mb-1">Author Organization</label>
                        <input type="text" id="authorOrganization" bind:value={formData.authorOrganization} placeholder="Author Organization" class="w-full border rounded px-3 py-2" />
                    </div>

                    <!-- Author Location -->
                    <div>
                        <label for="authorLocation" class="block font-semibold mb-1">Author Location</label>
                        <input type="text" id="authorLocation" bind:value={formData.authorLocation} placeholder="Author Location" class="w-full border rounded px-3 py-2" />
                    </div>

                </div>

                <!-- Highlight -->
                <div>
                    <label for="highlight" class="block font-semibold mb-1">Highlight</label>
                    <textarea type="text" id="highlight" bind:value={formData.highlight} placeholder="Highlight" row="3" class="w-full border rounded px-3 py-2" ></textarea>
                </div>

                <!-- Quote -->
                <div>
                    <label for="quote" class="block font-semibold">Quote</label>
                    <MarkdownEditor
                        bind:value={formData.quote}
                        id="quote"
                        required
                        placeholder=""
                        onInput={(newValue) => {
                            formData.quote = newValue;
                        }}
                    />
                </div>

                <!-- Outcome Summary -->
                <div>
                    <label for="outcomeSummary" class="block font-semibold mb-1">Outcome Summary</label>
                    <textarea type="text" id="outcomeSummary" bind:value={formData.outcomeSummary} placeholder="Outcome Summary" row="3" class="w-full border rounded px-3 py-2"></textarea>
                </div>

                <!-- Images -->
                <div>
                    <label for="images" class="block font-semibold">Images</label>
                    <div class="mt-1">
                        <MediaUploader
                            type="images"
                            id="images"
                            multiple
                            maxFiles={20}
                            on:upload={handleImagesUpload}
                        />
                    </div>
                    <div class="mt-2 grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-7">
                        {#if formData.imageUrls?.length > 0}
                            {#each formData.imageUrls as image, index}
                                <div class="relative bg-gray-100 rounded-lg p-2">
                                    <img
                                        src={image}
                                        alt="Gallery preview"
                                        class="aspect-square rounded-lg bg-white object-cover"
                                    />
                                    <button
                                        type="button"
                                        on:click={() => formData.imageUrls = formData.imageUrls.filter((_, i) => i !== index)}
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

                <!-- Video -->
                <div>
                    <label for="video" class="block font-semibold">Video</label>
                    <div class="mt-1">
                        <MediaUploader
                            id="video"
                            type="videos"
                            on:upload={handleVideoUpload}
                        />
                    </div>
                    <div class="mt-2 grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-7">
                        {#if formData.videoUrl}
                            <div class="relative bg-gray-100 rounded-lg p-2">
                                <video
                                    src={formData.videoUrl}
                                    controls
                                    class="w-full rounded-lg"
                                >
                                    <track kind="captions" />
                                </video>
                                <button
                                    type="button"
                                    on:click={() => formData.videoUrl = null}
                                    class="absolute top-1 right-1 rounded-full p-1 bg-white text-red-500 hover:text-red-800 shadow-sm"
                                    aria-label="Remove video"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>	
                                </button>
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Tags -->
                <div>
                    <label for="tags" class="block font-semibold mb-1">Tags</label>
                    <div class="flex space-x-2 mb-2">
                        <input type="text" bind:value={tagInput} class="flex-1 border rounded px-3 py-2" placeholder="Add tag..." on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                        <button type="button" on:click={addTag} class="bg-primary text-white px-3 py-2 rounded">Add</button>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        {#each formData.tags as tag, idx}
                        <span class="bg-gray-300 rounded-full px-3 py-1 flex items-center">{tag}<button type="button" class="ml-2 text-red-500" on:click={() => removeTag(idx)}>&times;</button></span>
                        {/each}
                    </div>
                </div>

                <!-- Visibility, Status, Source, Display Format -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label for="visibility" class="block font-semibold mb-1">Visibility</label>
                        <select id="visibility" bind:value={formData.visibility} required class="w-full border rounded px-3 py-2">
                        {#each visibilityOptions as v}
                            <option value={v}>{v}</option>
                        {/each}
                        </select>
                    </div>
                    <div>
                        <label for="status" class="block font-semibold mb-1">Status</label>
                        <select id="status" bind:value={formData.moderationStatus} required class="w-full border rounded px-3 py-2">
                        {#each statusOptions as s}
                            <option value={s}>{s}</option>
                        {/each}
                        </select>
                    </div>
                    <div>
                        <label for="source" class="block font-semibold mb-1">Source</label>
                        <select id="source" bind:value={formData.source} class="w-full border rounded px-3 py-2">
                        {#each availableSources as s}
                            <option value={s}>{s}</option>
                        {/each}
                        </select>
                    </div>
                    <div>
                        <label for="format" class="block font-semibold mb-1">Display Format</label>
                        <select id="format" bind:value={formData.displayFormat} class="w-full border rounded px-3 py-2">
                        {#each formatOptions as f}
                            <option value={f}>{f}</option>
                        {/each}
                        </select>
                    </div>
                </div>

                <!-- Notes -->
                <div>
                    <label for="notes" class="block font-semibold mb-1">Internal Notes</label>
                    <textarea id="notes" bind:value={formData.editorNotes} rows="2" placeholder="Internal notes for admin/moderator" class="w-full border rounded px-3 py-2"></textarea>
                </div>

                {#if error}
                    <div class="text-red-600">{error}</div>
                {/if}
                <div class="flex justify-end space-x-4 pt-6">
                    <button
                        type="button"
                        class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        on:click={handleCancel} disabled={loading}
                    >
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
