<script>
    import { goto } from '$app/navigation';
    import { userData, userLoading, usersList } from '$lib/stores/userStore';
    import { authUser } from '$lib/stores/authStore';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { curProgram, programHandlers, programLoading, programs } from '$lib/stores/programStore';
    import { testimonialHandlers, testimonialLoading, testimonials } from '$lib/stores/testimonialStore';
    import defaultProfile from '$lib/images/About/placeHolderAvatar.jpg';
	import { writable } from 'svelte/store';

    // Redirect if not admin (only after user data has loaded)
    $: if (!$userLoading && $authUser && $userData && !$userData.isAdmin) {
        goto('/');
    }
    
    let programTestimonials = [];
    let submitterNames = {};

    let loading = true;
    let error = '';

    // Use program id from URL so it works on refresh (curProgram not loaded yet)
    $: programId = $page.params.programId;

    onMount(async () => {
        await loadProgram();
    });

    $: if ($testimonials) {
        const ids = $curProgram.testimonialIds || [];
        programTestimonials = $testimonials.filter((testimonial) => ids.includes(testimonial.id));
    }

    $: if ($usersList) {
        for (const user of $usersList) {
            submitterNames[user.id] = user.displayName || user.name || user.email || '—';
        }
    }

    async function loadProgram() {
        if (!programId) return; 
        loading = true;
        error = '';
        try {
            await programHandlers.getProgram(programId);
            await testimonialHandlers.getTestimonials(); 
            loading = false;
        } catch (err) {
            console.error('Error loading testimonials:', err);
            error = err?.message ?? String(err);
        }
    }

    async function handleDelete(id) {
		if (confirm('Are you sure you want to delete this testimonial?')) {
			await testimonialHandlers.deleteTestimonial(id); 
		}
        const testimonialIds = ($curProgram.testimonialIds || []).filter(i => i != id); 
        let programData = {
            ...$curProgram, 
            testimonialIds: testimonialIds
        }
        await programHandlers.updateProgram(programId, programData); 
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
			<h1 class="text-2xl font-bold">Testimonials</h1>
			<p>Manage {$curProgram.title} Testimonials</p>
		</div>

		<div class="mb-8 flex items-center justify-end">
			<a
				href="/admin/programs/edit/{programId}/testimonials/new"
				class="bg-primary hover:bg-primary-dark rounded-md px-4 py-2 text-white"
			>
				Add New Testimonial
			</a>
		</div>
		{#if programTestimonials.length === 0}
			<div class="rounded-lg bg-gray-100 p-8 text-center">
				<p class="text-gray-600">No testimonials found. Add your first testimonial!</p>
			</div>
		{:else}
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-center">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Highlight</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Submitter</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        {#each programTestimonials as testimonial}
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    {#if testimonial.authorCoverImage}
                                        <img src={testimonial.authorCoverImage} alt={testimonial.authorName} class="w-10 h-10 rounded-full object-cover mx-auto">
                                    {:else}
                                        <img src={defaultProfile} alt={testimonial.authorName} class="w-10 h-10 rounded-full object-cover mx-auto">
                                    {/if}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{testimonial.authorName || "VietSpark Member"}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900">{testimonial.highlight.slice(0, 100) + '...' || ""}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-sm leading-5 text-gray-900 rounded-full">
                                        {submitterNames[testimonial.submitterId] ?? '—'}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        {(testimonial.moderationStatus === "Approved") ? "text-green-500" : (testimonial.moderationStatus === "Pending" ? "text-grey-700" : "text-red-500")}"
                                    >
                                        {testimonial.moderationStatus}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex space-x-2 justify-center">
                                        <a
                                            href="/admin/programs/edit/{programId}/testimonials/edit/{testimonial.id}"
                                            class="text-blue-600 hover:text-blue-800"
                                        >
                                            Edit
                                        </a>
                                        <button
                                            on:click={() => handleDelete(testimonial.id)}
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

