<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authUser } from '$lib/stores/authStore';
	import { userData } from '$lib/stores/userStore';
	import {
		partners,
		partnersLoading,
		fetchPartners,
		deletePartner
	} from '$lib/stores/partnerStore';

	let isDataReady = false;

	$: if ($authUser && $userData) {
		isDataReady = true;
	}

	$: if (isDataReady && $authUser && !$userData?.isAdmin) {
		goto('/');
	}

	onMount(async () => {
		await fetchPartners();
	});

	async function handleDelete(id) {
		if (confirm('Are you sure you want to delete this partner?')) {
			await deletePartner(id);
		}
	}
</script>

<div class="container mx-auto">
	{#if !isDataReady}
		<div class="flex h-screen items-center justify-center">
			<p class="text-xl">Loading...</p>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center bg-primary text-white p-4 mb-8">
			<h1 class="text-2xl font-bold">Partners</h1>
			<p>Manage VietSpark's Partners</p>
		</div>
		<div class="mb-8 flex items-center justify-end">
			<a
				href="/admin/partners/new"
				class="bg-primary hover:bg-primary-dark rounded-md px-4 py-2 text-white"
			>
				Add New Partner
			</a>
		</div>
		{#if $partnersLoading}
			<div class="flex h-32 items-center justify-center">
				<p>Loading partners...</p>
			</div>
		{:else if $partners.length === 0}
			<div class="rounded-lg bg-gray-100 p-8 text-center">
				<p class="text-gray-600">No partners found. Add your first partner!</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each $partners as partner}
					<div class="rounded-lg bg-white p-6 shadow-md">
						<div class="mb-4 flex items-center justify-between">
							<img src={partner.image} alt="{partner.name} logo" class="h-16 w-16 object-contain" />
							<div class="flex space-x-2">
								<a
									href="/admin/partners/{partner.id}/edit"
									class="text-blue-600 hover:text-blue-800"
								>
									Edit
								</a>
								<button
									on:click={() => handleDelete(partner.id)}
									class="text-red-600 hover:text-red-800"
								>
									Delete
								</button>
							</div>
						</div>
						<h3 class="mb-2 text-xl font-semibold">{partner.name}</h3>
						{#if partner.website}
							<a
								href={partner.website}
								target="_blank"
								rel="noopener noreferrer"
								class="text-primary mt-4 inline-block hover:underline"
							>
								Visit Website →
							</a>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>
