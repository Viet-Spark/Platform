<script>
	import { loginWithEmail, registerWithEmail, authLoading, authError, authUser } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { profileData, profileLoading, profileError, updateUserProfile, getUserProfile } from '$lib/stores/profileStore';
	import { subscribers, subscriberHandlers } from '$lib/stores/subscriberStore';

	let email = '';
	let password = '';
	let name = ''; 
	let title = ''; 
	let company = ''; 
	let location = '';
	let subscriptions = {
		events: false,
		newsletters: false,
		mentorship: false
	};
	let isRegistering = false;
	let errorMessage = '';
	let formErrors = {
		email: '',
		password: ''
	};

	onMount(() => {
		// If user is already logged in, redirect to home
		if ($authUser) {
			goto('/');
		}
	});

	$: if ($authError) {
		errorMessage = $authError;
	}

	$: if ($authUser) {
		// When user logs in, redirect to home
		goto('/');
	}

	function validateForm() {
		formErrors = {
			email: '',
			password: ''
		};

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email) {
			formErrors.email = 'Email is required';
		} else if (!emailRegex.test(email)) {
			formErrors.email = 'Please enter a valid email address';
		}

		// Password validation
		if (!password) {
			formErrors.password = 'Password is required';
		} else if (password.length < 6) {
			formErrors.password = 'Password must be at least 6 characters';
		} else if (isRegistering && !/(?=.*[A-Z])/.test(password)) {
			formErrors.password = 'Password must contain at least one uppercase letter';
		} else if (isRegistering && !/(?=.*[0-9])/.test(password)) {
			formErrors.password = 'Password must contain at least one number';
		}

		return !formErrors.email && !formErrors.password;
	}

	async function handleSubmit() {
		errorMessage = '';
		formErrors = {
			email: '',
			password: ''
		};

		if (!validateForm()) {
			return;
		}

		try {
			if (isRegistering) {
				const user = await registerWithEmail(email, password);
				if (user) {
					try {
						await getUserProfile(user.uid); 
						await updateUserProfile(user.uid, {
							name,
							title,
							company,
							location,
							subscriptions
						});
					} catch (error) {
						console.error('Error saving profile after registration:', error);
						errorMessage = error.message || 'Account created but profile could not be saved.';
					}
				}
			} else {
				await loginWithEmail(email, password);
			}
		} catch (error) {
			errorMessage = error.message;
		}
	}

	function toggleMode() {
		isRegistering = !isRegistering;
		errorMessage = '';
		formErrors = {
			email: '',
			password: ''
		};
	}
</script>

<svelte:head>
	<title>{isRegistering ? 'Register' : 'Login'} | VietSpark</title>
</svelte:head>

<div class="login-container">
	<div class="mx-auto w-xl rounded-lg bg-white p-6 shadow-md">
		<div class="mb-6 text-center">
			<img
				src="/logos/225357894_335085408311214_4818242809207101955_n.png"
				alt="VietSpark Logo"
				class="mx-auto mb-4 h-16"
			/>
			<div class="text-2xl font-bold">
				{isRegistering ? 'Register' : 'Login'}
			</div>
		</div>

		<form on:submit|preventDefault={handleSubmit} class="space-y-4">
			<div>
				<label for="email" class="mb-1 block font-medium">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					class:border-red-500={formErrors.email}
				/>
				{#if formErrors.email}
					<div class="mt-1 text-sm text-red-500">{formErrors.email}</div>
				{/if}
			</div>

			<div>
				<label for="password" class="mb-1 block font-medium">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					minlength="6"
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					class:border-red-500={formErrors.password}
				/>
				{#if formErrors.password}
					<div class="mt-1 text-sm text-red-500">{formErrors.password}</div>
				{/if}
				{#if isRegistering}
					<div class="mt-1 text-xs text-gray-500">
						Password must be at least 6 characters long and contain at least one uppercase letter
						and one number.
					</div>
				{/if}
			</div>

			{#if isRegistering} 
				<div>
					<label for="name" class="mb-1 block font-medium">Display Name</label>
					<input
						type="text"
						id="name"
						bind:value={name}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
				</div>
				<div>
					<label for="title" class="mb-1 block font-medium">Job Title</label>
					<input
						type="text"
						id="title"
						bind:value={title}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
				</div>
				<div>
					<label for="company" class="mb-1 block font-medium">Company</label>
					<input
						type="text"
						id="company"
						bind:value={company}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
				</div>

				<div>
					<label for="location" class="mb-1 block font-medium">Location</label>
					<input
						type="text"
						id="location"
						bind:value={location}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
				</div>
				<div class="border-t pt-6">
					<h3 class="mb-4 text-lg font-bold">Email Preferences</h3>
					<div class="space-y-3">
						<label class="flex items-center">
							<input 
								type="checkbox" 
								class="text-primary h-5 w-5 rounded" 
								bind:checked={subscriptions.events} 
							/>
							<span class="ml-2 text-gray-700">Event announcements</span>
						</label>
						<label class="flex items-center">
							<input 
								type="checkbox" 
								class="text-primary h-5 w-5 rounded" 
								bind:checked={subscriptions.newsletters} 
							/>
							<span class="ml-2 text-gray-700">Newsletter</span>
						</label>
						<label class="flex items-center">
							<input 
								type="checkbox" 
								class="text-primary h-5 w-5 rounded" 
								bind:checked={subscriptions.mentorship} 
							/>
							<span class="ml-2 text-gray-700">Mentorship opportunities</span>
						</label>
					</div>
				</div>
			{/if}

			{#if errorMessage}
				<div class="text-sm text-red-500">{errorMessage}</div>
			{/if}

			<button
				type="submit"
				disabled={$authLoading}
				class="bg-primary hover:bg-primary-dark focus:ring-primary w-full rounded-md px-4 py-2 font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
			>
				{#if $authLoading}
					<span>Loading...</span>
				{:else}
					<span>{isRegistering ? 'Register' : 'Login'}</span>
				{/if}
			</button>

			<div class="mt-4 text-center">
				<button type="button" on:click={toggleMode} class="text-primary hover:underline">
					{isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
				</button>
			</div>
		</form>
	</div>
</div>

<style>
	.login-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: calc(100vh - 200px);
		padding: 2rem;
	}

	:global(.ring-primary) {
		--tw-ring-color: #0a57a0;
	}
</style>
