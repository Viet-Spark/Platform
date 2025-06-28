<script>
	import placeHolderAvatar from '$lib/images/About/placeHolderAvatar.jpg';
	import { aboutStore, aboutLoading } from '$lib/stores/aboutStore';
    import {marked} from 'marked';

</script>

<svelte:head>
	<title>About Us - VietSpark</title>
	<meta
		name="description"
		content="Learn about VietSpark's mission, vision, and the team behind our community."
	/>
</svelte:head>
{#if $aboutLoading}
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-center">
			<div
				class="border-primary inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2"
			></div>
			<p class="mt-4 text-gray-600">Loading About Us...</p>
			{#if loadingError}
				<p class="mt-2 text-red-500">{loadingError}</p>
				<button
					class="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
					on:click={() => window.location.reload()}
				>
					Retry
				</button>
			{/if}
		</div>
	</div>
{:else}
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
						{@html marked.parse($aboutStore.history)}
					</p>
				</div>
				<div class="flex h-96 items-center justify-center rounded-lg bg-gray-100 overflow-hidden">
					<!-- Placeholder for history image -->
					<img src={$aboutStore.historyImage} alt="History" class="object-cover w-full"/>
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
						{$aboutStore.mission}
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
						{$aboutStore.vision}
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
				{#each $aboutStore.coreValues as coreValue} 
					<div class="rounded-lg bg-gray-50 p-6 text-center transition-shadow hover:shadow-md">
						<div
							class="text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
						>
							<i class="fas {coreValue.iconName} text-2xl"></i>
						</div>
						<h3 class="mb-2 text-xl font-bold">{coreValue.name}</h3>
						<p class="text-gray-600">{coreValue.description}</p>
					</div>
				{/each}
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
					{$aboutStore.whatWeDo.summary}
				</p>
			</div>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				{#each $aboutStore.whatWeDo.pillars as pillar}
					<div class="rounded-lg bg-white p-8 shadow-md">
						<div
							class="text-primary mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
						>
							<i class="fas {pillar.iconName} text-2xl"></i>
						</div>
						<h3 class="mb-4 text-xl font-bold">{pillar.title}</h3>
						<p class="mb-4 text-gray-700">
							{pillar.description}
						</p>
						<ul class="list-inside list-disc space-y-2 text-gray-600">
							{#each pillar.list as highlight}
								<li>{highlight}</li>
							{/each}
						</ul>
					</div>
				{/each}
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
				{#each $aboutStore.boardOfDirectors.slice(0,2) as member}
					<div class="rounded-lg bg-white p-6 text-center shadow-md w-130">
						<img
							src={member.profileImage}
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
				{#each $aboutStore.boardOfDirectors.slice(2,5) as member}
					<div class="rounded-lg bg-white p-6 text-center shadow-md">
						<img
							src={member.profileImage}
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

			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 item-center">
				{#each $aboutStore.advisoryBoard as member}
					<div class="rounded-lg bg-gray-50 p-6 text-center shadow-sm">
						<img
							src={member.profileImage}
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

			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
				{#each $aboutStore.volunteers as member}
					<div class="rounded-lg bg-gray-50 p-6 text-center shadow-sm">
						<img
							src={member.profileImage || placeHolderAvatar}
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
							<!-- <i class="fab fa-linkedin text-xl"></i> -->
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
{/if}
<style>
	.btn {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		font-weight: 500;
		border-radius: 0.375rem;
		transition: all 0.2s;
	}
</style>
