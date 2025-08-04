<script>
    import { goto } from '$app/navigation';
	import { programLoading, programHandlers, curProgram, programs} from '$lib/stores/programStore';
    import { userData } from '$lib/stores/userStore';
    import { authUser } from '$lib/stores/authStore';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    let error = '';
    let isEditing = true; 
    let programId = $page.params.id; 

    // Redirect if not admin
    $: if ($authUser && !$userData?.isAdmin) {
        goto('/');
    }
    
    onMount(async () => {
        // This will set curProgram
        await programHandlers.getProgram(programId);
    });


</script>

<div class="container mx-auto px-4 py-8">
    {#if $programLoading }
        <div class="flex h-screen items-center justify-center">
            <p class="text-xl">Loading...</p>
        </div>
    {:else}
        <h1 class="mb-8 text-3xl font-bold">Edit {$curProgram.title} Program</h1>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <!-- Teams Card -->
            <div class="rounded-lg bg-white p-6 shadow-md">
                <h2 class="mb-4 text-xl font-semibold">Teams</h2>
                    <p class="text-3xl font-bold">{$curProgram.teamIds.length}</p>
                    <a href="/admin/programs/edit/{programId}/teams" class="text-primary mt-4 inline-block hover:underline"
                        >Manage Teams →</a
                    >
            </div>
            
            <!-- Projects Card -->
            <div class="rounded-lg bg-white p-6 shadow-md">
                <h2 class="mb-4 text-xl font-semibold">Projects</h2>
                    <p class="text-3xl font-bold">{$curProgram.projectIds?.length}</p>
                    <a href="/admin/programs/edit/{programId}/projects" class="text-primary mt-4 inline-block hover:underline"
                        >Manage Projects →</a
                    >
            </div>

            <!-- Testimonials Card -->
            <div class="rounded-lg bg-white p-6 shadow-md">
                <h2 class="mb-4 text-xl font-semibold">Testimonials</h2>
                    <p class="text-3xl font-bold">{$curProgram.testimonialIds.length}</p>
                    <a href="/admin/programs/edit/{programId}/testimonials" class="text-primary mt-4 inline-block hover:underline"
                        >Manage Testimonials →</a
                    >
            </div>

            <!-- Workshops Card -->
            <div class="rounded-lg bg-white p-6 shadow-md">
                <h2 class="mb-4 text-xl font-semibold">Workshops</h2>
                    <p class="text-3xl font-bold">{$curProgram.workshops.length}</p>
                    <a href="/admin/programs/edit/{programId}/workshops" class="text-primary mt-4 inline-block hover:underline"
                        >Manage Workshops →</a
                    >
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="mt-8">
            <h2 class="mb-4 text-2xl font-bold">Quick Actions</h2>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <a
                    href="/admin/programs/edit/{programId}/details"
                    class="bg-primary hover:bg-primary-dark flex items-center justify-center rounded-lg p-4 text-white"
                >
                    Manage Program Details
                </a>
            </div>
        </div>
    {/if}
</div>
