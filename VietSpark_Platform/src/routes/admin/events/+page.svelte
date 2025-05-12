<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authUser } from '$lib/stores/authStore';
	import { userData } from '$lib/stores/userStore';
	import { events, eventsLoading, fetchEvents, deleteEvent } from '$lib/stores/eventStore';

	let isDataReady = false;
	let filterStatus = 'all'; // all, upcoming, past
	let filteredEvents = [];

	$: if ($authUser && $userData) {
		isDataReady = true;
	}

	$: if (isDataReady && $authUser && !$userData?.isAdmin) {
		goto('/');
	}

	$: filteredEvents = $events
		.filter((event) => {
			const now = new Date();
			const eventDate = new Date(event.date);

			if (filterStatus === 'upcoming') {
				return eventDate >= now;
			} else if (filterStatus === 'past') {
				return eventDate < now;
			}
			return true;
		})
		.sort((a, b) => new Date(b.date) - new Date(a.date));

	onMount(async () => {
		await fetchEvents();
	});

	async function handleDelete(id) {
		if (confirm('Are you sure you want to delete this event?')) {
			await deleteEvent(id);
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	{#if !isDataReady}
		<div class="flex h-screen items-center justify-center">
			<p class="text-xl">Loading...</p>
		</div>
	{:else}
		<div class="mb-8 flex items-center justify-between">
			<h1 class="text-3xl font-bold">Manage Events</h1>
			<a
				href="/admin/events/new"
				class="bg-primary hover:bg-primary-dark rounded-md px-4 py-2 text-white"
			>
				Create New Event
			</a>
		</div>

		<div class="mb-6 flex space-x-4">
			<button
				class="rounded-md px-4 py-2"
				class:bg-primary={filterStatus === 'all'}
				class:text-white={filterStatus === 'all'}
				class:bg-gray-100={filterStatus !== 'all'}
				class:text-gray-700={filterStatus !== 'all'}
				on:click={() => (filterStatus = 'all')}
			>
				All Events
			</button>
			<button
				class="rounded-md px-4 py-2"
				class:bg-primary={filterStatus === 'upcoming'}
				class:text-white={filterStatus === 'upcoming'}
				class:bg-gray-100={filterStatus !== 'upcoming'}
				class:text-gray-700={filterStatus !== 'upcoming'}
				on:click={() => (filterStatus = 'upcoming')}
			>
				Upcoming
			</button>
			<button
				class="rounded-md px-4 py-2"
				class:bg-primary={filterStatus === 'past'}
				class:text-white={filterStatus === 'past'}
				class:bg-gray-100={filterStatus !== 'past'}
				class:text-gray-700={filterStatus !== 'past'}
				on:click={() => (filterStatus = 'past')}
			>
				Past
			</button>
		</div>

		{#if $eventsLoading}
			<div class="flex h-32 items-center justify-center">
				<p>Loading events...</p>
			</div>
		{:else if filteredEvents.length === 0}
			<div class="rounded-lg bg-gray-100 p-8 text-center">
				<p class="text-gray-600">No events found. Create your first event!</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each filteredEvents as event}
					<div class="rounded-lg bg-white p-6 shadow-md">
						{#if event.image}
							<img
								src={event.image}
								alt={event.title}
								class="mb-4 h-48 w-full rounded-lg object-cover"
							/>
						{/if}
						<div class="mb-4 flex items-center justify-between">
							<h3 class="text-xl font-semibold">{event.title}</h3>
							<div class="flex space-x-2">
								<a href="/admin/events/{event.id}/edit" class="text-blue-600 hover:text-blue-800">
									Edit
								</a>
								<button
									on:click={() => handleDelete(event.id)}
									class="text-red-600 hover:text-red-800"
								>
									Delete
								</button>
							</div>
						</div>
						<p class="mb-4 text-gray-600">{event.description}</p>
						<div class="mb-4">
							<p class="text-sm text-gray-500">
								<i class="far fa-calendar mr-2"></i>
								{new Date(event.date).toLocaleDateString()} at {event.time}
							</p>
							<p class="text-sm text-gray-500">
								<i class="fas fa-map-marker-alt mr-2"></i>
								{event.location}
							</p>
						</div>
						<div class="flex flex-wrap gap-2">
							{#each event.tags as tag}
								<span class="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
									{tag}
								</span>
							{/each}
						</div>
						<a
							href="/events/{event.slug}"
							target="_blank"
							class="text-primary mt-4 inline-block hover:underline"
						>
							View Event →
						</a>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>
