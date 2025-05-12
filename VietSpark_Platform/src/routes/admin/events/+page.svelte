<script>
	import { onMount } from 'svelte';
	import {
		events,
		eventsLoading,
		eventsError,
		fetchEvents,
		deleteEvent
	} from '$lib/stores/eventStore';
	import { goto } from '$app/navigation';

	onMount(fetchEvents);

	async function handleDelete(eventId) {
		if (confirm('Are you sure you want to delete this event?')) {
			try {
				await deleteEvent(eventId);
			} catch (error) {
				console.error('Error deleting event:', error);
			}
		}
	}
</script>

<div>
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Manage Events</h1>
		<a
			href="/admin/events/new"
			class="bg-primary hover:bg-primary-dark rounded-lg px-4 py-2 text-white"
		>
			Create New Event
		</a>
	</div>

	{#if $eventsLoading}
		<p>Loading events...</p>
	{:else if $eventsError}
		<p class="text-red-500">Error: {$eventsError}</p>
	{:else if $events.length === 0}
		<p>No events found. Create your first event!</p>
	{:else}
		<div class="overflow-x-auto rounded-lg bg-white shadow">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							Title
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							Date
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							Status
						</th>
						<th
							class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white">
					{#each $events as event}
						<tr>
							<td class="whitespace-nowrap px-6 py-4">
								<div class="text-sm font-medium text-gray-900">{event.title}</div>
							</td>
							<td class="whitespace-nowrap px-6 py-4">
								<div class="text-sm text-gray-500">
									{new Date(event.date).toLocaleDateString()}
								</div>
							</td>
							<td class="whitespace-nowrap px-6 py-4">
								<span
									class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
									class:bg-green-100={new Date(event.date) > new Date()}
									class:text-green-800={new Date(event.date) > new Date()}
									class:bg-gray-100={new Date(event.date) <= new Date()}
									class:text-gray-800={new Date(event.date) <= new Date()}
								>
									{new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
								</span>
							</td>
							<td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
								<a
									href="/admin/events/{event.id}/edit"
									class="text-primary hover:text-primary-dark"
								>
									Edit
								</a>
								<button
									on:click={() => handleDelete(event.id)}
									class="ml-4 text-red-600 hover:text-red-900"
								>
									Delete
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
