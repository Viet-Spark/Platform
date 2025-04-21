<script>
	import '../app.css';
	import { user } from '$lib/stores/authStore';
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
	/>
</svelte:head>

<div class="site-container">
	<header class="bg-white shadow-md">
		<nav class="container mx-auto flex items-center justify-between p-4">
			<div class="flex items-center">
				<a href="/" class="text-primary text-2xl font-bold">
					<span class="sr-only">VietSpark</span>
					<!-- Replace placeholder with actual logo -->
					<img
						src="/logos/225357894_335085408311214_4818242809207101955_n.png"
						alt="VietSpark Logo"
						class="h-10"
					/>
				</a>
			</div>

			<div class="hidden space-x-6 md:flex">
				<a href="/" class="nav-link">Home</a>
				<a href="/about" class="nav-link">About Us</a>
				<a href="/events" class="nav-link">Events</a>
				<a href="/blog" class="nav-link">Blog</a>
				<a href="/work-with-us" class="nav-link">Work With Us</a>
				<a href="/contact" class="nav-link">Contact</a>
				<a href="/donate" class="nav-link">Donate</a>
			</div>

			<div class="flex items-center space-x-4">
				{#if $user}
					<a href="/profile" class="text-primary text-sm hover:underline">
						{$user.email}
					</a>
				{:else}
					<a href="/login" class="bg-primary hover:bg-primary-dark rounded-md px-4 py-2 text-white">
						Login
					</a>
				{/if}

				<button class="text-gray-600 focus:outline-none md:hidden" aria-label="Toggle menu">
					<i class="fas fa-bars text-xl"></i>
				</button>
			</div>
		</nav>

		<!-- Mobile menu (hidden by default) -->
		<div class="hidden md:hidden">
			<div class="space-y-1 px-2 pb-3 pt-2">
				<a href="/" class="mobile-nav-link">Home</a>
				<a href="/about" class="mobile-nav-link">About Us</a>
				<a href="/events" class="mobile-nav-link">Events</a>
				<a href="/blog" class="mobile-nav-link">Blog</a>
				<a href="/work-with-us" class="mobile-nav-link">Work With Us</a>
				<a href="/contact" class="mobile-nav-link">Contact</a>
				<a href="/donate" class="mobile-nav-link">Donate</a>
			</div>
		</div>
	</header>

	<main>
		<slot />
	</main>

	<footer class="bg-gray-800 text-white">
		<div class="container mx-auto px-4 py-8">
			<div class="grid grid-cols-1 gap-8 md:grid-cols-4">
				<div>
					<div class="mb-4">
						<img
							src="/logos/225357894_335085408311214_4818242809207101955_n.png"
							alt="VietSpark Logo"
							class="mb-2 h-12"
						/>
						<h3 class="text-lg font-bold">VietSpark</h3>
					</div>
					<p class="mb-4 text-gray-300">Empowering Vietnamese professionals to lead in tech</p>
					<div class="flex space-x-4">
						<a
							href="https://facebook.com"
							class="text-white hover:text-blue-400"
							aria-label="Facebook"
						>
							<i class="fab fa-facebook-f"></i>
						</a>
						<a
							href="https://linkedin.com"
							class="text-white hover:text-blue-400"
							aria-label="LinkedIn"
						>
							<i class="fab fa-linkedin-in"></i>
						</a>
					</div>
				</div>

				<div>
					<h3 class="mb-4 text-lg font-bold">Quick Links</h3>
					<ul class="space-y-2">
						<li><a href="/about" class="text-gray-300 hover:text-white">About Us</a></li>
						<li><a href="/events" class="text-gray-300 hover:text-white">Events</a></li>
						<li><a href="/blog" class="text-gray-300 hover:text-white">Blog</a></li>
					</ul>
				</div>

				<div>
					<h3 class="mb-4 text-lg font-bold">Get Involved</h3>
					<ul class="space-y-2">
						<li><a href="/work-with-us" class="text-gray-300 hover:text-white">Volunteer</a></li>
						<li><a href="/donate" class="text-gray-300 hover:text-white">Donate</a></li>
						<li><a href="/contact" class="text-gray-300 hover:text-white">Contact Us</a></li>
					</ul>
				</div>

				<div>
					<h3 class="mb-4 text-lg font-bold">Newsletter</h3>
					<p class="mb-4 text-gray-300">Subscribe to our newsletter for updates</p>
					<form class="flex">
						<input
							type="email"
							placeholder="Your email"
							class="w-full rounded-l-md px-3 py-2 focus:outline-none"
						/>
						<button
							type="submit"
							class="bg-primary hover:bg-primary-dark rounded-r-md px-4 py-2 focus:outline-none"
						>
							Subscribe
						</button>
					</form>
				</div>
			</div>

			<div class="mt-8 border-t border-gray-700 pt-8 text-center text-gray-300">
				<p>&copy; {new Date().getFullYear()} VietSpark. All rights reserved.</p>
			</div>
		</div>
	</footer>
</div>

<style>
	:global(body) {
		font-family: 'Inter', sans-serif;
		color: #333;
		background-color: #f8f9fa;
	}

	.site-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
	}

	.nav-link {
		font-weight: 500;
		color: #4b5563;
		padding: 0.5rem;
		transition: color 0.2s;
	}

	.nav-link:hover {
		color: #0a57a0;
	}

	.mobile-nav-link {
		display: block;
		padding: 0.75rem 1rem;
		font-weight: 500;
		color: #4b5563;
		border-left: 4px solid transparent;
	}

	.mobile-nav-link:hover {
		color: #0a57a0;
		border-left-color: #0a57a0;
		background-color: #f3f4f6;
	}

	:global(.bg-primary) {
		background-color: #0a57a0;
	}

	:global(.bg-primary-dark) {
		background-color: #084682;
	}

	:global(.text-primary) {
		color: #0a57a0;
	}
</style>
