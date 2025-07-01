<script>
	import { onMount } from 'svelte';
	import { authUser } from '$lib/stores/authStore';
	import { userData } from '$lib/stores/userStore';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	// Redirect if not admin
	$: if ($authUser && !$userData?.isAdmin) {
		goto('/');
	}

	const navItems = [
		{ href: '/admin', label: 'Dashboard' },
		{ href: '/admin/home', label: 'Home' },
		{ href: '/admin/aboutUs', label: 'About Us' },
		{ href: '/admin/events', label: 'Events' },
		{ href: '/admin/blog', label: 'Blog' },
		{ href: '/admin/partners', label: 'Partners' },
		{ href: '/admin/newsletter', label: 'Newsletter' },
		{ href: '/admin/faqs', label: 'FAQs' },
		{ href: '/admin/users', label: 'Users' }
	];
</script>

<div class="min-h-screen bg-gray-100">
	<!-- Admin Navigation -->
	<nav class="bg-white shadow-md">
		<div class="container mx-auto px-4">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center">
					<a href="/admin" class="text-primary text-xl font-bold">Admin Panel</a>
				</div>
				<div class="flex items-center space-x-4">
					{#each navItems as item}
						<a
							href={item.href}
							class="hover:text-primary text-gray-600"
							class:text-primary={$page.url.pathname === item.href}
						>
							{item.label}
						</a>
					{/each}
					<a href="/" class="hover:text-primary text-gray-600">← Back to Site</a>
				</div>
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<main class="container mx-auto px-4 py-8">
		<slot />
	</main>
</div>
