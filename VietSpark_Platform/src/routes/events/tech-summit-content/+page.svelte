<script>
	import EventPlaceHolderImage from '$lib/images/Events/EventPlaceHolderImage.jpg';
	import TechSummitImage from '$lib/images/Events/TechSummitImage.JPG';
	import TechSummit2025Image from '$lib/images/Events/2025/TechSummit2025Image.jpg';
	import { eventImages } from '$lib/images/Events/imgEvents.js';
	// Event data (to be replaced with API/database data later)
	const events = [
		{
			title: 'Annual Tech Summit 2025',
			date: 'August 22-23, 2025',
			time: '9:00 AM - 5:00 PM PST',
			location: 'San Francisco, CA',
			description:
				'Join us for a day of inspiring talks, networking, and workshops from industry leaders.',
			images: [TechSummit2025Image],
			category: 'Tech Summit',
			content:[
				"<p>📣 <b>VIETNAM TECH SUMMIT 2025 IS OFFICIALLY BACK - OPEN EARLY BIRD REGISTRATION</b></p>",
			]
		},
		{
			title: 'Annual Tech Summit 2024',
			date: 'August 16-17, 2024',
			time: '9:00 AM - 5:00 PM PST',
			location: 'San Francisco, CA',
			description:
				'Join us for a day of inspiring talks, networking, and workshops from industry leaders.',
			images: [
				eventImages.IMG_2024_1,eventImages.IMG_2024_2,eventImages.IMG_2024_3,eventImages.IMG_2024_4,eventImages.IMG_2024_5,
				eventImages.IMG_2024_6,eventImages.IMG_2024_7,eventImages.IMG_2024_8,eventImages.IMG_2024_9,eventImages.IMG_2024_10,
			],
			category: 'Tech Summit',
			content:[
				"<p>Tech Summit 2024 was hosted in Bay Area in August 2024, attracting over 400 tech enthusiasts who gathered to explore the latest industry trends and share insights that push the boundaries of AI and career development. Day 1 featured exclusive tours of Google and Microsoft Headquarters, offering attendees a unique opportunity to witness the cutting-edge work being done at two of the world’s most influential tech companies. After the tours, the evening was capped off with a lively Networking Night, complete with live Co Band music, providing a relaxed and enjoyable setting for participants to forge meaningful connections and reflect on the day's experiences.</p>",
				"<p>The event continued with keynotes outlining the latest AI trends, leading into the highly anticipated panel discussion, \"AI: Beyond the Horizon\". Thought leaders <strong>Trieu Trinh</strong>, <strong>Ray Nguyen</strong>, <strong>Hung Hoang Nguyen</strong>, and <strong>Tuoc Luong</strong> shared their visions for the future of AI, sparking dynamic conversations about how this transformative technology will shape the industry.</p>",
				"<p>Day 2 featured a new Speed Mentoring session, offering personalized advice across four specialized tracks: Start-up, Product, Software Engineering, and Data. Participants also attended 11 in-depth workshops on AI, product development, and career growth, including sessions like \"Implementing LLM Virtual Assistants in Vietnam\" and \"How to Bring AI from Research to Product.\" The day concluded with a final networking session and a raffle, leaving participants reflecting on the knowledge and connections gained.</p>",
			]
		},
		{
			title: 'Annual Tech Summit 2023',
			date: 'August 11-13, 2023',
			time: '9:00 AM - 5:00 PM PST',
			location: 'San Francisco, CA',
			description:
				'Join us for a day of inspiring talks, networking, and workshops from industry leaders.',
			images: [
				eventImages.IMG_2023_1,eventImages.IMG_2023_2,eventImages.IMG_2023_3,eventImages.IMG_2023_4,eventImages.IMG_2023_5,
				eventImages.IMG_2023_6,eventImages.IMG_2023_7,eventImages.IMG_2023_8,eventImages.IMG_2023_9,eventImages.IMG_2023_10,
			],
			category: 'Tech Summit',
			content:[
				"<p>Following the success of Tech Summit 2022, Tech Summit 2023 in the Bay Area brought together over 300 participants for a dynamic two-day event filled with insightful panels, engaging workshops, and valuable networking.</p>",
				"<p>Day 1 featured exclusive tours of Google and Microsoft Headquarters, offering attendees an inside look at two of the world’s most innovative companies</p>",
				"<p>Day 2’s spotlight panel, “The Impact of AI on Our Careers” explored the rapid evolution of AI and its transformative influence on the tech industry. Esteemed speakers from top companies like Got It, Doordash, Adobe, and FPT Software shared cutting-edge insights into AI applications in tech, from machine learning advancements to AI-driven product development. The day also featured hands-on workshops, ranging from career growth in data analytics to strategies for excelling in software engineering. As the day concluded, attendees had the chance to connect with fellow professionals and experience the innovation of Vinfast’s automotive technology through an exclusive test drive, further emphasizing the diverse impact of tech in today’s world.</p>",
				"<p>The third and final day of the summit wrapped up with a relaxing Outdoor BBQ Party, offering a chance for attendees to unwind, reflect, and build lasting connections in a casual setting. Tech Summit 2023 successfully captured the pulse of the AI trend and left participants inspired and equipped for the next steps in their tech careers.</p>",
				"<p>Check out the event in the media <a href='https://vtv.vn/the-gioi/tech-summit-2023-thu-hut-thanh-nien-sinh-vien-viet-nam-tai-my-20230815114650564.htm?fbclid=IwAR3tyFST7GfIO7lDHlNSQYJ4y41Wg2Z2l6s3_WrxRKTqs3bKmqJCxvsTuzE_aem_ASHvtmvALX9IrCGLMnvWLF-yzw5L_4wiW7mIUkxQmxDJDJZS063L3fwazDuafkp-pLRXB2xmpO4o05TU5W7y7BMK'>here</a> </p>",
				"<p>The day also featured hands-on workshops, ranging from career growth in data analytics to strategies for excelling in software engineering. As the day concluded, attendees had the chance to connect with fellow professionals and experience the innovation of Vinfast’s automotive technology through an exclusive test drive, further emphasizing the diverse impact of tech in today’s world.</p>",
				"<p>The third and final day of the summit wrapped up with a relaxing Outdoor BBQ Party, offering a chance for attendees to unwind, reflect, and build lasting connections in a casual setting. Tech Summit 2023 successfully captured the pulse of the AI trend and left participants inspired and equipped for the next steps in their tech careers.</p>",
			]
		},
		{
			title: 'Annual Tech Summit 2022',
			date: 'September 16-18, 2022',
			time: '9:00 AM - 5:00 PM PST',
			location: 'Seattle, WA',
			description:
				'Join us for a day of inspiring talks, networking, and workshops from industry leaders.',
			images: [
				eventImages.IMG_2022_1,eventImages.IMG_2022_2,eventImages.IMG_2022_3,eventImages.IMG_2022_4,eventImages.IMG_2022_5,
				eventImages.IMG_2022_6,eventImages.IMG_2022_7,eventImages.IMG_2022_8,eventImages.IMG_2022_9,eventImages.IMG_2022_10,
			],
			category: 'Tech Summit',
			content:[
				"<p>The inaugural Tech Summit 2022, organized by Viet Spark and Seattle Vietnamese Professionals & Students (SVPS), took place in Seattle, WA, from September 16-18, attracting over 100 attendees. The event kicked off with a tour of Microsoft Headquarters, followed by a relaxed Happy Hour, offering participants a chance to connect with industry leaders.</p>",
				"<p>Day 2 featured a Tech Industry Outlook Post-Covid panel with prominent speakers from Microsoft, Amazon, Meta, and more, discussing current tech trends and the evolving job market. Workshops covering topics like career growth in tech, breaking into the industry, and personal finance for tech professionals gave attendees practical skills to advance their careers.</p>",
				"<p>The summit concluded on Day 3 with an Outdoor Team Building event at Volunteer Park and a Networking BBQ, providing a relaxed setting for participants to reflect on the weekend’s discussions and form lasting connections.</p>",
				"<p>Check out the event in the media <a href='https://youtu.be/hFLKIsWHQ5k?t=124'>here</a>",
				"<p>The inaugural Tech Summit 2022, organized by Viet Spark and Seattle Vietnamese Professionals & Students (SVPS), took place in Seattle, WA, from September 16-18, attracting over 100 attendees. The event kicked off with a tour of Microsoft Headquarters, followed by a relaxed Happy Hour, offering participants a chance to connect with industry leaders.</p>",
				"<p>Day 2 featured a Tech Industry Outlook Post-Covid panel with prominent speakers from Microsoft, Amazon, Meta, and more, discussing current tech trends and the evolving job market. Workshops covering topics like career growth in tech, breaking into the industry, and personal finance for tech professionals gave attendees practical skills to advance their careers.</p>",
				"<p>The summit concluded on Day 3 with an Outdoor Team Building event at Volunteer Park and a Networking BBQ, providing a relaxed setting for participants to reflect on the weekend’s discussions and form lasting connections.</p>",
			]
		}
	];

	// For images carousel
	/* 
	Example of data: 
	currentSlide = {
  		0: 0,  // for event 0, current slide is image 0
  		1: 0,  // for event 1, current slide is image 0
	}
	*/
	let currentSlide = {};

  // Initialize currentSlide index for each event
  $: events.forEach((event, i) => {
    if (!(i in currentSlide)) {
      currentSlide[i] = 0;
    }
  });

  function prev(i, length) {
    currentSlide[i] = (currentSlide[i] - 1 + length) % length;
  }

  function next(i, length) {
    currentSlide[i] = (currentSlide[i] + 1) % length;
  }
</script>

<svelte:head>
	{#each events as event}
		<title>{event.title} - VietSpark Events</title>
		<meta name="description" content={event.description} />
	{/each}
</svelte:head>

{#each events as event, i}
<div>
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
					
					{#if event.images.length > 1}
						<div class="relative w-full" style="height: 400px;">
							<img
								src={event.images[currentSlide[i]]}
								alt={event.title}
								class="w-full rounded-lg object-cover shadow-md"
								style="height: 400px;"
							/>
							<!-- Left arrow -->
							<button
								on:click={() => {console.log(event.images[i]); return prev(i, event.images.length)}}
								aria-label="Previous image"
								class="opacity-50 absolute top-1/2 left-4 -translate-y-1/2 bg-black bg-opacity-30 text-white p-5 rounded-full hover:bg-opacity-50 transition-all duration-200 w-14 h-14 flex items-center justify-center text-xl cursor-pointer"
							>
								‹
							</button>
							<!-- Right arrow -->
							<button
								on:click={() => next(i, event.images.length)}
								aria-label="Next image"
								class="opacity-50 absolute top-1/2 right-4 -translate-y-1/2 bg-black bg-opacity-30 text-white p-5 rounded-full hover:bg-opacity-50 transition-all duration-200 w-14 h-14 flex items-center justify-center text-xl cursor-pointer"
							>
								›
							</button>

						</div>
					{:else if event.images.length === 1}
						<img
							src={event.images[0]}
							alt={event.title}
							class="mb-8 w-full rounded-lg object-cover shadow-md"
							style="height: 400px;"
						/>
					{/if}
					
					<div class="prose prose-lg max-w-none">
						{#each event.content as paragraph}
							<p>{@html paragraph}</p>
						{/each}
					</div>
				</div>
				{#if i === 0}
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
										<p>$30 - $70 (Early bird pricing available)</p>
									</div>
								</li>
							</ul>

							
							<div class="mt-6">
								<a href="https://bit.ly/VietnamTechSummit2025" 
								aria-label="Register for Vietnam Tech Summit 2025"
								target="_blank"
								>
									<button class="btn bg-primary hover:underline hover:bg-primary-dark w-full text-white">
										Register Now
									</button>
								</a>
								<p class="mt-2 text-center text-sm text-gray-600">
									Limited seats available. VietSpark members receive special pricing.
								</p>
							</div>
						</div>

						<div class="rounded-lg bg-gray-50 p-6 shadow-sm text-gray-600">
							<h3 class="mb-4 text-xl font-bold">Share This Event</h3>
							<div class="flex space-x-4">
								<a
									href="https://facebook.com/sharer/sharer.php?u={encodeURIComponent(
										`https://vietspark.org/events/tech-summit-content`
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
										`https://vietspark.org/events/tech-summit-content`
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
										`https://vietspark.org/events/tech-summit-content`
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
										`Check out this event: https://vietspark.org/events/tech-summit-content`
									)}"
									class="text-gray-600 hover:text-green-500"
									aria-label="Share via Email"
								>
									<i class="fas fa-envelope text-xl"></i>
								</a>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</section>
</div>
{/each}




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
