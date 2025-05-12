<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authUser } from '$lib/stores/authStore';
	import { userData } from '$lib/stores/userStore';
	import {
		subscribers,
		newsletterLoading,
		fetchSubscribers,
		removeSubscriber
	} from '$lib/stores/newsletterStore';

	let isDataReady = false;
	let searchTerm = '';
	let filteredSubscribers = [];

	$: if ($authUser && $userData) {
		isDataReady = true;
	}

	$: if (isDataReady && $authUser && !$userData?.isAdmin) {
		goto('/');
	}

	$: filteredSubscribers = $subscribers.filter((sub) =>
		sub.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	onMount(async () => {
		await fetchSubscribers();
	});

	async function handleDelete(id) {
		if (confirm('Are you sure you want to remove this subscriber?')) {
			await removeSubscriber(id);
		}
	}

	function exportToCSV() {
		const headers = ['Email', 'Date Subscribed'];
		const csvContent = [
			headers.join(','),
			...$subscribers.map((sub) =>
				[sub.email, new Date(sub.subscribedAt).toLocaleDateString()].join(',')
			)
		].join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
		link.click();
	}
</script>

<div class="container mx-auto px-4 py-8">
	{#if !isDataReady}
		<div class="flex h-screen items-center justify-center">
			<p class="text-xl">Loading...</p>
		</div>
	{:else}
		<div class="mb-8 flex items-center justify-between">
			<h1 class="text-3xl font-bold">Newsletter Subscribers</h1>
			<button
				on:click={exportToCSV}
				class="bg-primary hover:bg-primary-dark rounded-md px-4 py-2 text-white"
			>
				Export to CSV
			</button>
		</div>

		<div class="mb-6">
			<input
				type="text"
				bind:value={searchTerm}
				placeholder="Search subscribers..."
				class="focus:border-primary w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none"
			/>
		</div>

		{#if $newsletterLoading}
			<div class="flex h-32 items-center justify-center">
				<p>Loading subscribers...</p>
			</div>
		{:else if $subscribers.length === 0}
			<div class="rounded-lg bg-gray-100 p-8 text-center">
				<p class="text-gray-600">No subscribers found.</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b bg-gray-50">
							<th class="px-4 py-3 text-left">Email</th>
							<th class="px-4 py-3 text-left">Date Subscribed</th>
							<th class="px-4 py-3 text-left">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredSubscribers as subscriber}
							<tr class="border-b hover:bg-gray-50">
								<td class="px-4 py-3">{subscriber.email}</td>
								<td class="px-4 py-3">
									{new Date(subscriber.subscribedAt).toLocaleDateString()}
								</td>
								<td class="px-4 py-3">
									<button
										on:click={() => handleDelete(subscriber.id)}
										class="text-red-600 hover:text-red-800"
									>
										Remove
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="mt-4 text-right text-gray-600">
				Total subscribers: {$subscribers.length}
			</div>
		{/if}
	{/if}
</div>
