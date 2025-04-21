<script>
	// Sample blog posts data
	const blogPosts = [
		{
			id: 'industry-explained-cloud',
			title: 'Industry Xplained: Cloud Computing',
			date: 'October 15, 2023',
			author: 'Jane Doe',
			authorTitle: 'Cloud Solutions Architect',
			excerpt:
				'A comprehensive introduction to cloud computing, its benefits, and how it is transforming the tech industry.',
			category: 'Industry Xplained',
			image: 'https://via.placeholder.com/800x450',
			readTime: '8 min read'
		},
		{
			id: 'tech-summit-recap-2023',
			title: 'Tech Summit 2023: Key Takeaways',
			date: 'September 22, 2023',
			author: 'John Smith',
			authorTitle: 'Program Manager',
			excerpt:
				'Highlights and insights from our annual Tech Summit, featuring the latest trends and innovations in technology.',
			category: 'Tech Summit',
			image: 'https://via.placeholder.com/800x450',
			readTime: '6 min read'
		},
		{
			id: 'break-into-tech-success',
			title: 'From Finance to Tech: A Success Story',
			date: 'August 30, 2023',
			author: 'Alice Johnson',
			authorTitle: 'Software Engineer',
			excerpt:
				'How one of our members successfully transitioned from a career in finance to becoming a software engineer.',
			category: 'Break Into Tech',
			image: 'https://via.placeholder.com/800x450',
			readTime: '10 min read'
		},
		{
			id: 'mentorship-impact',
			title: 'The Transformative Power of Mentorship',
			date: 'August 15, 2023',
			author: 'Robert Williams',
			authorTitle: 'VP of Engineering',
			excerpt:
				'Exploring how mentorship can accelerate career growth and create lasting professional relationships.',
			category: 'Mentorship',
			image: 'https://via.placeholder.com/800x450',
			readTime: '7 min read'
		},
		{
			id: 'women-in-tech',
			title: 'Women in Tech: Challenges and Triumphs',
			date: 'July 28, 2023',
			author: 'Emily Chen',
			authorTitle: 'Tech Lead',
			excerpt:
				'A discussion on the experiences of Vietnamese women in the tech industry and strategies for fostering inclusivity.',
			category: 'Diversity',
			image: 'https://via.placeholder.com/800x450',
			readTime: '9 min read'
		},
		{
			id: 'industry-explained-ai',
			title: 'Industry Xplained: Artificial Intelligence',
			date: 'July 10, 2023',
			author: 'David Lee',
			authorTitle: 'AI Researcher',
			excerpt:
				'Demystifying artificial intelligence and exploring its current applications and future potential.',
			category: 'Industry Xplained',
			image: 'https://via.placeholder.com/800x450',
			readTime: '12 min read'
		}
	];

	// Filter blog posts by category
	let selectedCategory = 'All';
	const categories = [
		'All',
		'Industry Xplained',
		'Tech Summit',
		'Break Into Tech',
		'Mentorship',
		'Diversity'
	];

	$: filteredPosts =
		selectedCategory === 'All'
			? blogPosts
			: blogPosts.filter((post) => post.category === selectedCategory);

	function setCategory(category) {
		selectedCategory = category;
	}

	// Search functionality
	let searchQuery = '';

	$: searchResults = searchQuery
		? filteredPosts.filter(
				(post) =>
					post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
					post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
					post.category.toLowerCase().includes(searchQuery.toLowerCase())
			)
		: filteredPosts;
</script>

<svelte:head>
	<title>Blog - VietSpark</title>
	<meta
		name="description"
		content="Articles, insights, and stories from the VietSpark community focused on technology, careers, and professional development."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="bg-primary py-16 text-white">
	<div class="container mx-auto px-4 text-center">
		<h1 class="mb-4 text-4xl font-bold">VietSpark Blog</h1>
		<p class="mx-auto mb-8 max-w-3xl text-xl">
			Insights, stories, and knowledge from our community of tech professionals.
		</p>

		<div class="mx-auto max-w-2xl">
			<div class="flex overflow-hidden rounded-full bg-white">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search articles..."
					class="w-full px-6 py-3 text-gray-700 outline-none"
				/>
				<button class="flex items-center bg-blue-800 px-6 text-white">
					<i class="fas fa-search"></i>
				</button>
			</div>
		</div>
	</div>
</section>

<!-- Category Filters -->
<section class="border-b bg-white py-8">
	<div class="container mx-auto px-4">
		<div class="flex flex-wrap gap-2">
			{#each categories as category}
				<button
					class="rounded-full px-4 py-2 text-sm font-medium transition-colors {selectedCategory ===
					category
						? 'bg-primary text-white'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
					on:click={() => setCategory(category)}
				>
					{category}
				</button>
			{/each}
		</div>
	</div>
</section>

<!-- Featured Post -->
{#if searchQuery === '' && selectedCategory === 'All' && blogPosts.length > 0}
	<section class="bg-gray-50 py-16">
		<div class="container mx-auto px-4">
			<div class="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
				<div>
					<img
						src={blogPosts[0].image}
						alt={blogPosts[0].title}
						class="h-96 w-full rounded-lg object-cover shadow-md"
					/>
				</div>
				<div>
					<div class="space-y-4">
						<div class="flex flex-wrap items-center gap-2">
							<span class="text-primary rounded-full bg-blue-100 px-3 py-1 text-sm font-medium">
								{blogPosts[0].category}
							</span>
							<span class="text-sm text-gray-600">{blogPosts[0].date}</span>
							<span class="text-sm text-gray-600">• {blogPosts[0].readTime}</span>
						</div>
						<h2 class="text-3xl font-bold">{blogPosts[0].title}</h2>
						<p class="text-gray-600">{blogPosts[0].excerpt}</p>
						<div class="flex items-center">
							<div class="mr-3 h-10 w-10 rounded-full bg-gray-300"></div>
							<div>
								<h3 class="font-medium">{blogPosts[0].author}</h3>
								<p class="text-sm text-gray-600">{blogPosts[0].authorTitle}</p>
							</div>
						</div>
						<div>
							<a
								href={`/blog/${blogPosts[0].id}`}
								class="btn bg-primary hover:bg-primary-dark text-white"
							>
								Read Article
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
{/if}

<!-- Blog Posts Grid -->
<section class="bg-white py-16">
	<div class="container mx-auto px-4">
		{#if searchQuery && searchResults.length === 0}
			<div class="py-12 text-center">
				<div class="mb-4 text-5xl text-gray-400">
					<i class="fas fa-search"></i>
				</div>
				<h2 class="mb-2 text-2xl font-bold">No Results Found</h2>
				<p class="mb-6 text-gray-600">
					We couldn't find any articles matching "{searchQuery}".
				</p>
				<button
					class="btn bg-primary hover:bg-primary-dark text-white"
					on:click={() => (searchQuery = '')}
				>
					Clear Search
				</button>
			</div>
		{:else if filteredPosts.length === 0}
			<div class="py-12 text-center">
				<p class="text-gray-600">
					No articles found in the {selectedCategory.toLowerCase()} category.
				</p>
				<button class="text-primary mt-4 hover:underline" on:click={() => setCategory('All')}>
					View all articles
				</button>
			</div>
		{:else}
			<!-- Start with the remaining posts (skip the featured one if displaying all) -->
			{#if searchQuery === '' && selectedCategory === 'All'}
				<h2 class="mb-8 text-2xl font-bold">Latest Articles</h2>
				<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{#each blogPosts.slice(1) as post}
						<div
							class="overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-md"
						>
							<a href={`/blog/${post.id}`} class="block">
								<img src={post.image} alt={post.title} class="h-48 w-full object-cover" />
							</a>
							<div class="p-6">
								<div class="mb-3 flex flex-wrap items-center gap-2">
									<span class="text-primary rounded-full bg-blue-100 px-3 py-1 text-xs font-medium">
										{post.category}
									</span>
									<span class="text-xs text-gray-600">{post.readTime}</span>
								</div>
								<a href={`/blog/${post.id}`} class="block">
									<h3 class="hover:text-primary mb-2 text-xl font-bold">{post.title}</h3>
								</a>
								<p class="mb-4 text-gray-600">{post.excerpt}</p>
								<div class="flex items-center justify-between">
									<div class="flex items-center">
										<div class="mr-2 h-8 w-8 rounded-full bg-gray-300"></div>
										<span class="text-sm font-medium">{post.author}</span>
									</div>
									<span class="text-sm text-gray-600">{post.date}</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{#each searchResults as post}
						<div
							class="overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-md"
						>
							<a href={`/blog/${post.id}`} class="block">
								<img src={post.image} alt={post.title} class="h-48 w-full object-cover" />
							</a>
							<div class="p-6">
								<div class="mb-3 flex flex-wrap items-center gap-2">
									<span class="text-primary rounded-full bg-blue-100 px-3 py-1 text-xs font-medium">
										{post.category}
									</span>
									<span class="text-xs text-gray-600">{post.readTime}</span>
								</div>
								<a href={`/blog/${post.id}`} class="block">
									<h3 class="hover:text-primary mb-2 text-xl font-bold">{post.title}</h3>
								</a>
								<p class="mb-4 text-gray-600">{post.excerpt}</p>
								<div class="flex items-center justify-between">
									<div class="flex items-center">
										<div class="mr-2 h-8 w-8 rounded-full bg-gray-300"></div>
										<span class="text-sm font-medium">{post.author}</span>
									</div>
									<span class="text-sm text-gray-600">{post.date}</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</section>

<!-- Newsletter Section -->
<section class="bg-gray-50 py-16">
	<div class="container mx-auto px-4 text-center">
		<h2 class="mb-4 text-3xl font-bold">Stay Updated</h2>
		<p class="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
			Subscribe to our newsletter to receive the latest articles, stories, and updates from
			VietSpark.
		</p>

		<div class="mx-auto max-w-md">
			<form class="flex flex-col sm:flex-row">
				<input
					type="email"
					placeholder="Your email address"
					class="focus:ring-primary mb-2 flex-1 border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 sm:mb-0 sm:rounded-l-md sm:rounded-r-none"
				/>
				<button
					type="submit"
					class="btn bg-primary hover:bg-primary-dark px-6 text-white sm:rounded-l-none"
				>
					Subscribe
				</button>
			</form>
			<p class="mt-3 text-sm text-gray-600">We respect your privacy. Unsubscribe at any time.</p>
		</div>
	</div>
</section>

<!-- Submit Article CTA -->
<section class="bg-primary py-16 text-white">
	<div class="container mx-auto px-4 text-center">
		<h2 class="mb-4 text-3xl font-bold">Share Your Knowledge</h2>
		<p class="mx-auto mb-8 max-w-2xl text-xl">
			Have insights or experiences to share with the VietSpark community? We welcome guest articles
			from our members.
		</p>
		<a
			href="/contact?subject=Article Submission"
			class="btn text-primary bg-white hover:bg-gray-100"
		>
			Submit an Article
		</a>
	</div>
</section>

<style>
	.btn {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		font-weight: 500;
		border-radius: 0.375rem;
		transition: all 0.2s;
	}
</style>
