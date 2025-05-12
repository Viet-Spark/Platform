<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authUser } from '$lib/stores/authStore';
	import { userData } from '$lib/stores/userStore';
	import { blogPosts, blogLoading, fetchBlogPosts, deleteBlogPost } from '$lib/stores/blogStore';

	let isDataReady = false;

	$: if ($authUser && $userData) {
		isDataReady = true;
	}

	$: if (isDataReady && $authUser && !$userData?.isAdmin) {
		goto('/');
	}

	onMount(async () => {
		await fetchBlogPosts();
	});

	async function handleDelete(id) {
		if (confirm('Are you sure you want to delete this blog post?')) {
			await deleteBlogPost(id);
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	{#if !isDataReady}
		<div class="flex h-screen items-center justify-center">
			<p class="text-xl">Loading...</p>
		</div>
	{:else}
		<div class="mb-8 flex items-center justify-between">
			<h1 class="text-3xl font-bold">Manage Blog Posts</h1>
			<a
				href="/admin/blog/new"
				class="bg-primary hover:bg-primary-dark rounded-md px-4 py-2 text-white"
			>
				Create New Post
			</a>
		</div>

		{#if $blogLoading}
			<div class="flex h-32 items-center justify-center">
				<p>Loading blog posts...</p>
			</div>
		{:else if $blogPosts.length === 0}
			<div class="rounded-lg bg-gray-100 p-8 text-center">
				<p class="text-gray-600">No blog posts found. Create your first post!</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b bg-gray-50">
							<th class="px-4 py-3 text-left">Title</th>
							<th class="px-4 py-3 text-left">Author</th>
							<th class="px-4 py-3 text-left">Date</th>
							<th class="px-4 py-3 text-left">Status</th>
							<th class="px-4 py-3 text-left">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each $blogPosts as post}
							<tr class="border-b hover:bg-gray-50">
								<td class="px-4 py-3">
									<a href="/blog/{post.slug}" class="text-primary hover:underline" target="_blank">
										{post.title}
									</a>
								</td>
								<td class="px-4 py-3">{post.author}</td>
								<td class="px-4 py-3">{new Date(post.date).toLocaleDateString()}</td>
								<td class="px-4 py-3">
									<span
										class="rounded-full px-2 py-1 text-sm"
										class:bg-green-100={post.published}
										class:text-green-800={post.published}
										class:bg-yellow-100={!post.published}
										class:text-yellow-800={!post.published}
									>
										{post.published ? 'Published' : 'Draft'}
									</span>
								</td>
								<td class="px-4 py-3">
									<div class="flex space-x-2">
										<a href="/admin/blog/{post.id}/edit" class="text-blue-600 hover:text-blue-800">
											Edit
										</a>
										<button
											on:click={() => handleDelete(post.id)}
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
</div>
