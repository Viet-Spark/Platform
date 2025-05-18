<script>
	import TechSummitImage from '$lib/images/Events/TechSummitImage.JPG';
	import EventPlaceHolderImage from '$lib/images/Events/EventPlaceHolderImage.jpg';
	// Sample events data (to be replaced with actual data from a database/API)
	const upcomingEvents = [
		{
			id: 'tech-summit-2023',
			title: 'Annual Tech Summit 2023',
			date: 'December 15, 2023',
			time: '9:00 AM - 5:00 PM PST',
			location: 'San Francisco, CA',
			description:
				'Join us for a day of inspiring talks, networking, and workshops from industry leaders.',
			image: TechSummitImage,
			category: 'Vietnam Tech Summit'
		},
		{
			id: 'break-into-tech',
			title: 'Break Into Tech Workshop',
			date: 'November 5, 2023',
			time: '10:00 AM - 2:00 PM PST',
			location: 'Online (Zoom)',
			description:
				'A workshop designed to help newcomers navigate their way into the tech industry.',
			image: EventPlaceHolderImage,
			category: 'Break Into Tech'
		},
		{
			id: 'networking-night',
			title: 'Tech Networking Night',
			date: 'October 20, 2023',
			time: '6:00 PM - 9:00 PM PST',
			location: 'Seattle, WA',
			description: 'An evening of networking with professionals from leading tech companies.',
			image: EventPlaceHolderImage,
			category: 'Networking'
		}
	];

	const pastEvents = [
		{
			id: 'tech-summit-2022',
			title: 'Annual Tech Summit 2022',
			date: 'December 10, 2022',
			location: 'San Francisco, CA',
			description:
				'Our signature event featuring keynotes from tech leaders and innovative workshops.',
			image: EventPlaceHolderImage,
			category: 'Tech Summit'
		},
		{
			id: 'mentorship-kickoff',
			title: 'Mentorship Program Kickoff',
			date: 'September 15, 2022',
			location: 'Online (Zoom)',
			description:
				'The launch of our annual mentorship program pairing mentees with experienced tech professionals.',
			image: EventPlaceHolderImage,
			category: 'Mentorship'
		}
	];

	// Filter events by category
	let selectedCategory = 'All';
	// const categories = ['All', 'Vietnam Tech Summit', 'Break Into Tech', 'Networking', 'Vietnam – US Fall Forum'];
	const categories = ['All', 'Vietnam Tech Summit', 'Break Into Tech', 'Vietnam – US Fall Forum'];

	$: filteredUpcomingEvents =
		selectedCategory === 'All'
			? upcomingEvents
			: upcomingEvents.filter((event) => event.category === selectedCategory);

	$: filteredPastEvents =
		selectedCategory === 'All'
			? pastEvents
			: pastEvents.filter((event) => event.category === selectedCategory);

	function setCategory(category) {
		selectedCategory = category;
	}
</script>

<svelte:head>
	<title>Events - VietSpark</title>
	<meta
		name="description"
		content="Upcoming and past events organized by VietSpark to connect, educate, and empower Vietnamese professionals in tech."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="bg-primary py-16 text-white">
	<div class="container mx-auto px-4 text-center">
		<h1 class="mb-4 text-4xl font-bold">VietSpark Events</h1>
		<p class="mx-auto max-w-3xl text-xl">
			Connect, learn, and grow through our educational and networking events.
		</p>
	</div>
</section>

<!-- Event Filters -->
<section class="border-b bg-white py-8">
	<div class="container mx-auto px-4">
		<div class="flex flex-wrap items-center justify-between">
			<h2 class="mb-4 text-2xl font-bold md:mb-0">Browse Events</h2>
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
	</div>
</section>

<!-- Upcoming Events -->
<section class="bg-gray-50 py-16">
	<div class="container mx-auto px-4">
		<div class="mb-12 text-center">
			<h2 class="mb-4 text-3xl font-bold">Upcoming Events</h2>
			<div class="bg-primary mx-auto mb-6 h-1 w-24"></div>
		</div>

		{#if filteredUpcomingEvents.length > 0}
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{#each filteredUpcomingEvents as event}
					<div class="overflow-hidden rounded-lg bg-white shadow-md">
						<img src={event.image} alt={event.title} class="h-48 w-full object-cover" />
						<div class="p-6">
							<div class="mb-2 flex items-start justify-between">
								<span
									class="text-primary inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold"
								>
									{event.category}
								</span>
								<span class="text-gray-600">{event.date}</span>
							</div>
							<h3 class="mb-2 text-xl font-bold">{event.title}</h3>
							<p class="mb-4 text-gray-600">{event.description}</p>
							<div class="mb-4">
								<div class="mb-2 flex items-center text-gray-600">
									<i class="fas fa-map-marker-alt w-5"></i>
									<span>{event.location}</span>
								</div>
								<div class="flex items-center text-gray-600">
									<i class="fas fa-clock w-5"></i>
									<span>{event.time}</span>
								</div>
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
				<p class="text-gray-600">No upcoming {selectedCategory.toLowerCase()} events found.</p>
				<button class="text-primary mt-4 hover:underline" on:click={() => setCategory('All')}>
					View all events
				</button>
			</div>
		{/if}
	</div>
</section>

<!-- Tech Summit Feature -->
<section class="bg-white py-16">
	<div class="container mx-auto px-4">
		<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
			<div class="order-2 lg:order-1">
				<h2 class="mb-6 text-3xl font-bold">Annual Tech Summit</h2>
				<div class="bg-primary mb-6 h-1 w-24"></div>
				<p class="mb-4 text-gray-700">
					Our signature event brings together Vietnamese professionals from across the tech industry
					for a day of learning, networking, and inspiration. The Tech Summit features keynote
					speeches from industry leaders, panel discussions on emerging trends, and workshops to
					develop practical skills.
				</p>
				<p class="mb-6 text-gray-700">
					Whether you're a seasoned professional or just starting your tech journey, the Tech Summit
					offers valuable insights and connections to help advance your career.
				</p>
				<a href="/events/tech-summit-2023" class="btn bg-primary hover:bg-primary-dark text-white">
					Learn More About Tech Summit
				</a>
			</div>
			<div class="order-1 flex h-96 items-center justify-center rounded-lg bg-gray-100 lg:order-2">
				<!-- Placeholder for Tech Summit image -->
				<span class="font-bold text-gray-500">Tech Summit Image</span>
			</div>
		</div>
	</div>
</section>

<!-- Break Into Tech Feature -->
<section class="bg-gray-50 py-16">
	<div class="container mx-auto px-4">
		<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
			<div class="flex h-96 items-center justify-center rounded-lg bg-gray-100">
				<!-- Placeholder for Break Into Tech image -->
				<span class="font-bold text-gray-500">Break Into Tech Image</span>
			</div>
			<div>
				<h2 class="mb-6 text-3xl font-bold">Break Into Tech Program</h2>
				<div class="bg-primary mb-6 h-1 w-24"></div>
				<p class="mb-4 text-gray-700">
					Our Break Into Tech program is designed to help Vietnamese professionals transition into
					the tech industry or advance their early-stage tech careers. Through workshops,
					mentorship, and networking opportunities, participants gain the knowledge and connections
					needed to thrive.
				</p>
				<p class="mb-6 text-gray-700">
					The program includes resume workshops, mock interviews, technical skill development
					sessions, and insights from professionals who have successfully navigated the tech
					landscape.
				</p>
				<div class="flex flex-wrap gap-4">
					<a href="/events/break-into-tech" class="btn bg-primary hover:bg-primary-dark text-white">
						Upcoming Workshops
					</a>
					<a
						href="/testimonials"
						class="btn border-primary text-primary border-2 bg-transparent hover:bg-gray-100"
					>
						Success Stories
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Past Events -->
<section class="bg-white py-16">
	<div class="container mx-auto px-4">
		<div class="mb-12 text-center">
			<h2 class="mb-4 text-3xl font-bold">Past Events</h2>
			<div class="bg-primary mx-auto mb-6 h-1 w-24"></div>
		</div>

		{#if filteredPastEvents.length > 0}
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{#each filteredPastEvents as event}
					<div class="overflow-hidden rounded-lg bg-gray-50 shadow-sm">
						<img src={event.image} alt={event.title} class="h-48 w-full object-cover" />
						<div class="p-6">
							<div class="mb-2 flex items-start justify-between">
								<span
									class="text-primary inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold"
								>
									{event.category}
								</span>
								<span class="text-gray-600">{event.date}</span>
							</div>
							<h3 class="mb-2 text-xl font-bold">{event.title}</h3>
							<p class="mb-4 text-gray-600">{event.description}</p>
							<div class="mb-4 flex items-center text-gray-600">
								<i class="fas fa-map-marker-alt w-5"></i>
								<span>{event.location}</span>
							</div>
							<a href={`/events/${event.id}`} class="text-primary hover:underline"
								>View Event Recap →</a
							>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="py-12 text-center">
				<p class="text-gray-600">No past {selectedCategory.toLowerCase()} events found.</p>
				<button class="text-primary mt-4 hover:underline" on:click={() => setCategory('All')}>
					View all events
				</button>
			</div>
		{/if}

		{#if filteredPastEvents.length > 2}
			<div class="mt-12 text-center">
				<a href="/events/archive" class="btn bg-gray-200 text-gray-800 hover:bg-gray-300">
					View All Past Events
				</a>
			</div>
		{/if}
	</div>
</section>

<!-- Host an Event CTA -->
<section class="bg-primary py-16 text-white">
	<div class="container mx-auto px-4 text-center">
		<h2 class="mb-4 text-3xl font-bold">Want to Host an Event?</h2>
		<p class="mx-auto mb-8 max-w-2xl text-xl">
			If you're interested in hosting an event with VietSpark or have an idea for a collaboration,
			we'd love to hear from you.
		</p>
		<a href="/contact" class="btn text-primary bg-white hover:bg-gray-100">Get in Touch</a>
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
