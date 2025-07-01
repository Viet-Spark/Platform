<script>
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { faqs, faqsLoading} from '$lib/stores/faqStore';
	import { faqCategories } from '$lib/stores/faqCategoryStore';

	// FAQ data structure
	let isDataReady = false;
	let activeCategoryId = null;
	let expandedQuestions = new Set();

	$: if ($faqCategories.length > 0) {
		activeCategoryId = $faqCategories[0].id;
		isDataReady = true;
	}

	function setActiveCategoryId(id) {
		activeCategoryId = id;
		expandedQuestions.clear();
		expandedQuestions = expandedQuestions;
	}

	function toggleQuestion(questionIndex) {
		if (expandedQuestions.has(questionIndex)) {
			expandedQuestions.delete(questionIndex);
		} else {
			expandedQuestions.add(questionIndex);
		}
		expandedQuestions = expandedQuestions;
	}

	function getFAQsFromCategory(categoryId) {
		const FAQs = $faqs.filter((faq) => faq.categoryId === categoryId);
		return FAQs;
	}

	// Search functionality
	let searchQuery = '';
	let searchResults = [];
	let isSearching = false;

	function performSearch() {
		isSearching = searchQuery.trim() !== '';

		if (!isSearching) {
			searchResults = [];
			return;
		}

		const query = searchQuery.toLowerCase();
		searchResults = [];

		$faqCategories.forEach((category) => {
			getFAQsFromCategory(category.id).forEach((faq) => {
				if (
					faq.question.toLowerCase().includes(query) ||
					faq.answer.toLowerCase().includes(query)
				) {
					searchResults.push({
						...faq,
						category: category.name
					});
				}
			});
		});
	}

	$: if (searchQuery !== undefined) {
		performSearch();
	}
</script>

<svelte:head>
	<title>FAQ - VietSpark</title>
	<meta
		name="description"
		content="Find answers to frequently asked questions about VietSpark, our programs, events, and how to get involved."
	/>
</svelte:head>

{#if !isDataReady || $faqsLoading}
	<div class="flex h-screen items-center justify-center">
		<p class="text-xl">Loading...</p>
	</div>
{:else}
	<!-- Hero Section -->
	<section class="bg-primary py-16 text-white">
		<div class="container mx-auto px-4 text-center">
			<h1 class="mb-4 text-4xl font-bold">Frequently Asked Questions</h1>
			<p class="mx-auto max-w-3xl text-xl">
				Find answers to common questions about VietSpark, our programs, and how to get involved.
			</p>

			<!-- Search Bar -->
			<div class="mx-auto mt-8 max-w-2xl">
				<div class="relative">
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search for questions..."
						class="w-full rounded-lg px-4 py-3 pl-12 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
					/>
					<div class="absolute left-3 top-3 text-gray-500">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- FAQ Content -->
	<section class="py-16">
		<div class="container mx-auto px-4">
			{#if isSearching}
				<!-- Search Results -->
				<div class="mx-auto max-w-3xl">
					<h2 class="mb-6 text-2xl font-bold">Search Results for "{searchQuery}"</h2>

					{#if searchResults.length === 0}
						<div class="rounded-lg bg-gray-50 p-8 text-center">
							<p class="text-xl text-gray-600">
								No results found. Please try a different search term.
							</p>
							<button
								on:click={() => (searchQuery = '')}
								on:keydown={(e) => e.key === 'Enter' && (searchQuery = '')}
								class="bg-primary hover:bg-primary-dark mt-4 rounded-md px-6 py-2 text-white transition"
							>
								Clear Search
							</button>
						</div>
					{:else}
						<p class="mb-6 text-gray-600">
							Found {searchResults.length}
							{searchResults.length === 1 ? 'result' : 'results'}
						</p>

						<div class="space-y-4">
							{#each searchResults as result, i}
								<div class="overflow-hidden rounded-lg border border-gray-200 bg-white">
									<button
										type="button"
										class="flex w-full cursor-pointer items-center justify-between bg-gray-50 p-4 text-left hover:bg-gray-100"
										on:click={() => toggleQuestion(`search-${i}`)}
										on:keydown={(e) => e.key === 'Enter' && toggleQuestion(`search-${i}`)}
									>
										<h3 class="pr-8 text-lg font-semibold">{result.question}</h3>
										<div class="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700">
											{result.category}
										</div>
									</button>

									{#if expandedQuestions.has(`search-${i}`)}
										<div class="bg-white p-4" transition:slide>
											<p class="text-gray-600">{result.answer}</p>
										</div>
									{/if}
								</div>
							{/each}
						</div>

						<div class="mt-8 text-center">
							<button
								on:click={() => (searchQuery = '')}
								on:keydown={(e) => e.key === 'Enter' && (searchQuery = '')}
								class="rounded-md bg-gray-200 px-6 py-2 text-gray-800 transition hover:bg-gray-300"
							>
								Clear Search Results
							</button>
						</div>
					{/if}
				</div>
			{:else}
				<!-- Regular FAQ Display -->
				<div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
					<!-- Category Navigation -->
					<div class="lg:col-span-1">
						<div class="sticky top-24 rounded-lg border border-gray-200 bg-white p-4">
							<h2 class="mb-4 text-xl font-bold">Categories</h2>
							<nav class="space-y-2">
								{#each $faqCategories as category}
									<button
										type="button"
										class="mb-2 block w-full cursor-pointer rounded-lg px-6 py-3 text-left text-lg font-medium transition-colors hover:bg-gray-100"
										class:bg-primary={category.id === activeCategoryId}
										class:text-white={category.id=== activeCategoryId}
										class:bg-gray-50={category.id !== activeCategoryId}
										class:text-gray-800={category.id !== activeCategoryId}
										on:click={() => setActiveCategoryId(category.id)}
										on:keydown={(e) => e.key === 'Enter' && setActiveCategoryId(category.id)}
									>
										{category.name}
									</button>
								{/each}
							</nav>
						</div>
					</div>

					<!-- FAQ Content -->
					<div class="lg:col-span-3">
						{#each $faqCategories as category}
							{#if activeCategoryId === category.id}
								<div>
									<h2 class="mb-6 text-3xl font-bold">{category.name}</h2>

									<div class="space-y-4">
										{#each getFAQsFromCategory(category.id) as faq, i}
											<div
												class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
											>
												<button
													type="button"
													class="flex w-full cursor-pointer items-center justify-between p-4 text-left hover:bg-gray-50"
													on:click={() => toggleQuestion(i)}
													on:keydown={(e) => e.key === 'Enter' && toggleQuestion(i)}
												>
													<span class="text-lg font-medium">{faq.question}</span>
													<span class="ml-2 flex h-6 w-6 items-center justify-center">
														{#if expandedQuestions.has(i)}
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-5 w-5"
																viewBox="0 0 20 20"
																fill="currentColor"
															>
																<path
																	fill-rule="evenodd"
																	d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
																	clip-rule="evenodd"
																/>
															</svg>
														{:else}
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-5 w-5"
																viewBox="0 0 20 20"
																fill="currentColor"
															>
																<path
																	fill-rule="evenodd"
																	d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
																	clip-rule="evenodd"
																/>
															</svg>
														{/if}
													</span>
												</button>

												{#if expandedQuestions.has(i)}
													<div class="border-t border-gray-200 bg-gray-50 p-4" transition:slide>
														<p class="text-gray-600">{faq.answer}</p>
													</div>
												{/if}
											</div>
										{/each}
									</div>
								</div>
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</section>

	<!-- Additional Resources -->
	<section class="bg-gray-50 py-16">
		<div class="container mx-auto px-4">
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-3xl font-bold">Still Have Questions?</h2>
				<p class="mx-auto max-w-3xl text-xl text-gray-600">
					If you couldn't find the answer you were looking for, we're here to help.
				</p>
			</div>

			<div class="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
				<div class="rounded-lg bg-white p-6 text-center shadow-sm">
					<div
						class="text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<h3 class="mb-3 text-xl font-bold">Contact Us</h3>
					<p class="mb-4 text-gray-600">
						Reach out to our team directly with your specific questions or concerns.
					</p>
					<a href="/contact" class="text-primary hover:underline"> Send a Message → </a>
				</div>

				<div class="rounded-lg bg-white p-6 text-center shadow-sm">
					<div
						class="text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
							/>
						</svg>
					</div>
					<h3 class="mb-3 text-xl font-bold">Community Forum</h3>
					<p class="mb-4 text-gray-600">
						Join our community forum to discuss topics and get answers from fellow members.
					</p>
					<a href="/community" class="text-primary hover:underline"> Visit Forum → </a>
				</div>

				<div class="rounded-lg bg-white p-6 text-center shadow-sm">
					<div
						class="text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
							/>
						</svg>
					</div>
					<h3 class="mb-3 text-xl font-bold">Knowledge Base</h3>
					<p class="mb-4 text-gray-600">
						Browse our detailed resources and guides on various tech topics and career development.
					</p>
					<a href="/resources" class="text-primary hover:underline"> Explore Resources → </a>
				</div>
			</div>
		</div>
	</section>
{/if}
<style>
	/* Add any specific styles here */
</style>
