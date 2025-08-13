<script>
    import { createEventDispatcher } from 'svelte';
    import MediaUploader from './MediaUploader.svelte';
    import { usersList, getUsers } from '$lib/stores/userStore';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { validateFile, validateImageFile, validateVideoFile} from '$lib/utils/validator.js';
    import { applications, applicationLoading } from '$lib/stores/applicationStore';

    export let team = {
        id: '',
        name: '',
        users: [], // array of userData {id: userId, role: userRole}
        manager: '',
        description: '',
        logoUrl: '',
        logoFileTemp: null,
        visibility: 'Internal',
        tags: [],
        links: {},
        status: 'Active',
        featured: false,
        notes: ''
    };
    export let loading = false;
    export let error = '';
    export let isEditing = false;
    export let handleCancel = () => {}; 
    export let availableApplicants = []; 

    const dispatch = createEventDispatcher();
    let formData = { ...team };
    let tagInput = '';
    let visibilityOptions = ['Public', 'Internal', 'Hidden'];
    let statusOptions = ['Active', 'Completed', 'Inactive'];
    let managerApplicants = []; 
    let memberApplicants = []; 
    onMount(() => {
        getUsers();
    });

    $: if ($usersList) {
        availableApplicants = availableApplicants.map((u) => {
            const userData = $usersList.find((user) => user.uid === u.userId); 
            return {
                role: u.role, 
                name: userData.name || '', 
                uid: userData.uid, 
                displayName: userData.displayName || '', 
                email: userData.email
            }   
        })
        managerApplicants = availableApplicants.filter((app) => app.role === 'manager'); 
        memberApplicants = availableApplicants.filter((app) => app.role !== "manager"); 
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

    // User management
    function addUser() {
        if (!formData.users) {
            formData.users = []; 
        }
        formData.users = [...formData.users, ''];
    }
    function removeUser(idx) {
        formData.users = formData.users.filter((_, i) => i !== idx);
    }
    function handleUserChange(idx, userData) {
        formData.users[idx] = userData; 
    }

    // Logo upload
    function handleLogoUpload(event) {
        const { files } = event.detail;
        if (files && files[0]) {
            formData.logoFileTemp = files[0];
            const validationError = validateImageFile(files[0]); 
            if (validationError) {
                error = validationError; 
                return; 
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                formData.logoUrl = reader.result;
            };
            reader.readAsDataURL(formData.logoFileTemp);
        }
    }

    // Links
    let linkFields = ['github', 'figma', 'notion', 'miro', 'presentation'];
    function handleLinkChange(field, value) {
        formData.links = { ...formData.links, [field]: value };
    }

    function handleSubmit(e) {
        loading = true; 
        e.preventDefault();
        dispatch('submit', { ...formData });
    }
</script>

<h1 class="flex flex-col items-center justify-center bg-primary text-white p-4 mb-8">
    {isEditing ? 'Edit Team' : 'Create New Team'}
</h1>
<section class="min-h-[50vh]">
    <div class="container mx-auto">
        <div class="rounded-lg bg-white">
            <form on:submit={handleSubmit} class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Team Name -->
                    <div>
                        <label for="name" class="block font-semibold mb-1">Team Name</label>
                        <input type="text" id="name" bind:value={formData.name} required placeholder="Team Name" class="w-full border rounded px-3 py-2" />
                    </div>

                    <!-- Manager -->
                    <div>
                        <label for="manager" class="block font-semibold mb-1">Manager (Mentor/Lead)</label>
                        {#if managerApplicants.length > 0}
                            <select id="manager" bind:value={formData.manager} class="w-full border rounded px-3 py-2">
                                <option value="">Select manager</option>
                                {#each managerApplicants as user}
                                    <option value={user.uid}>{user.name || user.displayName} {(user.name || user.displayName) ? "-" : ""} {user.email}</option>
                                {/each}
                            </select>
                        {:else}
                            <div>There aren't any approved manager applications yet!</div>
                        {/if}
                    </div>

                    <!-- Logo Upload -->
                    <div>
                        <label for="logoImage" class="block font-semibold mb-1">Logo / Team Photo</label>
                        <div class="md:flex md:gap-4">
                            {#if formData.logoUrl}
                                <img src={formData.logoUrl} alt="Team Logo" class="md:w-[40%] w-full aspect-square object-cover rounded" />
                            {/if}
                            <div class="flex-1">
                                <MediaUploader 
                                    id="logoImage"
                                    type="image" 
                                    multiple={false} 
                                    maxFiles={1} 
                                    on:upload={handleLogoUpload} 
                                />
                            </div>
                        </div>
                    
                        
                    </div>

                    <!-- Description -->
                    <div class="grid-cols-1">
                        <label for="description" class="block font-semibold mb-1">Description</label>
                        <textarea id="description" bind:value={formData.description} rows="8" placeholder="Team bio or mission statement" required class="w-full border rounded px-3 py-2"></textarea>
                    </div>
                </div>
                
                <div class="flex flex-col gap-4">
                    <!-- Users and Roles -->
                    <div class="">
                        <label for="teamMembers" class="block font-semibold mb-1">Team Members</label>
                        <div id="teamMembers" class="space-y-2">
                            {#if memberApplicants.length > 0}
                                {#each formData.users as user, idx}
                                    <div class="md:flex items-center gap-2">
                                        <select on:change={(e) => handleUserChange(idx, memberApplicants[e.target.selectedIndex - 1])}
                                            class="border rounded px-2 py-1 md:flex-2"
                                        >
                                            <option value="" disabled selected>Select user</option>
                                            {#each memberApplicants as member}
                                                <option selected={formData.users[idx]?.uid === member.uid}>
                                                    {member.name || member.displayName} {(member.name || member.displayName) ? "-" : ""} {member.email} - {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                                </option>
                                            {/each}
                                        
                                        </select>
                                        <button type="button" class="text-red-500 ml-2" on:click={() => removeUser(idx)}>&times;</button>
                                    </div>
                                {/each}
                            {:else}
                                <div>There aren't any mentee or mentor applications yet!</div>  
                            {/if}
                            <button type="button" class="bg-primary text-white px-3 py-1 rounded" on:click={addUser}>+ Add Member</button>
                        </div>
                    </div>

                    <!-- Tags -->
                    <div>
                        <label for="tags" class="block font-semibold mb-1">Tags</label>
                        <div class="md:flex space-x-2 mb-2">
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

                    <!-- Visibility, Status, Featured -->
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
                            <select id="status" bind:value={formData.status} required class="w-full border rounded px-3 py-2">
                            {#each statusOptions as s}
                                <option value={s}>{s}</option>
                            {/each}
                            </select>
                        </div>
                        <div class="flex items-center mt-6">
                            <input id="featured" type="checkbox" bind:checked={formData.featured} class="mr-2" />
                            <label for="featured" class="font-semibold">Featured</label>
                        </div>
                    </div>

                    <!-- Notes -->
                    <div>
                        <label for="notes" class="block font-semibold mb-1">Internal Notes</label>
                        <textarea id="notes" bind:value={formData.notes} rows="2" placeholder="Internal notes for admin/moderator" class="w-full border rounded px-3 py-2"></textarea>
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
