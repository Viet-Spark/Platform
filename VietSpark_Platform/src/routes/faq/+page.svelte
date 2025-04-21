<script>
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	// FAQ data structure
	const faqCategories = [
		{
			id: 'general',
			name: 'General',
			faqs: [
				{
					question: 'What is VietSpark?',
					answer:
						'VietSpark is a non-profit organization dedicated to empowering Vietnamese professionals in the tech industry through education, mentorship, networking, and community building. We provide resources, events, and support to help Vietnamese individuals excel in their careers and make meaningful connections within the tech community.'
				},
				{
					question: 'Who can join VietSpark?',
					answer:
						'VietSpark welcomes anyone of Vietnamese descent who is working in or interested in the tech industry, regardless of their current role, experience level, or location. We also welcome allies who support our mission of empowering Vietnamese professionals in tech.'
				},
				{
					question: 'How much does it cost to join VietSpark?',
					answer:
						'Basic membership to VietSpark is free. We offer premium membership options with additional benefits for a small annual fee, which helps support our programs and initiatives. Details about membership tiers and benefits can be found on our membership page.'
				},
				{
					question: 'Is VietSpark only for people in the United States?',
					answer:
						'No, VietSpark welcomes members from around the world. While many of our events are based in tech hubs across the United States, we offer virtual events, online resources, and global networking opportunities to ensure that our community is accessible to Vietnamese professionals worldwide.'
				}
			]
		},
		{
			id: 'events',
			name: 'Events & Programs',
			faqs: [
				{
					question: 'What types of events does VietSpark organize?',
					answer:
						'VietSpark organizes a variety of events including tech talks, workshops, career development sessions, networking mixers, hackathons, and cultural celebrations. We also host an annual conference that brings together Vietnamese professionals in tech from around the world.'
				},
				{
					question: 'How can I attend VietSpark events?',
					answer:
						'Most VietSpark events are open to both members and non-members, though members may receive priority registration or discounted pricing. You can view upcoming events on our Events page and register directly there. Many events are also announced through our newsletter and social media channels.'
				},
				{
					question: 'Can I propose or host an event with VietSpark?',
					answer:
						'Absolutely! We welcome event ideas and partnerships from our community members. If you have an event concept or would like to collaborate with VietSpark, please contact our Events team through the Contact page or email events@vietspark.org.'
				},
				{
					question: 'Are there opportunities to volunteer at events?',
					answer:
						'Yes, we rely on volunteers to help make our events successful. Volunteering is a great way to get more involved with the community while developing your skills. You can sign up for volunteer opportunities on our Work With Us page.'
				}
			]
		},
		{
			id: 'mentorship',
			name: 'Mentorship',
			faqs: [
				{
					question: 'How does the mentorship program work?',
					answer:
						'Our mentorship program pairs early and mid-career professionals with experienced mentors in their field of interest. Mentorship relationships typically last for 3-6 months and include regular one-on-one meetings, goal setting, and career guidance. Both mentors and mentees apply through our platform and are matched based on their skills, interests, and career objectives.'
				},
				{
					question: 'How can I become a mentor?',
					answer:
						'If you have at least 3 years of professional experience in your field and are willing to commit to supporting the growth of others, you can apply to become a mentor. Visit the Mentorship page to learn more about mentor requirements and to submit your application.'
				},
				{
					question: 'How can I find a mentor?',
					answer:
						"To be paired with a mentor, you need to create an account, complete your profile, and submit a mentorship application. The application will ask about your background, goals, and what you're looking for in a mentor. Our team will review your application and match you with an appropriate mentor based on your needs."
				},
				{
					question: 'Is there a cost associated with the mentorship program?',
					answer:
						'The mentorship program is free for basic members, though there may be a limited number of spots available. Premium members receive priority matching and additional mentorship resources. Mentors volunteer their time at no cost as a way to give back to the community.'
				}
			]
		},
		{
			id: 'support',
			name: 'Support & Get Involved',
			faqs: [
				{
					question: 'How can I support VietSpark?',
					answer:
						'There are many ways to support VietSpark! You can: donate to our organization, volunteer your time and skills, become a mentor, sponsor our events, share our resources with others, or partner with us on initiatives. Every contribution helps us grow our impact within the Vietnamese tech community.'
				},
				{
					question: 'Does VietSpark accept donations?',
					answer:
						'Yes, VietSpark is a registered 501(c)(3) non-profit organization, and we gratefully accept donations. Your contributions help fund our programs, events, and operational costs. Donations are tax-deductible to the extent allowed by law. You can make a one-time or recurring donation on our Donate page.'
				},
				{
					question: 'How can companies partner with VietSpark?',
					answer:
						"Companies can partner with VietSpark through event sponsorships, program funding, in-kind donations, recruitment partnerships, and employee volunteer programs. We offer various partnership packages that can be customized to align with your company's goals. Contact our partnerships team at partnerships@vietspark.org to discuss collaboration opportunities."
				},
				{
					question: 'Can I join the VietSpark leadership team?',
					answer:
						'VietSpark periodically recruits for leadership and committee positions as we grow. These opportunities are announced to our community and posted on our Work With Us page. We encourage members who are passionate about our mission to start by volunteering for events or programs to get more involved before applying for leadership roles.'
				}
			]
		}
	];

	let activeCategory = faqCategories[0].id;
	let expandedQuestions = new Set();

	function setActiveCategory(categoryId) {
		activeCategory = categoryId;
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

	function getActiveCategoryFaqs() {
		const category = faqCategories.find((cat) => cat.id === activeCategory);
		return category ? category.faqs : [];
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

		faqCategories.forEach((category) => {
			category.faqs.forEach((faq) => {
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
							{#each faqCategories as category}
								<button
									type="button"
									class="mb-2 block w-full cursor-pointer rounded-lg px-6 py-3 text-left text-lg font-medium transition-colors hover:bg-gray-100"
									class:bg-primary={category.id === activeCategory}
									class:text-white={category.id === activeCategory}
									class:bg-gray-50={category.id !== activeCategory}
									class:text-gray-800={category.id !== activeCategory}
									on:click={() => setActiveCategory(category.id)}
									on:keydown={(e) => e.key === 'Enter' && setActiveCategory(category.id)}
								>
									{category.name}
								</button>
							{/each}
						</nav>
					</div>
				</div>

				<!-- FAQ Content -->
				<div class="lg:col-span-3">
					{#each faqCategories as category}
						{#if activeCategory === category.id}
							<div>
								<h2 class="mb-6 text-3xl font-bold">{category.name}</h2>

								<div class="space-y-4">
									{#each category.faqs as faq, i}
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

<style>
	/* Add any specific styles here */
</style>
