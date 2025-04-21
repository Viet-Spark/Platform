<script>
	import {
		loginWithEmail,
		registerWithEmail,
		authLoading,
		authError,
		user
	} from '$lib/stores/authStore';

	let email = '';
	let password = '';
	let isRegistering = false;
	let errorMessage = '';

	$: if ($authError) {
		errorMessage = $authError;
	}

	async function handleSubmit() {
		errorMessage = '';

		try {
			if (isRegistering) {
				await registerWithEmail(email, password);
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
	}
</script>

{#if !$user}
	<div class="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
		<h2 class="mb-6 text-center text-2xl font-bold">
			{isRegistering ? 'Register' : 'Login'}
		</h2>

		<form on:submit|preventDefault={handleSubmit} class="space-y-4">
			<div>
				<label for="email" class="mb-1 block font-medium">Email</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
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
				/>
			</div>

			{#if errorMessage}
				<div class="text-sm text-red-500">{errorMessage}</div>
			{/if}

			<button
				type="submit"
				disabled={$authLoading}
				class="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
			>
				{#if $authLoading}
					<span>Loading...</span>
				{:else}
					<span>{isRegistering ? 'Register' : 'Login'}</span>
				{/if}
			</button>

			<div class="mt-4 text-center">
				<button type="button" on:click={toggleMode} class="text-blue-600 hover:underline">
					{isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
				</button>
			</div>
		</form>
	</div>
{:else}
	<div class="mx-auto max-w-md rounded-lg bg-white p-6 text-center shadow-md">
		<p class="mb-4">You are logged in as {$user.email}</p>
	</div>
{/if}
