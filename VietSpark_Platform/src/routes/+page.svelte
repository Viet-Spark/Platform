<script>
	import { onMount } from 'svelte';
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcomeFallback from '$lib/images/svelte-welcome.png';
	import Login from '$lib/components/Login.svelte';
	import UserProfile from '$lib/components/UserProfile.svelte';
	import { authUser } from '$lib/stores/authStore';

	import TechSummitImage from '$lib/images/Events/TechSummitImage.JPG';
	import TechSummit2025Image from '$lib/images/Events/2025/TechSummit2025Image.jpg';
	import AgendaBG from '$lib/images/Events/2026/agenda_bg.png';
	import AgendaDay0Image from '$lib/images/Events/2026/IMG_0064.jpg';
	import AgendaDay1Image1 from '$lib/images/Events/2026/IMG_4053.jpg';
	import AgendaDay1Image2 from '$lib/images/Events/2026/DSC05676.jpg';
	import AgendaDay1Image3 from '$lib/images/Events/2026/DSC06080.jpg';
	import AgendaDay2Image1 from '$lib/images/Events/2026/A6.jpg';
	import AgendaDay2Image2 from '$lib/images/Events/2026/B12.jpg';
	import AgendaDay2Image3 from '$lib/images/Events/2026/DSC06204.jpg';
	import TechSummit2026Hero from '$lib/images/Events/2026/VS_Homepage_Hero_2025.png';
	import TS26Logo from '$lib/images/Events/2026/TS26_Logo.png';
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
	let selectedAgendaDay = 'day0';
	let activeCta = 'waitlist';
	let isWaitlistModalOpen = false;
	let isWaitlistSubmitting = false;
	let waitlistSuccessMessage = '';
	let waitlistErrorMessage = '';
	let isMentorModalOpen = false;
	let isMentorSubmitting = false;
	let mentorSuccessMessage = '';
	let mentorErrorMessage = '';
	let isVolunteerModalOpen = false;
	let isVolunteerSubmitting = false;
	let volunteerSuccessMessage = '';
	let volunteerErrorMessage = '';
	let isCareerStatusDropdownOpen = false;
	let isInterestAreaDropdownOpen = false;
	const careerStatusOptions = [
		'Student',
		'New grad',
		'Early career (0-3 years)',
		'Manager / Leadership',
		'Other'
	];
	const interestAreaOptions = [
		'Job & Referral Opportunities',
		'Networking & Community Building',
		'Mentorship & Professional Growth',
		'AI Trends, Innovation & Industry Insights',
		'Other'
	];
	const mentorBayAreaOptions = [
		'Yes — I am currently based in the Bay Area',
		'Yes — I will be traveling to the Bay Area for the event',
		'I am interested in participating virtually if opportunities are available'
	];
	const mentorContributionOptions = [
		'Mentorship & Career Guidance',
		'Speaking Opportunities / Panel Participation',
		'Informal Networking & Dinner Conversations',
		'Mock Interviews & Referrals',
		'Resume Reviews & Professional Development Support'
	];
	const volunteerContributionOptions = [
		'Design & Creative Support',
		'Marketing & Social Media',
		'Content Creation',
		'Community Engagement & Guest Experience',
		'Photography / Videography',
		'Event Operations & Logistics'
	];
	let waitlistFieldErrors = {
		name: '',
		email: '',
		careerStatus: '',
		interestArea: ''
	};
	let mentorFieldErrors = {
		name: '',
		email: '',
		company: '',
		titleRole: '',
		bayAreaStatus: '',
		contributions: ''
	};
	let volunteerFieldErrors = {
		name: '',
		email: '',
		organization: '',
		careerStatus: '',
		contributions: '',
		bayAreaStatus: ''
	};
	let waitlistForm = {
		name: '',
		email: '',
		careerStatus: '',
		careerStatusOther: '',
		interestArea: '',
		interestAreaOther: ''
	};
	let mentorForm = {
		name: '',
		email: '',
		company: '',
		titleRole: '',
		bayAreaStatus: '',
		contributions: []
	};
	let volunteerForm = {
		name: '',
		email: '',
		organization: '',
		careerStatus: '',
		contributions: [],
		bayAreaStatus: ''
	};

	$: if ($eventStore.events) {
		upcomingEvents.set(
			$eventStore.events
				.filter((event) => {
					const now = new Date();
					const eventDate = new Date(event.eventDate.start.seconds * 1000);

					return eventDate >= now;
				})
				.sort((a, b) => new Date(b.date) - new Date(a.date))
		);
	}

	function formatDate(timestamp) {
		if (!timestamp || !timestamp.seconds) return '';
		return new Date(timestamp.seconds * 1000).toLocaleDateString();
	}

	function openWaitlistModal() {
		activeCta = 'waitlist';
		waitlistSuccessMessage = '';
		waitlistErrorMessage = '';
		isCareerStatusDropdownOpen = false;
		isInterestAreaDropdownOpen = false;
		isWaitlistModalOpen = true;
	}

	function closeWaitlistModal() {
		isCareerStatusDropdownOpen = false;
		isInterestAreaDropdownOpen = false;
		isWaitlistModalOpen = false;
	}

	function openMentorModal() {
		activeCta = 'mentor';
		mentorSuccessMessage = '';
		mentorErrorMessage = '';
		resetMentorForm();
		resetMentorFieldErrors();
		isMentorModalOpen = true;
	}

	function selectVolunteerCta() {
		activeCta = 'volunteer';
	}

	function openVolunteerModal() {
		activeCta = 'volunteer';
		volunteerSuccessMessage = '';
		volunteerErrorMessage = '';
		resetVolunteerForm();
		resetVolunteerFieldErrors();
		isVolunteerModalOpen = true;
	}

	function closeVolunteerModal() {
		isVolunteerModalOpen = false;
	}

	function closeMentorModal() {
		isMentorModalOpen = false;
	}

	function resetWaitlistForm() {
		waitlistForm = {
			name: '',
			email: '',
			careerStatus: '',
			careerStatusOther: '',
			interestArea: '',
			interestAreaOther: ''
		};
	}

	function resetWaitlistFieldErrors() {
		waitlistFieldErrors = {
			name: '',
			email: '',
			careerStatus: '',
			interestArea: ''
		};
	}

	function resetMentorForm() {
		mentorForm = {
			name: '',
			email: '',
			company: '',
			titleRole: '',
			bayAreaStatus: '',
			contributions: []
		};
	}

	function resetMentorFieldErrors() {
		mentorFieldErrors = {
			name: '',
			email: '',
			company: '',
			titleRole: '',
			bayAreaStatus: '',
			contributions: ''
		};
	}

	function resetVolunteerForm() {
		volunteerForm = {
			name: '',
			email: '',
			organization: '',
			careerStatus: '',
			contributions: [],
			bayAreaStatus: ''
		};
	}

	function resetVolunteerFieldErrors() {
		volunteerFieldErrors = {
			name: '',
			email: '',
			organization: '',
			careerStatus: '',
			contributions: '',
			bayAreaStatus: ''
		};
	}

	function handleWindowKeydown(event) {
		if (event.key === 'Escape' && isWaitlistModalOpen) {
			closeWaitlistModal();
		}
		if (event.key === 'Escape' && isMentorModalOpen) {
			closeMentorModal();
		}
		if (event.key === 'Escape' && isVolunteerModalOpen) {
			closeVolunteerModal();
		}
	}

	function selectCareerStatus(option) {
		waitlistForm.careerStatus = option;
		if (option !== 'Other') {
			waitlistForm.careerStatusOther = '';
		}
		waitlistFieldErrors.careerStatus = '';
		isCareerStatusDropdownOpen = false;
	}

	function selectInterestArea(option) {
		waitlistForm.interestArea = option;
		if (option !== 'Other') {
			waitlistForm.interestAreaOther = '';
		}
		waitlistFieldErrors.interestArea = '';
		isInterestAreaDropdownOpen = false;
	}

	function toggleMentorContribution(option) {
		if (mentorForm.contributions.includes(option)) {
			mentorForm = {
				...mentorForm,
				contributions: mentorForm.contributions.filter((value) => value !== option)
			};
		} else {
			mentorForm = {
				...mentorForm,
				contributions: [...mentorForm.contributions, option]
			};
		}

		mentorFieldErrors.contributions = '';
	}

	function toggleVolunteerContribution(option) {
		if (volunteerForm.contributions.includes(option)) {
			volunteerForm = {
				...volunteerForm,
				contributions: volunteerForm.contributions.filter((value) => value !== option)
			};
		} else {
			volunteerForm = {
				...volunteerForm,
				contributions: [...volunteerForm.contributions, option]
			};
		}

		volunteerFieldErrors.contributions = '';
	}

	async function handleWaitlistSubmit() {
		waitlistSuccessMessage = '';
		waitlistErrorMessage = '';
		resetWaitlistFieldErrors();

		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!waitlistForm.name.trim()) {
			waitlistFieldErrors.name = 'Name is required.';
		}

		if (!waitlistForm.email.trim()) {
			waitlistFieldErrors.email = 'Email is required.';
		} else if (!emailPattern.test(waitlistForm.email.trim())) {
			waitlistFieldErrors.email = 'Please enter a valid email address.';
		}

		if (!waitlistForm.careerStatus.trim()) {
			waitlistFieldErrors.careerStatus = 'Current career status is required.';
		} else if (waitlistForm.careerStatus === 'Other' && !waitlistForm.careerStatusOther.trim()) {
			waitlistFieldErrors.careerStatus = 'Please enter your current career status.';
		}

		if (!waitlistForm.interestArea.trim()) {
			waitlistFieldErrors.interestArea = 'Interest area is required.';
		} else if (waitlistForm.interestArea === 'Other' && !waitlistForm.interestAreaOther.trim()) {
			waitlistFieldErrors.interestArea = 'Please enter your area of interest.';
		}

		if (Object.values(waitlistFieldErrors).some(Boolean)) {
			return;
		}

		isWaitlistSubmitting = true;

		try {
			const response = await fetch('/api/waitlist', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					...waitlistForm,
					careerStatus:
						waitlistForm.careerStatus === 'Other'
							? waitlistForm.careerStatusOther.trim()
							: waitlistForm.careerStatus,
					interestArea:
						waitlistForm.interestArea === 'Other'
							? waitlistForm.interestAreaOther.trim()
							: waitlistForm.interestArea
				})
			});

			const data = await response.json();

			if (!response.ok) {
				waitlistErrorMessage = data.message || 'Something went wrong while submitting.';
				return;
			}

			waitlistSuccessMessage = data.message || "You're on the waitlist. We'll keep you posted.";
			resetWaitlistForm();
		} catch (error) {
			console.error('Waitlist submit failed:', error);
			waitlistErrorMessage = 'Something went wrong while submitting.';
		} finally {
			isWaitlistSubmitting = false;
		}
	}

	async function handleMentorSubmit() {
		mentorSuccessMessage = '';
		mentorErrorMessage = '';
		resetMentorFieldErrors();

		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!mentorForm.name.trim()) {
			mentorFieldErrors.name = 'Full name is required.';
		}

		if (!mentorForm.email.trim()) {
			mentorFieldErrors.email = 'Email is required.';
		} else if (!emailPattern.test(mentorForm.email.trim())) {
			mentorFieldErrors.email = 'Please enter a valid email address.';
		}

		if (!mentorForm.company.trim()) {
			mentorFieldErrors.company = 'Company is required.';
		}

		if (!mentorForm.titleRole.trim()) {
			mentorFieldErrors.titleRole = 'Title / Role is required.';
		}

		if (!mentorForm.bayAreaStatus.trim()) {
			mentorFieldErrors.bayAreaStatus = 'Please select an option.';
		}

		if (!mentorForm.contributions.length) {
			mentorFieldErrors.contributions = 'Please select at least one contribution area.';
		}

		if (Object.values(mentorFieldErrors).some(Boolean)) {
			return;
		}

		isMentorSubmitting = true;

		try {
			const response = await fetch('/api/mentor', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: mentorForm.name.trim(),
					email: mentorForm.email.trim(),
					company: mentorForm.company.trim(),
					titleRole: mentorForm.titleRole.trim(),
					bayAreaStatus: mentorForm.bayAreaStatus,
					contributions: mentorForm.contributions
				})
			});

			const data = await response.json();

			if (!response.ok) {
				mentorErrorMessage = data.message || 'Something went wrong while submitting.';
				return;
			}

			mentorSuccessMessage = data.message || "Thanks for your interest. We'll be in touch soon.";
			resetMentorForm();
			resetMentorFieldErrors();
		} catch (error) {
			console.error('Mentor submit failed:', error);
			mentorErrorMessage = 'Something went wrong while submitting.';
		} finally {
			isMentorSubmitting = false;
		}
	}

	async function handleVolunteerSubmit() {
		volunteerSuccessMessage = '';
		volunteerErrorMessage = '';
		resetVolunteerFieldErrors();

		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!volunteerForm.name.trim()) {
			volunteerFieldErrors.name = 'Full name is required.';
		}

		if (!volunteerForm.email.trim()) {
			volunteerFieldErrors.email = 'Email is required.';
		} else if (!emailPattern.test(volunteerForm.email.trim())) {
			volunteerFieldErrors.email = 'Please enter a valid email address.';
		}

		if (!volunteerForm.organization.trim()) {
			volunteerFieldErrors.organization = 'University / Company is required.';
		}

		if (!volunteerForm.careerStatus.trim()) {
			volunteerFieldErrors.careerStatus = 'Please select your current career status.';
		}

		if (!volunteerForm.contributions.length) {
			volunteerFieldErrors.contributions = 'Please select at least one contribution area.';
		}

		if (!volunteerForm.bayAreaStatus.trim()) {
			volunteerFieldErrors.bayAreaStatus = 'Please select an option.';
		}

		if (Object.values(volunteerFieldErrors).some(Boolean)) {
			return;
		}

		isVolunteerSubmitting = true;

		try {
			const response = await fetch('/api/volunteer', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: volunteerForm.name.trim(),
					email: volunteerForm.email.trim(),
					organization: volunteerForm.organization.trim(),
					careerStatus: volunteerForm.careerStatus,
					contributions: volunteerForm.contributions,
					bayAreaStatus: volunteerForm.bayAreaStatus
				})
			});

			const data = await response.json();

			if (!response.ok) {
				volunteerErrorMessage =
					data.message || 'Something went wrong while submitting your volunteer form.';
				return;
			}

			volunteerSuccessMessage = data.message || "Thanks for your interest. We'll be in touch soon.";
			resetVolunteerForm();
			resetVolunteerFieldErrors();
		} catch (error) {
			console.error('Volunteer submit failed:', error);
			volunteerErrorMessage = 'Something went wrong while submitting your volunteer form.';
		} finally {
			isVolunteerSubmitting = false;
		}
	}

	const summitHighlights = [
		{
			id: 'learn-from-the-best',
			title: 'Learn from the best',
			description:
				'Hear from senior engineers, founders, and operators driving the next wave of AI - practical insights, not platitudes.',
			icon: 'lightbulb'
		},
		{
			id: 'build-meaningful-relationships',
			title: 'Build meaningful relationships',
			description:
				'Curated networking, mentorship, dinners, mixers, and community experiences designed for real connection.',
			icon: 'relationships'
		},
		{
			id: 'accelerate-your-career',
			title: 'Accelerate your career',
			description:
				'Meet recruiters, hiring managers, mentors, founders, and operators across the tech ecosystem.',
			icon: 'trend'
		},
		{
			id: 'discover-new-opportunities',
			title: 'Discover new opportunities',
			description:
				'Explore where AI is creating entirely new industries, business models, and career paths.',
			icon: 'search'
		}
	];

	const summitAgendaDays = [
		{
			id: 'day0',
			month: 'Aug',
			day: '06',
			title: 'Pre-event Dinner',
			subtitle: 'Thursday · August 6 · Day 0',
			tag: 'Pre-event dinner',
			label: 'Day 0',
			dateLine: 'Thursday, August 6 · Silicon Valley',
			images: [AgendaDay0Image],
			description:
				'Join intimate dinner conversations with professionals from leading tech companies and hear firsthand stories about how they landed their roles, navigated career growth, and built successful paths in tech.',
			schedule: [
				{
					time: '6:00 PM – 9:00 PM',
					title: 'Founders & Operators Dinner',
					description:
						'Small-group conversations with senior tech leaders from Vietnamese-American backgrounds. Limited seats.'
				}
			]
		},
		{
			id: 'day1',
			month: 'Aug',
			day: '07',
			title: 'Industry Day',
			subtitle: 'Friday · August 7 · Day 1',
			tag: 'Industry day',
			label: 'Day 1',
			dateLine: 'Friday, August 7, 2026 · Silicon Valley',
			images: [AgendaDay1Image1, AgendaDay1Image2, AgendaDay1Image3],
			description:
				'Go behind the scenes at top tech companies. Meet recruiters, see how AI is being built in production, and close the day with the Vietnam AI Stars Grand Finale.',
			schedule: [
				{
					time: '9:00 AM – 1:00 PM',
					title: 'Company Visits · Inside the Giants',
					description: 'Curated tours and engineering sessions at host companies across the Valley.'
				},
				{
					time: '2:00 PM – 4:00 PM',
					title: 'Recruitment Tables',
					description:
						'Direct conversations with hiring managers and recruiters across engineering, product, and research.'
				},
				{
					time: '4:00 PM – 6:00 PM',
					title: 'Vietnam AI Stars · Grand Finale',
					description: 'Top Vietnamese AI startups pitch live. Demos, judges, and a community vote.'
				},
				{
					time: '7:00 PM – 10:00 PM',
					title: 'Welcome Mixer',
					description:
						'Food, entertainment, and games — unwind, connect, and kick off the summit energy.'
				}
			]
		},
		{
			id: 'day2',
			month: 'Aug',
			day: '08',
			title: 'Main Conference',
			subtitle: 'Saturday · August 8 · Day 2',
			tag: 'Main conference',
			label: 'Day 2',
			dateLine: 'Saturday, August 8 · Silicon Valley',
			images: [AgendaDay2Image1, AgendaDay2Image2, AgendaDay2Image3],
			description:
				'The mainstage day. Keynotes, panels, speed mentoring, and crossroads sessions designed for working professionals serious about their next move.',
			schedule: [
				{
					time: '8:00 AM – 9:00 AM',
					title: 'Registration & Breakfast',
					description: 'Pick up your badge, grab coffee, settle in.'
				},
				{
					time: '9:00 AM – 12:00 PM',
					title: 'Keynotes & Panel Discussion',
					description:
						"Leaders shaping the AI era share what's coming next and how to position yourself for it."
				},
				{
					time: '12:00 PM – 1:00 PM',
					title: 'Lunch & Connect',
					description: 'Themed tables organized by company, function, and career stage.'
				},
				{
					time: '1:00 PM – 2:00 PM',
					title: 'Speed Mentoring',
					description: 'Short, focused 1:1 sessions with mentors hand-matched to your goals.'
				},
				{
					time: '2:00 PM – 5:00 PM',
					title: 'Crossroads Sessions',
					description:
						'Three tracks: Wealth Building, Career Strategy, and Growth Tactics. Pick your path.'
				},
				{
					time: '6:00 PM – 9:00 PM',
					title: 'Evening Dinner · Conversations Beyond the Stage',
					description:
						'Closing dinner, deeper conversations off the main stage with the people you met.'
				}
			]
		}
	];

	const agendaImageSources = summitAgendaDays.flatMap((day) => day.images);

	onMount(() => {
		const preloadedImages = agendaImageSources.map((src) => {
			const image = new Image();
			image.src = src;
			image.decode?.().catch(() => {});
			return image;
		});

		return () => {
			preloadedImages.length = 0;
		};
	});

	$: selectedAgenda =
		summitAgendaDays.find((item) => item.id === selectedAgendaDay) ?? summitAgendaDays[0];
</script>

<svelte:window on:keydown={handleWindowKeydown} />

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
			<div
				class="border-primary inline-block h-12 w-12 animate-spin rounded-full border-t-2 border-b-2"
			></div>
			<p class="mt-4 text-gray-600">Loading Home Page...</p>
		</div>
	</div>
{:else}
	<!-- Hero Section -->
	<section
		class="hero-section relative overflow-hidden text-white"
		style="min-height: 720px; background-image:url({TechSummit2026Hero}); background-size: cover; background-position: center;"
	>
		<div class="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/75"></div>
		<div
			class="relative z-10 container mx-auto flex min-h-[720px] items-end px-4 pt-24 pb-16 sm:pt-28 sm:pb-20"
		>
			<div>
				<div class="mb-2 flex items-center gap-3">
					<img src={TS26Logo} alt="Vietnam Tech Summit 2026 logo" class="h-auto w-15" />
					<div>
						<p class="text-gray-97 text-base uppercase">2026 Vietnam</p>
						<span class="text-2xl font-semibold text-white uppercase">Tech Summit</span>
					</div>
				</div>
				<p class="text-[88px] leading-none font-normal tracking-[-0.27px] text-white">
					Build Your Edge in the
					<span
						class="inline-block bg-clip-text text-transparent"
						style="background-image: linear-gradient(172.27deg, #43F7EB 15.48%, #57D7EB 25.18%, #7B9FEB 44.6%, #9577EB 61.86%, #A55EEB 74.8%, #AB55EC 82.35%);"
					>
						AI Era
					</span>
				</p>
				<p class="mt-2 text-base text-white/90">
					Two days of ideas, strategy, mentorship, and meaningful connections shaping the future of
					tech careers.
				</p>
				<div class="mt-8 flex flex-wrap gap-4 hover:cursor-pointer">
					<button
						type="button"
						on:click={openWaitlistModal}
						class="inline-flex items-center rounded-2xl bg-[#0B57BD] px-8 py-4 text-lg font-semibold text-white"
						style="background: linear-gradient(135.47deg, #4F69F6 0.65%, #7133BD 62.01%, #EA7277 118.82%);"
					>
						Join the Waitlist
						<span class="ml-2 text-[#90FFF4]">→</span>
					</button>
					<div
						href="/events/tech-summit"
						class="inline-flex items-center rounded-2xl border border-white/35 bg-black/20 px-6 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/30"
					>
						<i class="far fa-calendar mr-3"></i>
						Early Tickets · 06/15/2026
					</div>
					<!-- {#if !$authUser}
						<a
							href="/work-with-us"
							class="btn hover:text-primary border-2 border-white bg-transparent hover:bg-white"
						>
							Join Us
						</a>
					{:else}
						<a
							href="/work-with-us"
							class="btn hover:text-primary border-2 border-white bg-transparent text-white transition-all hover:bg-white"
						>
							Work With Us
						</a>
					{/if}  -->
				</div>
				<p class="mt-3 text-base text-white/90">
					✦ Free admission opportunities for waitlist entries
				</p>
			</div>
		</div>
	</section>
	<section
		class="overflow-hidden py-24 text-white"
		style="background-color: #000000; background-image: url({AgendaBG}), radial-gradient(50% 50% at 50% 50%, #50277C 0%, #000000 100%); background-size: contain, cover; background-position: center 82%, center; background-repeat: no-repeat;"
	>
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-5xl text-center">
				<div class="text-[14px] font-bold tracking-[1.92px] text-white/90 uppercase">Agenda</div>
				<div class="mt-6 text-[40px] leading-tight font-extrabold text-white">
					A multi-day experience connecting industry leaders &amp; emerging talent
				</div>
				<div class="mx-auto mt-5 max-w-3xl text-[18px] leading-[1.55] text-white/80 md:text-[20px]">
					Designed to inspire, connect, and engage. The full schedule will be available closer to
					the event.
				</div>
			</div>

			<div
				class="mx-auto mt-16 grid max-w-7xl gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start"
			>
				<div class="space-y-4">
					{#each summitAgendaDays as agendaDay (agendaDay.id)}
						<button
							type="button"
							class={`flex min-h-[82px] w-[280px] items-center gap-3.5 rounded-2xl border px-4 py-4 text-left hover:cursor-pointer ${
								selectedAgendaDay === agendaDay.id
									? 'border-[#50277C] bg-[#50277C] text-white'
									: 'border-white/15 bg-white text-black'
							}`}
							on:click={() => (selectedAgendaDay = agendaDay.id)}
						>
							<div
								class={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl ${
									selectedAgendaDay === agendaDay.id ? 'bg-[#D3BBF7]' : 'bg-[#DFECFF]'
								}`}
							>
								<p
									class={`text-[12px] tracking-[0.08em] uppercase ${
										selectedAgendaDay === agendaDay.id ? 'text-white' : 'text-[#1559C2]'
									}`}
								>
									{agendaDay.month}
								</p>
								<div
									class={`text-[14.5px] leading-none font-[500] ${
										selectedAgendaDay === agendaDay.id ? 'text-white' : 'text-[#1559C2]'
									}`}
								>
									{agendaDay.day}
								</div>
							</div>
							<div>
								<div class="text-[15px] font-bold text-inherit">
									{agendaDay.title}
								</div>
								<p
									class={`mt-1 text-[12.5px] ${
										selectedAgendaDay === agendaDay.id ? 'text-white/85' : 'text-[#5A6478]'
									}`}
								>
									{agendaDay.subtitle}
								</p>
							</div>
						</button>
					{/each}
				</div>

				<div
					class="rounded-[28px] border border-[#D7E2F0] bg-white p-6 text-[#101828] shadow-[0_24px_60px_rgba(3,8,20,0.18)] md:p-8"
				>
					<div
						class="inline-flex rounded-full bg-[#E9EFF8] px-3 py-2 text-[12px] font-bold tracking-[1.6px] text-[#1559C2] uppercase"
					>
						{selectedAgenda.tag}
					</div>
					<div class="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
						<div class="text-2xl leading-none font-bold text-[#0E1726]">
							{selectedAgenda.label}
						</div>
						<div class="text-[16px] font-semibold text-[#344054]">
							{selectedAgenda.dateLine}
						</div>
					</div>

					{#if selectedAgenda.images.length === 1}
						<div class="mt-5 overflow-hidden rounded-2xl">
							<img
								src={selectedAgenda.images[0]}
								alt={selectedAgenda.title}
								loading="eager"
								fetchpriority="high"
								class="h-[260px] w-full object-cover md:h-[360px]"
							/>
						</div>
					{:else}
						<div class="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
							{#each selectedAgenda.images as agendaImage, imageIndex (imageIndex)}
								<div class="overflow-hidden rounded-2xl">
									<img
										src={agendaImage}
										alt={`${selectedAgenda.title} photo ${imageIndex + 1}`}
										loading="eager"
										fetchpriority="high"
										class="h-[220px] w-full object-cover md:h-[180px]"
									/>
								</div>
							{/each}
						</div>
					{/if}

					<div class="mt-5 max-w-4xl text-[16px] leading-[1.7] text-[#667085] md:text-[18px]">
						{selectedAgenda.description}
					</div>

					<div class="mt-8 divide-y divide-[#E4E7EC]">
						{#each selectedAgenda.schedule as session (session.title)}
							<div class="grid gap-3 py-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-6">
								<div class="text-[18px] font-semibold text-[#1559C2]">{session.time}</div>
								<div>
									<div class="text-[18px] font-semibold text-[#15213A]">{session.title}</div>
									<div class="mt-2 text-[16px] leading-[1.7] text-[#667085]">
										{session.description}
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
			<div class="mx-auto mt-24 max-w-5xl text-center">
				<div class="text-[14px] font-bold tracking-[1.92px] text-white/90 uppercase">
					More Than An Event
				</div>
				<div class="mt-3 text-[40px] leading-tight font-extrabold text-white">
					Connections made to last
				</div>
			</div>

			<div class="mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-5">
				<div class="rounded-[24px] border border-[#D7E2F0] bg-white px-7 py-7">
					<div
						class="inline-flex rounded-full bg-[#EEF3F9] px-3 py-2 text-[12px] font-bold tracking-[1.4px] text-[#344054] uppercase"
					>
						Pre-summit experience
					</div>
					<div class="mt-3 text-xl leading-[30px] font-bold text-[#15213A]">
						Build momentum before you arrive
					</div>
					<div class="my-1.5 text-[13.5px] leading-[20.25px] font-semibold text-[#0B57BD]">
						Every Saturday · July 11 – August 1, 2026 · Via Zoom
					</div>
					<div class="text-[14.5px] leading-[22.48px] text-[#667085]">
						A series of virtual networking events, interactive workshops, mock interview labs, and
						strategy sessions designed to build momentum, deepen connections, and prepare attendees
						for the summit experience.
					</div>
				</div>

				<div
					class="rounded-[24px] px-7 py-7 text-white"
					style="background: linear-gradient(88.06deg, #191F4D 19.47%, #2B3A84 43.23%, #32399F 61.21%, #50277C 96.72%);"
				>
					<div
						class="inline-flex rounded-full bg-white/14 px-3 py-2 text-[12px] font-bold tracking-[1.4px] text-white/90 uppercase"
					>
						Beyond the summit
					</div>
					<div class="mt-3 text-xl leading-tight font-bold text-white">
						Networking Hike · Elevated Conversations
					</div>
					<div class="my-1.5 text-[13.5px] leading-[20.25px] font-semibold text-[#B7D4FF]">
						Sunday · August 9, 2026 · Morning
					</div>
					<div class="text-[14.5px] leading-[22.48px] text-white/84">
						Close out the weekend with a refreshing morning hike designed for authentic
						conversation — the kind you don't get in a conference room.
					</div>
				</div>
			</div>
		</div>
	</section>
	<section class="bg-white py-12">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-4xl text-center">
				<div class="text-base font-bold tracking-[1.92px] text-[#0B57BD] uppercase">Why Attend</div>
				<div class="my-3 text-[40px] font-extrabold tracking-tight text-[#15213A]">
					What makes this summit different?
				</div>
				<p class="mx-auto max-w-3xl text-xl leading-relaxed text-[#5A6478]">
					Not just talks. Real access — to people, opportunities, and the rooms where decisions get
					made.
				</p>
			</div>

			<div class="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
				{#each summitHighlights as item (item.id)}
					<div
						class="rounded-[28px] border border-[#D7E2F0] bg-white px-10 py-10 shadow-[0_1px_2px_rgba(16,24,40,0.02)]"
					>
						<div class="flex flex-col gap-6 sm:flex-row sm:items-start">
							<div
								class="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl bg-[#E9EFF8] text-[#1559C2]"
							>
								{#if item.icon === 'lightbulb'}
									<svg
										width="17"
										height="24"
										viewBox="0 0 17 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M5.06921 18.4178H11.5692M6.15254 22.7511H10.4859M8.31921 1.08447C6.77296 1.1554 5.28545 1.6978 4.05647 2.63882C2.8275 3.57983 1.91591 4.8744 1.44416 6.34862C0.972405 7.82285 0.96308 9.40614 1.41743 10.8858C1.87179 12.3655 2.76806 13.6707 3.98587 14.6261V17.3345H12.6525V14.6261C13.8703 13.6707 14.7666 12.3655 15.221 10.8858C15.6753 9.40614 15.666 7.82285 15.1943 6.34862C14.7225 4.8744 13.8109 3.57983 12.5819 2.63882C11.353 1.6978 9.86545 1.1554 8.31921 1.08447Z"
											stroke="#602E9B"
											stroke-width="2.16667"
										/>
									</svg>
								{:else if item.icon === 'relationships'}
									<svg
										width="19"
										height="17"
										viewBox="0 0 19 17"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M18.0994 1.53198L13.7661 5.86532L9.43278 1.53198L5.09945 5.86532L0.766113 1.53198M0.766113 10.1986L5.09945 14.532L9.43278 10.1986L13.7661 14.532L18.0994 10.1986"
											stroke="#602E9B"
											stroke-width="2.16667"
										/>
									</svg>
								{:else if item.icon === 'trend'}
									<svg
										width="21"
										height="26"
										viewBox="0 0 21 26"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M11.9166 2.16675L2.16663 15.1667H9.74996L8.66663 23.8334L18.4166 10.8334H10.8333L11.9166 2.16675Z"
											stroke="#602E9B"
											stroke-width="2.16667"
										/>
									</svg>
								{:else if item.icon === 'search'}
									<svg
										width="26"
										height="26"
										viewBox="0 0 26 26"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M11.9166 19.4999C16.1047 19.4999 19.4999 16.1047 19.4999 11.9166C19.4999 7.72843 16.1047 4.33325 11.9166 4.33325C7.72843 4.33325 4.33325 7.72843 4.33325 11.9166C4.33325 16.1047 7.72843 19.4999 11.9166 19.4999Z"
											stroke="#602E9B"
											stroke-width="2.16667"
										/>
										<path
											d="M22.7499 22.7499L18.0916 18.0916"
											stroke="#602E9B"
											stroke-width="2.16667"
										/>
									</svg>
								{/if}
							</div>
							<div>
								<h3 class="text-xl font-semibold tracking-tight text-[#15213A]">
									{item.title}
								</h3>
								<p class="mt-2 text-base leading-[1.6] text-[#667085]">
									{item.description}
								</p>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<div class="mt-10 flex justify-center">
				<a
					href="https://youtu.be/G5bGnMjbuys?si=MJ2ukyXIQlTE7_Fe"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center justify-center gap-3 rounded-2xl px-[22px] py-[8.5px] text-lg font-semibold text-white"
					style="background: #33105B; text-decoration: none;"
				>
					<span class="text-sm leading-none">▶</span>
					See our 2025 highlights
				</a>
			</div>
		</div>
	</section>
	<section
		class="py-24 text-white"
		style="background: linear-gradient(95.62deg, #000000 5.95%, #2B3A84 66.19%, #50277C 94.04%);"
	>
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-4xl text-center">
				<div class="text-5xl leading-[1.2] font-extrabold text-white">
					Don't just wish you'd been there.
					<br />
					Be there.
				</div>
				<div class="mx-auto mt-6 max-w-2xl text-[18px] text-white">
					Join the waitlist for a chance at free admission, or get involved as a mentor or
					volunteer.
				</div>
				<div class="mt-10 flex flex-wrap items-center justify-center gap-3">
					<button
						type="button"
						on:click={openWaitlistModal}
						class={`inline-flex cursor-pointer items-center justify-center rounded-xl px-5.5 py-3.5 text-base transition-all duration-200 ${
							activeCta === 'waitlist'
								? 'bg-white font-bold text-[#0B57BD] hover:brightness-105'
								: 'border border-white/28 bg-transparent font-semibold text-white hover:border-white/45 hover:bg-white/10 hover:brightness-110'
						}`}
					>
						Join the Waitlist
					</button>
					<button
						type="button"
						on:click={openMentorModal}
						class={`inline-flex cursor-pointer items-center justify-center rounded-xl px-5.5 py-3.5 text-base transition-all duration-200 ${
							activeCta === 'mentor'
								? 'bg-white font-bold text-[#0B57BD] hover:brightness-105'
								: 'border border-white/28 bg-transparent font-semibold text-white hover:border-white/45 hover:bg-white/10 hover:brightness-110'
						}`}
					>
						Join as a Mentor
					</button>
					<button
						type="button"
						on:click={openVolunteerModal}
						class={`inline-flex cursor-pointer items-center justify-center rounded-xl px-5.5 py-3 text-base transition-all duration-200 ${
							activeCta === 'volunteer'
								? 'bg-white font-bold text-[#0B57BD] hover:brightness-105'
								: 'border border-white/28 bg-transparent font-semibold text-white hover:border-white/45 hover:bg-white/10 hover:brightness-110'
						}`}
					>
						Volunteer with Us
					</button>
				</div>
			</div>
		</div>
	</section>

	{#if isWaitlistModalOpen}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-[#020916]/55 px-4 py-8 backdrop-blur-[2px]"
			role="presentation"
			tabindex="-1"
			on:click|self={closeWaitlistModal}
		>
			<div
				id="waitlist-modal"
				class="relative max-h-[90vh] w-full max-w-[500px] overflow-y-auto rounded-[18px] border border-[#D7E2F0] bg-white p-6 shadow-[0_24px_80px_rgba(2,9,22,0.35)]"
				role="dialog"
				tabindex="-1"
				aria-modal="true"
				aria-labelledby="waitlist-modal-title"
			>
				<button
					type="button"
					class="absolute top-5 right-5 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#667085] transition-colors hover:bg-[#F2F4F7] hover:text-[#15213A]"
					aria-label="Close waitlist popup"
					on:click={closeWaitlistModal}
				>
					<svg
						width="18"
						height="18"
						viewBox="0 0 18 18"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5"
							stroke="currentColor"
							stroke-width="1.8"
							stroke-linecap="round"
						/>
					</svg>
				</button>

				<div id="waitlist-modal-title" class="text-2xl font-semibold text-[#15213A]">
					Join the Waitlist
				</div>
				<p class="mt-1 text-base text-[#757575]">for a chance at free admission</p>

				<form class="mt-6 space-y-6" novalidate on:submit|preventDefault={handleWaitlistSubmit}>
					<div>
						<label for="waitlist-name" class="block text-base text-[#1E1E1E]">Name</label>
						<input
							id="waitlist-name"
							type="text"
							bind:value={waitlistForm.name}
							placeholder="Value"
							class="mt-3 h-[40px] w-full rounded-lg border border-[#0B3A8A] px-6 text-base placeholder:text-[#B3B3B3]"
						/>
						{#if waitlistFieldErrors.name}
							<div class="mt-2 text-sm text-red-600">{waitlistFieldErrors.name}</div>
						{/if}
					</div>

					<div>
						<label for="waitlist-email" class="block text-base text-[#1E1E1E]">Email</label>
						<input
							id="waitlist-email"
							type="text"
							inputmode="email"
							bind:value={waitlistForm.email}
							placeholder="Value"
							class="mt-3 h-[40px] w-full rounded-lg border border-[#0B3A8A] px-6 text-base placeholder:text-[#B3B3B3]"
						/>
						{#if waitlistFieldErrors.email}
							<div class="mt-2 text-sm text-red-600">{waitlistFieldErrors.email}</div>
						{/if}
					</div>

					<div>
						<label for="waitlist-career" class="block text-base text-[#1E1E1E]">
							What best describes your current career status
						</label>
						<div class="relative mt-3">
							<button
								id="waitlist-career"
								type="button"
								class="flex h-[40px] w-full items-center justify-between rounded-lg border border-[#0B3A8A] bg-white px-6 text-left text-base text-[#1E1E1E]"
								aria-haspopup="listbox"
								aria-expanded={isCareerStatusDropdownOpen}
								on:click={() => (isCareerStatusDropdownOpen = !isCareerStatusDropdownOpen)}
							>
								<span class={waitlistForm.careerStatus ? 'text-[#1E1E1E]' : 'text-[#B3B3B3]'}>
									{waitlistForm.careerStatus || 'Value'}
								</span>
								<svg
									width="18"
									height="10"
									viewBox="0 0 18 10"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									class={`transition-transform ${isCareerStatusDropdownOpen ? 'rotate-180' : ''}`}
								>
									<path
										d="M2 1.5L9 8.5L16 1.5"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</button>

							{#if isCareerStatusDropdownOpen}
								<div
									class="absolute z-20 mt-3 w-full overflow-hidden rounded-[20px] border border-[#E4E7EC] bg-white shadow-[0_20px_48px_rgba(16,24,40,0.18)]"
									role="listbox"
								>
									{#each careerStatusOptions as option (option)}
										<button
											type="button"
											class="flex min-h-[60px] w-full items-center px-6 text-left text-[16px] text-[#1E1E1E] transition-colors hover:bg-[#F8FAFC]"
											on:click={() => selectCareerStatus(option)}
										>
											{option}
										</button>
									{/each}
								</div>
							{/if}
						</div>

						{#if waitlistForm.careerStatus === 'Other'}
							<input
								id="waitlist-career-other"
								type="text"
								bind:value={waitlistForm.careerStatusOther}
								placeholder="Please specify"
								class="mt-3 h-[40px] w-full rounded-lg border border-[#0B3A8A] px-6 text-base placeholder:text-[#B3B3B3]"
							/>
						{/if}
						{#if waitlistFieldErrors.careerStatus}
							<div class="mt-2 text-sm text-red-600">{waitlistFieldErrors.careerStatus}</div>
						{/if}
					</div>

					<div>
						<label for="waitlist-interest" class="block text-base text-[#1E1E1E]">
							What area you are most interested in?
						</label>
						<div class="relative mt-3">
							<button
								id="waitlist-interest"
								type="button"
								class="flex h-[40px] w-full items-center justify-between rounded-lg border border-[#0B3A8A] bg-white px-6 text-left text-base text-[#1E1E1E]"
								aria-haspopup="listbox"
								aria-expanded={isInterestAreaDropdownOpen}
								on:click={() => (isInterestAreaDropdownOpen = !isInterestAreaDropdownOpen)}
							>
								<span class={waitlistForm.interestArea ? 'text-[#1E1E1E]' : 'text-[#B3B3B3]'}>
									{waitlistForm.interestArea || 'Value'}
								</span>
								<svg
									width="18"
									height="10"
									viewBox="0 0 18 10"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									class={`transition-transform ${isInterestAreaDropdownOpen ? 'rotate-180' : ''}`}
								>
									<path
										d="M2 1.5L9 8.5L16 1.5"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</button>

							{#if isInterestAreaDropdownOpen}
								<div
									class="absolute z-20 mt-3 w-full overflow-hidden rounded-[20px] border border-[#E4E7EC] bg-white shadow-[0_20px_48px_rgba(16,24,40,0.18)]"
									role="listbox"
								>
									{#each interestAreaOptions as option (option)}
										<button
											type="button"
											class="flex min-h-[60px] w-full items-center px-6 text-left text-[16px] text-[#1E1E1E] transition-colors hover:bg-[#F8FAFC]"
											on:click={() => selectInterestArea(option)}
										>
											{option}
										</button>
									{/each}
								</div>
							{/if}
						</div>

						{#if waitlistForm.interestArea === 'Other'}
							<input
								id="waitlist-interest-other"
								type="text"
								bind:value={waitlistForm.interestAreaOther}
								placeholder="Please specify"
								class="mt-3 h-[40px] w-full rounded-lg border border-[#0B3A8A] px-6 text-base placeholder:text-[#B3B3B3]"
							/>
						{/if}
						{#if waitlistFieldErrors.interestArea}
							<div class="mt-2 text-sm text-red-600">{waitlistFieldErrors.interestArea}</div>
						{/if}
					</div>

					{#if waitlistSuccessMessage}
						<div class="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
							{waitlistSuccessMessage}
						</div>
					{/if}

					{#if waitlistErrorMessage}
						<div class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
							{waitlistErrorMessage}
						</div>
					{/if}

					<button
						type="submit"
						class="mt-2 inline-flex h-[40px] w-full items-center justify-center rounded-xl text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
						style="background: #50277C;"
						disabled={isWaitlistSubmitting}
					>
						{isWaitlistSubmitting ? 'Submitting...' : 'Submit'}
					</button>
				</form>
			</div>
		</div>
	{/if}

	{#if isMentorModalOpen}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-[#020916]/55 px-4 py-8 backdrop-blur-[2px]"
			role="presentation"
			tabindex="-1"
			on:click|self={closeMentorModal}
		>
			<div
				id="mentor-modal"
				class="relative max-h-[90vh] w-full max-w-[820px] overflow-y-auto rounded-[18px] border border-[#D7E2F0] bg-white p-6 shadow-[0_24px_80px_rgba(2,9,22,0.35)]"
				role="dialog"
				tabindex="-1"
				aria-modal="true"
				aria-labelledby="mentor-modal-title"
			>
				<button
					type="button"
					class="absolute top-5 right-5 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#667085] transition-colors hover:bg-[#F2F4F7] hover:text-[#15213A]"
					aria-label="Close mentor popup"
					on:click={closeMentorModal}
				>
					<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5"
							stroke="currentColor"
							stroke-width="1.8"
							stroke-linecap="round"
						/>
					</svg>
				</button>

				<div id="mentor-modal-title" class="text-2xl font-semibold text-[#202124]">
					Become a Mentor
				</div>

				<form class="mt-6 space-y-6" novalidate on:submit|preventDefault={handleMentorSubmit}>
					<div>
						<label for="mentor-name" class="block text-base text-[#202124]">
							Full name <span class="text-red-500">*</span>
						</label>
						<input
							id="mentor-name"
							type="text"
							bind:value={mentorForm.name}
							placeholder="e.g. Trang Nguyen"
							class="mt-3 h-[40px] w-full rounded-lg border border-[#D7DCE4] px-6 text-base text-[#202124] placeholder:text-[#B3B3B3]"
						/>
						{#if mentorFieldErrors.name}
							<div class="mt-2 text-sm text-red-600">{mentorFieldErrors.name}</div>
						{/if}
					</div>

					<div>
						<label for="mentor-email" class="block text-base text-[#202124]">
							Email <span class="text-red-500">*</span>
						</label>
						<input
							id="mentor-email"
							type="text"
							inputmode="email"
							bind:value={mentorForm.email}
							placeholder="Value"
							class="mt-3 h-[40px] w-full rounded-lg border border-[#D7DCE4] px-6 text-base text-[#202124] placeholder:text-[#B3B3B3]"
						/>
						{#if mentorFieldErrors.email}
							<div class="mt-2 text-sm text-red-600">{mentorFieldErrors.email}</div>
						{/if}
					</div>

					<div>
						<label for="mentor-company" class="block text-base text-[#202124]">
							Company <span class="text-red-500">*</span>
						</label>
						<input
							id="mentor-company"
							type="text"
							bind:value={mentorForm.company}
							placeholder="Value"
							class="mt-3 h-[40px] w-full rounded-lg border border-[#D7DCE4] px-6 text-base text-[#202124] placeholder:text-[#B3B3B3]"
						/>
						{#if mentorFieldErrors.company}
							<div class="mt-2 text-sm text-red-600">{mentorFieldErrors.company}</div>
						{/if}
					</div>

					<div>
						<label for="mentor-title" class="block text-base text-[#202124]">
							Title / Role <span class="text-red-500">*</span>
						</label>
						<input
							id="mentor-title"
							type="text"
							bind:value={mentorForm.titleRole}
							placeholder="Value"
							class="mt-3 h-[40px] w-full rounded-lg border border-[#D7DCE4] px-6 text-base text-[#202124] placeholder:text-[#B3B3B3]"
						/>
						{#if mentorFieldErrors.titleRole}
							<div class="mt-2 text-sm text-red-600">{mentorFieldErrors.titleRole}</div>
						{/if}
					</div>

					<div>
						<div class="block text-base text-[#202124]">
							Will you be in the Bay Area during the event? <span class="text-red-500">*</span>
						</div>
						<div class="mt-3 space-y-3">
							{#each mentorBayAreaOptions as option (option)}
								<label class="flex items-start gap-3 text-base text-[#202124]">
									<input
										type="radio"
										name="mentor-bay-area"
										value={option}
										bind:group={mentorForm.bayAreaStatus}
										class="mentor-radio mt-1"
									/>
									<span>{option}</span>
								</label>
							{/each}
						</div>
						{#if mentorFieldErrors.bayAreaStatus}
							<div class="mt-2 text-sm text-red-600">{mentorFieldErrors.bayAreaStatus}</div>
						{/if}
					</div>

					<div>
						<div class="block text-base text-[#202124]">
							How would you like to contribute? <span class="italic">(Select all that apply.)</span>
							<span class="text-red-500">*</span>
						</div>
						<div class="mt-3 space-y-3">
							{#each mentorContributionOptions as option (option)}
								<label class="flex items-start gap-3 text-base text-[#202124]">
									<input
										type="checkbox"
										checked={mentorForm.contributions.includes(option)}
										on:change={() => toggleMentorContribution(option)}
										class="mentor-checkbox mt-1"
									/>
									<span>{option}</span>
								</label>
							{/each}
						</div>
						{#if mentorFieldErrors.contributions}
							<div class="mt-2 text-sm text-red-600">{mentorFieldErrors.contributions}</div>
						{/if}
					</div>

					{#if mentorSuccessMessage}
						<div class="rounded-xl bg-[#ECFDF3] px-4 py-3 text-sm text-[#027A48]">
							{mentorSuccessMessage}
						</div>
					{/if}

					{#if mentorErrorMessage}
						<div class="rounded-xl bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318]">
							{mentorErrorMessage}
						</div>
					{/if}

					<button
						type="submit"
						class="mt-2 inline-flex h-[40px] w-full items-center justify-center rounded-xl px-6 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
						style="background: #50277C;"
						disabled={isMentorSubmitting}
					>
						{isMentorSubmitting ? 'Submitting...' : 'Submit'}
					</button>
				</form>
			</div>
		</div>
	{/if}

	{#if isVolunteerModalOpen}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-[#020916]/55 px-4 py-8 backdrop-blur-[2px]"
			role="presentation"
			tabindex="-1"
			on:click|self={closeVolunteerModal}
		>
			<div
				id="volunteer-modal"
				class="relative max-h-[90vh] w-full max-w-[820px] overflow-y-auto rounded-[18px] border border-[#D7E2F0] bg-white p-6 shadow-[0_24px_80px_rgba(2,9,22,0.35)]"
				role="dialog"
				tabindex="-1"
				aria-modal="true"
				aria-labelledby="volunteer-modal-title"
			>
				<button
					type="button"
					class="absolute top-5 right-5 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#667085] transition-colors hover:bg-[#F2F4F7] hover:text-[#15213A]"
					aria-label="Close volunteer popup"
					on:click={closeVolunteerModal}
				>
					<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5"
							stroke="currentColor"
							stroke-width="1.8"
							stroke-linecap="round"
						/>
					</svg>
				</button>

				<div id="volunteer-modal-title" class="text-2xl font-semibold text-[#202124]">
					Volunteer with us
				</div>

				<form class="mt-6 space-y-6" novalidate on:submit|preventDefault={handleVolunteerSubmit}>
					<div>
						<label for="volunteer-name" class="block text-base text-[#202124]">
							Full name <span class="text-red-500">*</span>
						</label>
						<input
							id="volunteer-name"
							type="text"
							bind:value={volunteerForm.name}
							placeholder="e.g. Trang Nguyen"
							class="mt-3 h-[40px] w-full rounded-lg border border-[#D7DCE4] px-6 text-base text-[#202124] placeholder:text-[#B3B3B3]"
						/>
						{#if volunteerFieldErrors.name}
							<div class="mt-2 text-sm text-red-600">{volunteerFieldErrors.name}</div>
						{/if}
					</div>

					<div>
						<label for="volunteer-email" class="block text-base text-[#202124]">
							Email <span class="text-red-500">*</span>
						</label>
						<input
							id="volunteer-email"
							type="text"
							inputmode="email"
							bind:value={volunteerForm.email}
							placeholder="Value"
							class="mt-3 h-[40px] w-full rounded-lg border border-[#D7DCE4] px-6 text-base text-[#202124] placeholder:text-[#B3B3B3]"
						/>
						{#if volunteerFieldErrors.email}
							<div class="mt-2 text-sm text-red-600">{volunteerFieldErrors.email}</div>
						{/if}
					</div>

					<div>
						<label for="volunteer-organization" class="block text-base text-[#202124]">
							University/ Company <span class="text-red-500">*</span>
						</label>
						<input
							id="volunteer-organization"
							type="text"
							bind:value={volunteerForm.organization}
							placeholder="Value"
							class="mt-3 h-[40px] w-full rounded-lg border border-[#D7DCE4] px-6 text-base text-[#202124] placeholder:text-[#B3B3B3]"
						/>
						{#if volunteerFieldErrors.organization}
							<div class="mt-2 text-sm text-red-600">{volunteerFieldErrors.organization}</div>
						{/if}
					</div>

					<div>
						<div class="block text-base text-[#202124]">
							What best describes your current career status: <span class="text-red-500">*</span>
						</div>
						<div class="mt-3 space-y-3">
							{#each careerStatusOptions.slice(0, 4) as option (option)}
								<label class="flex items-start gap-3 text-base text-[#202124]">
									<input
										type="radio"
										name="volunteer-career-status"
										value={option}
										bind:group={volunteerForm.careerStatus}
										class="mentor-radio mt-1"
									/>
									<span>{option}</span>
								</label>
							{/each}
						</div>
						{#if volunteerFieldErrors.careerStatus}
							<div class="mt-2 text-sm text-red-600">{volunteerFieldErrors.careerStatus}</div>
						{/if}
					</div>

					<div>
						<div class="block text-base text-[#202124]">
							How would you like to contribute? <span class="italic">(Select all that apply.)</span>
							<span class="text-red-500">*</span>
						</div>
						<div class="mt-3 space-y-3">
							{#each volunteerContributionOptions as option (option)}
								<label class="flex items-start gap-3 text-base text-[#202124]">
									<input
										type="checkbox"
										checked={volunteerForm.contributions.includes(option)}
										on:change={() => toggleVolunteerContribution(option)}
										class="mentor-checkbox mt-1"
									/>
									<span>{option}</span>
								</label>
							{/each}
						</div>
						{#if volunteerFieldErrors.contributions}
							<div class="mt-2 text-sm text-red-600">{volunteerFieldErrors.contributions}</div>
						{/if}
					</div>

					<div>
						<div class="block text-base text-[#202124]">
							Will you be in the Bay Area during the event? <span class="text-red-500">*</span>
						</div>
						<div class="mt-3 space-y-3">
							{#each mentorBayAreaOptions as option (option)}
								<label class="flex items-start gap-3 text-base text-[#202124]">
									<input
										type="radio"
										name="volunteer-bay-area"
										value={option}
										bind:group={volunteerForm.bayAreaStatus}
										class="mentor-radio mt-1"
									/>
									<span>{option}</span>
								</label>
							{/each}
						</div>
						{#if volunteerFieldErrors.bayAreaStatus}
							<div class="mt-2 text-sm text-red-600">{volunteerFieldErrors.bayAreaStatus}</div>
						{/if}
					</div>

					{#if volunteerSuccessMessage}
						<div class="rounded-xl bg-[#ECFDF3] px-4 py-3 text-sm text-[#027A48]">
							{volunteerSuccessMessage}
						</div>
					{/if}

					{#if volunteerErrorMessage}
						<div class="rounded-xl bg-[#FEF3F2] px-4 py-3 text-sm text-[#B42318]">
							{volunteerErrorMessage}
						</div>
					{/if}

					<button
						type="submit"
						class="mt-2 inline-flex h-[40px] w-full items-center justify-center rounded-xl px-6 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
						style="background: #50277C;"
						disabled={isVolunteerSubmitting}
					>
						{isVolunteerSubmitting ? 'Submitting...' : 'Submit'}
					</button>
				</form>
			</div>
		</div>
	{/if}
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

	.mentor-radio,
	.mentor-checkbox {
		appearance: none;
		-webkit-appearance: none;
		flex-shrink: 0;
		width: 1.25rem;
		height: 1.25rem;
		cursor: pointer;
		border: 1.5px solid #98a2b3;
		background-color: #ffffff;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.mentor-radio {
		border-radius: 9999px;
	}

	.mentor-radio:checked {
		border-color: #894bd9;
		background-color: #894bd9;
		box-shadow: inset 0 0 0 5px #894bd9;
		background-image: radial-gradient(circle, #ffffff 0 28%, transparent 32%);
		background-position: center;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.mentor-checkbox {
		border-radius: 0.25rem;
	}

	.mentor-checkbox:checked {
		border-color: #894bd9;
		background-color: #894bd9;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.2' d='M3.5 8.5 6.5 11.5 12.5 4.5'/%3E%3C/svg%3E");
		background-position: center;
		background-repeat: no-repeat;
		background-size: 0.95rem 0.95rem;
	}

	.mentor-radio:focus-visible,
	.mentor-checkbox:focus-visible {
		outline: 2px solid rgba(137, 75, 217, 0.28);
		outline-offset: 2px;
	}
</style>
