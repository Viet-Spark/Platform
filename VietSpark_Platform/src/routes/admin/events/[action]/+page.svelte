<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { createEvent, updateEvent, events, fetchEvents } from '$lib/stores/eventStore';

	let eventData = {
		title: '',
		description: '',
		date: '',
		location: '',
		imageUrl: '',
		registrationUrl: ''
	};

	let isEditing = $page.params.action === 'edit';
	let eventId = $page.params.id;

	onMount(async () => {
		if (isEditing && eventId) {
			await fetchEvents();
			const event = $events.find((e) => e.id === eventId);
			if (event) {
				eventData = {
					...event,
					date: new Date(event.date).toISOString().split('T')[0]
				};
			}
		}
	});

	async function handleSubmit() {
		try {
			if (isEditing) {
				await updateEvent(eventId, eventData);
			} else {
				await createEvent(eventData);
			}
			goto('/admin/events');
		} catch (error) {
			console.error('Error saving event:', error);
		}
	}
</script>

<div class="max-w-2xl">
	<h1 class="mb-8 text-3xl font-bold">
		{isEditing ? 'Edit Event' : 'Create New Event'}
	</h1>

	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		<div>
			<label for="title" class="block text-sm font-medium text-gray-700">Title</label>
			<input
				type="text"
				id="title"
				bind:value={eventData.title}
				required
				class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			/>
		</div>

		<div>
			<label for="description" class="block text-sm font-medium text-gray-700">Description</label>
			<textarea
				id="description"
				bind:value={eventData.description}
				rows="4"
				required
				class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			></textarea>
		</div>

		<div>
			<label for="date" class="block text-sm font-medium text-gray-700">Date</label>
			<input
				type="date"
				id="date"
				bind:value={eventData.date}
				required
				class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			/>
		</div>

		<div>
			<label for="location" class="block text-sm font-medium text-gray-700">Location</label>
			<input
				type="text"
				id="location"
				bind:value={eventData.location}
				required
				class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			/>
		</div>

		<div>
			<label for="imageUrl" class="block text-sm font-medium text-gray-700">Image URL</label>
			<input
				type="url"
				id="imageUrl"
				bind:value={eventData.imageUrl}
				class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			/>
		</div>

		<div>
			<label for="registrationUrl" class="block text-sm font-medium text-gray-700"
				>Registration URL</label
			>
			<input
				type="url"
				id="registrationUrl"
				bind:value={eventData.registrationUrl}
				class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			/>
		</div>

		<div class="flex justify-end space-x-4">
			<a
				href="/admin/events"
				class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
			>
				Cancel
			</a>
			<button
				type="submit"
				class="bg-primary hover:bg-primary-dark rounded-md px-4 py-2 text-sm font-medium text-white"
			>
				{isEditing ? 'Update Event' : 'Create Event'}
			</button>
		</div>
	</form>
</div>
