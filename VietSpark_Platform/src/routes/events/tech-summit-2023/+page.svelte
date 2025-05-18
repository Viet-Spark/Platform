<script>
	import TechSummitImage from '$lib/images/Events/TechSummitImage.jpg'
	// Event data (to be replaced with API/database data later)
	const event = {
		title: 'Annual Tech Summit 2023',
		date: 'December 15, 2023',
		time: '9:00 AM - 5:00 PM PST',
		location: 'San Francisco, CA',
		description:
			'Join us for a day of inspiring talks, networking, and workshops from industry leaders.',
		image: TechSummitImage,
		category: 'Tech Summit'
	};
</script>

<svelte:head>
	<title>{event.title} - VietSpark Events</title>
	<meta name="description" content={event.description} />
</svelte:head>

<!-- Event Hero Section -->
<section class="bg-primary py-16 text-white">
	<div class="container mx-auto px-4">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="mb-4 text-4xl font-bold">{event.title}</h1>
				<div class="flex items-center space-x-4 text-lg">
					<div class="flex items-center">
						<i class="fas fa-calendar-day mr-2"></i>
						<span>{event.date}</span>
					</div>
					<div class="flex items-center">
						<i class="fas fa-clock mr-2"></i>
						<span>{event.time}</span>
					</div>
					<div class="flex items-center">
						<i class="fas fa-map-marker-alt mr-2"></i>
						<span>{event.location}</span>
					</div>
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
				<img
					src={event.image}
					alt={event.title}
					class="mb-8 w-full rounded-lg object-cover shadow-md"
					style="height: 400px;"
				/>

				<div class="prose prose-lg max-w-none">
					<h2>About This Event</h2>
					<p>
						Our signature event, usually held in August, brings together Vietnamese professionals 
						from across the tech industry onsite for 2-3 days of learning, networking, and inspiration. 
						The Tech Summit features keynote speeches from industry leaders, panel discussions on emerging trends, 
						and workshops to develop practical skills
					</p>
					<p>
						Whether you're a seasoned professional or just starting your tech journey, the Tech
						Summit offers valuable insights and connections to help advance your career.
					</p>

					<h2>What to Expect</h2>
					<ul>
						<li>Keynote presentations from industry leaders</li>
						<li>Panel discussions on emerging tech trends</li>
						<li>Hands-on workshops and skill-building sessions</li>
						<li>Networking opportunities with professionals in the field</li>
						<li>Career development resources and mentorship connections</li>
					</ul>

					<h2>Featured Speakers</h2>
					<p>
						Speaker announcements coming soon! Check back for updates or subscribe to our newsletter
						to be the first to know.
					</p>
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
								<p>{event.date}</p>
							</div>
						</li>
						<li class="flex items-start">
							<div class="text-primary mr-3 mt-1">
								<i class="fas fa-clock"></i>
							</div>
							<div>
								<strong>Time</strong>
								<p>{event.time}</p>
							</div>
						</li>
						<li class="flex items-start">
							<div class="text-primary mr-3 mt-1">
								<i class="fas fa-map-marker-alt"></i>
							</div>
							<div>
								<strong>Location</strong>
								<p>{event.location}</p>
								<p class="text-sm">123 Main Street, San Francisco, CA 94105</p>
							</div>
						</li>
						<li class="flex items-start">
							<div class="text-primary mr-3 mt-1">
								<i class="fas fa-ticket-alt"></i>
							</div>
							<div>
								<strong>Registration</strong>
								<p>$25 - $50 (Early bird pricing available)</p>
							</div>
						</li>
					</ul>

					<div class="mt-6">
						<button class="btn bg-primary hover:bg-primary-dark w-full text-white">
							Register Now
						</button>
						<p class="mt-2 text-center text-sm text-gray-600">
							Limited seats available. VietSpark members receive special pricing.
						</p>
					</div>
				</div>

				<div class="rounded-lg bg-gray-50 p-6 shadow-sm">
					<h3 class="mb-4 text-xl font-bold">Share This Event</h3>
					<div class="flex space-x-4">
						<a
							href="https://facebook.com/sharer/sharer.php?u={encodeURIComponent(
								`https://vietspark.org/events/tech-summit-2023`
							)}"
							target="_blank"
							rel="noopener noreferrer"
							class="text-gray-600 hover:text-blue-600"
							aria-label="Share on Facebook"
						>
							<i class="fab fa-facebook-f text-xl"></i>
						</a>
						<a
							href="https://twitter.com/intent/tweet?url={encodeURIComponent(
								`https://vietspark.org/events/tech-summit-2023`
							)}&text={encodeURIComponent(event.title)}"
							target="_blank"
							rel="noopener noreferrer"
							class="text-gray-600 hover:text-blue-400"
							aria-label="Share on Twitter"
						>
							<i class="fab fa-twitter text-xl"></i>
						</a>
						<a
							href="https://www.linkedin.com/sharing/share-offsite/?url={encodeURIComponent(
								`https://vietspark.org/events/tech-summit-2023`
							)}"
							target="_blank"
							rel="noopener noreferrer"
							class="text-gray-600 hover:text-blue-700"
							aria-label="Share on LinkedIn"
						>
							<i class="fab fa-linkedin-in text-xl"></i>
						</a>
						<a
							href="mailto:?subject={encodeURIComponent(event.title)}&body={encodeURIComponent(
								`Check out this event: https://vietspark.org/events/tech-summit-2023`
							)}"
							class="text-gray-600 hover:text-green-500"
							aria-label="Share via Email"
						>
							<i class="fas fa-envelope text-xl"></i>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Related Events -->
<section class="bg-gray-50 py-16">
	<div class="container mx-auto px-4">
		<h2 class="mb-8 text-2xl font-bold">Other Events You Might Like</h2>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			<!-- Placeholder events -->
			<div class="overflow-hidden rounded-lg bg-white shadow-sm">
				<img
					src="https://via.placeholder.com/800x400"
					alt="Break Into Tech Workshop"
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
					src="https://via.placeholder.com/800x400"
					alt="Tech Networking Night"
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
					src="https://via.placeholder.com/800x400"
					alt="Mentorship Program Kickoff"
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
</section>

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
