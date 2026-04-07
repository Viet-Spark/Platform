<script>
    import { goto } from '$app/navigation';
    import { userData, userLoading } from '$lib/stores/userStore';
    import { authUser } from '$lib/stores/authStore';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { programHandlers, programLoading, curProgram, programs } from '$lib/stores/programStore';
    import { validateFile, validateImageFile, validateVideoFile} from '$lib/utils/validator.js';
    import { workshopHandlers, workshops, workshopError, workshopLoading } from '$lib/stores/workshopStore';
    import WorkshopForm from '$lib/components/WorkshopForm.svelte';
    import { formatDateForDateTimeInput, formatDetailDate} from '$lib/utils/formatDate.js';

    // Redirect if not admin
    $: if (!$userLoading && $authUser && $userData && !$userData.isAdmin) {
        goto('/');
    }
    $: programId = $page.params.programId;
    let programWorkshops = []; 
    let loading = true;
    let error = '';

    onMount(async () => {
        await loadWorkshops(); 
    })

    async function loadWorkshops() {
        if (!programId) return; 
        loading = true;
        error = '';
        try {
            // Load the current program to get associated workshop IDs
            await programHandlers.getProgram(programId);
            await workshopHandlers.getWorkshops(); 
            const ids = $curProgram.workshopIds || [];
            let filteredWorkshops = $workshops.filter((workshop) => ids.includes(workshop.id)); 
            
            // Sort by startTime (most recent first)
            filteredWorkshops.sort((a, b) => {
                const getTimestamp = (workshop) => {
                    if (!workshop.startTime) return 0;
                    // Handle Firestore Timestamp
                    if (workshop.startTime.seconds) {
                        return workshop.startTime.seconds * 1000;
                    }
                }
                return getTimestamp(b) - getTimestamp(a); // Descending order (most recent first)
            });
            
            programWorkshops = filteredWorkshops.map((workshop) => {
                workshop.startTime = formatDateForDateTimeInput(workshop.startTime);
                workshop.endTime = formatDateForDateTimeInput(workshop.endTime);
                workshop.registrationDeadline = formatDateForDateTimeInput(workshop.registrationDeadline);
                return workshop;
            });
            
            loading = false;
        } catch (err) {
            console.error('Error loading workshops:', err);
            error = err?.message ?? String(err);
        }
    }

    async function handleDelete(id) {
		if (confirm('Are you sure you want to delete this workshop?')) {
            loading = true; 
			await workshopHandlers.deleteWorkshop(id); 
		}
        const workshopIds = ($curProgram.workshopIds || []).filter(i => i != id); 
        let programData = {
            ...$curProgram, 
            workshopIds: workshopIds
        }
        await programHandlers.updateProgram(programId, programData); 
        await loadWorkshops(); 
        loading = false;
	}

</script>

<section class="container mx-auto">
    {#if loading}
        <div class="flex h-screen items-center justify-center">
            <span>Loading...</span>
        </div>
    {:else if error !== ''}
        <div class="flex h-screen items-center justify-center">
            <span>{error}</span>
        </div>
    {:else}
		<div class="flex flex-col items-center justify-center bg-primary text-white p-4 mb-8">
			<h1 class="text-2xl font-bold">Workshops</h1>
			<p>Manage {$curProgram.title} Workshops</p>
		</div>

		<div class="mb-8 flex items-center justify-end">
			<a
				href="/admin/programs/edit/{programId}/workshops/new"
				class="bg-primary hover:bg-primary-dark rounded-md px-4 py-2 text-white"
			>
				Add New Workshop
			</a>
		</div>
		{#if programWorkshops.length === 0}
			<div class="rounded-lg bg-gray-100 p-8 text-center">
				<p class="text-gray-600">No workshops found. Add your first workshop!</p>
			</div>
		{:else}
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-center">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cover Image</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Visibility</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        {#each programWorkshops as workshop}
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    {#if workshop.coverUrl}
                                        <img src={workshop.coverUrl} alt={workshop.title} class="w-10 h-10 rounded-full object-cover mx-auto">
                                    {:else}
                                        <div class="w-10 h-10 rounded-full object-cover bg-primary mx-auto"></div>
                                    {/if}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{workshop.title || "VietSpark Workshop"}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900">{formatDetailDate(workshop.startTime)}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs font-semibold rounded-full
                                    {(workshop.visibility === "Public") ? "text-green-500" : (workshop.visibility === "Internal" ? "text-grey-700" : "text-red-500")}"
                                    >
                                        {workshop.visibility}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex space-x-2 justify-center">
                                        <a
                                            href="/admin/programs/edit/{programId}/workshops/edit/{workshop.id}"
                                            class="text-blue-600 hover:text-blue-800"
                                        >
                                            Edit
                                        </a>
                                        <button
                                            on:click={() => handleDelete(workshop.id)}
                                            class="text-red-600 hover:text-red-800"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
		{/if}
	{/if}
</section>

