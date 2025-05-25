<script>
	// Event data (to be replaced with API/database data later)
	const event = {
		title: 'Break Into Tech Workshop',
		date: 'November 5, 2023',
		time: '10:00 AM - 2:00 PM PST',
		location: 'Online (Zoom)',
		description: 'A workshop designed to help newcomers navigate their way into the tech industry.',
		image: 'https://via.placeholder.com/1200x600',
		category: 'Workshop'
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
					<h2>About This Workshop</h2>
					<p>
						Our Break Into Tech program is designed to help Vietnamese professionals transition into
						the tech industry or advance their early-stage tech careers. This comprehensive workshop
						will provide you with the knowledge, resources, and connections needed to successfully
						navigate the tech landscape.
					</p>
					<p>
						Whether you're looking to switch careers, enter the job market, or take your tech career
						to the next level, this workshop offers practical guidance tailored to your needs.
					</p>

					<h2>What You'll Learn</h2>
					<ul>
						<li>How to identify your transferable skills and strengths</li>
						<li>Different tech career paths and which might be right for you</li>
						<li>Resume building strategies specific to tech roles</li>
						<li>Technical interview preparation and practice</li>
						<li>Networking techniques in the tech industry</li>
						<li>Resources for continuing education and skill development</li>
					</ul>

					<h2>Workshop Agenda</h2>
					<p><strong>10:00 AM - 10:15 AM:</strong> Welcome and Introduction</p>
					<p><strong>10:15 AM - 11:00 AM:</strong> Tech Career Paths Overview</p>
					<p><strong>11:00 AM - 11:45 AM:</strong> Resume Building for Tech Roles</p>
					<p><strong>11:45 AM - 12:30 PM:</strong> Networking Break & Q&A</p>
					<p><strong>12:30 PM - 1:15 PM:</strong> Interview Preparation Strategies</p>
					<p><strong>1:15 PM - 2:00 PM:</strong> Resources & Next Steps</p>

					<h2>Who Should Attend</h2>
					<p>
						This workshop is perfect for professionals considering a career change to tech, recent
						graduates looking to enter the tech industry, or early-career tech professionals wanting
						to advance their careers.
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
								<p class="text-sm">Meeting link will be sent to registered participants</p>
							</div>
						</li>
						<li class="flex items-start">
							<div class="text-primary mr-3 mt-1">
								<i class="fas fa-ticket-alt"></i>
							</div>
							<div>
								<strong>Registration</strong>
								<p>$15 (Free for VietSpark members)</p>
							</div>
						</li>
					</ul>

					<div class="mt-6">
						<button class="btn bg-primary hover:bg-primary-dark w-full text-white">
							Register Now
						</button>
						<p class="mt-2 text-center text-sm text-gray-600">
							Limited spots available. Register early to secure your spot.
						</p>
					</div>
				</div>

				<div class="rounded-lg bg-gray-50 p-6 shadow-sm">
					<h3 class="mb-4 text-xl font-bold">Workshop Speakers</h3>
					<div class="space-y-4">
						<div class="flex items-center">
							<div
								class="mr-3 h-12 w-12 rounded-full bg-gray-300 text-center text-xs leading-10 text-white"
							>
								Photo
							</div>
							<div>
								<p class="font-semibold">Jane Doe</p>
								<p class="text-sm text-gray-600">Senior Software Engineer at Tech Co.</p>
							</div>
						</div>
						<div class="flex items-center">
							<div
								class="mr-3 h-12 w-12 rounded-full bg-gray-300 text-center text-xs leading-10 text-white"
							>
								Photo
							</div>
							<div>
								<p class="font-semibold">John Smith</p>
								<p class="text-sm text-gray-600">Technical Recruiter at Major Tech</p>
							</div>
						</div>
					</div>
				</div>

				<div class="mt-8 rounded-lg bg-gray-50 p-6 shadow-sm">
					<h3 class="mb-4 text-xl font-bold">Share This Event</h3>
					<div class="flex space-x-4">
						<a
							href="https://facebook.com/sharer/sharer.php?u={encodeURIComponent(
								`https://vietspark.org/events/break-into-tech`
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
								`https://vietspark.org/events/break-into-tech`
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
								`https://vietspark.org/events/break-into-tech`
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
								`Check out this event: https://vietspark.org/events/break-into-tech`
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
			<div class="overflow-hidden rounded-lg bg-white shadow-sm">
				<img
					src="https://via.placeholder.com/800x400"
					alt="Annual Tech Summit 2023"
					class="h-48 w-full object-cover"
				/>
				<div class="p-4">
					<span
						class="text-primary inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold"
					>
						Tech Summit
					</span>
					<h3 class="hover:text-primary mb-2 mt-2 text-lg font-bold">
						<a href="/events/tech-summit-content">Annual Tech Summit 2023</a>
					</h3>
					<p class="mb-4 text-sm text-gray-600">December 15, 2023 • San Francisco, CA</p>
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
					alt="Resume Workshop"
					class="h-48 w-full object-cover"
				/>
				<div class="p-4">
					<span
						class="text-primary inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold"
					>
						Workshop
					</span>
					<h3 class="hover:text-primary mb-2 mt-2 text-lg font-bold">Tech Resume Workshop</h3>
					<p class="mb-4 text-sm text-gray-600">October 10, 2023 • Online (Zoom)</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Testimonials -->
<section class="py-16">
	<div class="container mx-auto px-4">
		<h2 class="mb-8 text-center text-2xl font-bold">What Past Participants Say</h2>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			<div class="rounded-lg bg-gray-50 p-6 shadow-sm">
				<div class="mb-4 text-yellow-400">
					<i class="fas fa-star"></i>
					<i class="fas fa-star"></i>
					<i class="fas fa-star"></i>
					<i class="fas fa-star"></i>
					<i class="fas fa-star"></i>
				</div>
				<p class="mb-4 italic text-gray-600">
					"This workshop was exactly what I needed to transition from my finance career to tech. The
					practical advice and networking opportunities were invaluable."
				</p>
				<div class="flex items-center">
					<div class="mr-3 h-10 w-10 rounded-full bg-gray-300"></div>
					<div>
						<p class="font-semibold">Alex Nguyen</p>
						<p class="text-sm text-gray-600">Former Accountant, Now Software Developer</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-gray-50 p-6 shadow-sm">
				<div class="mb-4 text-yellow-400">
					<i class="fas fa-star"></i>
					<i class="fas fa-star"></i>
					<i class="fas fa-star"></i>
					<i class="fas fa-star"></i>
					<i class="fas fa-star"></i>
				</div>
				<p class="mb-4 italic text-gray-600">
					"As a recent graduate, I was feeling lost about how to break into tech. This workshop
					provided clear steps and helped me land my first job!"
				</p>
				<div class="flex items-center">
					<div class="mr-3 h-10 w-10 rounded-full bg-gray-300"></div>
					<div>
						<p class="font-semibold">Tina Pham</p>
						<p class="text-sm text-gray-600">Junior UX Designer</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-gray-50 p-6 shadow-sm">
				<div class="mb-4 text-yellow-400">
					<i class="fas fa-star"></i>
					<i class="fas fa-star"></i>
					<i class="fas fa-star"></i>
					<i class="fas fa-star"></i>
					<i class="fas fa-star-half-alt"></i>
				</div>
				<p class="mb-4 italic text-gray-600">
					"The connections I made during this workshop have been instrumental in my career growth.
					Highly recommended for anyone looking to advance in tech."
				</p>
				<div class="flex items-center">
					<div class="mr-3 h-10 w-10 rounded-full bg-gray-300"></div>
					<div>
						<p class="font-semibold">Michael Tran</p>
						<p class="text-sm text-gray-600">Product Manager</p>
					</div>
				</div>
			</div>
		</div>
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
