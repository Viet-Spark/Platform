<script>
    import { createEventDispatcher } from 'svelte';
    import { usersList, getUsers } from '$lib/stores/userStore';
    import { onMount } from 'svelte';
    import { validateFile, validateImageFile, validateVideoFile} from '$lib/utils/validator.js';

    export let application = {
        id: '',
        programId: '',
        title: '',
        name: '', 
        role: '',
        userId: '',
        reasons: '',
        resume: '',
        resumeTempFile: null,
        email: '',
        status: 'Pending',
        links: {}
    };
    export let loading = false;
    export let error = '';
    export let isEditing = false;
    export let displayStatus = false;
    export let handleCancel = () => {}; 
    export let programId = ''; 
    export let role = ''; 

    const dispatch = createEventDispatcher();
    let formData = { ...application, role: role, programId: programId };
    let statusOptions = ['Pending', 'Approved', 'Rejected', 'Withdrawn'];

    onMount(() => {
        getUsers();
    });

    
    function handleFileChange(event) {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            // Optional: Additional check if you want to enforce MIME type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(selectedFile.type)) {
                alert('Only PDF or DOC files are allowed.');
                event.target.value = ''; // Clear the input
                formData.resumeTempFile = null;
                return;
            }
            formData.resumeTempFile = selectedFile;
            console.log('Selected file:', formData.resumeTempFile);
        }
    }

    // Links
    let linkFields = ['portfolio', 'gitHub', 'linkedIn', 'website'];
    function handleLinkChange(field, value) {
        formData.links = { ...formData.links, [field]: value };
    }

    function handleSubmit(e) {
        e.preventDefault();
        loading = true; 
        dispatch('submit', { ...formData });
    }
</script>

<h1 class="flex flex-col items-center justify-center bg-primary text-white p-4 mb-8">
    {isEditing ? 'Edit Application' : 'Create ' + role.charAt(0).toUpperCase() + role.slice(1) + ' Application'}
</h1>
<section class="min-h-[50vh]">
    <div class="container mx-auto">
        <div class="rounded-lg bg-white">
            <form on:submit={handleSubmit} class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Name -->
                    <div>
                        <label for="name" class="block font-semibold mb-1">Name</label>
                        <input type="text" id="name" bind:value={formData.name} required placeholder="Name" class="w-full border rounded px-3 py-2" />
                    </div>

                    <!-- Email -->
                    <div>
                        <label for="email" class="block font-semibold mb-1">Email</label>
                        <input type="email" id="email" bind:value={formData.email} required placeholder="Email" class="w-full border rounded px-3 py-2" />
                    </div>

                    <!-- Resume -->
                    <div>
                        <label for="resume" class="block font-semibold mb-1">Upload your resume</label>
                        <div class="flex flex-col gap-3 w-full max-w-md p-4 bg-white shadow rounded-md border">
                            <input
                                id="resume"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                on:change={handleFileChange}
                                class="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                            />
                        
                            {#if formData.resumeTempFile}
                                <p class="text-sm text-green-600 font-medium">Selected file: {formData.resumeTempFile.name}</p>
                            {:else if formData.resume}
                                <a
                                    href={formData.resume}
                                    target="_blank"
                                    class="text-blue-600 underline text-sm mt-2"
                                >
                                    View uploaded resume
                                </a>
                            {/if}
                        </div>
                    </div>
                </div>
                
                <div class="flex flex-col gap-4">
                    <!-- Reasons -->
                    <div class="grid-cols-1">
                        <label for="reasons" class="block font-semibold mb-1">Reasons</label>
                        <textarea id="reasons" bind:value={formData.reasons} rows="8" placeholder="Reasons" required class="w-full border rounded px-3 py-2"></textarea>
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

                <!-- Status -->
                <div class="{displayStatus ? 'block' : 'hidden'}">
                    <label for="status" class="block font-semibold mb-1">Status</label>
                    <select id="status" bind:value={formData.status} required class="w-full border rounded px-3 py-2">
                    {#each statusOptions as s}
                        <option value={s}>{s}</option>
                    {/each}
                    </select>
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
