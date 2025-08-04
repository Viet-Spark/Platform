<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authUser } from '$lib/stores/authStore';
	import { userData } from '$lib/stores/userStore';
	import { eventStore, eventHandlers } from '$lib/stores/eventStore2';
	import { blogs, blogHandlers, blogLoading, blogError } from '$lib/stores/blogStore';
	import { partners, partnersLoading, fetchPartners } from '$lib/stores/partnerStore';
	import { subscribers, newsletterLoading, fetchSubscribers } from '$lib/stores/newsletterStore';
	import { faqs, faqsLoading} from '$lib/stores/faqStore';
	import { usersList, userLoading, userError, updateUser } from '$lib/stores/userStore';
	import { teams, teamHandlers } from '$lib/stores/teamStore';
	import { programs, programLoading, programHandlers } from '$lib/stores/programStore';
	import { testimonialLoading, testimonials, testimonialHandlers } from '$lib/stores/testimonialStore';
	import { projectError, projectHandlers } from '$lib/stores/projectStore';
	let isDataReady = false;

	// Debug logs
	$: console.log('Auth User:', $authUser);
	$: console.log('User Data:', $userData);
	$: console.log('Is Admin?', $userData?.isAdmin);
	$: console.log('Data Ready?', isDataReady);

	// Wait for data to be ready before checking admin status
	$: if ($authUser && $userData) {
		console.log('Checking admin status:', {
			hasAuthUser: !!$authUser,
			userDataIsAdmin: $userData?.isAdmin,
			condition: $authUser && !$userData?.isAdmin
		});
		isDataReady = true;
	}

	// Redirect if not admin, but only after data is ready
	$: if (isDataReady && $authUser && !$userData?.isAdmin) {
		console.log('Redirecting because:', {
			hasAuthUser: !!$authUser,
			userDataIsAdmin: $userData?.isAdmin
		});
		goto('/');
	}

	onMount(async () => {
		await Promise.all([
			eventHandlers.getEvents(), 
			blogHandlers.getBlogs(), 
			fetchPartners(), 
			fetchSubscribers(), 
			teamHandlers.getTeams(), 
			programHandlers.getPrograms(), 
			testimonialHandlers.getTestimonials(),
			projectHandlers.getProjects()
		]);
	});
</script>

<div class="container mx-auto px-4 py-8">
	{#if !isDataReady}
		<div class="flex h-screen items-center justify-center">
			<p class="text-xl">Loading...</p>
		</div>
	{:else}
		<h1 class="mb-8 text-3xl font-bold">Admin Dashboard</h1>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			<!-- Events Card -->
			<div class="rounded-lg bg-white p-6 shadow-md">
				<h2 class="mb-4 text-xl font-semibold">Events</h2>
				{#if $eventStore.isLoading}
					<p>Loading...</p>
				{:else}
					<p class="text-3xl font-bold">{$eventStore.events.length}</p>
					<a href="/admin/events" class="text-primary mt-4 inline-block hover:underline"
						>Manage Events →</a
					>
				{/if}
			</div>

			<!-- Blog Posts Card -->
			<div class="rounded-lg bg-white p-6 shadow-md">
				<h2 class="mb-4 text-xl font-semibold">Blog Posts</h2>
				{#if $blogLoading}
					<p>Loading...</p>
				{:else}
					<p class="text-3xl font-bold">{$blogs.length}</p>
					<a href="/admin/blog" class="text-primary mt-4 inline-block hover:underline"
						>Manage Blog →</a
					>
				{/if}
			</div>

			<!-- Partners Card -->
			<div class="rounded-lg bg-white p-6 shadow-md">
				<h2 class="mb-4 text-xl font-semibold">Partners</h2>
				{#if $partnersLoading}
					<p>Loading...</p>
				{:else}
					<p class="text-3xl font-bold">{$partners.length}</p>
					<a href="/admin/partners" class="text-primary mt-4 inline-block hover:underline"
						>Manage Partners →</a
					>
				{/if}
			</div>

			<!-- FAQs Card -->
			<div class="rounded-lg bg-white p-6 shadow-md">
				<h2 class="mb-4 text-xl font-semibold">FAQs</h2>
				{#if $faqsLoading}
					<p>Loading...</p>
				{:else}
					<p class="text-3xl font-bold">{$faqs.length}</p>
					<a href="/admin/faqs" class="text-primary mt-4 inline-block hover:underline"
						>Manage FAQs →</a
					>
				{/if}
			</div>

			<!-- Newsletter Card -->
			<div class="rounded-lg bg-white p-6 shadow-md">
				<h2 class="mb-4 text-xl font-semibold">Newsletter</h2>
				{#if $newsletterLoading}
					<p>Loading...</p>
				{:else}
					<p class="text-3xl font-bold">{$subscribers.length}</p>
					<a href="/admin/newsletter" class="text-primary mt-4 inline-block hover:underline"
						>Manage Subscribers →</a
					>
				{/if}
			</div>

			<!-- Users Card -->
			<div class="rounded-lg bg-white p-6 shadow-md">
				<h2 class="mb-4 text-xl font-semibold">Users</h2>
				{#if $userLoading}
					<p>Loading...</p>
				{:else}
					<p class="text-3xl font-bold">{$usersList.length}</p>
					<a href="/admin/users" class="text-primary mt-4 inline-block hover:underline"
						>Manage Users →</a
					>
				{/if}
			</div>

			<!-- Programs Card -->
			<div class="rounded-lg bg-white p-6 shadow-md">
				<h2 class="mb-4 text-xl font-semibold">Programs</h2>
				{#if $userLoading}
					<p>Loading...</p>
				{:else}
					<p class="text-3xl font-bold">{$programs.length}</p>
					<a href="/admin/programs" class="text-primary mt-4 inline-block hover:underline"
						>Manage Programs →</a
					>
				{/if}
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="mt-8">
			<h2 class="mb-4 text-2xl font-bold">Quick Actions</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				<a
					href="/admin/events/new"
					class="bg-primary hover:bg-primary-dark flex items-center justify-center rounded-lg p-4 text-white"
				>
					Create New Event
				</a>
				<a
					href="/admin/blog/new"
					class="bg-primary hover:bg-primary-dark flex items-center justify-center rounded-lg p-4 text-white"
				>
					Create New Blog Post
				</a>
				<a
					href="/admin/partners/new"
					class="bg-primary hover:bg-primary-dark flex items-center justify-center rounded-lg p-4 text-white"
				>
					Add New Partner
				</a>
				<a
					href="/admin/newsletter"
					class="bg-primary hover:bg-primary-dark flex items-center justify-center rounded-lg p-4 text-white"
				>
					View Subscribers
				</a>
			</div>
		</div>
	{/if}
</div>
