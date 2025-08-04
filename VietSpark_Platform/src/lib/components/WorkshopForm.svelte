<script>
    import { createEventDispatcher } from 'svelte';
    import MediaUploader from './MediaUploader.svelte';
    import MarkdownEditor from '$lib/components/MarkdownEditor.svelte';
    import { usersList, getUsers } from '$lib/stores/userStore';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { validateFile, validateImageFile, validateVideoFile} from '$lib/utils/validator.js';

    export let workshop = {
        id: '',
        title: '',
        description: '',
        date: '',
        duration: 0,
        location: '',
        imageUrls: [],
        tempFiles: [],
        schedule: [],
    }

    export let loading = false;
    export let error = '';
    export let isEditing = false;
    export let handleCancel = () => {}; 
    export let teams = []; 
    const dispatch = createEventDispatcher();
    let formData = { ...workshop };


    function handleImagesUpload(event) {
		formData.tempFiles = [...(formData.tempFiles || []), ...event.detail.files];
		// Create temporary preview URLs
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

    function addScheduleEntry() {
        formData.schedule = [...formData.schedule, {
            presenterId: '',
            time: 0, 
            description: ''
        }]
    }

    function removeScheduleEntry(schedIdx) {
        formData.schedule = formData.schedule.filter((_, i) => i !== schedIdx); 
    } 

    function getWorkshopDuration() {
        if (!formData.schedule) return 0;
        let total = formData.schedule.reduce((sum, entry) => sum + (Number(entry.time) || 0), 0);
        formData.duration = total; 
        return total; 
    }

    function handleSubmit(e) {
        e.preventDefault();
        dispatch('submit', { ...formData });
    }

</script>

<h1 class="flex flex-col items-center justify-center bg-primary text-white p-4 mb-8">
    {isEditing ? 'Edit Workshop' : 'Create New Workshop'}
</h1>

<section class="min-h-[50vh] bg-gray-50 py-12">
    <div class="container mx-auto px-4">
        <div class="rounded-lg bg-white p-6 shadow-md">
            <form on:submit={handleSubmit} class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Title -->
                    <div>
                        <label for="title" class="block text-sm font-bold text-gray-700">Title</label>
                        <input
                            id="title"
                            type="text"
                            required
                            bind:value={formData.title}
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        />
                    </div>

                    <!-- Location -->
                    <div>
                        <label for="location" class="block text-sm font-bold text-gray-700">Location</label>
                        <input
                            id="location"
                            type="text"
                            required
                            bind:value={formData.location}
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        />
                    </div>

                    <!-- Date -->
                    <div>
                        <label for="date" class="block text-sm font-bold text-gray-700">Date</label>
                        <input
                            id="date"
                            type="datetime-local"
                            required
                            bind:value={formData.date}
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        />
                    </div>

                    <!-- Description -->
                    <div class="col-span-2">
                        <label for="description" class="block text-sm font-bold text-gray-700">Description</label>
                        <MarkdownEditor
                            id="description"
                            bind:value={formData.description}
                            required
                            placeholder=""
                            onInput={(newValue) => {
                                formData.description = newValue;
                            }}
                        />
                    </div>
                </div>

                <!-- Images -->
                <div>
                    <label for="images" class="block text-sm font-bold text-gray-700">Images</label>
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
                                        alt="Image {index} preview}"
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

                <!-- Schedule Section -->
                <div class="mt-6">
                <h4 class="font-bold mb-2">Schedule</h4>
                <div class="space-y-2">
                    <div>
                        <table class="table-fixed w-full text-sm">
                            <thead>
                                <tr class="bg-gray-100">
                                    <th class="w-[2%] px-2 py-1">#</th>
                                    <th class="w-[40%] px-2 py-1">Presenter</th>
                                    <th class="w-[10%] px-2 py-1">Time (min)</th>
                                    <th class="w-[46%] px-2 py-1">Description</th>
                                    <th class="w-[2%] px-2 py-1"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {#if formData.schedule && formData.schedule.length > 0}
                                    {#each formData.schedule as entry, schedIdx}
                                        <tr>
                                            <td class="w-[2%] px-2 py-1">{schedIdx+1}</td>
                                            <td class="w-[40%] px-2 py-1">
                                                <select
                                                    class="rounded border-gray-300 w-full"
                                                    bind:value={entry.presenterId}
                                                >
                                                    <option value="">Select presenter</option>
                                                    {#if $usersList}
                                                        {#each $usersList as user}
                                                            <option value={user.uid}>{user.name || user.displayName || 'Unknown'} ({user.email})</option>
                                                        {/each}
                                                    {/if}
                                                    {#if teams.length > 0}
                                                        {#each teams as team}
                                                            <option value={team.id}>{team.name}</option>
                                                        {/each}
                                                    {/if}
                                                </select>
                                            </td>
                                            <td class="w-[10%] px-2 py-1">
                                                <input
                                                    type="number"
                                                    class="rounded border-gray-300 w-full"
                                                    bind:value={entry.time}
                                                />
                                            </td>
                                            <td class="w-[46%] px-2 py-1">
                                                <input
                                                    type="text"
                                                    class="rounded border-gray-300 w-full"
                                                    bind:value={entry.description}
                                                    placeholder="Topic Summary"
                                                />
                                            </td>
                                            <td class="w-[2%] px-2 py-1 text-right">
                                                <button type="button" class="text-red-500 hover:text-red-700" on:click={() => removeScheduleEntry(schedIdx)}>
                                                    ✕
                                                </button>
                                            </td>
                                        </tr>
                                    {/each}
                                {:else}
                                    <tr><td colspan="4" class="text-gray-500 px-2 py-2">No schedule entries yet.</td></tr>
                                {/if}
                            </tbody>
                        </table>
                    </div>
                    <button type="button" class="mt-2 bg-primary text-white px-3 py-2 rounded hover:bg-primary-dark" on:click={() => addScheduleEntry()}>
                        + Add Schedule Item
                    </button>
                </div>

                <!-- Total Duration -->
                <div class="mt-2 text-sm text-gray-700 font-semibold">
                    Total Duration: {getWorkshopDuration(workshop)} min
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