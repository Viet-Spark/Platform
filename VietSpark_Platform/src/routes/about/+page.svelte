<script>
	import placeHolderAvatar from '$lib/images/About/placeHolderAvatar.jpg';
	import IonahImage from '$lib/images/About/Ionah.jpg';
	import HanhMaiImage from '$lib/images/About/HanhMai.jpg';
    import VanLeImage from '$lib/images/About/VanLe.jpg';
    import TanPhanImage from '$lib/images/About/TanPhan.jpg';
	// Team members data (to be expanded with real data)
    import HistoryImage from '$lib/images/About/HistoryImage.jpg';
	const boardMembers = [
		{
			name: 'Ionah Hang Nguyen',
			title: 'Founder',
			image: IonahImage,
			linkedIn: 'https://www.linkedin.com/in/ionah-hang-nguyen-60b59922/'
		},
		{
			name: 'Hanh Mai',
			title: 'Chief Executive Officer',
			image: HanhMaiImage,
			linkedIn: 'https://www.linkedin.com/in/hanhmaihhm'
		},
		{
			name: 'Van Le',
			title: 'Director of Fundraising and Finance',
			image: VanLeImage,
			linkedIn: 'https://www.linkedin.com/in/van-hong-le'
		},
		{
			name: 'Nhu Vo',
			title: 'Director of Operations',
			image: placeHolderAvatar,
			linkedIn: 'https://linkedin.com/'
		},
		{
			name: 'Tan Phan',
			title: 'Director of Programs',
			image: TanPhanImage,
			linkedIn: 'https://www.linkedin.com/in/tanphanvan'
		}
	];
 
	const advisoryBoard = [
		{
			name: 'Dr. Emily Chen',
			title: 'Technology Advisor',
			image: placeHolderAvatar,
			linkedIn: 'https://linkedin.com/'
		},
		{
			name: 'Michael Brown',
			title: 'Industry Advisor',
			image: placeHolderAvatar,
			linkedIn: 'https://linkedin.com/'
		},
		{
			name: 'Sarah Wilson',
			title: 'Education Advisor',
			image: placeHolderAvatar,
			linkedIn: 'https://linkedin.com/'
		},
		{
			name: 'David Lee',
			title: 'Financial Advisor',
			image: placeHolderAvatar,
			linkedIn: 'https://linkedin.com/'
		}
	];

	const volunteers = [
		{
			name: 'Kevin Nguyen',
			title: 'Volunteer',
			image: placeHolderAvatar,
			linkedIn: 'https://linkedin.com/'
		},
		{
			name: 'Vivian Trang',
			title: 'Volunteer',
			image: placeHolderAvatar,
			linkedIn: 'https://linkedin.com/'
		},
		{
			name: 'Kevin Nguyen',
			title: 'Volunteer',
			image: placeHolderAvatar,
			linkedIn: 'https://linkedin.com/'
		},
		{
			name: 'Vivian Trang',
			title: 'Volunteer',
			image: placeHolderAvatar,
			linkedIn: 'https://linkedin.com/'
		},
	];
</script>

<svelte:head>
	<title>About Us - VietSpark</title>
	<meta
		name="description"
		content="Learn about VietSpark's mission, vision, and the team behind our community."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="bg-primary py-16 text-white">
	<div class="container mx-auto px-4 text-center">
		<h1 class="mb-4 text-4xl font-bold">About VietSpark</h1>
		<p class="mx-auto max-w-3xl text-xl">
			Empowering Vietnamese professionals through education, networking, and community.
		</p>
	</div>
</section>

<!-- History Section -->
<section class="bg-white py-16">
	<div class="container mx-auto px-4">
		<div class="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
			<div>
				<h2 class="mb-6 text-3xl font-bold">Our History</h2>
				<div class="bg-primary mb-6 h-1 w-24"></div>
				<p class="mb-4 text-gray-700">
					Viet Spark was founded in 2020 by a group of passionate US-based Vietnamese MBAs 
					who recognized the need for a platform connecting Vietnamese professionals with the tech industry. 
					Originally known as <em>Vietnamese Business Professionals in Tech</em
					>, our organization has grown into a dynamic community focused on mentorship, 
					knowledge-sharing, and collaboration.
				</p>
				<p class="mb-4 text-gray-700">
					Over the years, we've hosted impactful events, fostered valuable connections, and witnessed our members' growth. 
					From our signature Tech Summit to our empowering Mentorship Program, our journey has been marked by 
					stories of resilience, success, and collective progress.
				</p>
				<p class="text-gray-700">
					Join us as we continue to shape the future of Viet Spark, where passion fuels purpose, 
					and every individual has the opportunity to spark their own success story.
				</p>
			</div>
			<div class="flex h-96 items-center justify-center rounded-lg bg-gray-100 overflow-hidden">
				<!-- Placeholder for history image -->
				<img src={HistoryImage} alt="History" class="object-cover w-full"/>
			</div>
		</div>
	</div>
</section>

<!-- Mission & Vision Section -->
<section class="bg-gray-50 py-16">
	<div class="container mx-auto px-4">
		<div class="grid grid-cols-1 gap-12 md:grid-cols-2">
			<div class="rounded-lg bg-white p-8 shadow-md">
				<div
					class="text-primary mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
				>
					<i class="fas fa-bullseye text-3xl"></i>
				</div>
				<h2 class="mb-4 text-2xl font-bold">Our Mission</h2>
				<p class="text-gray-700">
					Our mission is to inspire, educate, and connect individuals who share a common vision of
					excellence in technology. We strive to create a supportive environment where Vietnamese
					professionals can develop their skills, expand their networks, and achieve their career
					goals in the tech industry.
				</p>
			</div>

			<div class="rounded-lg bg-white p-8 shadow-md">
				<div
					class="text-primary mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
				>
					<i class="fas fa-eye text-3xl"></i>
				</div>
				<h2 class="mb-4 text-2xl font-bold">Our Vision</h2>
				<p class="text-gray-700">
					We aim to empower Vietnamese professionals to take the lead in tech. 
					We envision a future where Vietnamese professionals hold influential leadership roles across the tech industry, 
					bringing their unique perspectives and talents to foster innovation and create lasting, positive change.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Core Values Section -->
<section class="bg-white py-16">
	<div class="container mx-auto px-4">
		<div class="mb-12 text-center">
			<h2 class="mb-4 text-3xl font-bold">Our Core Values</h2>
			<div class="bg-primary mx-auto mb-6 h-1 w-24"></div>
		</div>

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
			<div class="rounded-lg bg-gray-50 p-6 text-center transition-shadow hover:shadow-md">
				<div
					class="text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
				>
					<i class="fas fa-briefcase text-2xl"></i>
				</div>
				<h3 class="mb-2 text-xl font-bold">Professionalism</h3>
				<p class="text-gray-600">We uphold high standards in all our interactions and endeavors.</p>
			</div>

			<div class="rounded-lg bg-gray-50 p-6 text-center transition-shadow hover:shadow-md">
				<div
					class="text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
				>
					<i class="fas fa-book text-2xl"></i>
				</div>
				<h3 class="mb-2 text-xl font-bold">Knowledge</h3>
				<p class="text-gray-600">We value continuous learning and the pursuit of expertise.</p>
			</div>

			<div class="rounded-lg bg-gray-50 p-6 text-center transition-shadow hover:shadow-md">
				<div
					class="text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
				>
					<i class="fas fa-hands-helping text-2xl"></i>
				</div>
				<h3 class="mb-2 text-xl font-bold">Sharing</h3>
				<p class="text-gray-600">We believe in generously sharing insights and opportunities.</p>
			</div>

			<div class="rounded-lg bg-gray-50 p-6 text-center transition-shadow hover:shadow-md">
				<div
					class="text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
				>
					<i class="fas fa-handshake text-2xl"></i>
				</div>
				<h3 class="mb-2 text-xl font-bold">Trust</h3>
				<p class="text-gray-600">We foster relationships built on integrity and mutual respect.</p>
			</div>

			<div class="rounded-lg bg-gray-50 p-6 text-center transition-shadow hover:shadow-md">
				<div
					class="text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
				>
					<i class="fas fa-users text-2xl"></i>
				</div>
				<h3 class="mb-2 text-xl font-bold">Diversity</h3>
				<p class="text-gray-600">We celebrate diverse perspectives and inclusive collaboration.</p>
			</div>
		</div>
	</div>
</section>

<!-- What We Do Section -->
<section class="bg-gray-50 py-16">
	<div class="container mx-auto px-4">
		<div class="mb-12 text-center">
			<h2 class="mb-4 text-3xl font-bold">What We Do</h2>
			<div class="bg-primary mx-auto mb-6 h-1 w-24"></div>
			<p class="mx-auto mb-8 max-w-3xl text-lg text-gray-600">
				We help Vietnamese professionals in the U.S. who demonstrate their commitment to learning,
				growing and paying it forward to come together through three pillars.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			<div class="rounded-lg bg-white p-8 shadow-md">
				<div
					class="text-primary mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
				>
					<i class="fas fa-rocket text-2xl"></i>
				</div>
				<h3 class="mb-4 text-xl font-bold">Career Development</h3>
				<p class="mb-4 text-gray-700">
					Provide educational events and mentoring program to help members land a job in tech or
					advance their career.
				</p>
				<ul class="list-inside list-disc space-y-2 text-gray-600">
					<li>Resume workshops and career coaching</li>
					<li>Technical skill development sessions</li>
					<li>Interview preparation and practice</li>
					<li>Personalized mentorship opportunities</li>
				</ul>
			</div>

			<div class="rounded-lg bg-white p-8 shadow-md">
				<div
					class="text-primary mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
				>
					<i class="fas fa-users text-2xl"></i>
				</div>
				<h3 class="mb-4 text-xl font-bold">Bonding</h3>
				<p class="mb-4 text-gray-700">
					Accelerate a sharing community, a go-to place to ask questions, share perspectives on Tech
					news/trends, or to look for partners.
				</p>
				<ul class="list-inside list-disc space-y-2 text-gray-600">
					<li>Community forums and discussion groups</li>
					<li>Tech trend analysis and discussions</li>
					<li>Collaborative problem-solving</li>
					<li>Social events and cultural celebrations</li>
				</ul>
			</div>

			<div class="rounded-lg bg-white p-8 shadow-md">
				<div
					class="text-primary mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
				>
					<i class="fas fa-handshake text-2xl"></i>
				</div>
				<h3 class="mb-4 text-xl font-bold">Networking</h3>
				<p class="mb-4 text-gray-700">
					Provide networking opportunities to senior employees in Tech companies for industry
					insights, company insights or job referrals.
				</p>
				<ul class="list-inside list-disc space-y-2 text-gray-600">
					<li>Industry-specific networking events</li>
					<li>Company tours and information sessions</li>
					<li>Professional mixers and meetups</li>
					<li>Job fairs and recruitment partnerships</li>
				</ul>
			</div>
		</div>
	</div>
</section>

<!-- Board of Directors Section -->
<section class="bg-gray-50 py-16">
	<div class="container mx-auto px-4">
		<div class="mb-12 text-center">
			<h2 class="mb-4 text-3xl font-bold">Board of Directors</h2>
			<div class="bg-primary mx-auto mb-6 h-1 w-24"></div>
		</div>

		<div class="flex w-full item-center justify-center gap-6">
			{#each boardMembers.slice(0,2) as member}
				<div class="rounded-lg bg-white p-6 text-center shadow-md w-130">
					<img
						src={member.image}
						alt={member.name}
						class="mx-auto mb-4 h-32 w-32 rounded-full object-cover"
					/>
					<h3 class="mb-1 text-xl font-bold">{member.name}</h3>
					<p class="mb-3 text-gray-600">{member.title}</p>
					<a
						href={member.linkedIn}
						target="_blank"
						rel="noopener noreferrer"
						class="text-primary hover:text-primary-dark"
						aria-label={`${member.name}'s LinkedIn profile`}
					>
						<i class="fab fa-linkedin text-xl"></i>
					</a>
				</div>
			{/each}
		</div>

		<div class="mt-6"></div>

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each boardMembers.slice(2,5) as member}
				<div class="rounded-lg bg-white p-6 text-center shadow-md">
					<img
						src={member.image}
						alt={member.name}
						class="mx-auto mb-4 h-32 w-32 rounded-full object-cover"
					/>
					<h3 class="mb-1 text-xl font-bold">{member.name}</h3>
					<p class="mb-3 text-gray-600">{member.title}</p>
					<a
						href={member.linkedIn}
						target="_blank"
						rel="noopener noreferrer"
						class="text-primary hover:text-primary-dark"
						aria-label={`${member.name}'s LinkedIn profile`}
					>
						<i class="fab fa-linkedin text-xl"></i>
					</a>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Advisory Board Section -->
<section class="bg-white py-16">
	<div class="container mx-auto px-4">
		<div class="mb-12 text-center">
			<h2 class="mb-4 text-3xl font-bold">Advisory Board</h2>
			<div class="bg-primary mx-auto mb-6 h-1 w-24"></div>
		</div>

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each advisoryBoard as member}
				<div class="rounded-lg bg-gray-50 p-6 text-center shadow-sm">
					<img
						src={member.image}
						alt={member.name}
						class="mx-auto mb-4 h-32 w-32 rounded-full object-cover"
					/>
					<h3 class="mb-1 text-xl font-bold">{member.name}</h3>
					<p class="mb-3 text-gray-600">{member.title}</p>
					<a
						href={member.linkedIn}
						target="_blank"
						rel="noopener noreferrer"
						class="text-primary hover:text-primary-dark"
						aria-label={`${member.name}'s LinkedIn profile`}
					>
						<i class="fab fa-linkedin text-xl"></i>
					</a>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Volunteers Section -->
<section class="bg-white py-16">
	<div class="container mx-auto px-4">
		<div class="mb-12 text-center">
			<h2 class="mb-4 text-3xl font-bold">Volunteers</h2>
			<div class="bg-primary mx-auto mb-6 h-1 w-24"></div>
		</div>

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each volunteers as member}
				<div class="rounded-lg bg-gray-50 p-6 text-center shadow-sm">
					<img
						src={member.image}
						alt={member.name}
						class="mx-auto mb-4 h-32 w-32 rounded-full object-cover"
					/>
					<h3 class="mb-1 text-xl font-bold">{member.name}</h3>
					<p class="mb-3 text-gray-600">{member.title}</p>
					<a
						href={member.linkedIn}
						target="_blank"
						rel="noopener noreferrer"
						class="text-primary hover:text-primary-dark"
						aria-label={`${member.name}'s LinkedIn profile`}
					>
						<i class="fab fa-linkedin text-xl"></i>
					</a>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="bg-primary py-16 text-white">
	<div class="container mx-auto px-4 text-center">
		<h2 class="mb-4 text-3xl font-bold">Join Us in Making a Difference</h2>
		<p class="mx-auto mb-8 max-w-2xl text-xl">
			Whether you're looking to advance your own career or help others grow, there's a place for you
			in our community.
		</p>
		<div class="flex flex-wrap justify-center gap-4">
			<a href="/work-with-us" class="btn text-primary bg-white hover:bg-gray-100"
				>Volunteer With Us</a
			>
			<a
				href="/donate"
				class="btn hover:text-primary border-2 border-white bg-transparent hover:bg-white"
				>Support Our Mission</a
			>
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
