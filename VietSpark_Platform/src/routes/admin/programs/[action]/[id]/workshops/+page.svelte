<script>
    import { goto } from '$app/navigation';
    import { userData } from '$lib/stores/userStore';
    import { authUser } from '$lib/stores/authStore';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { programHandlers, programLoading, curProgram } from '$lib/stores/programStore';
    import { teams, teamLoading} from '$lib/stores/teamStore';
    import { validateFile, validateImageFile, validateVideoFile} from '$lib/utils/validator.js';
    import WorkshopForm from '$lib/components/WorkshopForm.svelte';
    import { formatDateForDateTimeInput } from '$lib/utils/formatDate.js';

    // Redirect if not admin
    $: if ($authUser && !$userData?.isAdmin) {
        goto('/');
    }

    $: if ($teams && $curProgram) {
        programTeams = $teams.filter(team => $curProgram.teamIds.includes(team.id)); 
    }

    let workshops = []; 
    let loading = false;
    let error = '';
    let programTeams = []; 
    // Add a state to track which workshop is being edited (by index)
    let editingWorkshopIndex = null;

    async function handleWorkshopFormSubmit(event, workshopIndex) {
        const updatedWorkshop = event.detail;
        workshops = workshops.map((workshop, i) => i === workshopIndex ? updatedWorkshop : workshop);
        editingWorkshopIndex = null;
    }

    onMount(() => {
        if ($curProgram.workshops.length > 0) {
            workshops = $curProgram.workshops.map((workshop) => {
                workshop.date = formatDateForDateTimeInput(workshop.date);
                return workshop;
            })
        }
    })

    // Workshop management functions
    function handleAddWorkshop() {
        workshops = [
            ...(workshops || []),
            {
                id: crypto.randomUUID(),
                title: '',
                description: '',
                date: '',
                duration: 0,
                location: '',
                imageUrls: [],
                tempFiles: [],
                schedule: [],
            }
        ];
        editingWorkshopIndex = workshops.length - 1;
    }

    function handleEditWorkshop(idx) {
        editingWorkshopIndex = idx;
    }

    function handleRemoveWorkshop(index) {
        workshops = workshops.filter((_, i) => i !== index)
    }

    async function handleSubmit() {
        loading = true;
        error = '';

        try {
            for (let workshop of workshops) {
                // Upload gallery images
                let imageUrls = workshop.imageUrls.filter(url => !url.startsWith('data:') && !url.startsWith('blob:')); // Keep existing URLs
                if (workshop.tempFiles?.length > 0) {
                    const newUrls = await programHandlers.uploadWorkshopImages(workshop.tempFiles, $curProgram.id, workshop.id);
                    imageUrls = [...imageUrls, ...newUrls];
                }
                workshop.imageUrls = imageUrls; 
                workshop.date = new Date(workshop.date); 
                delete workshop.tempFiles; 
            }

            console.log('Preparing data to submit...');
            const dataToSubmit = {
                ...$curProgram, 
                workshops: workshops, 
            }

            console.log("Detail:", dataToSubmit);

            await programHandlers.updateProgram($curProgram.id, dataToSubmit)
            console.log('Program saved successfully');
            goto(`/admin/programs/edit/${$curProgram.id}`);
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

                <!-- Workshops Details -->
                <div class="space-y-6">
                    <div class="flex justify-between items-center">
                        <h3 class="text-lg font-bold">Workshops</h3>
                        <button
                            type="button"
                            on:click={handleAddWorkshop}
                            class="text-primary hover:text-primary-dark"
                        >
                            + Add Workshop
                        </button>
                    </div>
                    {#if workshops.length > 0}
                        {#each workshops as workshop, workshopIndex}
                            <div class="rounded-md border p-6 mb-4">
                                {#if editingWorkshopIndex === workshopIndex}
                                    <WorkshopForm
                                        workshop={workshop}
                                        isEditing={true}
                                        on:submit={(e) => handleWorkshopFormSubmit(e, workshopIndex)}
                                        loading={loading}
                                        error={error}
                                        teams={programTeams}
                                        handleCancel={() => editingWorkshopIndex = null}
                                    />
                                {:else}
                                    <div class="flex justify-between items-center">
                                        <div class="flex items-center">
                                            <div>
                                                <p class="font-bold">{workshop.title || 'Untitled Workshop'}</p>
                                                <p class="text-sm text-gray-600">{workshop.description.slice(0, 200)}</p>
                                            </div>
                                        </div>
                                        <div class="flex gap-2">
                                            <button type="button" class="text-primary" on:click={() => handleEditWorkshop(workshopIndex)}>Edit</button>
                                            <button type="button" class="text-red-600" on:click={() => handleRemoveWorkshop(workshopIndex)}>Remove</button>
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    {:else}
                        <div>There are no workshops for this program yet! Select "+ Add Workshop" to create one!</div>
                    {/if}
                </div>

                <!-- Form Actions -->
                <div class="flex justify-end space-x-4 pt-6">
                    <button
                        type="button"
                        class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        on:click={() => goto(`/admin/programs/edit/${$curProgram.id}`)} disabled={loading}
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

