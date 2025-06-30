<script>
    import { onMount, onDestroy } from 'svelte';
	import { authUser, logout, authLoading } from '$lib/stores/authStore';
	import { homeStore, homeLoading, homeError, homeHandlers } from '$lib/stores/homeStore';
	import { goto } from '$app/navigation';
	import defaultProfile from '$lib/images/About/placeHolderAvatar.jpg';

    let uploadError = null;
	let loadingError = null;
	let loadingTimeout;
	let isSaving = false;

    onMount(async () => {
        await homeHandlers.getHome();
    });

    onDestroy(() => {
		// Clear the timeout if component is destroyed
		if (loadingTimeout) {
			clearTimeout(loadingTimeout);
		}
	});
</script>

<svelte:head>
	<title>About Us - VietSpark</title>
	<meta
		name="description"
		content="Manage VietSpark's Home Page"
	/>
</svelte:head>

{#if $homeLoading}
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-center">
			<div
				class="border-primary inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2"
			></div>
			<p class="mt-4 text-gray-600">Loading Home Data...</p>
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
{:else if $authUser}
	<div class="flex flex-col items-center justify-center bg-primary text-white p-4">
		<h1 class="text-2xl font-bold">Home</h1>
		<p>Manage VietSpark's Home Page</p>
	</div>

	<!-- About Us Content -->
	<section class="min-h-[50vh] bg-gray-50 py-12">
		<div class="container mx-auto px-4">
				<div class="rounded-lg bg-white p-6 shadow-md">
					<form
						class="space-y-6"
						on:submit|preventDefault={async () => {
                            try {
                                isSaving = true;
                                await homeHandlers.updateHome({
                                    whoWeAre: $homeStore.whoWeAre,
                                    missionSummary: $homeStore.missionSummary,
                                    visionSummary: $homeStore.visionSummary,
                                    coreValuesSummary: $homeStore.coreValuesSummary,
                                    lastUpdated: new Date().toISOString()
                                });
                                alert('Home Page updated successfully!');
                            } catch (error) {
                                console.error('Error updating home page:', error);
                                alert(`Error updating home page: ${error.message}`);
                            } finally {
                                isSaving = false;
                            }
						}}
					>
						<div>
							<label for="whoWeAre" class="mb-2 block text-gray-700 font-bold">Who We Are</label>
							<textarea
								id="whoWeAre"
                                rows="2"
                                bind:value={$homeStore.whoWeAre}
								class="focus:ring-primary w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2"
							></textarea>
						</div>

						<div>
							<label for="missionSummary" class="mb-2 block font-bold text-gray-700">Mission Summary</label>
							<textarea
								id="missionSummary"
                                rows="2"
                                bind:value={$homeStore.missionSummary}
								class="focus:ring-primary w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2"
							></textarea>
						</div>

						<div>
							<label for="visionSummary" class="mb-2 block font-bold text-gray-700">Vision Summary</label>
							<textarea
								id="visionSummary"
                                rows="2"
                                bind:value={$homeStore.visionSummary}
								class="focus:ring-primary w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2"
							></textarea>
						</div>

						<div>
							<label for="coreValuesSummary" class="mb-2 block font-bold text-gray-700">Core Values Summary</label>
							<textarea
								id="coreValuesSummary"
                                rows="2"
                                bind:value={$homeStore.coreValuesSummary}
								class="focus:ring-primary w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2"
							></textarea>
						</div>

						<div class="flex justify-end pt-4">
							<button 
								type="submit" 
                                class="btn bg-primary hover:bg-primary-dark text-white"								
                                disabled={isSaving}
							>
								{#if isSaving}
									<div class="flex items-center gap-2">
										<div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
										Saving...
									</div>
								{:else}
									Save Changes
								{/if}
							</button>
						</div>
					</form>
				</div>
		</div>
	</section>
{:else}
	<div class="flex min-h-screen items-center justify-center">
		<div class="p-8 text-center">
			<div class="mb-6 text-6xl text-gray-300">
				<i class="fas fa-user-lock"></i>
			</div>
			<h2 class="mb-4 text-2xl font-bold">Please Log In</h2>
			<p class="mb-6 text-gray-600">You need to be logged in to view the admin page for Home Page.</p>
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
