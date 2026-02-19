<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { marked } from 'marked';
    import DOMPurify from 'dompurify';
    import { workshopHandlers } from '$lib/stores/workshopStore';
    import { formatDate, formatTime, formatDetailDate } from '$lib/utils/formatDate';

    let workshop = null;
    let loading = true;
    let error = null;
    let workshopId = ''; 

    // Lightbox modal state for images
    let showImageModal = false;
    let modalImageUrl = '';

    $: workshopId = $page.params.id;

	onMount(async () => {
		if (!workshopId) {
			error = 'Missing workshop ID.';
			loading = false;
			return;
		}
		try {
			loading = true;
			const data = await workshopHandlers.getWorkshop(workshopId);

			if (!data) {
				error = 'Workshop not found.';
				return;
			}
			workshop = data;
		} catch (e) {
			console.error('Error loading workshop detail:', e);
			error = e?.message || 'Failed to load workshop.';
		} finally {
			loading = false;
		}
	});

    function parseMarkdown(content) {
        if (!content) return 'No description available';
        // First parse markdown to HTML
        const rawHtml = marked(content);
        // Then sanitize the HTML to prevent XSS
        return DOMPurify.sanitize(rawHtml);
    }
</script>

<svelte:head>
	{#if workshop}
		<title>{workshop.title}</title>
		<meta
			name="description"
			content={workshop.title || `VietSpark's Workshop`}
		/>
	{:else}
		<title>Workshop - VietSpark</title>
	{/if}
</svelte:head>

{#if loading}
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-center">
			<div class="border-primary inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2"></div>
			<p class="mt-4 text-gray-600">Loading workshop...</p>
		</div>
	</div>
{:else if error}
	<div class="flex min-h-screen items-center justify-center">
		<div class="max-w-xl text-center">
			<p class="mb-2 text-lg font-semibold text-red-700">Error</p>
			<p class="text-gray-600">{error}</p>
			<a href="/workshops" class="text-primary mt-4 inline-block hover:underline">Back to Workshops</a>
		</div>
	</div>
{:else if !workshop}
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-center">
			<p class="mb-4 text-xl">Workshop not found</p>
			<a href="/workshops" class="text-primary hover:underline">Back to Workshops</a>
		</div>
	</div>
{:else}
    <section class="bg-primary py-16 text-white">
        <div class="container mx-auto px-4">
            <div class="flex gap-5 items-center justify-between md:flex-row flex-col">
                <div class="flex-6">
                    <h1 class="mb-4 font-bold">{workshop.title}</h1>
                    <div class="flex gap-2 items-center justify-center space-x-4 text-lg md:flex-row flex-col">
                        <div class="flex items-center">
                            <i class="fas fa-calendar-day mr-2"></i>
                            <span>{formatDate(workshop.startTime)} - {formatDate(workshop.endTime)}</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-clock mr-2"></i>
                            <span>{formatTime(workshop.startTime)} - {formatTime(workshop.endTime)}</span>
                        </div>
                        {#if workshop.location}
                            <div class="flex items-center">
                                <i class="fas fa-map-marker-alt mr-2"></i>
                                <span>{workshop.location}</span>
                            </div>
                        {/if}
                    </div>
                </div>
                <a
                    href="/workshops"
                    class="btn text-center flex-1 hover:text-primary border-2 border-white bg-transparent hover:bg-white"
                >
                    Back to Workshops
                </a>
            </div>
        </div>
    </section>

    <section class="py-16">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
                <div class="md:col-span-2">
                    {#if workshop.description}
						<div class="prose prose-lg prose-a:text-blue-600 prose-a:hover:text-blue-800">
							{@html parseMarkdown(workshop.description)}
						</div>
					{:else}
						<p class="text-gray-600">Details coming soon.</p>
					{/if}
                    {#if workshop.schedule && workshop.schedule.length > 0}
                        <div class="mt-8">
                            <h3 class="mb-3 text-lg font-semibold text-gray-900">Schedule</h3>
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th class="px-3 py-2 text-left font-bold text-gray-700">#</th>
                                            <th class="px-3 py-2 text-left font-bold text-gray-700">Presenter</th>
                                            <th class="px-3 py-2 text-left font-bold text-gray-700">Time (min)</th>
                                            <th class="px-3 py-2 text-left font-bold text-gray-700">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-100 bg-white">
                                        {#each workshop.schedule as entry, idx}
                                            <tr>
                                                <td class="px-3 py-2 text-gray-600">{idx + 1}</td>
                                                <td class="px-3 py-2 text-gray-800">
                                                    {entry.presenterName || 'TBA'}
                                                </td>
                                                <td class="px-3 py-2 text-gray-800">
                                                    {entry.time || 0}
                                                </td>
                                                <td class="px-3 py-2 text-gray-700">
                                                    {entry.description}
                                                </td>
                                            </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    {/if}
                    {#if workshop.imageUrls && workshop.imageUrls.length > 0}
						<div>
							<h2 class="mb-3 text-lg font-semibold text-gray-900">Gallery</h2>
							<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
								{#each workshop.imageUrls as url (url)}
									<button
										type="button"
										class="overflow-hidden rounded-lg bg-white shadow-sm focus:outline-none"
										aria-label="View image full size"
										on:click={() => {
											modalImageUrl = url;
											showImageModal = true;
										}}
									>
										<img
											src={url}
											alt={`Image from ${workshop.title || 'workshop'}`}
											class="w-full cursor-pointer object-cover transition hover:scale-105"
										/>
									</button>
								{/each}
							</div>
						</div>
					{/if}
                </div>
                <div class="flex gap-5 flex-col md:col-span-1">
                    {#if workshop.coverUrl}
                        <img 
                            src={workshop.coverUrl}
                            alt={workshop.title}
                            class="w-full rounded-lg ring-2 ring-gray-100"
                        />
                    {/if}
                    <div class="mb-8 rounded-lg bg-gray-50 p-6 shadow-sm">
						<h3 class="mb-4 text-xl font-bold">Workshop Details</h3>
						<ul class="space-y-4">
							{#if workshop.startTime}
								<li class="flex items-start">
									<div class="text-primary mr-3 mt-1">
										<i class="fas fa-calendar-alt"></i>
									</div>
									<div>
										<strong>Date</strong>
										<p>{formatDate(workshop.startTime)}</p>
									</div>
								</li>
                                <li class="flex items-start">
									<div class="text-primary mr-3 mt-1">
										<i class="fas fa-clock"></i>
									</div>
									<div>
										<strong>Time</strong>
										<p>{formatTime(workshop.startTime)} - {formatTime(workshop.endTime)}</p>
									</div>
								</li>
							{/if}
                            {#if workshop.location}
                                <li class="flex items-start">
                                    <div class="text-primary mr-3 mt-1">
                                        <i class="fas fa-map-marker-alt"></i>
                                    </div>
                                    <div>
                                        <strong>Location</strong>
                                        <p>{workshop.location}</p>
                                    </div>
                                </li>
                            {/if}
                            {#if workshop.registrationDeadline}
                                <li class="flex items-start">
                                    <div class="text-primary mr-3 mt-1">
                                        <i class="fas fa-calendar-check"></i>
                                    </div>
                                    <div>
                                        <strong>Registration Deadline</strong>
                                        <p>{formatDetailDate(workshop.registrationDeadline)}</p>
                                    </div>
                                </li>
                            {/if}
						</ul>
						{#if workshop.registrationLink && workshop.registrationDeadline && new Date(workshop.registrationDeadline.seconds * 1000) > new Date()}
                            <div class="mt-6">
                                <a href={workshop.registrationLink}
                                    aria-label="Apply for {workshop.title}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <button class="btn bg-primary hover:underline hover:bg-primary-dark w-full text-white">
                                        Register Now
                                    </button>
                                </a>
                            </div>
                        {/if}
					</div>
                </div>
            </div>
        </div>
    </section>

	{#if showImageModal && modalImageUrl}
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
			role="dialog"
			aria-modal="true"
			aria-label="Image lightbox"
			tabindex="-1"
			on:click={() => (showImageModal = false)}
			on:keydown={(e) => e.key === 'Escape' && (showImageModal = false)}
		>
			<button
				type="button"
				aria-label="Close"
				class="absolute right-4 top-4 z-10 text-3xl text-white hover:opacity-80"
				on:click={() => (showImageModal = false)}
			>
				×
			</button>
			<div class="max-h-[90vh] max-w-full" role="presentation" on:click|stopPropagation on:keydown|stopPropagation>
				<img
					src={modalImageUrl}
					alt="Enlarged view"
					class="max-h-[90vh] max-w-full rounded-lg object-contain shadow-xl"
				/>
			</div>
		</div>
	{/if}
{/if}

<style>
	.btn {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		font-weight: 500;
		border-radius: 0.375rem;
		transition: all 0.2s;
	}
</style>

