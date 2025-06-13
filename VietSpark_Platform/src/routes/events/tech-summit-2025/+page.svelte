<script>
	import TechSummitImage from '$lib/images/Events/TechSummitImage.JPG';
	import TechSummit2025Image from '$lib/images/Events/2025/TechSummit2025Image.jpg';
	import EventPlaceHolderImage from '$lib/images/Events/EventPlaceHolderImage.jpg';
	// Event data (to be replaced with API/database data later)
	const event = {
		title: 'Annual Tech Summit 2025',
		date: 'August 22-23, 2025',
		time: '9:00 AM - 5:00 PM PST',
		location: 'Silicon Valley, CA',
		description:
			'Join us for a day of inspiring talks, networking, and workshops from industry leaders.',
		image: TechSummit2025Image,
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
					<!-- <div class="flex items-center">
						<i class="fas fa-clock mr-2"></i>
						<span>{event.time}</span>
					</div> -->
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
				<div class="flex justify-center">
					<img
					src={event.image}
					alt={event.title}
					class="mb-8 h-full rounded-lg shadow-md"
					style="height: 400px;"
					/>
				</div>

				<div class="prose prose-lg max-w-none">
					<h2>{@html "📣 <b>VIETNAM TECH SUMMIT 2025</b> IS OFFICIALLY BACK - OPEN <b>EARLY BIRD</b> REGISTRATION"}</h2>
					
					<p>{@html `After three successful years, drawing over 400 professionals and tech enthusiasts just last year alone, <b><a href="https://www.linkedin.com/company/vietnam-business-professional-in-tech/" style="color: blue;">Viet Spark</a></b>, VietBay, <b><a href="https://www.linkedin.com/company/visemi/" style="color: blue;">VISEMI Foundation</a></b>, and <b><a href="https://www.linkedin.com/company/aiforvietnam/" style="color: blue;">AI for Vietnam</a></b> - is officially back!`}</p>
					<p>{@html "Get ready for an exciting 2-day journey of breakthrough ideas and meaningful connections — where the Vietnamese tech community across the U.S. gathers to <b>connect - share - and unlock new opportunities.</b>"}</p>
					<p>{@html "🗓️ <b>When? August 22-23, 2025</b>"}</p>
					<p>{@html "📍 <b>Where? Silicon Valley, CA</b>"}</p>
					<p><br></p>
					<p>{@html "📣 <i><b>What's waiting for you at Vietnam Tech Summit 2025?</b></i>"}</p>
					<p>{@html "✨ <b>In-depth Panel Discussions</b> featuring top experts on the hottest topics: AI and Semiconductors."}</p>
					<p>{@html "✨ <b>Vietnam AI Stars 2025 – Grand Finale:</b> The first AI-focused competition designed for Vietnamese talents. Finalist teams will <b>pitch their AI projects live</b> in front of an all-star panel of judges and compete for amazing prizes — including cash awards, 1:1 mentoring/coaching by industry leaders, investment opportunities, and global visibility."}</p>

					<p>{@html "<b>Judging Panel includes:</b>"}</p>
					<ul>
						<li>{@html '<a href="https://www.linkedin.com/in/quoc-v-le-319b5a8/" style="color: blue;">Mr. Quoc Le</a> – <a href="https://www.linkedin.com/company/google/" style="color: blue;">Google</a> Fellow, <a href="https://www.linkedin.com/company/googledeepmind/" style="color: blue;">Google DeepMind</a>'}</li>
						<li>{@html '<a href="https://www.linkedin.com/in/hungtrv/" style="color: blue;">Mr. Hung Tran</a> – CEO | Co-Founder, <a href="https://www.linkedin.com/company/aiforvietnam/" style="color: blue;">AI for Vietnam</a>'}</li>
						<li>{@html '<a href="https://www.linkedin.com/in/chiphuyen/" style="color: blue;">Ms. Huyen Chip, M.Sc.</a> – Computer Scientist, Founder of Claypot AI, Amazon Bestselling Author'}</li>
						<li>{@html '<a href="https://www.linkedin.com/in/chiphuyen/" style="color: blue;">Mr. Hien Luu, M.Sc.</a> – Senior Engineering Manager, <a href="https://www.linkedin.com/company/zoox-inc/" style="color: blue;">Zoox</a>'}</li>
					</ul>

					<p>{@html "✨ <b>Live Music & Networking Night:</b> A cozy yet vibrant kickoff party with live music – perfect for building authentic connections with speakers, professionals, and the broader Vietnamese tech community."}</p>
					<p>{@html "✨ <b>10+ Hands-on Workshops</b> across 4 time slots: Covering a wide range of topics from AI, Semiconductors to career skills in Software, Data, Product, and Business."}</p>
					
					<p>{@html "✨ <b>Company Tours</b> to top tech headquarters like Google, Microsoft, and TikTok: Get an exclusive look into how the tech giants operate in real life."}</p>
					<p>{@html "<i><b>Note</b></i>: Company Tours is complimentary and free of charge to Vietnam Tech Summit participants. Limited spots available, early registration priority. The organizing committee reserves the right to determine the final participant list"}</p>
					<p><br></p>
					<p>{@html "👉 <b>Register today to receive Early Bird tickets at discounted prices!</b>"}</p>
					<p>{@html "📌 Registration link: <a href='https://lnkd.in/eR--8Ya2'style='color: blue; '>https://lnkd.in/eR--8Ya2</a>"}</p>

					<p>{@html "<b>Don't miss out - this summer will be more vibrant than ever with the Tech Summit!</b>"}</p>
					<p>{@html "<b>📩 Email:</b> <span style='color: blue;'>contact@vietspark.org</span>"}</p>					<!-- <p>{@html "📣 <b>Follow the Viet Spark fanpage to stay updated with the latest news and announcements for the event!</b>"}</p>
					<p>{@html "We can't wait to see you at the upcoming activities of <b>Vietnam Tech Summit 2025!</b>"}</p>

					<h2>{@html "📣 <b>VIETNAM TECH SUMMIT 2025 IS OFFICIALLY BACK - OPEN EARLY BIRD REGISTRATION</b>"}</h2> -->
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
						<!-- <li class="flex items-start">
							<div class="text-primary mr-3 mt-1">
								<i class="fas fa-clock"></i>
							</div>
							<div>
								<strong>Time</strong>
								<p>{event.time}</p>
							</div>
						</li> -->
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
						<!-- <p class="mt-2 text-center text-sm text-gray-600">
							Limited seats available. VietSpark members receive special pricing.
						</p> -->
					</div>
				</div>

				<div class="rounded-lg bg-gray-50 p-6 shadow-sm">
					<h3 class="mb-4 text-xl font-bold">Share This Event</h3>
					<div class="flex space-x-4">
						<a
							href="https://www.facebook.com/share/1ZYMGM3fwC/"
							target="_blank"
							rel="noopener noreferrer"
							class="text-gray-600 hover:text-blue-600"
							aria-label="Share on Facebook"
						>
							<i class="fab fa-facebook-f text-xl"></i>
						</a>
						<!-- <a
							href="https://twitter.com/intent/tweet?url={encodeURIComponent(
								`https://vietspark.org/events/tech-summit-2023`
							)}&text={encodeURIComponent(event.title)}"
							target="_blank"
							rel="noopener noreferrer"
							class="text-gray-600 hover:text-blue-400"
							aria-label="Share on Twitter"
						>
							<i class="fab fa-twitter text-xl"></i>
						</a> -->
						<a
							href="https://www.linkedin.com/posts/vietnam-business-professional-in-tech_%F0%9D%90%95%F0%9D%90%88%F0%9D%90%84%F0%9D%90%93%F0%9D%90%8D%F0%9D%90%80%F0%9D%90%8C-%F0%9D%90%93%F0%9D%90%84%F0%9D%90%82%F0%9D%90%87-%F0%9D%90%92%F0%9D%90%94%F0%9D%90%8C%F0%9D%90%8C%F0%9D%90%88%F0%9D%90%93-%F0%9D%9F%90%F0%9D%9F%8E%F0%9D%9F%90%F0%9D%9F%93-activity-7336960846851432448-k6-B?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAvBykkBuk--cmHKO-h7qvlSz22QDsIz5SU"
							target="_blank"
							rel="noopener noreferrer"
							class="text-gray-600 hover:text-blue-700"
							aria-label="Share on LinkedIn"
						>
							<i class="fab fa-linkedin-in text-xl"></i>
						</a>
						<a
							href="https://app.promotix.com/events/details/Vietnam-Tech-Summit-2025-tickets?referrer=eve[…]DX-IlgwrOjeyJ1ErZ4OUqAgDbUxlyOHFw_aem_zp2DcT2orcDULncg2QVeKw"
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
