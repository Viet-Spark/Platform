<script>
    import { createEventDispatcher } from 'svelte';
    import MediaUploader from './MediaUploader.svelte';
    import { usersList, getUsers } from '$lib/stores/userStore';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { validateFile, validateImageFile, validateVideoFile} from '$lib/utils/validator.js';

    export let project = {
        id: '',
        title: '',
        description: '',
        teamId: '',
        startDate: '',
        endDate: '',
        status: 'In Progress',
        technologies: [],
        imageUrls: [],
        imageTempFiles: [], 
        presentationDate: '', 
        administrators: [], 
        tags: [], 
        links: {}
    };
    export let loading = false;
    export let error = '';
    export let isEditing = false;
    export let handleCancel = () => {}; 
    export let teams = []; 

    const dispatch = createEventDispatcher();
    let formData = { ...project };
    let tagInput = '';

    let statusOptions = ['Planning', 'In Progress', 'Completed', 'Paused'];

    onMount(() => {
        getUsers();
    });

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

    // User management
    function addAdministrators() {
        if (!formData.administrators) {
            formData.administrators = []; 
        }
        formData.administrators = [...formData.administrators, ""];
    }
    function removeAdministrators(idx) {
        formData.administrators = formData.administrators.filter((_, i) => i !== idx);
    }
    function handleUserChange(idx, userId) {
        formData.administrators[idx] = userId;
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

    // Links
    let linkFields = ['design', 'gitHub', 'demo', 'documentation', 'video'];
    function handleLinkChange(field, value) {
        formData.links = { ...formData.links, [field]: value };
    }

    function handleSubmit(e) {
        e.preventDefault();
        dispatch('submit', { ...formData });
    }
</script>

<h1 class="flex flex-col items-center justify-center bg-primary text-white p-4 mb-8">
    {isEditing ? 'Edit Project' : 'Create New Project'}
</h1>
<section class="min-h-[50vh] bg-gray-50 py-12">
    <div class="container mx-auto px-4">
        <div class="rounded-lg bg-white p-6 shadow-md">
            <form on:submit={handleSubmit} class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Project Title -->
                    <div>
                        <label for="title" class="block font-semibold mb-1">Project Title</label>
                        <input type="text" id="title" bind:value={formData.title} required placeholder="Project Title" class="w-full border rounded px-3 py-2" />
                    </div>

                    <!-- Team -->
                    <div>
                        <label for="teamId" class="block font-semibold mb-1">Team</label>
                        <select id="teamId" bind:value={formData.teamId} required class="w-full border rounded px-3 py-2">
                        <option value="">Select team</option>
                        {#if teams}
                            {#each teams as team}
                            <option value={team.id}>{team.name}</option>
                            {/each}
                        {/if}
                        </select>
                    </div>

                    <!-- Start Date -->
                    <div>
                        <label for="startDate" class="block text-sm font-medium text-gray-700">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            bind:value={formData.startDate}
                            required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        />
                    </div>

                    <!-- End Date -->
                    <div>
                        <label for="endDate" class="block text-sm font-medium text-gray-700">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            bind:value={formData.endDate}
                            required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        />
                    </div>

                    <!-- Presentation Date -->
                    <div>
                        <label for="presentationDate" class="block text-sm font-medium text-gray-700">Presentation Date</label>
                        <input
                            type="date"
                            id="presentationDate"
                            bind:value={formData.presentationDate}
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        />
                    </div>

                    <!-- Status -->
                    <div>
                        <label for="status" class="block font-semibold mb-1">Status</label>
                        <select id="status" bind:value={formData.status} required class="w-full border rounded px-3 py-2">
                        {#each statusOptions as s}
                            <option value={s}>{s}</option>
                        {/each}
                        </select>
                    </div>
                </div>
                
                <div class="flex flex-col gap-4">
                    <!-- Description -->
                    <div class="grid-cols-1">
                        <label for="description" class="block font-semibold mb-1">Description</label>
                        <textarea id="description" bind:value={formData.description} rows="8" placeholder="Project Description" required class="w-full border rounded px-3 py-2"></textarea>
                    </div>

                    <!-- Administrators -->
                    <div>
                        <label for="administrators" class="block font-semibold mb-1">Administrators</label>
                        <div id="administrators" class="space-y-2">
                            {#each formData.administrators as userId, idx}
                                <div class="flex items-center gap-2">
                                    <select bind:value={formData.administrators[idx]} on:change={(e) => handleUserChange(idx, e.target.value)} class="border rounded px-2 py-1 flex-2">
                                    <option value="">Select user</option>
                                    {#if $usersList}
                                        {#each $usersList as user}
                                        <option value={user.uid}>{user.name || user.displayName} {(user.name || user.displayName) ? "-" : ""} {user.email}</option>
                                        {/each}
                                    {/if}
                                    </select>
                                    
                                    <button type="button" class="text-red-500 ml-2" on:click={() => removeAdministrators(idx)}>&times;</button>
                                </div>
                            {/each}
                            <button type="button" class="bg-primary text-white px-3 py-1 rounded" on:click={addAdministrators}>+ Add Administrator</button>
                        </div>
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
                            {#if formData.imageUrls.length > 0}
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

                    <!-- Technologies -->
                    <div>
                        <label for="technologies" class="block text-sm font-medium text-gray-700">Technologies (comma-separated)</label>
                        <input
                            id="technologies"
                            type="text"
                            value={formData.technologies.join(', ')}
                            on:input={(e) => {
                                formData.technologies = e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech);
                            }}
                            placeholder="React, Node.js, MongoDB"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        />
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

                    <!-- Links -->
                    <div>
                        <label for="links" class="block font-semibold mb-1">Links</label>
                        <div id="links" class="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {#each linkFields as field}
                                <div>
                                    <input
                                        type="url"
                                        placeholder={field.charAt(0).toUpperCase() + field.slice(1) + ' URL'}
                                        value={(formData.links && formData.links[field]) || ''}
                                        on:input={(e) => handleLinkChange(field, e.target.value)}
                                        class="w-full border rounded px-3 py-2"
                                    />
                                </div>
                            {/each}
                        </div>
                    </div>

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
