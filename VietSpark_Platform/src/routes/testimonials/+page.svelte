<script>
    import { onMount } from 'svelte';
	import { testimonials, testimonialHandlers, testimonialLoading, testimonialError} from '$lib/stores/testimonialStore';
	import defaultProfile from '$lib/images/About/placeHolderAvatar.jpg';
	import { marked } from 'marked';
	import { writable } from 'svelte/store';
	import DOMPurify from 'dompurify';

	let approvedTestimonial = writable([]); 

	$: if ($testimonials) {
		let filteredTestimonials = $testimonials.filter(t => t.moderationStatus === 'Approved' && t.visibility === "Public");
		filteredTestimonials.sort((a, b) => b.year - a.year);
		approvedTestimonial.set(filteredTestimonials); 
	}

	function parseMarkdown(content) {
		if (!content) return '';
		return DOMPurify.sanitize(marked(String(content)));
	}


</script>

<svelte:head>
	<title>Testimonials - VietSpark</title>
	<meta
		name="description"
		content="Learn about VietSpark's mission, vision, and the team behind our community."
	/>
</svelte:head>

<section class="bg-primary py-16 text-white">
	<div class="container mx-auto px-4 text-center">
		<h1 class="mb-4 text-4xl font-bold">Testimonials</h1>
		<p class="mx-auto max-w-3xl text-xl">
			Our Break Into Tech program is an online, three-month long program run between December and March, 
            designed to help Vietnamese professionals transition into the tech industry or advance their early-stage tech careers.
		</p>
	</div>
</section>

<section id="testimonial" class="py-8 md:py-16">
	<div class="px-4 md:px-8 mx-auto max-w-7xl">
		<div class="container mx-auto px-4">
			<div class="mb-12 text-center">
				<div class="mb-4 text-2xl font-bold">Success Stories from Break Into Tech</div>
				<div class="bg-primary mx-auto mb-6 h-1 w-24"></div>
			</div>

			{#if $testimonialLoading}
				<div class="flex justify-center py-12">
					<div class="text-center">
						<div
							class="border-primary inline-block h-10 w-10 animate-spin rounded-full border-b-2 border-t-2"
						></div>
						<p class="mt-3 text-gray-600">Loading testimonials...</p>
					</div>
				</div>
			{:else if $testimonialError}
				<div class="mx-auto max-w-xl rounded-lg bg-red-50 p-6 text-center text-red-700">
					<p class="font-semibold">Unable to load testimonials.</p>
					<p class="mt-1 text-sm">{$testimonialError}</p>
				</div>
			{:else if !$testimonials || $testimonials.length === 0}
				<div class="mx-auto max-w-xl text-center text-gray-600">
					<p>Testimonials will be published here soon. Check back later.</p>
				</div>
			{:else}
				<div class="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
					{#each $approvedTestimonial as testimonial (testimonial.id)}
						<a
							href={`/testimonials/${testimonial.id}`}
							class="group flex h-full flex-col rounded-xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							<div class="flex flex-col flex-1 text-center">
                                <div class="text-lg mb-2 font-bold italic text-gray-700 line-clamp-3">
									{testimonial.highlight}
								</div>

                                <div class="flex items-center gap-2 justify-center mt-auto ">
                                    <img
                                        src={testimonial.authorCoverImage || defaultProfile}
                                        alt={testimonial.authorName || 'VietSpark member'}
                                        loading="lazy"
                                        class="h-24 w-24 md:h-30 md:w-30 rounded-full object-cover"
                                        />
                                    <div>
                                        <div>
                                            <div class="text-lg font-bold">
                                                {testimonial.authorName || 'VietSpark Member'}
											</div>
                                            {#if testimonial.authorTitle || testimonial.authorOrganization}
                                                <p class="mt-1 text-base text-gray-600">
                                                    {testimonial.authorTitle}
                                                    <br/>
                                                    {testimonial.authorOrganization}
                                                </p>
                                            {/if}
                                        </div>
                                    </div>
                                </div>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</section>
