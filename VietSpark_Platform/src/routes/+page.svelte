<script>
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcomeFallback from '$lib/images/svelte-welcome.png';
	import Login from '$lib/components/Login.svelte';
	import UserProfile from '$lib/components/UserProfile.svelte';
	import { authUser } from '$lib/stores/authStore';

	import TechSummitImage from '$lib/images/Events/TechSummitImage.JPG';
	import TechSummit2025Image from '$lib/images/Events/2025/TechSummit2025Image.jpg';
	import VietBayLogo from '$lib/images/Partners/VietBayLogo.jpg';
	import AIforVietNamFoundationLogo from '$lib/images/Partners/AIforVietNamFoundationLogo.jpg';
	import VISEMIFoundationLogo from '$lib/images/Partners/VISEMIFoundationLogo.jpg';

	import { aboutStore, aboutLoading } from '$lib/stores/aboutStore';
	import { homeStore, homeLoading } from '$lib/stores/homeStore';
	import { partners, partnersLoading } from '$lib/stores/partnerStore';
	import { eventStore, eventHandlers } from '$lib/stores/eventStore2';
	import { eventCategories } from '$lib/stores/eventCategoryStore';
	import { writable } from 'svelte/store';

	let upcomingEvents = writable([]);

	$: if ($eventStore.events) {
		upcomingEvents.set($eventStore.events
		.filter((event) => {
			const now = new Date();
			const eventDate = new Date(event.eventDate.start.seconds * 1000);

			return eventDate >= now;
		})
		.sort((a, b) => new Date(b.date) - new Date(a.date)));
	}

	function formatDate(timestamp) {
        if (!timestamp || !timestamp.seconds) return '';
        return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }

</script>

<svelte:head>
	<title>VietSpark - Empowering Vietnamese Professionals in Tech</title>
	<meta
		name="description"
		content="VietSpark is a community that bridges the gap between Vietnamese professionals and the tech industry through knowledge-sharing, mentorship, and collaboration."
	/>
</svelte:head>

{#if $homeLoading || $aboutLoading || $partnersLoading || eventStore.isLoading}
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-center">
			<div class="border-primary inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2"></div>
			<p class="mt-4 text-gray-600">Loading Home Page...</p>
		</div>
	</div>
{:else}
	<!-- Hero Section -->
	<section class="bg-primary py-16 text-white">
		<div class="container mx-auto px-4">
			<div class="flex flex-col items-center">
				<h1 class="mb-4 text-4xl font-bold md:text-5xl">
					Empowering Vietnamese Professionals to Lead in Tech
				</h1>
				<p class="mb-8 text-xl">
					Connect, learn, and grow with a community of like-minded professionals.
				</p>
				<div class="flex flex-wrap gap-4">
					<a href="/events/tech-summit-2025" class="btn text-primary bg-white hover:bg-gray-100"
						>Tech Summit 2025</a
					>
					{#if !$authUser}
						<a
							href="/work-with-us"
							class="btn hover:text-primary border-2 border-white bg-transparent hover:bg-white"
						>
							Join Us
						</a>
					{:else}
						<a
							href="/events"
							class="btn hover:text-primary border-2 border-white bg-transparent text-white transition-all hover:bg-white"
						>
							Explore Events
						</a>
					{/if}
				</div>
			</div>
		</div>
	</section>
	<!-- About Section -->
	<section id="about" class="bg-white py-16">
		<div class="container mx-auto px-4">
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-3xl font-bold">Who We Are</h2>
				<div class="bg-primary mx-auto mb-6 h-1 w-24"></div>
				<p class="mx-auto max-w-3xl text-lg text-gray-600">
					{$homeStore.whoWeAre}
				</p>
			</div>

			<div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
				<div class="rounded-lg bg-gray-50 p-6 text-center transition-shadow hover:shadow-lg">
					<div
						class="text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
					>
						<i class="fas fa-lightbulb text-2xl"></i>
					</div>
					<h3 class="mb-2 text-xl font-bold">Our Mission</h3>
					<p class="text-gray-600">
						{$homeStore.missionSummary}
					</p>
				</div>

				<div class="rounded-lg bg-gray-50 p-6 text-center transition-shadow hover:shadow-lg">
					<div
						class="text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
					>
						<i class="fas fa-eye text-2xl"></i>
					</div>
					<h3 class="mb-2 text-xl font-bold">Our Vision</h3>
					<p class="text-gray-600">{$homeStore.visionSummary}</p>
				</div>

				<div class="rounded-lg bg-gray-50 p-6 text-center transition-shadow hover:shadow-lg">
					<div
						class="text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
					>
						<i class="fas fa-heart text-2xl"></i>
					</div>
					<h3 class="mb-2 text-xl font-bold">Core Values</h3>
					<p class="text-gray-600">{$homeStore.coreValuesSummary}</p>
				</div>
			</div>
		</div>
	</section>

	<!-- What We Do Section -->
	<section id="what-we-do" class="bg-gray-50 py-16">
		<div class="container mx-auto px-4">
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-3xl font-bold">What We Do</h2>
				<div class="bg-primary mx-auto mb-6 h-1 w-24"></div>
				<p class="mx-auto max-w-3xl text-lg text-gray-600">
					{$aboutStore.whatWeDo.summary}
				</p>
			</div>

			<div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
				{#each $aboutStore.whatWeDo.pillars as pillar}
					<div class="rounded-lg bg-white p-6 shadow-md">
						<div
							class="text-primary mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
						>
							<i class="fas {pillar.iconName} text-2xl"></i>
						</div>
						<h3 class="mb-2 text-xl font-bold">{pillar.title}</h3>
						<p class="text-gray-600">
							{pillar.description}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Events Highlight Section -->
	<section id="events-highlight" class="bg-white py-16">
		<div class="container mx-auto px-4">
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-3xl font-bold">Upcoming Events</h2>
				<div class="bg-primary mx-auto mb-6 h-1 w-24"></div>
			</div>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
					{#each $upcomingEvents as event}
						<div class="overflow-hidden rounded-lg bg-gray-50 shadow-md">
							<div class="flex h-48 items-center justify-center bg-blue-200">
								<img src={event.coverImage} alt={event.title} class="h-48 w-full object-cover" />
							</div>
							<div class="p-6">
								<div class="text-primary mb-2 text-sm font-semibold">{formatDate(event.eventDate.start)} - {formatDate(event.eventDate.end)}</div>
								<h3 class="mb-2 text-xl font-bold">{event.title}</h3>
								<p class="mb-4 text-gray-600">
									{event.shortDescription}
								</p>
								<a href="/events/{event.id}" class="text-primary font-medium hover:underline"
									>Learn more →</a
								>
							</div>
						</div>
					{/each}
				

				<!-- <div class="overflow-hidden rounded-lg bg-gray-50 shadow-md">
					<div class="flex h-48 items-center justify-center bg-blue-200">
						<span class="text-primary font-bold">Break Into Tech Image</span>
					</div>
					<div class="p-6">
						<div class="text-primary mb-2 text-sm font-semibold">Nov 5, 2023</div>
						<h3 class="mb-2 text-xl font-bold">Break Into Tech Workshop</h3>
						<p class="mb-4 text-gray-600">
							A workshop designed to help newcomers navigate their way into the tech industry.
						</p>
						<a href="/events/break-into-tech" class="text-primary font-medium hover:underline"
							>Learn more →</a
						>
					</div>
				</div> -->
			</div>

			<div class="mt-8 text-center">
				<a href="/events" class="btn bg-primary hover:bg-primary-dark text-white">View All Events</a>
			</div>
		</div>
	</section>

	<!-- Partners Section -->
	<section id="partners" class="bg-gray-50 py-16">
		<div class="container mx-auto px-4">
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-3xl font-bold">Our Partners</h2>
				<div class="bg-primary mx-auto mb-6 h-1 w-24"></div>
			</div>

			<div class="grid grid-cols-2 gap-8 md:grid-cols-3">
				<!-- Partner logos placeholders -->
				{#each $partners as partner}
					<a
						href={partner.website}
						target="_blank"
						class="flex h-24 items-center justify-center rounded-lg bg-white p-6 shadow-sm"
					>
						<img
							src={partner.image}
							alt={partner.name}
							class="mx-auto max-h-full max-w-full object-contain"
						/>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="bg-primary py-16 text-white">
		<div class="container mx-auto px-4 text-center">
			<h2 class="mb-4 text-3xl font-bold">Ready to Join Our Community?</h2>
			<p class="mx-auto mb-8 max-w-2xl text-xl">
				Connect with like-minded professionals, access mentorship opportunities, and grow your career
				in tech.
			</p>
			{#if !$authUser}
				<a href="/login" class="btn text-primary bg-white hover:bg-gray-100">Join VietSpark</a>
			{:else}
				<a href="/profile" class="btn text-primary bg-white hover:bg-gray-100">View Your Profile</a>
			{/if}
		</div>
	</section>
{/if}



<style>
	.hero-section {
		position: relative;
		overflow: hidden;
	}

	.btn {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		font-weight: 500;
		border-radius: 0.375rem;
		transition: all 0.2s;
	}

	:global(a.btn:hover) {
		text-decoration: none !important;
		color: #0a57a0 !important; /* This is primary from your config */
	}
</style>
