<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authUser } from '$lib/stores/authStore';
	import { userData } from '$lib/stores/userStore';
	import { events, eventsLoading, fetchEvents, deleteEvent } from '$lib/stores/eventStore';
	import {
		eventCategories,
		addEventCategory,
		removeEventCategory,
		fetchEventCategories
	} from '$lib/stores/eventCategoryStore';

	let isDataReady = false;
	let filterStatus = 'all'; // all, upcoming, past
	let filteredEvents = [];
	let newCategory = '';
	let isAddingCategory = false;
	let isRemovingCategory = false;

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
		await Promise.all([fetchEvents(), fetchEventCategories()]);
	});

	async function handleDelete(id) {
		if (confirm('Are you sure you want to delete this event?')) {
			await deleteEvent(id);
		}
	}

	async function handleAddCategory() {
		if (newCategory.trim() && !isAddingCategory) {
			try {
				isAddingCategory = true;
				await addEventCategory(newCategory.trim());
				newCategory = '';
			} catch (error) {
				console.error('Error adding category:', error);
				alert('Failed to add category. Please try again.');
			} finally {
				isAddingCategory = false;
			}
		}
	}

	async function handleRemoveCategory(category) {
		if (
			confirm(`Are you sure you want to remove the category "${category}"?`) &&
			!isRemovingCategory
		) {
			try {
				isRemovingCategory = true;
				await removeEventCategory(category);
			} catch (error) {
				console.error('Error removing category:', error);
				alert('Failed to remove category. Please try again.');
			} finally {
				isRemovingCategory = false;
			}
		}
	}
</script>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<div class="mb-8">
		<h2 class="mb-4 text-2xl font-bold">Manage Event Categories</h2>
		<div class="rounded-lg bg-white p-6 shadow">
			<div class="mb-4 flex gap-4">
				<input
					type="text"
					bind:value={newCategory}
					placeholder="Enter new category"
					class="focus:border-primary focus:ring-primary flex-1 rounded-md border-gray-300 shadow-sm"
					disabled={isAddingCategory}
				/>
				<button
					on:click={handleAddCategory}
					class="bg-primary hover:bg-primary-dark rounded-md px-4 py-2 text-white disabled:opacity-50"
					disabled={isAddingCategory || !newCategory.trim()}
				>
					{isAddingCategory ? 'Adding...' : 'Add Category'}
				</button>
			</div>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each $eventCategories as category}
					<div class="flex items-center justify-between rounded-md bg-gray-50 p-3">
						<span class="font-medium">{category}</span>
						<button
							on:click={() => handleRemoveCategory(category)}
							class="text-red-600 hover:text-red-800 disabled:opacity-50"
							disabled={isRemovingCategory}
						>
							{isRemovingCategory ? 'Removing...' : 'Remove'}
						</button>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Events</h1>
		<a
			href="/admin/events/new"
			class="bg-primary hover:bg-primary-dark rounded-md px-4 py-2 text-white"
		>
			Create New Event
		</a>
	</div>

	<div class="mb-6">
		<div class="flex gap-4">
			<button
				class="rounded-md px-4 py-2 {filterStatus === 'all'
					? 'bg-primary text-white'
					: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				on:click={() => (filterStatus = 'all')}
			>
				All Events
			</button>
			<button
				class="rounded-md px-4 py-2 {filterStatus === 'upcoming'
					? 'bg-primary text-white'
					: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				on:click={() => (filterStatus = 'upcoming')}
			>
				Upcoming
			</button>
			<button
				class="rounded-md px-4 py-2 {filterStatus === 'past'
					? 'bg-primary text-white'
					: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				on:click={() => (filterStatus = 'past')}
			>
				Past
			</button>
		</div>
	</div>

	{#if $eventsLoading}
		<div class="py-8 text-center">Loading...</div>
	{:else if filteredEvents.length === 0}
		<div class="py-8 text-center text-gray-500">No events found</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each filteredEvents as event}
				<div class="overflow-hidden rounded-lg bg-white shadow">
					{#if event.coverImage}
						<img src={event.coverImage} alt={event.title} class="h-48 w-full object-cover" />
					{/if}
					<div class="p-4">
						<h3 class="mb-2 text-xl font-semibold">{event.title}</h3>
						<p class="mb-4 text-gray-600">{event.description}</p>
						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-500">
								{new Date(event.date).toLocaleDateString()}
							</span>
							<div class="flex gap-2">
								<a
									href="/admin/events/edit/{event.id}"
									class="text-primary hover:text-primary-dark"
								>
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
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
