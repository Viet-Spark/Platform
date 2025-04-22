<script>
	import { onMount, onDestroy } from 'svelte';
	import { user, logout, authLoading } from '$lib/stores/authStore';
	import {
		profileData,
		profileLoading,
		profileError,
		getUserProfile,
		uploadProfileImage,
		updateUserProfile
	} from '$lib/stores/profileStore';
	import { goto } from '$app/navigation';

	let fileInput;
	let uploadError = null;
	let isUploading = false;
	let localImagePreview = null;
	let loadingError = null;
	let loadingTimeout;

	// Tabs for the profile page
	const tabs = ['Overview', 'Events', 'Mentorship', 'Settings'];
	let activeTab = 'Overview';

	function setActiveTab(tab) {
		activeTab = tab;
	}

	async function handleLogout() {
		try {
			await logout();
			goto('/');
		} catch (error) {
			console.error('Logout error:', error);
		}
	}

	function handleAvatarClick() {
		if (fileInput) {
			fileInput.click();
		}
	}

	async function handleFileChange(event) {
		const file = event.target.files[0];
		if (!file) return;

		// Check file type
		if (!file.type.startsWith('image/')) {
			uploadError = 'Please select an image file';
			return;
		}

		// Check file size (max 2MB)
		if (file.size > 2 * 1024 * 1024) {
			uploadError = 'Image size should be less than 2MB';
			return;
		}

		uploadError = null;
		isUploading = true;

		// Show preview immediately
		const reader = new FileReader();
		reader.onload = (e) => {
			localImagePreview = e.target.result;
		};
		reader.readAsDataURL(file);

		try {
			// Upload to Firebase Storage
			if ($user && $user.uid) {
				await uploadProfileImage($user.uid, file);
				// The profileData store will be updated automatically
				localImagePreview = null; // Clear local preview as we'll use the one from Firebase
			} else {
				uploadError = 'User not authenticated';
			}
		} catch (error) {
			console.error('Upload error:', error);
			uploadError = `Upload failed: ${error.message}`;
		} finally {
			isUploading = false;
		}
	}

	async function loadUserProfile() {
		// Set a timeout to force loading to end after 15 seconds
		loadingTimeout = setTimeout(() => {
			if ($profileLoading) {
				console.log('Profile loading timed out');
				profileLoading.set(false);
				loadingError = 'Loading timed out. Please try again.';
			}
		}, 15000);

		if (!$user || !$user.uid) {
			console.log('No user or user ID available');
			loadingError = 'User not authenticated';
			profileLoading.set(false); // Force loading to end if no user
			return;
		}

		try {
			console.log('Loading profile for user:', $user.uid);
			await getUserProfile($user.uid);
			console.log('Profile loaded successfully:', $profileData);
		} catch (error) {
			console.error('Error loading profile:', error);
			loadingError = `Failed to load profile: ${error.message}`;
			profileLoading.set(false); // Force loading to end on error
		}
	}

	onMount(() => {
		// If user is not logged in, redirect to login
		if (!$user) {
			console.log('No user in onMount, redirecting to login');
			goto('/login');
		} else {
			console.log('User authenticated, loading profile');
			// Load profile data
			loadUserProfile();
		}
	});

	onDestroy(() => {
		// Clear the timeout if component is destroyed
		if (loadingTimeout) {
			clearTimeout(loadingTimeout);
		}
	});
</script>

<svelte:head>
	<title>My Profile - VietSpark</title>
	<meta
		name="description"
		content="Manage your VietSpark profile, view your events, and update your settings."
	/>
</svelte:head>

{#if $authLoading || $profileLoading}
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-center">
			<div
				class="border-primary inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2"
			></div>
			<p class="mt-4 text-gray-600">Loading profile...</p>
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
{:else if $user}
	<!-- Hidden file input for profile image upload -->
	<input
		type="file"
		accept="image/*"
		style="display: none;"
		bind:this={fileInput}
		on:change={handleFileChange}
	/>

	<!-- Profile Header -->
	<section class="bg-primary py-16 text-white">
		<div class="container mx-auto px-4">
			<div class="flex flex-col items-center gap-8 md:flex-row">
				<div
					class="text-primary relative flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-blue-200 text-4xl font-bold"
					on:click={handleAvatarClick}
					on:keydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ' || e.key === 'Space') {
							e.preventDefault();
							handleAvatarClick();
						}
					}}
					role="button"
					tabindex="0"
					aria-label="Upload profile picture"
				>
					{#if isUploading}
						<div
							class="absolute inset-0 flex items-center justify-center bg-blue-200 bg-opacity-80"
						>
							<div
								class="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent"
							></div>
						</div>
					{:else if localImagePreview}
						<img
							src={localImagePreview}
							alt="Profile Preview"
							class="absolute inset-0 h-full w-full object-cover"
						/>
					{:else if $profileData.profileImage}
						<img
							src={$profileData.profileImage}
							alt="Profile"
							class="absolute inset-0 h-full w-full object-cover"
						/>
					{:else}
						{($profileData.name || 'U').charAt(0).toUpperCase()}
					{/if}

					<!-- Overlay with hint -->
					<div
						class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity hover:opacity-100"
					>
						<i class="fas fa-camera text-2xl text-white"></i>
					</div>
				</div>
				<div>
					<h1 class="mb-2 flex w-full items-center justify-start text-3xl font-bold">
						{$profileData.name || 'VietSpark Member'}
					</h1>
					<p class="mb-4 text-blue-100">
						{$profileData.title || ''}
						{$profileData.title && $profileData.company ? 'at' : ''}
						{$profileData.company || ''}
					</p>
					<div class="flex flex-wrap gap-2">
						<span class="inline-flex items-center rounded-full bg-blue-700 px-3 py-1 text-sm">
							<i class="fas fa-map-marker-alt mr-2"></i>
							{$profileData.location || 'No location set'}
						</span>
						<span class="inline-flex items-center rounded-full bg-blue-700 px-3 py-1 text-sm">
							<i class="fas fa-envelope mr-2"></i>
							{$profileData.email || 'No email available'}
						</span>
					</div>
					{#if uploadError}
						<div class="mt-2 text-sm text-red-300">{uploadError}</div>
					{/if}
					{#if $profileError}
						<div class="mt-2 text-sm text-red-300">{$profileError}</div>
					{/if}
				</div>
			</div>
		</div>
	</section>

	<!-- Profile Navigation -->
	<section class="border-b bg-white">
		<div class="container mx-auto px-4">
			<div class="flex flex-wrap">
				{#each tabs as tab}
					<button
						class="hover:text-primary border-b-2 px-6 py-4 text-gray-600 {activeTab === tab
							? 'border-primary text-primary font-medium'
							: 'border-transparent'}"
						on:click={() => setActiveTab(tab)}
					>
						{tab}
					</button>
				{/each}
			</div>
		</div>
	</section>

	<!-- Profile Content -->
	<section class="min-h-[50vh] bg-gray-50 py-12">
		<div class="container mx-auto px-4">
			{#if activeTab === 'Overview'}
				<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
					<div class="lg:col-span-2">
						<div class="rounded-lg bg-white p-6 shadow-md">
							<h2 class="mb-4 text-2xl font-bold">About Me</h2>
							<p class="mb-6 text-gray-700">{$profileData.bio || 'No bio information yet.'}</p>

							<h3 class="mb-3 text-lg font-bold">Interests</h3>
							<div class="mb-6 flex flex-wrap gap-2">
								{#if $profileData.interests && $profileData.interests.length > 0}
									{#each $profileData.interests as interest}
										<span class="text-primary rounded-full bg-blue-100 px-3 py-1 text-sm">
											{interest}
										</span>
									{/each}
								{:else}
									<span class="text-sm text-gray-500">No interests added yet.</span>
								{/if}
							</div>

							<h3 class="mb-3 text-lg font-bold">Recent Events</h3>
							{#if $profileData.events && $profileData.events.length > 0}
								<div class="space-y-4">
									{#each $profileData.events.slice(0, 2) as event}
										<div class="flex items-center rounded-lg bg-gray-50 p-3">
											<div
												class="text-primary mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100"
											>
												<i class="fas fa-calendar-day"></i>
											</div>
											<div>
												<h4 class="font-medium">{event.title}</h4>
												<p class="text-sm text-gray-600">{event.date}</p>
											</div>
										</div>
									{/each}
								</div>
								<div class="mt-4">
									<button
										class="text-primary hover:underline"
										on:click={() => setActiveTab('Events')}
									>
										View all events →
									</button>
								</div>
							{:else}
								<p class="text-gray-600">You haven't attended any events yet.</p>
							{/if}
						</div>
					</div>

					<div>
						<div class="mb-6 rounded-lg bg-white p-6 shadow-md">
							<h2 class="mb-4 text-2xl font-bold">Membership</h2>
							<div class="mb-4 rounded-lg bg-blue-50 p-4 text-center">
								<div class="text-primary mb-2 text-4xl">
									<i class="fas fa-star"></i>
								</div>
								<h3 class="mb-1 text-lg font-bold">Active Member</h3>
								<p class="text-sm text-gray-600">Since {new Date().getFullYear()}</p>
							</div>
							<div class="space-y-2">
								<div class="flex justify-between">
									<span class="text-gray-600">Member Type:</span>
									<span class="font-medium">Regular</span>
								</div>
								<div class="flex justify-between">
									<span class="text-gray-600">Status:</span>
									<span class="font-medium text-green-600">Active</span>
								</div>
							</div>
						</div>

						<div class="rounded-lg bg-white p-6 shadow-md">
							<h2 class="mb-4 text-2xl font-bold">Quick Actions</h2>
							<div class="space-y-3">
								<a
									href="/events"
									class="text-primary block w-full rounded-md bg-blue-50 px-4 py-2 hover:bg-blue-100"
								>
									<i class="fas fa-calendar-alt mr-2"></i> Browse Events
								</a>
								<a
									href="/work-with-us"
									class="text-primary block w-full rounded-md bg-blue-50 px-4 py-2 hover:bg-blue-100"
								>
									<i class="fas fa-hands-helping mr-2"></i> Volunteer
								</a>
								<a
									href="/donate"
									class="text-primary block w-full rounded-md bg-blue-50 px-4 py-2 hover:bg-blue-100"
								>
									<i class="fas fa-heart mr-2"></i> Donate
								</a>
								<button
									on:click={handleLogout}
									class="block w-full rounded-md bg-red-50 px-4 py-2 text-red-600 hover:bg-red-100"
								>
									<i class="fas fa-sign-out-alt mr-2"></i> Sign Out
								</button>
							</div>
						</div>
					</div>
				</div>
			{:else if activeTab === 'Events'}
				<div class="rounded-lg bg-white p-6 shadow-md">
					<h2 class="mb-6 text-2xl font-bold">My Events</h2>

					{#if $profileData.events && $profileData.events.length > 0}
						<div class="space-y-4">
							{#each $profileData.events as event}
								<div class="flex items-center rounded-lg border p-4 hover:bg-gray-50">
									<div
										class="text-primary mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100"
									>
										<i class="fas fa-calendar-day"></i>
									</div>
									<div class="flex-1">
										<h4 class="font-medium">{event.title}</h4>
										<p class="text-sm text-gray-600">{event.date}</p>
									</div>
									<a href={`/events/${event.id}`} class="text-primary hover:underline"
										>View Details</a
									>
								</div>
							{/each}
						</div>
					{:else}
						<div class="py-8 text-center">
							<div class="mb-4 text-5xl text-gray-400">
								<i class="fas fa-calendar-times"></i>
							</div>
							<h3 class="mb-2 text-xl font-bold">No Events Yet</h3>
							<p class="mb-4 text-gray-600">You haven't registered for any events yet.</p>
							<a href="/events" class="btn bg-primary hover:bg-primary-dark text-white"
								>Browse Events</a
							>
						</div>
					{/if}
				</div>
			{:else if activeTab === 'Mentorship'}
				<div class="rounded-lg bg-white p-6 shadow-md">
					<h2 class="mb-6 text-2xl font-bold">Mentorship Program</h2>

					<div class="py-8 text-center">
						<div class="mb-4 text-5xl text-gray-400">
							<i class="fas fa-users"></i>
						</div>
						<h3 class="mb-2 text-xl font-bold">Join Our Mentorship Program</h3>
						<p class="mx-auto mb-6 max-w-2xl text-gray-600">
							Connect with experienced professionals or give back by mentoring others in our
							community. Our mentorship program runs twice a year and matches mentors with mentees
							based on career goals and interests.
						</p>
						<div class="flex flex-wrap justify-center gap-4">
							<a href="/mentorship/mentor" class="btn bg-primary hover:bg-primary-dark text-white">
								Apply as a Mentor
							</a>
							<a
								href="/mentorship/mentee"
								class="btn border-primary text-primary border-2 bg-transparent hover:bg-gray-100"
							>
								Apply as a Mentee
							</a>
						</div>
					</div>
				</div>
			{:else if activeTab === 'Settings'}
				<div class="rounded-lg bg-white p-6 shadow-md">
					<h2 class="mb-6 text-2xl font-bold">Account Settings</h2>

					<form
						class="space-y-6"
						on:submit|preventDefault={async () => {
							if ($user && $user.uid) {
								try {
									await updateUserProfile($user.uid, {
										name: $profileData.name,
										title: $profileData.title,
										company: $profileData.company,
										location: $profileData.location,
										bio: $profileData.bio
									});
								} catch (error) {
									console.error('Error updating profile:', error);
								}
							}
						}}
					>
						<div>
							<label for="name" class="mb-2 block font-medium text-gray-700">Display Name</label>
							<input
								type="text"
								id="name"
								bind:value={$profileData.name}
								class="focus:ring-primary w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2"
							/>
						</div>

						<div>
							<label for="email" class="mb-2 block font-medium text-gray-700">Email Address</label>
							<input
								type="email"
								id="email"
								value={$profileData.email}
								disabled
								class="w-full rounded-md border bg-gray-50 px-4 py-2"
							/>
							<p class="mt-1 text-sm text-gray-600">Email cannot be changed.</p>
						</div>

						<div>
							<label for="title" class="mb-2 block font-medium text-gray-700">Job Title</label>
							<input
								type="text"
								id="title"
								bind:value={$profileData.title}
								class="focus:ring-primary w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2"
							/>
						</div>

						<div>
							<label for="company" class="mb-2 block font-medium text-gray-700">Company</label>
							<input
								type="text"
								id="company"
								bind:value={$profileData.company}
								class="focus:ring-primary w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2"
							/>
						</div>

						<div>
							<label for="location" class="mb-2 block font-medium text-gray-700">Location</label>
							<input
								type="text"
								id="location"
								bind:value={$profileData.location}
								class="focus:ring-primary w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2"
							/>
						</div>

						<div>
							<label for="bio" class="mb-2 block font-medium text-gray-700">Bio</label>
							<textarea
								id="bio"
								rows="4"
								bind:value={$profileData.bio}
								class="focus:ring-primary w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2"
							></textarea>
						</div>

						<div>
							<fieldset>
								<legend class="mb-2 block font-medium text-gray-700">Interests</legend>
								<div class="flex flex-wrap gap-2">
									{#each $profileData.interests as interest, index}
										<div class="flex items-center rounded-full bg-blue-50 px-3 py-1">
											<span>{interest}</span>
											<button
												class="ml-2 text-gray-500 hover:text-red-500"
												aria-label={`Remove ${interest}`}
												type="button"
												on:click={() => {
													const newInterests = [...$profileData.interests];
													newInterests.splice(index, 1);
													profileData.update((data) => ({
														...data,
														interests: newInterests
													}));
												}}
											>
												<i class="fas fa-times-circle"></i>
											</button>
										</div>
									{/each}
									<button
										class="hover:text-primary hover:border-primary rounded-full border border-dashed border-gray-300 px-3 py-1 text-gray-500"
										type="button"
										on:click={() => {
											const interest = prompt('Enter new interest:');
											if (interest && !$profileData.interests.includes(interest)) {
												profileData.update((data) => ({
													...data,
													interests: [...data.interests, interest]
												}));
											}
										}}
									>
										<i class="fas fa-plus mr-1"></i> Add interest
									</button>
								</div>
							</fieldset>
						</div>

						<div class="border-t pt-6">
							<h3 class="mb-4 text-lg font-bold">Email Preferences</h3>
							<div class="space-y-3">
								<label class="flex items-center">
									<input type="checkbox" class="text-primary h-5 w-5 rounded" checked />
									<span class="ml-2 text-gray-700">Event announcements</span>
								</label>
								<label class="flex items-center">
									<input type="checkbox" class="text-primary h-5 w-5 rounded" checked />
									<span class="ml-2 text-gray-700">Newsletter</span>
								</label>
								<label class="flex items-center">
									<input type="checkbox" class="text-primary h-5 w-5 rounded" />
									<span class="ml-2 text-gray-700">Mentorship opportunities</span>
								</label>
							</div>
						</div>

						<div class="flex justify-end pt-4">
							<button type="submit" class="btn bg-primary hover:bg-primary-dark text-white">
								Save Changes
							</button>
						</div>
					</form>
				</div>
			{/if}
		</div>
	</section>
{:else}
	<div class="flex min-h-screen items-center justify-center">
		<div class="p-8 text-center">
			<div class="mb-6 text-6xl text-gray-300">
				<i class="fas fa-user-lock"></i>
			</div>
			<h2 class="mb-4 text-2xl font-bold">Please Log In</h2>
			<p class="mb-6 text-gray-600">You need to be logged in to view your profile.</p>
			<a href="/login" class="btn bg-primary hover:bg-primary-dark text-white">Log In</a>
		</div>
	</div>
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
