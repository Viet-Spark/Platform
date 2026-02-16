<script>
	import '../app.css';
	import { authUser } from '$lib/stores/authStore';
	import { userData, getUserData } from '$lib/stores/userStore';
	import {profileData} from '$lib/stores/profileStore';
	import { subscriberHandlers, subscriberError, subscriberLoading, subscribers } from '$lib/stores/subscriberStore';
	import { aboutHandlers } from '$lib/stores/aboutStore';
	import { onMount } from 'svelte';
	import { homeHandlers } from '$lib/stores/homeStore';
	import { partnerHandlers } from '$lib/stores/partnerStore';
	import { faqHandlers } from '$lib/stores/faqStore';
	import { getUsers } from '$lib/stores/userStore';
	import { faqCategories, faqCategoryHandlers } from '$lib/stores/faqCategoryStore';
	import { eventHandlers } from '$lib/stores/eventStore2';
	import { eventCategories, eventCategoryHandlers } from '$lib/stores/eventCategoryStore';
	import { blogs, blogHandlers } from '$lib/stores/blogStore';
	import { programs, programHandlers} from '$lib/stores/programStore';
	import { projects, projectHandlers} from '$lib/stores/projectStore';
	import { applications, applicationHandlers } from '$lib/stores/applicationStore';
	import { testimonialHandlers } from '$lib/stores/testimonialStore';
	let isMobileMenuOpen = false;
	let newsletterEmail = '';
	let newsletterMessage = '';

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	// async function sendEmail( name, email, templateId) {
	// 	let status = 'Sending...';

	// 	const res = await fetch('/api/sendEmail', {
	// 		method: 'POST',
	// 		headers: { 'Content-Type': 'application/json' },
	// 		body: JSON.stringify({ to: email, name, templateId, subject: 'Welcome!' })
	// 	});

	// 	const data = await res.json();
	// 	status = data.success ? '✅ Email sent!' : `❌ Error: ${data.error}`;
	// 	console.log(status); 
	// }

	async function handleNewsletterSubmit() {
		newsletterMessage = '';
		try { 
			if (!$subscribers.find((subscriber) => subscriber.email === newsletterEmail)) {
				await subscriberHandlers.addSubscriber(newsletterEmail);
				// await sendEmail('VietSpark Member', newsletterEmail, '3vz9dle7ej14kj50'); 
			}
			newsletterMessage = 'Thank you for subscribing!';
			newsletterEmail = '';
		} catch (error) {
			newsletterMessage = error.message;
		}
	}
	onMount(async () => {
		await aboutHandlers.getAboutUs();
		await homeHandlers.getHome();
		await partnerHandlers.fetchPartners();
		await faqHandlers.fetchFAQs();
		await getUsers();
		await testimonialHandlers.getTestimonials();
		await faqCategoryHandlers.fetchFaqCategories();
		await eventHandlers.getEvents();
		await eventCategoryHandlers.fetchEventCategories();
		await blogHandlers.getBlogs();
		await programHandlers.getPrograms(); 
		await projectHandlers.getProjects(); 
		await applicationHandlers.getApplications(); 
		await subscriberHandlers.fetchSubscribers(); 
	});

	$: console.log('user', $userData);
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
	/>
</svelte:head>

<div class="site-container">
	<header class="bg-white shadow-md">
		<nav class="container mx-auto flex items-center justify-between p-1">
			<div class="flex items-center">
				<a href="/" class="text-primary text-2xl font-bold">
					<span class="sr-only">VietSpark</span>
					<!-- Replace placeholder with actual logo -->
					<img
						src="/logos/225357894_335085408311214_4818242809207101955_n.png"
						alt="VietSpark Logo"
						class="h-20"
					/>
				</a>
			</div>

			<div class="hidden space-x-3 lg:flex">
				<a href="/" class="nav-link">Home</a>
				<a href="/about" class="nav-link">About Us</a>
				<a href="/events" class="nav-link">Events</a>
				<!-- <a href="/blog" class="nav-link">Blog</a> -->
				<a href="/programs" class="nav-link">Programs</a>
				<a href="/testimonials" class="nav-link">Testimonials</a>
				<a href="/work-with-us" class="nav-link">Work With Us</a>
				<a href="/contact" class="nav-link">Contact</a>
				<a href="/donate" class="nav-link">Donate</a>
			</div>

			<div class="flex items-center space-x-4">
				{#if $authUser}
					{#if $userData?.isAdmin}
						<a href="/admin" class="text-primary text-sm hover:underline"> Admin Dashboard </a>
					{/if}
					<a href="/profile" class="text-primary text-sm hover:underline">
						<div class="text-primary relative flex flex-col cursor-pointer items-center justify-center h-8 w-8 rounded-full bg-blue-200 text-lg font-bold">
							{#if $userData?.profileImage}
								<img
									src={$userData?.profileImage}
									alt="Profile"
									class="inset-0 h-8 w-8 rounded-full"
								/>
							{:else}
								{($authUser.name ||  $userData?.name || 'V').charAt(0).toUpperCase()}
							{/if}
						</div>
					</a>
				{:else}
					<a href="/login" class="bg-primary hover:bg-primary-dark rounded-md px-4 py-2 text-white">
						Login
					</a>
				{/if}

				<button
					class="text-gray-600 focus:outline-none lg:hidden"
					aria-label="Toggle menu"
					on:click={toggleMobileMenu}
				>
					<i class="fas fa-bars text-xl"></i>
				</button>
			</div>
		</nav>

		<!-- Mobile menu (hidden by default) -->
		<div class="lg:hidden" class:hidden={!isMobileMenuOpen}>
			<div class="space-y-1 px-2 pb-3 pt-2">
				<a href="/" class="mobile-nav-link">Home</a>
				<a href="/about" class="mobile-nav-link">About Us</a>
				<a href="/events" class="mobile-nav-link">Events</a>
				<!-- <a href="/blog" class="mobile-nav-link">Blog</a> -->
				<a href="/programs" class="mobile-nav-link">Programs</a>
				<a href="/testimonials" class="mobile-nav-link">Testimonials</a>
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
							href="https://www.facebook.com/VietSpark.org"
							class="text-white transition-colors duration-300 hover:text-blue-400"
							aria-label="Facebook"
							target="_blank"
						>
							<i class="fab fa-facebook-f text-xl"></i>
						</a>
						<a
							href="https://www.linkedin.com/company/vietnam-business-professional-in-tech/"
							class="text-white transition-colors duration-300 hover:text-blue-400"
							aria-label="LinkedIn"
							target="_blank"
						>
							<i class="fab fa-linkedin-in text-xl"></i>
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
					<form on:submit|preventDefault={handleNewsletterSubmit} class="flex flex-col space-y-2">
						<input
							type="email"
							bind:value={newsletterEmail}
							placeholder="Your email"
							required
							class="w-full rounded-md px-3 py-2 text-primary-700 focus:outline-none"
						/>
						<button
							type="submit"
							disabled={$subscriberLoading}
							class="bg-primary hover:bg-primary-dark rounded-md px-4 py-2 focus:outline-none disabled:opacity-50"
						>
							{$subscriberLoading ? 'Subscribing...' : 'Subscribe'}
						</button>
						{#if newsletterMessage}
							<p
								class="text-sm"
								class:text-red-500={$subscriberError}
								class:text-green-500={!$subscriberError}
							>
								{newsletterMessage}
							</p>
						{/if}
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

</style>
