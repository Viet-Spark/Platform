<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';
	import { programs, programHandlers, programLoading, programError } from '$lib/stores/programStore';
	import { testimonials, testimonialHandlers } from '$lib/stores/testimonialStore';
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';
	import { formatDateFromStr } from '$lib/utils/formatDate';

	let error = null;
	const program = writable(null);
	let currentSlide = 0;
	let tabList = [];
	let programImages = writable([]);
	let length = 0;

	$: programId = $page.params.id;

	$: if (programId && $programs) {
		program.set($programs.find((p) => p.id === programId));
	}

	$: programTestimonials = $program?.testimonialIds?.length
		? ($testimonials || []).filter((t) => $program.testimonialIds.includes(t.id))
		: [];

	onMount(async () => {
		if ($program.coverUrl) {
            programImages.set([$program.coverUrl]); 
        }
        if ($program.imageUrls) {
            programImages.set([...$programImages, ...$program.imageUrls]);
        }
        length = $programImages.length;
        console.log(programImages);
	});



	$: if ($program) {
		tabList = [
			{ key: 'description', label: 'Description', show: true },
			{ key: 'testimonials', label: 'Testimonials', show: programTestimonials.length > 0 },
			{ key: 'gallery', label: 'Gallery', show: $programImages.length > 0 }
		];
	}

	function parseMarkdown(content) {
		if (!content) return '';
		return DOMPurify.sanitize(marked(String(content)));
	}

	function prev() {
		currentSlide = (currentSlide - 1 + length) % (length || 1);
	}

	function next() {
		currentSlide = (currentSlide + 1 + length) % (length || 1);
	}

	let activeTab = 'description';

	function toggleTab(tab) {
		activeTab = activeTab === tab ? '' : tab;
	}

	// Lightbox modal state for images
	let showImageModal = false;
	let modalImageUrl = '';

</script>

<svelte:head>
	{#if $program}
		<title>{$program.title} - VietSpark Programs</title>
		<meta name="description" content={$program.title} />
	{:else}
		<title>Program - VietSpark</title>
	{/if}
</svelte:head>

{#if $programLoading}
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-center">
			<div class="border-primary inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2"></div>
			<p class="mt-4 text-gray-600">Loading program...</p>
		</div>
	</div>
{:else if error}
	<div class="flex min-h-screen items-center justify-center">
		<div class="max-w-xl text-center">
			<p class="mb-2 text-lg font-semibold text-red-700">Error</p>
			<p class="text-gray-600">{error}</p>
			<a href="/programs" class="text-primary mt-4 inline-block hover:underline">Back to Programs</a>
		</div>
	</div>
{:else if !$program}
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-center">
			<p class="mb-4 text-xl">Program not found</p>
			<a href="/programs" class="text-primary hover:underline">Back to Programs</a>
		</div>
	</div>
{:else}
	<section class="bg-primary py-16 text-white">
		<div class="container mx-auto px-4">
			<div class="flex items-center justify-between md:flex-row flex-col gap-4">
				<div class="text-center">
					<h1 class="mb-4 text-4xl font-bold">{$program.title}</h1>
					{#if $program.startDate || $program.endDate}
						<div class="flex items-center justify-center space-x-4 text-lg">
							<div class="flex items-center">
								<i class="fas fa-calendar-day mr-2"></i>
								<span>
									{#if $program.startDate}{formatDateFromStr($program.startDate)}{/if}
									{#if $program.startDate && $program.endDate} – {/if}
									{#if $program.endDate}{formatDateFromStr($program.endDate)}{/if}
								</span>
							</div>
						</div>
					{/if}
				</div>

				<a href="/programs" class="btn hover:text-primary border-2 border-white bg-transparent hover:bg-white">
					Back to Programs
				</a>
			</div>
		</div>
	</section>

	<section class="py-16">
		<div class="container mx-auto px-4">
			<div class="grid grid-cols-1 gap-12 lg:grid-cols-3">
				<div class="lg:col-span-2">
					{#if $programImages.length > 0}
						<div class="flex justify-center">
							{#if $programImages.length > 1}
								<div class="relative w-full" style="height: 400px;">
									<button
										type="button"
										class="absolute inset-0 z-0 w-full focus:outline-none"
										aria-label="View image full size"
										on:click={() => {
											modalImageUrl = $programImages[currentSlide];
											showImageModal = true;
										}}
									>
										<img
											src={$programImages[currentSlide]}
											alt={`${$program.title} image ${currentSlide + 1}`}
											class="w-full cursor-pointer rounded-lg object-cover shadow-md"
											style="height: 400px;"
										/>
									</button>
									<button
										type="button"
										on:click={(e) => { e.stopPropagation(); prev(); }}
										aria-label="Previous image"
										class="absolute top-1/2 left-4 z-10 -translate-y-1/2 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-black/30 p-5 text-xl text-white opacity-50 transition-all duration-200 hover:bg-opacity-50"
									>
										‹
									</button>
									<button
										type="button"
										on:click={(e) => { e.stopPropagation(); next(); }}
										aria-label="Next image"
										class="absolute top-1/2 right-4 z-10 -translate-y-1/2 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-black/30 p-5 text-xl text-white opacity-50 transition-all duration-200 hover:bg-opacity-50"
									>
										›
									</button>
								</div>
							{:else}
								<button
									type="button"
									class="focus:outline-none"
									aria-label="View image full size"
									on:click={() => {
										modalImageUrl = $programImages[0];
										showImageModal = true;
									}}
								>
									<img
										src={$programImages[0]}
										alt={$program.title}
										class="mb-8 h-full w-full cursor-pointer rounded-lg object-cover shadow-md"
										style="height: 400px;"
									/>
								</button>
							{/if}
						</div>
					{/if}
				</div>

				<div class="lg:col-span-1">
					<div class="mb-8 rounded-lg bg-gray-50 p-6 shadow-sm">
						<h3 class="mb-4 text-xl font-bold">Program Details</h3>
						<ul class="space-y-4">
							{#if $program.startDate && $program.endDate}
								<li class="flex items-start">
									<div class="text-primary mr-3 mt-1">
										<i class="fas fa-calendar-alt"></i>
									</div>
									<div>
										<strong>Program Timeline</strong>
										<p>{formatDateFromStr($program.startDate)} - {formatDateFromStr($program.endDate)}</p>
									</div>
								</li>
							{/if}
							{#if $program.applicationDeadline}
								<li class="flex items-start">
									<div class="text-primary mr-3 mt-1">
										<i class="fas fa-calendar-check"></i>
									</div>
									<div>
										<strong>Application Deadline</strong>
										<p>{formatDateFromStr($program.applicationDeadline)}</p>
									</div>
								</li>
							{/if}
							{#if $program.presentationDate}
								<li class="flex items-start">
									<div class="text-primary mr-3 mt-1">
										<i class="fas fa-calendar-check"></i>
									</div>
									<div>
										<strong>Presentation Date</strong>
										<p>{formatDateFromStr($program.presentationDate)}</p>
									</div>
								</li>
							{/if}
							{#if $program.applicationFee}
                                <li class="flex items-start">
                                    <div class="text-primary mr-3 mt-1">
                                        <i class="fas fa-ticket-alt"></i>
                                    </div>
                                    <div>
                                        <strong>Application Fee</strong>
                                        <p>{$program.applicationFee}</p>
                                    </div>
                                </li>
                            {/if}
						</ul>
						{#if $program.applicationLink}
                            <div class="mt-6">
                                <a href={$program.applicationLink}
                                    aria-label="Apply for {$program.title}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <button class="btn bg-primary hover:underline hover:bg-primary-dark w-full text-white">
                                        Apply Now
                                    </button>
                                </a>
                            </div>
                        {/if}
					</div>
					{#if $program.socialMediaLinks.facebook || $program.socialMediaLinks.x || $program.socialMediaLinks.linkedIn}
                        <div class="rounded-lg bg-gray-50 p-6 shadow-sm">
                            <h3 class="mb-4 text-xl font-bold">Share This Program</h3>
                            <div class="flex space-x-4">
                                {#if $program.socialMediaLinks.facebook}
                                    <a
                                        href={$program.socialMediaLinks.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-gray-600 hover:text-blue-600"
                                        aria-label="Share on Facebook"
                                    >
                                        <i class="fab fa-facebook-f text-xl"></i>
                                    </a>
                                {/if}
                                {#if $program.socialMediaLinks.x}
                                    <a
                                        href={$program.socialMediaLinks.x}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-gray-600 hover:text-blue-600"
                                        aria-label="Share on X"
                                    >
                                        <i class="fab fa-twitter text-xl"></i>
                                    </a>
                                {/if}
                                {#if $program.socialMediaLinks.linkedIn}
                                    <a
                                        href={$program.socialMediaLinks.linkedIn}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-gray-600 hover:text-blue-600"
                                        aria-label="Share on LinkedIn"
                                    >
                                        <i class="fab fa-linkedin-in text-xl"></i>
                                    </a>
                                {/if}
							</div>
						</div>
					{/if}
				</div>

			</div>

			<!-- Tabs -->
			<div class="lg:mt-12 lg:grid-cols-3 mt-0">
				<div class="mb-6 border-b border-gray-200">
					<nav class="-mb-px flex space-x-8" aria-label="Tabs">
						{#each tabList as tab (tab.key)}
							{#if tab.show}
								<button
									type="button"
									class="whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium {activeTab === tab.key
										? 'border-primary text-primary'
										: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
									on:click={() => toggleTab(tab.key)}
								>
									{tab.label}
								</button>
							{/if}
						{/each}
					</nav>
				</div>

				{#if activeTab === 'description'}
					{#if $program.description}
						<div class="prose prose-lg max-w-none prose-a:text-blue-600 prose-a:hover:text-blue-800">
							{@html parseMarkdown($program.description)}
						</div>
					{:else}
						<p class="text-gray-600">Details coming soon.</p>
					{/if}
				{/if}

				{#if activeTab === 'testimonials'}
					<section>
						<div class="space-y-8">
							{#each programTestimonials as testimonial (testimonial.id)}
								<div class="rounded-lg bg-gray-50 p-6 shadow-sm">
									<div class="mb-2 flex items-center space-x-4">
										<div>
											<h3 class="text-lg font-semibold">{testimonial.name || testimonial.authorTitle || 'VietSpark Member'}</h3>
											{#if testimonial.authorTitle && testimonial.name}
												<span class="font-medium">{testimonial.authorTitle}</span>
											{/if}
											{#if testimonial.authorOrganization}
												<span class="text-gray-600"> · {testimonial.authorOrganization}</span>
											{/if}
										</div>
									</div>
									{#if testimonial.imageUrls && testimonial.imageUrls.length > 0}
										<div class="mb-2 flex space-x-2">
											{#each testimonial.imageUrls as img (img)}
												<button
													type="button"
													class="focus:outline-none"
													on:click={() => { modalImageUrl = img; showImageModal = true; }}
												>
													<img src={img} alt="Testimonial" class="h-16 w-16 rounded object-cover transition-transform hover:scale-105" />
												</button>
											{/each}
										</div>
									{/if}
									{#if testimonial.videoUrl}
										<div class="mb-2">
											<video src={testimonial.videoUrl} controls class="w-full rounded">
												<track kind="captions" />
											</video>
										</div>
									{/if}
									{#if testimonial.highlight}
										<p class="text-primary font-medium">{testimonial.highlight}</p>
									{/if}
									{#if testimonial.quote}
										<div class="prose mt-2 max-w-none">
											{@html parseMarkdown(testimonial.quote)}
										</div>
									{/if}
									{#if testimonial.outcomeSummary}
										<div class="prose mt-2 max-w-none text-gray-700">
											{@html parseMarkdown(testimonial.outcomeSummary)}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</section>
				{/if}

				{#if activeTab === 'gallery'}
					<div class="grid grid-cols-2 gap-4 md:grid-cols-3">
						{#each $programImages as url, i (url)}
							<button
								type="button"
								class="focus:outline-none"
								on:click={() => {
									modalImageUrl = url;
									showImageModal = true;
								}}
							>
								<img
									src={url}
									alt={`${$program.title} image ${i + 1}`}
									class="h-48 w-full rounded-lg object-cover shadow-md transition hover:opacity-90"
								/>
							</button>
						{/each}
					</div>
				{/if}
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