<script>
    import { onMount } from 'svelte';
	import { workshops, workshopLoading, workshopError } from '$lib/stores/workshopStore';
	import { marked } from 'marked';
	import { writable } from 'svelte/store';
	import DOMPurify from 'dompurify';
    import { goto } from '$app/navigation';
	import { formatDetailDate } from '$lib/utils/formatDate';

	function parseMarkdown(content) {
		if (!content) return '';
		return DOMPurify.sanitize(marked(String(content)));
	}

</script>

<svelte:head>
	<title>Workshops - VietSpark</title>
	<meta
		name="description"
		content="Learn about VietSpark's workshops associated with Break Into Tech program"
	/>
</svelte:head>

<section class="bg-primary py-16 text-white">
	<div class="container mx-auto px-4 text-center">
		<h1 class="mb-4 text-4xl font-bold">Workshops</h1>
		<p class="mx-auto max-w-3xl text-xl">
			Our Break Into Tech program is an online, three-month long program run between December and March, 
            designed to help Vietnamese professionals transition into the tech industry or advance their early-stage tech careers.
		</p>
	</div>
</section>

<section id="workshop" class="py-8 md:py-16">
	<div class="px-4 md:px-8 mx-auto max-w-7xl">
		<div class="container mx-auto px-4">
			{#if $workshopLoading }
				<div class="flex justify-center py-12">
					<div class="text-center">
						<div
							class="border-primary inline-block h-10 w-10 animate-spin rounded-full border-b-2 border-t-2"
						></div>
						<p class="mt-3 text-gray-600">Loading workshops...</p>
					</div>
				</div>
			{:else if $workshopError}
				<div class="mx-auto max-w-xl rounded-lg bg-red-50 p-6 text-center text-red-700">
					<p class="font-semibold">Unable to load workshops.</p>
					<p class="mt-1 text-sm">{$workshopError}</p>
				</div>
			{:else if $workshops && $workshops.length === 0}
				<div class="mx-auto max-w-xl text-center text-gray-600">
					<p>Workshops will be published here soon. Check back later.</p>
				</div>
			{:else}
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 h-full">
                    {#each $workshops as workshop (workshop.id)}
                        <div class="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                            {#if workshop.coverUrl}
                                <button
                                    type="button"
                                    class="focus:outline-none"
                                    aria-label={`View cover image for ${workshop.title}`}
                                    on:click={() => {
                                        modalImageUrl = workshop.coverUrl;
                                        showImageModal = true;
                                    }}
                                >
                                    <img
                                        src={workshop.coverUrl}
                                        alt={workshop.title}
                                        class="h-48 w-full object-cover"
                                        loading="lazy"
                                    />
                                </button>
                            {/if}
                            <div class="flex flex-1 flex-col gap-3 p-4">
                                <h3 class="text-lg font-semibold text-gray-900">
                                    {workshop.title}
                                </h3>
                                {#if workshop.startTime}
                                    <p class="flex items-center text-sm text-gray-600">
                                        <i class="fas fa-calendar-alt mr-2 text-primary"></i>
                                        {formatDetailDate(workshop.startTime)}
                                    </p>
                                {/if}
                                {#if workshop.location}
                                    <p class="flex items-center text-sm text-gray-600">
                                        <i class="fas fa-map-marker-alt mr-2 text-primary"></i>
                                        {workshop.location}
                                    </p>
                                {/if}
                                <div class="text-lg flex gap-2 mt-auto text-center">
                                    <button
                                        type="button"
                                        class="flex-1 border p-2 border-primary text-primary hover:bg-primary/5 rounded-lg"
                                        on:click={() => goto(`/workshops/${workshop.id}`)}
                                    >
                                        View details
                                    </button>
                                    {#if workshop.registrationLink && workshop.registrationDeadline && new Date(workshop.registrationDeadline.seconds * 1000) > new Date()}
                                        <a
                                            href={workshop.registrationLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Register for ${workshop.title}`}
                                            class="flex-1 p-2 bg-primary text-white hover:bg-primary-dark rounded-lg"
                                        >
                                        Register
                                        </a>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
			{/if}
		</div>
	</div>
</section>
