<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authUser } from '$lib/stores/authStore';
	import { userData } from '$lib/stores/userStore';
	import { eventStore, eventHandlers } from '$lib/stores/eventStore2';
	import {
		eventCategories,
		addEventCategory,
		removeEventCategory,
		fetchEventCategories
	} from '$lib/stores/eventCategoryStore';
	import { writable } from 'svelte/store';

	let isDataReady = false;
	let filterStatus = 'all'; // all, upcoming, past
	let filteredEvents = writable([]);
	let newCategory = '';
	let isAddingCategory = false;
	let isRemovingCategory = false;

	$: if ($authUser && $userData) {
		isDataReady = true;
	}

	$: if (isDataReady && $authUser && !$userData?.isAdmin) {
		goto('/');
	}

	$: if ($eventStore.events) {
		filteredEvents.set($eventStore.events
		.filter((event) => {
			const now = new Date();
			const eventDate = new Date(event.eventDate.start.seconds * 1000);

			if (filterStatus === 'upcoming') {
				return eventDate >= now;
			} else if (filterStatus === 'past') {
				return eventDate < now;
			}
			return true;
		})
		.sort((a, b) => new Date(b.date) - new Date(a.date)));
	}

	async function handleDelete(id) {
		if (confirm('Are you sure you want to delete this event?')) {
			await eventHandlers.deleteEvent(id);
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

	async function handleRemoveCategory(categoryName, id) {
		if (
			confirm(`Are you sure you want to remove the category "${categoryName}"?`) &&
			!isRemovingCategory
		) {
			try {
				isRemovingCategory = true;
				await removeEventCategory(id);
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
					{isAddingCategory ? 'Adding...' : 'Add'}
				</button>
			</div>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each $eventCategories as category}
					<div class="flex items-center justify-between rounded-md bg-gray-50 p-3">
						<span class="font-medium">{category.name}</span>
						<button
							on:click={() => handleRemoveCategory(category.name, category.id)}
							class="text-red-600 hover:text-red-800 disabled:opacity-50"
							disabled={isRemovingCategory}
						>
							{isRemovingCategory ? 'Removing...' : 'x'}
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

	{#if $eventStore.isLoading}
		<div class="py-8 text-center">Loading...</div>
	{:else if $filteredEvents.length === 0}
		<div class="py-8 text-center text-gray-500">No events found</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each $filteredEvents as event}
				<div class="overflow-hidden rounded-lg bg-white shadow">
					{#if event.coverImage}
						<img src={event.coverImage} alt={event.title} class="h-48 w-full object-cover" />
					{:else}
						<div class="h-48 w-full bg-primary-300"></div>
					{/if}
					<div class="p-4">
						<h3 class="mb-2 text-xl font-semibold">{event.title}</h3>
						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-500">
								{#if event.eventDate?.start}
									{new Date(event.eventDate.start.seconds * 1000).toLocaleString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit'
									})}
								{:else}
									Date not set
								{/if}
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
