<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authUser } from '$lib/stores/authStore';
	import { userData } from '$lib/stores/userStore';
	import { slide } from 'svelte/transition';
	import { faqs, faqsLoading, fetchFAQs, deleteFAQ, renameCategory, deleteCategory, faqsError } from '$lib/stores/faqStore';
	import { writable } from 'svelte/store';

	let isDataReady = false;
    let categories = writable([]);
	let activeCategory = null;
	let expandedQuestions = new Set();

	$: if ($authUser && $userData) {
		isDataReady = true;
	}

	$: if (isDataReady && $authUser && !$userData?.isAdmin) {
		goto('/');
	}

	onMount(async () => {
		await fetchFAQs();
        categories.set(new Set($faqs.map(faq => faq.category)));
        categories.set(Array.from($categories).sort());
        activeCategory = $categories[0];
	});

	async function handleDelete(id) {
		if (confirm('Are you sure you want to delete this FAQ?')) {
			await deleteFAQ(id);
		}
	}

	function toggleQuestion(questionIndex) {
		if (expandedQuestions.has(questionIndex)) {
			expandedQuestions.delete(questionIndex);
		} else {
			expandedQuestions.add(questionIndex);
		}
		console.log(expandedQuestions);
		expandedQuestions = expandedQuestions;
	}

	function setActiveCategory(categoryName) {
		activeCategory = categoryName;
		expandedQuestions.clear();
		expandedQuestions = expandedQuestions;
	}

	function getActiveCategoryFaqs() {
		const activeFAQs = $faqs.filter((faq) => faq.category === activeCategory);
		return activeFAQs;
	}

	async function handleRenameCategory(oldCategory, newCategory) {
		try {
			await renameCategory(oldCategory, newCategory);
			categories.set(new Set($faqs.map(faq => faq.category)));
			categories.set(Array.from($categories).sort());
        	activeCategory = newCategory;
		} catch (error) {
			console.error('Error renaming category:', error);
		}
	}
	
	async function handleDeleteCategory(category) {
		try {	
			await deleteCategory(category);
			categories.set(new Set($faqs.map(faq => faq.category)));
			categories.set(Array.from($categories).sort());
        	activeCategory = $categories[0];
		} catch (error) {
			console.error('Error deleting category:', error);
		}
	}

</script>

<div class="container mx-auto">
	{#if !isDataReady}
		<div class="flex h-screen items-center justify-center">
			<p class="text-xl">Loading...</p>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center bg-primary text-white p-4 mb-8">
			<h1 class="text-2xl font-bold">FAQs</h1>
			<p>Manage VietSpark's FAQs</p>
		</div>
		<div class="mb-8 flex items-center justify-end gap-4">
			<a
				href="/admin/faqs/new"
				class="bg-primary hover:bg-primary-dark rounded-md px-4 py-2 text-white"
			>
				Add New FAQ
			</a>
		</div>
		{#if $faqsLoading}
			<div class="flex h-32 items-center justify-center">
				<p>Loading FAQs...</p>
			</div>
		{:else if $faqs.length === 0}
			<div class="rounded-lg bg-gray-100 p-8 text-center">
				<p class="text-gray-600">No FAQ found. Add your first FAQ!</p>
			</div>
		{:else}
			<!-- Regular FAQ Display -->
			<div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
				<!-- Category Navigation -->
				<div class="lg:col-span-1">
					<div class="sticky top-24 rounded-lg border border-gray-200 bg-white p-4">
						<h2 class="mb-4 text-xl font-bold">Categories</h2>
						<nav class="space-y-2">
							{#each $categories as category}
								<button
									type="button"
									class="mb-2 block w-full cursor-pointer rounded-lg px-6 py-3 text-left text-lg font-medium transition-colors hover:bg-gray-100"
									class:bg-primary={category === activeCategory}
									class:text-white={category === activeCategory}
									class:bg-gray-50={category !== activeCategory}
									class:text-gray-800={category !== activeCategory}
									on:click={() => setActiveCategory(category)}
									on:keydown={(e) => e.key === 'Enter' && setActiveCategory(category)}
								>
									{category}
								</button>
							{/each}
						</nav>
					</div>
				</div>
			
				<div class="lg:col-span-3">
					{#each $categories as category}
						{#if activeCategory === category}
							<div>
								<div class="flex space-x-2 mx-4 mb-4 items-center justify-between">
									<h2 class=" flex text-3xl font-bold ">{category}</h2>
									<div class="flex gap-4">
										<button
											class="text-blue-600 hover:text-blue-800"
											on:click={() => {
												const newCategory = prompt('Enter new category name:');
												if (newCategory && newCategory !== category) {
													handleRenameCategory(category, newCategory);
												}
											}}
										>
											Rename Category
										</button>
										<button
											class="text-red-600 hover:text-red-800"
											on:click={() => {
												if (confirm('Are you sure you want to delete this category?')) {
													handleDeleteCategory(category);
												}
											}}
										>
											Delete Category
										</button>
									</div>
								</div>
								
								<div class="space-y-4">
									{#each getActiveCategoryFaqs(category) as faq, i}
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
											<div class="flex space-x-2 mx-4 mb-4">
												<a
													href="/admin/faqs/{faq.id}/edit"
													class="text-blue-600 hover:text-blue-800 mr-10"
												>
													Edit
												</a>
												<button
													on:click={() => handleDelete(faq.id)}
													class="text-red-600 hover:text-red-800"
												>
													Delete
												</button>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</div>
