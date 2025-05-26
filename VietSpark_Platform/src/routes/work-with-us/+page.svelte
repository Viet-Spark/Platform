<script>
	// Sample volunteer opportunities
	const volunteerOpportunities = [
		{
			id: 'program-manager',
			title: 'Program Manager',
			category: 'Event Planning',
			commitment: 'Hybrid, 5-10 hours/week',
			description:
				'Lead and coordinate our educational programs and events, working closely with speakers and community partners.',
			requirements: [
				'Strong organizational and communication skills',
				'Experience in project management or event planning',
				'Interest in educational programming',
				'Availability for occasional weekend events'
			]
		},
		{
			id: 'mentorship-coordinator',
			title: 'Mentorship Coordinator',
			category: 'Mentorship',
			commitment: 'Remote, 3-5 hours/week',
			description:
				'Facilitate our mentorship program by matching mentors with mentees and ensuring productive relationships.',
			requirements: [
				'Understanding of mentorship best practices',
				'Excellent interpersonal skills',
				'Ability to facilitate introductions and check-ins',
				'Experience in coaching or mentoring (preferred)'
			]
		},
		{
			id: 'content-creator',
			title: 'Content Creator',
			category: 'Marketing',
			commitment: 'Remote, flexible hours',
			description:
				'Develop engaging content for our website, blog, and social media channels to share community stories and insights.',
			requirements: [
				'Strong writing skills',
				'Experience in content creation',
				'Understanding of social media platforms',
				'Interest in technology and professional development'
			]
		},
		{
			id: 'tech-lead',
			title: 'Tech Lead',
			category: 'Technology',
			commitment: 'Remote, 5-7 hours/week',
			description:
				'Lead the development and maintenance of our platform and digital tools to support our community.',
			requirements: [
				'Experience in web development',
				'Proficiency in JavaScript and modern frameworks',
				'Understanding of database management',
				'Ability to mentor junior developers'
			]
		}
	];

	// Filter opportunities by category
	let selectedCategory = 'All';
	const categories = ['All', 'Event Planning', 'Mentorship', 'Marketing', 'Technology'];

	$: filteredOpportunities =
		selectedCategory === 'All'
			? volunteerOpportunities
			: volunteerOpportunities.filter((opp) => opp.category === selectedCategory);

	function setCategory(category) {
		selectedCategory = category;
	}
</script>

<svelte:head>
	<title>Work With Us - VietSpark</title>
	<meta
		name="description"
		content="Join the VietSpark team and help us empower Vietnamese professionals in the tech industry. Volunteer opportunities and career positions available."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="bg-primary py-16 text-white">
	<div class="container mx-auto px-4 text-center">
		<h1 class="mb-4 text-4xl font-bold">Work With Us</h1>
		<p class="mx-auto max-w-3xl text-xl">
			Join our mission to empower Vietnamese professionals in the tech industry through
			knowledge-sharing, mentorship, and community.
		</p>
	</div>
</section>

<!-- Why Join Section -->
<section class="bg-white py-16">
	<div class="container mx-auto px-4">
		<div class="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
			<div>
				<h2 class="mb-6 text-3xl font-bold">Why Join VietSpark?</h2>
				<div class="bg-primary mb-6 h-1 w-24"></div>
				<p class="mb-4 text-gray-700">
					Joining the VietSpark team means becoming part of a passionate community dedicated to
					creating opportunities and fostering growth for Vietnamese professionals in tech.
				</p>

				<div class="mt-8 space-y-4">
					<div class="flex">
						<div class="mt-1 flex-shrink-0">
							<div class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
								<i class="fas fa-check text-primary text-sm"></i>
							</div>
						</div>
						<div class="ml-4">
							<h3 class="text-lg font-bold text-gray-800">Make an Impact</h3>
							<p class="text-gray-600">
								Directly contribute to the growth and success of Vietnamese professionals in the
								tech industry.
							</p>
						</div>
					</div>

					<div class="flex">
						<div class="mt-1 flex-shrink-0">
							<div class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
								<i class="fas fa-check text-primary text-sm"></i>
							</div>
						</div>
						<div class="ml-4">
							<h3 class="text-lg font-bold text-gray-800">Develop Skills</h3>
							<p class="text-gray-600">
								Gain valuable experience and enhance your professional skills in your area of
								interest.
							</p>
						</div>
					</div>

					<div class="flex">
						<div class="mt-1 flex-shrink-0">
							<div class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
								<i class="fas fa-check text-primary text-sm"></i>
							</div>
						</div>
						<div class="ml-4">
							<h3 class="text-lg font-bold text-gray-800">Expand Your Network</h3>
							<p class="text-gray-600">
								Connect with like-minded professionals, industry experts, and potential mentors.
							</p>
						</div>
					</div>

					<div class="flex">
						<div class="mt-1 flex-shrink-0">
							<div class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
								<i class="fas fa-check text-primary text-sm"></i>
							</div>
						</div>
						<div class="ml-4">
							<h3 class="text-lg font-bold text-gray-800">Flexible Commitment</h3>
							<p class="text-gray-600">
								Most of our volunteer roles offer flexible hours and remote work opportunities.
							</p>
						</div>
					</div>
				</div>
			</div>

			<div class="flex h-96 items-center justify-center rounded-lg bg-gray-100">
				<!-- Placeholder for team image -->
				<span class="font-bold text-gray-500">Team Image</span>
			</div>
		</div>
	</div>
</section>

<!-- Volunteer Opportunities Section -->
<section class="bg-gray-50 py-16">
	<div class="container mx-auto px-4">
		<div class="mb-12 text-center">
			<h2 class="mb-4 text-3xl font-bold">Volunteer Opportunities</h2>
			<div class="bg-primary mx-auto mb-6 h-1 w-24"></div>
			<p class="mx-auto max-w-3xl text-lg text-gray-600">
				<!-- We have various volunteer roles available based on your interests, skills, and availability. -->
				 There are no volunteering roles available currently. Please check back in the future!
			</p>
		</div>

		<!-- <div class="mb-10 flex flex-wrap justify-center gap-3">
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

		{#if filteredOpportunities.length > 0}
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
				{#each filteredOpportunities as opportunity}
					<div class="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
						<div class="mb-4 flex items-start justify-between">
							<div>
								<h3 class="mb-1 text-xl font-bold">{opportunity.title}</h3>
								<span
									class="text-primary inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold"
								>
									{opportunity.category}
								</span>
							</div>
							<span class="text-sm text-gray-600">{opportunity.commitment}</span>
						</div>

						<p class="mb-4 text-gray-700">{opportunity.description}</p>

						<div class="mb-4">
							<h4 class="mb-2 font-bold text-gray-800">Requirements:</h4>
							<ul class="list-inside list-disc space-y-1 text-gray-600">
								{#each opportunity.requirements as requirement}
									<li>{requirement}</li>
								{/each}
							</ul>
						</div>

						<a
							href={`/apply/${opportunity.id}`}
							class="btn bg-primary hover:bg-primary-dark text-white"
						>
							Apply Now
						</a>
					</div>
				{/each}
			</div>
		{:else}
			<div class="py-12 text-center">
				<p class="text-gray-600">
					No opportunities found in the {selectedCategory.toLowerCase()} category.
				</p>
				<button class="text-primary mt-4 hover:underline" on:click={() => setCategory('All')}>
					View all opportunities
				</button>
			</div>
		{/if} -->
	</div>
</section>

<!-- Custom Role Section -->
<section class="bg-white py-16">
	<div class="container mx-auto px-4 text-center">
		<h2 class="mb-4 text-3xl font-bold">Don't See the Right Fit?</h2>
		<p class="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
			We're always looking for passionate individuals with diverse skills. Tell us how you'd like to
			contribute!
		</p>
		<a
			href="/contact?subject=Custom Volunteer Role"
			class="btn bg-primary hover:bg-primary-dark text-white"
		>
			Suggest a Role
		</a>
	</div>
</section>

<!-- Testimonials Section -->
<section class="bg-gray-50 py-16">
	<div class="container mx-auto px-4">
		<div class="mb-12 text-center">
			<h2 class="mb-4 text-3xl font-bold">Volunteer Testimonials</h2>
			<div class="bg-primary mx-auto mb-6 h-1 w-24"></div>
		</div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			<div class="rounded-lg bg-white p-6 shadow-sm">
				<div class="mb-4 flex justify-center">
					<div class="h-16 w-16 rounded-full bg-gray-300"></div>
				</div>
				<blockquote class="mb-4 italic text-gray-700">
					"Volunteering with VietSpark has been incredibly rewarding. I've developed new skills,
					expanded my network, and helped fellow Vietnamese professionals succeed in tech."
				</blockquote>
				<div class="text-center">
					<h4 class="font-bold">Minh Nguyen</h4>
					<p class="text-sm text-gray-600">Program Manager, 2 years</p>
				</div>
			</div>

			<div class="rounded-lg bg-white p-6 shadow-sm">
				<div class="mb-4 flex justify-center">
					<div class="h-16 w-16 rounded-full bg-gray-300"></div>
				</div>
				<blockquote class="mb-4 italic text-gray-700">
					"As a mentor coordinator, I've witnessed firsthand the transformative power of mentorship.
					It's been amazing to facilitate these valuable connections within our community."
				</blockquote>
				<div class="text-center">
					<h4 class="font-bold">Linh Tran</h4>
					<p class="text-sm text-gray-600">Mentorship Coordinator, 1.5 years</p>
				</div>
			</div>

			<div class="rounded-lg bg-white p-6 shadow-sm">
				<div class="mb-4 flex justify-center">
					<div class="h-16 w-16 rounded-full bg-gray-300"></div>
				</div>
				<blockquote class="mb-4 italic text-gray-700">
					"Working on the VietSpark platform has allowed me to grow my technical skills while
					contributing to a cause I deeply care about. The team is supportive and mission-driven."
				</blockquote>
				<div class="text-center">
					<h4 class="font-bold">Trung Pham</h4>
					<p class="text-sm text-gray-600">Tech Lead, 1 year</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Application Process Section -->
<section class="bg-white py-16">
	<div class="container mx-auto px-4">
		<div class="mb-12 text-center">
			<h2 class="mb-4 text-3xl font-bold">Our Application Process</h2>
			<div class="bg-primary mx-auto mb-6 h-1 w-24"></div>
		</div>

		<div class="mx-auto max-w-4xl">
			<div class="relative">
				<!-- Timeline Line -->
				<div
					class="absolute left-0 top-0 h-full w-1 -translate-x-1/2 transform bg-blue-100 md:left-1/2"
				></div>

				<!-- Timeline Items -->
				<div class="timeline-items">
					<!-- Item 1 -->
					<div class="relative mb-16 flex flex-col md:flex-row md:even:flex-row-reverse">
						<div class="timeline-dot"></div>
						<div class="mb-8 md:mb-0 md:w-1/2 md:px-8">
							<h3 class="mb-3 text-xl font-bold">1. Apply Online</h3>
							<p class="text-gray-600">
								Submit your application for the role you're interested in. Be sure to highlight your
								relevant skills and experience, as well as why you're passionate about our mission.
							</p>
						</div>
						<div class="hidden md:block md:w-1/2 md:px-8"></div>
					</div>

					<!-- Item 2 -->
					<div class="relative mb-16 flex flex-col md:flex-row md:even:flex-row-reverse">
						<div class="timeline-dot"></div>
						<div class="mb-8 hidden md:mb-0 md:block md:w-1/2 md:px-8"></div>
						<div class="md:w-1/2 md:px-8">
							<h3 class="mb-3 text-xl font-bold">2. Initial Interview</h3>
							<p class="text-gray-600">
								If your application matches our needs, we'll schedule a conversation to discuss your
								background, interests, and availability in more detail.
							</p>
						</div>
					</div>

					<!-- Item 3 -->
					<div class="relative mb-16 flex flex-col md:flex-row md:even:flex-row-reverse">
						<div class="timeline-dot"></div>
						<div class="mb-8 md:mb-0 md:w-1/2 md:px-8">
							<h3 class="mb-3 text-xl font-bold">3. Team Introduction</h3>
							<p class="text-gray-600">
								Meet the team you'll be working with to learn more about current projects and how
								your role contributes to our broader goals.
							</p>
						</div>
						<div class="hidden md:block md:w-1/2 md:px-8"></div>
					</div>

					<!-- Item 4 -->
					<div class="relative flex flex-col md:flex-row md:even:flex-row-reverse">
						<div class="timeline-dot"></div>
						<div class="mb-8 hidden md:mb-0 md:block md:w-1/2 md:px-8"></div>
						<div class="md:w-1/2 md:px-8">
							<h3 class="mb-3 text-xl font-bold">4. Onboarding & Training</h3>
							<p class="text-gray-600">
								Once you join, we'll provide comprehensive onboarding and any necessary training to
								ensure you're set up for success in your role.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="bg-primary py-16 text-white">
	<div class="container mx-auto px-4 text-center">
		<h2 class="mb-4 text-3xl font-bold">Ready to Join Our Team?</h2>
		<p class="mx-auto mb-8 max-w-2xl text-xl">
			Take the first step towards making a difference in the Vietnamese tech community.
		</p>
		<div class="flex flex-wrap justify-center gap-4">
			<a href="#volunteer-opportunities" class="btn text-primary bg-white hover:bg-gray-100">
				View Opportunities
			</a>
			<a
				href="/contact?subject=Volunteer Inquiry"
				class="btn hover:text-primary border-2 border-white bg-transparent hover:bg-white"
			>
				Contact Us
			</a>
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

	.timeline-dot {
		position: absolute;
		left: 0;
		top: 0;
		width: 20px;
		height: 20px;
		background-color: #0a57a0;
		border-radius: 50%;
		transform: translateX(-50%);
		z-index: 1;
	}

	@media (min-width: 768px) {
		.timeline-dot {
			left: 50%;
		}
	}
</style>
