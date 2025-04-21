<script>
	import { user, logout } from '$lib/stores/authStore';

	async function handleLogout() {
		try {
			await logout();
		} catch (error) {
			console.error('Logout error:', error);
		}
	}
</script>

{#if $user}
	<div class="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
		<div class="text-center">
			<div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
				<span class="text-xl font-bold text-blue-600">{$user.email.charAt(0).toUpperCase()}</span>
			</div>
			<h2 class="text-xl font-bold">{$user.email}</h2>
			<p class="mb-4 text-sm text-gray-600">User ID: {$user.uid}</p>

			<button
				on:click={handleLogout}
				class="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
			>
				Logout
			</button>
		</div>
	</div>
{:else}
	<div class="p-4 text-center">
		<p>Please log in to view your profile</p>
	</div>
{/if}
