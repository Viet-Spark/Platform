<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { testimonialHandlers } from '$lib/stores/testimonialStore';
	import { marked } from 'marked';
    import DOMPurify from 'dompurify';
    import defaultProfile from '$lib/images/About/placeHolderAvatar.jpg';
	import { userData } from '$lib/stores/userStore';
    import { goto } from '$app/navigation';
	let testimonial = null;
	let loading = true;
	let error = null;

	// Lightbox modal state for images
	let showImageModal = false;
	let modalImageUrl = '';

	$: testimonialId = $page.params.testimonialId;
    $: programId = $page.params.id;

	function parseMarkdown(content) {
		if (!content) return '';
		return DOMPurify.sanitize(marked(String(content)));
	}

	onMount(async () => {
		if (!testimonialId) {
			error = 'Missing testimonial ID.';
			loading = false;
			return;
		}

		try {
			loading = true;
			const data = await testimonialHandlers.getTestimonial(testimonialId);
			if (!data) {
				error = 'Testimonial not found.';
				return;
			}
            if (data.submitterId !== $userData.id) {
                goto(`/programs/${programId}`);
            }


			testimonial = data;
		} catch (e) {
			console.error('Error loading testimonial detail:', e);
			error = e?.message || 'Failed to load testimonial.';
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	{#if testimonial}
		<title>{testimonial.authorName ? `${testimonial.authorName}'s Testimonial` : 'Testimonial'} - VietSpark</title>
		<meta
			name="description"
			content={testimonial.highlight || 'Testimonial from the VietSpark community.'}
		/>
	{:else}
		<title>Testimonial - VietSpark</title>
	{/if}
</svelte:head>

{#if loading}
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-center">
			<div class="border-primary inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2"></div>
			<p class="mt-4 text-gray-600">Loading testimonial...</p>
		</div>
	</div>
{:else if error}
	<div class="flex min-h-screen items-center justify-center">
		<div class="max-w-xl text-center">
			<p class="mb-2 text-lg font-semibold text-red-700">Error</p>
			<p class="text-gray-600">{error}</p>
			<a href="/programs/{programId}/participant" class="text-primary mt-4 inline-block hover:underline">Back to Program</a>
		</div>
	</div>
{:else if !testimonial}
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-center">
			<p class="mb-4 text-xl">Testimonial not found</p>
			<a href="//programs/{programId}/participant" class="text-primary hover:underline">Back to Program</a>
		</div>
	</div>
{:else}
	<section class="bg-primary py-16 text-white">
		<div class="container mx-auto px-4">
			<div class="flex flex-col text-center items-center justify-between gap-6 md:flex-row">
                <div class="flex flex-6 items-center gap-4">
                    <h1 class="mb-3 text-xl font-bold">
                        {testimonial.highlight || 'Testimonial from the VietSpark community.'}
                    </h1>
                </div>
				<a
					href="/programs/{programId}/participant"
					class="btn flex-1 border-2 border-white bg-transparent px-6 py-2 text-sm font-medium text-white hover:bg-white hover:text-primary"
				>
					Back to Program
				</a>
			</div>
		</div>
	</section>

	<section class="bg-gray-50 py-12 md:py-16">
		<div class="container mx-auto px-4">
			<div class="grid grid-cols-1 gap-10 lg:grid-cols-3">
				<!-- Main testimonial content -->
				<div class="lg:col-span-2 space-y-6">
					{#if testimonial.videoUrl}
						<div>
							<h2 class="mb-3 text-lg font-semibold text-gray-900">Video Story</h2>
							<div class="overflow-hidden rounded-xl bg-black shadow-sm">
								<video
									src={testimonial.videoUrl}
									controls
									class="h-full w-full"
								>
									<track kind="captions" />
								</video>
							</div>
						</div>
					{/if}

					{#if testimonial.quote}
						<div class="prose prose-lg max-w-none rounded-xl bg-white p-6 shadow-sm prose-a:text-blue-600 prose-a:hover:text-blue-800">
							{@html parseMarkdown(testimonial.quote)}
						</div>
					{:else}
						<div class="rounded-xl bg-white p-6 shadow-sm">
							<p class="text-gray-600">Full testimonial coming soon.</p>
						</div>
					{/if}

					{#if testimonial.imageUrls && testimonial.imageUrls.length > 0}
						<div>
							<h2 class="mb-3 text-lg font-semibold text-gray-900">Gallery</h2>
							<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
								{#each testimonial.imageUrls as url (url)}
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
											alt={`Image from ${testimonial.authorName || 'testimonial'}`}
											class="w-full cursor-pointer object-cover transition hover:scale-105"
										/>
									</button>
								{/each}
							</div>
						</div>
					{/if}
				</div>

				<!-- Sidebar with author info -->
				<aside class="space-y-6">
					<div class="rounded-xl bg-white p-6 text-center shadow-sm">
						<div class="mb-4 flex justify-center">
							<img
								src={testimonial.authorCoverImage || defaultProfile}
								alt={testimonial.authorName || 'Author avatar'}
								class="h-48 w-48 rounded-full object-cover ring-2 ring-gray-100"
							/>
						</div>
						<div class="text-xl font-semibold text-gray-900">
							{testimonial.authorName || 'VietSpark Member'}
						</div>
						{#if testimonial.authorTitle || testimonial.authorOrganization}
							<p class="mt-1 text-lg text-gray-600">
								{testimonial.authorTitle}
								{#if testimonial.authorTitle && testimonial.authorOrganization} · {/if}
								{testimonial.authorOrganization}
							</p>
						{/if}
						{#if testimonial.authorLocation}
							<p class="mt-1 text-sm text-gray-500">
								<i class="fas fa-map-marker-alt mr-1"></i>
								{testimonial.authorLocation}
							</p>
						{/if}
					</div>

					{#if testimonial.tags && testimonial.tags.length > 0}
						<div class="rounded-xl bg-white p-6 shadow-sm">
							<h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
								Tags
							</h3>
							<div class="flex flex-wrap gap-2">
								{#each testimonial.tags as tag (tag)}
									<span class="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-primary">
										#{tag}
									</span>
								{/each}
							</div>
						</div>
					{/if}
				</aside>
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

