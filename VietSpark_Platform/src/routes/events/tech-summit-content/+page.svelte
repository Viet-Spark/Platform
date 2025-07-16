<script>
	import {eventStore} from '$lib/stores/eventStore2'; 
	import {writable} from 'svelte/store'; 
	import { eventCategories, eventCategoriesLoading, eventCategoriesError } from '$lib/stores/eventCategoryStore';

	let upcomingEvents = writable([]);
	let pastEvents = writable([]);
	let dataIsReady = false; 

	$: if ($eventStore.events && $eventCategories) {
		const techSummitCategory = $eventCategories.filter((c) => c.name === 'Vietnam Tech Summit'); 
		if (techSummitCategory.length > 0) {
			const techSummitId = techSummitCategory[0].id;
			upcomingEvents.set($eventStore.events.filter((event) => {
					const now = new Date();
					const eventDate = new Date(event.eventDate.start.seconds * 1000);

					return eventDate >= now && event.eventCategoryId === techSummitId;
				})
				.sort((a, b) => new Date(b.date) - new Date(a.date)));

			pastEvents.set($eventStore.events.filter((event) => {
					const now = new Date();
					const eventDate = new Date(event.eventDate.start.seconds * 1000);

					return eventDate < now && event.eventCategoryId === techSummitId;
				})
				.sort((a, b) => new Date(b.date) - new Date(a.date)));
			dataIsReady = true;
		}
		
	}

	// For images carousel
	/* 
	Example of data: 
	currentSlide = {
  		0: 0,  // for event 0, current slide is image 0
  		1: 0,  // for event 1, current slide is image 0
	}
	*/

	function formatDate(timestamp) {
        if (!timestamp || !timestamp.seconds) return '';
        return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }

	function formatTime(timestamp) {
		if (!timestamp || !timestamp.seconds) return '';

		const date = new Date(timestamp.seconds * 1000);

		const formatAMPM = date => {
			let hours = date.getHours();
			let minutes = date.getMinutes();
			const ampm = hours >= 12 ? 'PM' : 'AM';
			hours = hours % 12 || 12; // Convert to 12-hour format
			minutes = String(minutes).padStart(2, '0');
			return `${hours}:${minutes} ${ampm}`;
		};

		return formatAMPM(date);
	}

	function getTimezoneAbbreviation(date = new Date()) {
		// Convert date to string and extract abbreviation from parentheses
		const match = date.toString().match(/\(([^)]+)\)/);
		if (match && match[1]) {
			return match[1].split(' ').map(word => word[0]).join('');
		}
		return 'UTC'; // fallback if no match
	}


</script>

<svelte:head>
	<title>VietSpark Tech Summit Events</title>
	<meta name="description" content="Upcoming and past Tech Summit events organized by VietSpark to connect, educate, and empower Vietnamese professionals in tech."/>
</svelte:head>

{#if !dataIsReady }
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-center">
			<div
				class="border-primary inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2"
			></div>
			<p class="mt-4 text-gray-600">Loading Tech Summit Events...</p>
		</div>
	</div>
{:else}
	{#if $upcomingEvents.length} 
		{#each $upcomingEvents as event, i}
			<section class="bg-primary py-16 text-white">
				<div class="container mx-auto px-4">
					<div class="flex items-center justify-between">
						<div>
							<h1 class="mb-4 text-4xl font-bold">{event.title}</h1>
							<div class="flex items-center space-x-4 text-lg">
								<div class="flex items-center">
									<i class="fas fa-calendar-day mr-2"></i>
									<span>{formatDate(event.eventDate?.start)} - {formatDate(event.eventDate?.end)}</span>
								</div>
								<div class="flex items-center">
									<i class="fas fa-clock mr-2"></i>
									<span>{formatTime(event.eventDate?.start)} - {formatTime(event.eventDate?.end)} {getTimezoneAbbreviation()}</span>
								</div>
								{#if event.location?.displayText}
									<div class="flex items-center">
										<i class="fas fa-map-marker-alt mr-2"></i>
										<span>{event.location.displayText}</span>
									</div>
								{/if}
							</div>
						</div>
						<a
							href="/events"
							class="btn hover:text-primary border-2 border-white bg-transparent hover:bg-white"
						>
							Back to Events
						</a>
					</div>
				</div>
			</section>
	
			<!-- Event Content -->
			<section class="py-16">
				<div class="container mx-auto px-4">
					<div class="grid grid-cols-1 gap-12 lg:grid-cols-3">
						<div class="lg:col-span-2">
							{#if event.coverImage}
							<img
								src={event.coverImage}
								alt={event.title}
								class="mb-8 h-full rounded-lg object-cover shadow-md"
								style="height: 400px;"
							/>
							{/if}
							<div class="prose prose-lg max-w-none">
								<a 
									href={`/events/${event.id}`}
									class="btn bg-primary hover:bg-primary-dark text-center text-white">
									Learn more
								</a>
							</div>
						</div>
		
						<div class="lg:col-span-1">
							<div class="mb-8 rounded-lg bg-gray-50 p-6 shadow-sm">
								<h3 class="mb-4 text-xl font-bold">Event Details</h3>
								<ul class="space-y-4">
									<li class="flex items-start">
										<div class="text-primary mr-3 mt-1">
											<i class="fas fa-calendar-alt"></i>
										</div>
										<div>
											<strong>Date</strong>
											<p>{formatDate(event.eventDate?.start)} - {formatDate(event.eventDate?.end)}</p>
										</div>
									</li>
									<li class="flex items-start">
										<div class="text-primary mr-3 mt-1">
											<i class="fas fa-clock"></i>
										</div>
										<div>
											<strong>Time</strong>
											<p>{formatTime(event.eventDate?.start)} - {formatTime(event.eventDate?.end)} {getTimezoneAbbreviation()}</p>
										</div>
									</li>
									{#if event.location?.displayText}
										<li class="flex items-start">
											<div class="text-primary mr-3 mt-1">
												<i class="fas fa-map-marker-alt"></i>
											</div>
											<div>
												<strong>Location</strong>
												<p>{event.location.displayText}</p>
											</div>
										</li>
									{/if}
									{#if event.earlyBirdRegistrationPricing && event.registrationPricing}
										<li class="flex items-start">
											<div class="text-primary mr-3 mt-1">
												<i class="fas fa-ticket-alt"></i>
											</div>
											<div>
												<strong>Registration</strong>
												<p>${event.earlyBirdRegistrationPricing} - ${event.registrationPricing} (Early bird pricing available)</p>
											</div>
										</li>
									{/if}
								</ul>
		
								{#if event.registrationLink}
									<div class="mt-6">
										<a href={event.registrationLink}
											aria-label="Register for {event.title}"
											target="_blank"
											rel="noopener noreferrer"
										>
											<button class="btn bg-primary hover:underline hover:bg-primary-dark w-full text-white">
												Register Now
											</button>
										</a>
									</div>
								{/if}
							</div>
		
							{#if event.socialMediaLinks}
								<div class="rounded-lg bg-gray-50 p-6 shadow-sm">
									<h3 class="mb-4 text-xl font-bold">Share This Event</h3>
									<div class="flex space-x-4">
										{#if event.socialMediaLinks.facebook}
											<a
												href={event.socialMediaLinks.facebook}
												target="_blank"
												rel="noopener noreferrer"
												class="text-gray-600 hover:text-blue-600"
												aria-label="Share on Facebook"
											>
												<i class="fab fa-facebook-f text-xl"></i>
											</a>
										{/if}
										{#if event.socialMediaLinks.x}
											<a
												href={event.socialMediaLinks.x}
												target="_blank"
												rel="noopener noreferrer"
												class="text-gray-600 hover:text-blue-600"
												aria-label="Share on X"
											>
												<i class="fab fa-twitter text-xl"></i>
											</a>
										{/if}
										{#if event.socialMediaLinks.linkedIn}
											<a
												href={event.socialMediaLinks.linkedIn}
												target="_blank"
												rel="noopener noreferrer"
												class="text-gray-600 hover:text-blue-600"
												aria-label="Share on LinkedIn"
											>
												<i class="fab fa-linkedin-in text-xl"></i>
											</a>
										{/if}
										{#if event.socialMediaLinks.email}
											<a
												href={event.socialMediaLinks.email}
												target="_blank"
												rel="noopener noreferrer"
												class="text-gray-600 hover:text-blue-600"
												aria-label="Share via Email"
											>   
												<i class="fas fa-envelope text-xl"></i>
											</a>
										{/if}
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</section>
	
		{/each}
		{:else}
			<!-- Hero Section -->
			<section class="bg-primary py-16 text-white">
				<div class="container mx-auto px-4 text-center">
					<h1 class="mb-4 text-4xl font-bold">VietSpark Tech Summit Events</h1>
					<p class="mx-auto max-w-3xl text-xl">
						Connect, learn, and grow through our educational and networking events.
					</p>
				</div>
			</section>
		{/if}

	<!-- Past Events -->
	<section class="bg-gray-50 py-16">
		<div class="container mx-auto px-4">
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-3xl font-bold">Previous Tech Summit Events</h2>
				<div class="bg-primary mx-auto mb-6 h-1 w-24"></div>
			</div>

			{#if $pastEvents.length > 0}
				<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{#each $pastEvents as event}
						<div class="overflow-hidden rounded-lg bg-white shadow-md">
							<img src={event.coverImage} alt={event.title} class="h-48 w-full object-cover" />
							<div class="p-6">
								<div class="mb-2 flex items-start justify-between">
									<span
										class="text-primary inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold"
									>
										Vietnam Tech Summit
									</span>
									<span class="text-gray-600">{formatDate(event.eventDate.start)} - {formatDate(event.eventDate.end)}</span>
								</div>
								<h3 class="mb-2 text-xl font-bold">{event.title}</h3>
								<p class="mb-4 text-gray-600">{event.shortDescription}</p>
								<div class="mb-4">
									<div class="mb-2 flex items-center text-gray-600">
										<i class="fas fa-map-marker-alt w-5"></i>
										<span>{event.location.displayText}</span>
									</div>
									<!-- <div class="flex items-center text-gray-600">
										<i class="fas fa-clock w-5"></i>
										<span>{event.time}</span>
									</div> -->
								</div>
								<a
									href={`/events/${event.id}`}
									class="btn bg-primary hover:bg-primary-dark w-full text-center text-white"
								>
									View Details
								</a>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="py-12 text-center">
					<p class="text-gray-600">No previous events found.</p>
				</div>
			{/if}
		</div>
	</section>
{/if}


<!-- Related Events -->
<!-- <section class="bg-gray-50 py-16">
	<div class="container mx-auto px-4">
		<h2 class="mb-8 text-2xl font-bold">Other Events You Might Like</h2>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			<div class="overflow-hidden rounded-lg bg-white shadow-sm">
				<img
					src={EventPlaceHolderImage}
					alt="EventPlaceHolderImage"
					class="h-48 w-full object-cover"
				/>
				<div class="p-4">
					<span
						class="text-primary inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold"
					>
						Workshop
					</span>
					<h3 class="hover:text-primary mb-2 mt-2 text-lg font-bold">
						<a href="/events/break-into-tech">Break Into Tech Workshop</a>
					</h3>
					<p class="mb-4 text-sm text-gray-600">November 5, 2023 • Online (Zoom)</p>
				</div>
			</div>

			<div class="overflow-hidden rounded-lg bg-white shadow-sm">
				<img
					src={EventPlaceHolderImage}
					alt="EventPlaceHolderImage"
					class="h-48 w-full object-cover"
				/>
				<div class="p-4">
					<span
						class="text-primary inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold"
					>
						Networking
					</span>
					<h3 class="hover:text-primary mb-2 mt-2 text-lg font-bold">Tech Networking Night</h3>
					<p class="mb-4 text-sm text-gray-600">October 20, 2023 • Seattle, WA</p>
				</div>
			</div>

			<div class="overflow-hidden rounded-lg bg-white shadow-sm">
				<img
					src={EventPlaceHolderImage}
					alt="EventPlaceHolderImage"
					class="h-48 w-full object-cover"
				/>
				<div class="p-4">
					<span
						class="text-primary inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold"
					>
						Mentorship
					</span>
					<h3 class="hover:text-primary mb-2 mt-2 text-lg font-bold">Mentorship Program Kickoff</h3>
					<p class="mb-4 text-sm text-gray-600">January 15, 2024 • Online (Zoom)</p>
				</div>
			</div>
		</div>
	</div>
</section> -->

<!-- CTA -->
<section class="bg-primary py-16 text-white">
	<div class="container mx-auto px-4 text-center">
		<h2 class="mb-4 text-3xl font-bold">Want to speak at our events?</h2>
		<p class="mx-auto mb-8 max-w-2xl text-xl">
			We're always looking for knowledgeable speakers to share their expertise and experiences.
		</p>
		<a href="/contact" class="btn text-primary bg-white hover:bg-gray-100">Contact Us</a>
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
