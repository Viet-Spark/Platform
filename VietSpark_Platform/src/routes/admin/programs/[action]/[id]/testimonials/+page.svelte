<script>
    import { goto } from '$app/navigation';
    import { userData, getUser } from '$lib/stores/userStore';
    import { authUser } from '$lib/stores/authStore';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { curProgram, programHandlers, programLoading } from '$lib/stores/programStore';
    import { testimonialHandlers, testimonialLoading, testimonials } from '$lib/stores/testimonialStore';
    import defaultProfile from '$lib/images/About/placeHolderAvatar.jpg';

    // Redirect if not admin
    $: if ($authUser && !$userData?.isAdmin) {
        goto('/');
    }
    let programTestimonials = []; 

    $: if (loading) {
        updateProgramTestimonials(); 
    }

    onMount(() => {
        updateProgramTestimonials(); 
    })

    let loading = false;
    let error = '';

    async function handleDelete(id) {
		if (confirm('Are you sure you want to delete this testimonial?')) {
			await testimonialHandlers.deleteTestimonial(id); 
		}
        let testimonialIds = $curProgram.testimonialIds.filter(i => i != id); 
        let programData = {
            ...$curProgram, 
            testimonialIds: testimonialIds
        }
        await programHandlers.updateProgram($curProgram.id, programData); 
        loading = true;
	}

    async function updateProgramTestimonials() {
        await programHandlers.getProgram($curProgram.id);

        let baseTestimonials = $testimonials.filter((testimonial => $curProgram.testimonialIds.includes(testimonial.id))); 
        // Get author information by user ID
        if (baseTestimonials.length > 0) {
            programTestimonials = await Promise.all(
                baseTestimonials.map(async t => {
                    const author = await getUser(t.authorId);
                    return { ...t, ...author };
                })
            );
        }
        loading = false; 
    }

</script>

<section class="container mx-auto">
    {#if $programLoading || $testimonialLoading}
        <div class="flex h-screen items-center justify-center">
            <p class="text-xl">Loading...</p>
        </div>

    {:else}
		<div class="flex flex-col items-center justify-center bg-primary text-white p-4 mb-8">
			<h1 class="text-2xl font-bold">Testimonials</h1>
			<p>Manage {$curProgram.title} Testimonials</p>
		</div>

		<div class="mb-8 flex items-center justify-end">
			<a
				href="/admin/programs/edit/{$curProgram.id}/testimonials/new"
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
                <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile Image</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Highlight</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        {#each programTestimonials as testimonial}
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    {#if testimonial.profileImage}
                                        <img src={testimonial.profileImage} alt={testimonial.name} class="w-10 h-10 rounded-full object-cover">
                                    {:else}
                                        <img src={defaultProfile} alt={testimonial.name} class="w-10 h-10 rounded-full object-cover">
                                    {/if}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{testimonial.name || "VietSpark Member"}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-500">{testimonial.highlight.slice(0, 100) || ""}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                                        {testimonial.moderationStatus}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex space-x-2 justify-start">
                                        <a
                                            href="/admin/programs/edit/{$curProgram.id}/testimonials/edit/{testimonial.id}"
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

