<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { createEvent, updateEvent, events, fetchEvents } from '$lib/stores/eventStore';
	import { eventCategories } from '$lib/stores/eventCategoryStore';

	let eventData = {
		eventCategory: '',
		year: new Date().getFullYear(),
		description: '',
		coverImage: '',
		images: [],
		attendees: [],
		tags: [],
		location: {
			addressLine1: '',
			addressLine2: '',
			city: '',
			state: '',
			zipCode: '',
			country: ''
		},
		registrationPricing: 0,
		earlyBirdRegistrationPricing: 0,
		eventDate: {
			start: '',
			end: ''
		},
		seatsAvailable: 0,
		seatsPurchased: 0,
		socialMediaLinks: {
			facebook: '',
			x: '',
			linkedIn: '',
			email: ''
		},
		speakers: [],
		eventContactEmail: '',
		programSchedule: []
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
					eventDate: {
						start: event.eventDate.start
							? new Date(event.eventDate.start).toISOString().split('T')[0]
							: '',
						end: event.eventDate.end
							? new Date(event.eventDate.end).toISOString().split('T')[0]
							: ''
					}
				};
			}
		}
	});

	async function handleSubmit() {
		try {
			// Convert dates to Firestore timestamps
			const dataToSubmit = {
				...eventData,
				eventDate: {
					start: new Date(eventData.eventDate.start),
					end: new Date(eventData.eventDate.end)
				},
				createdAt: isEditing ? eventData.createdAt : new Date(),
				updatedAt: new Date()
			};

			console.log(dataToSubmit)
			// if (isEditing) {
			// 	await updateEvent(eventId, dataToSubmit);
			// } else {
			// 	await createEvent(dataToSubmit);
			// }
			// goto('/admin/events');
		} catch (error) {
			console.error('Error saving event:', error);
		}
	}

	function addSpeaker() {
		eventData.speakers = [...eventData.speakers, { 
			userId: '', 
			metaData: {
				agenda: '',
				bio: '',
				title: '',
				socials: '',
			} }];
	}

	function removeSpeaker(index) {
		eventData.speakers = eventData.speakers.filter((_, i) => i !== index);
	}

	function addProgramItem() {
		eventData.programSchedule = [
			...eventData.programSchedule,
			{ time: '', period: '', title: '', description: '', location: '' }
		];
	}

	function removeProgramItem(index) {
		eventData.programSchedule = eventData.programSchedule.filter((_, i) => i !== index);
	}

	function addTag() {
		eventData.tags = [...eventData.tags, ''];
	}

	function removeTag(index) {
		eventData.tags = eventData.tags.filter((_, i) => i !== index);
	}
</script>

<div class="max-w-4xl">
	<h1 class="mb-8 text-3xl font-bold">
		{isEditing ? 'Edit Event' : 'Create New Event'}
	</h1>

	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		<div>
			<label for="eventCategory" class="block text-sm font-medium text-gray-700"
				>Event Category</label
			>
			<select
				id="eventCategory"
				bind:value={eventData.eventCategory}
				required
				class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			>
				<option value="">Select a category</option>
				{#each $eventCategories as category}
					<option value={category}>{category}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="year" class="block text-sm font-medium text-gray-700">Year</label>
			<input
				type="number"
				id="year"
				bind:value={eventData.year}
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
			<label for="coverImage" class="block text-sm font-medium text-gray-700">Cover Image URL</label
			>
			<input
				type="url"
				id="coverImage"
				bind:value={eventData.coverImage}
				class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
			/>
		</div>

		<div class="space-y-4">
			<h3 class="text-lg font-medium">Tags</h3>
			{#each eventData.tags as tag, index}
				<div class="flex items-center gap-2">
					<input
						type="text"
						bind:value={eventData.tags[index]}
						placeholder="Enter a tag"
						class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					/>
					<button
						type="button"
						on:click={() => removeTag(index)}
						class="text-red-600 hover:text-red-800"
					>
						Remove
					</button>
				</div>
			{/each}
			<button type="button" on:click={addTag} class="text-primary hover:text-primary-dark mt-2">
				+ Add Tag
			</button>
		</div>

		<div class="space-y-4">
			<h3 class="text-lg font-medium">Event Dates</h3>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="startDate" class="block text-sm font-medium text-gray-700">Start Date</label>
					<input
						type="date"
						id="startDate"
						bind:value={eventData.eventDate.start}
						required
						class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					/>
				</div>
				<div>
					<label for="endDate" class="block text-sm font-medium text-gray-700">End Date</label>
					<input
						type="date"
						id="endDate"
						bind:value={eventData.eventDate.end}
						required
						class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					/>
				</div>
			</div>
		</div>

		<div class="space-y-4">
			<h3 class="text-lg font-medium">Location</h3>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="addressLine1" class="block text-sm font-medium text-gray-700"
						>Address Line 1</label
					>
					<input
						type="text"
						id="addressLine1"
						bind:value={eventData.location.addressLine1}
						class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					/>
				</div>
				<div>
					<label for="addressLine2" class="block text-sm font-medium text-gray-700"
						>Address Line 2</label
					>
					<input
						type="text"
						id="addressLine2"
						bind:value={eventData.location.addressLine2}
						class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					/>
				</div>
				<div>
					<label for="city" class="block text-sm font-medium text-gray-700">City</label>
					<input
						type="text"
						id="city"
						bind:value={eventData.location.city}
						class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					/>
				</div>
				<div>
					<label for="state" class="block text-sm font-medium text-gray-700">State</label>
					<input
						type="text"
						id="state"
						bind:value={eventData.location.state}
						class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					/>
				</div>
				<div>
					<label for="zipCode" class="block text-sm font-medium text-gray-700">ZIP Code</label>
					<input
						type="text"
						id="zipCode"
						bind:value={eventData.location.zipCode}
						class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					/>
				</div>
				<div>
					<label for="country" class="block text-sm font-medium text-gray-700">Country</label>
					<input
						type="text"
						id="country"
						bind:value={eventData.location.country}
						class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					/>
				</div>
			</div>
		</div>

		<div class="space-y-4">
			<h3 class="text-lg font-medium">Pricing</h3>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="registrationPricing" class="block text-sm font-medium text-gray-700"
						>Regular Price</label
					>
					<input
						type="number"
						id="registrationPricing"
						bind:value={eventData.registrationPricing}
						class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					/>
				</div>
				<div>
					<label for="earlyBirdPricing" class="block text-sm font-medium text-gray-700"
						>Early Bird Price</label
					>
					<input
						type="number"
						id="earlyBirdPricing"
						bind:value={eventData.earlyBirdRegistrationPricing}
						class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					/>
				</div>
			</div>
		</div>

		<div class="space-y-4">
			<h3 class="text-lg font-medium">Capacity</h3>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="seatsAvailable" class="block text-sm font-medium text-gray-700"
						>Total Seats Available</label
					>
					<input
						type="number"
						id="seatsAvailable"
						bind:value={eventData.seatsAvailable}
						class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					/>
				</div>
				<div>
					<label for="seatsPurchased" class="block text-sm font-medium text-gray-700"
						>Seats Purchased</label
					>
					<input
						type="number"
						id="seatsPurchased"
						bind:value={eventData.seatsPurchased}
						class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					/>
				</div>
			</div>
		</div>

		<div class="space-y-4">
			<h3 class="text-lg font-medium">Social Media Links</h3>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="facebook" class="block text-sm font-medium text-gray-700">Facebook</label>
					<input
						type="url"
						id="facebook"
						bind:value={eventData.socialMediaLinks.facebook}
						class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					/>
				</div>
				<div>
					<label for="x" class="block text-sm font-medium text-gray-700">X (Twitter)</label>
					<input
						type="url"
						id="x"
						bind:value={eventData.socialMediaLinks.x}
						class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					/>
				</div>
				<div>
					<label for="linkedin" class="block text-sm font-medium text-gray-700">LinkedIn</label>
					<input
						type="url"
						id="linkedin"
						bind:value={eventData.socialMediaLinks.linkedIn}
						class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					/>
				</div>
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700">Contact Email</label>
					<input
						type="email"
						id="email"
						bind:value={eventData.socialMediaLinks.email}
						class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
					/>
				</div>
			</div>
		</div>

		<div class="space-y-4">
			<h3 class="text-lg font-medium">Speakers</h3>
			{#each eventData.speakers as speaker, index (index)}
				<div class="rounded-md border p-4">
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label for="speaker-{index}" class="block text-sm font-medium text-gray-700"
								>Speaker ID</label
							>
							<input
								type="text"
								id="speaker-{index}"
								bind:value={speaker.userId}
								class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
							/>
						</div>
						{#each Object.entries(speaker.metaData) as [key, value] (key)}
							<div>
								<label for="speaker-{index}-{key}" class="block text-sm font-medium text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
								<input
									type='text'
									bind:value={speaker.metaData[key]}
									class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
								/>
							</div>
						{/each}
						<button
							type="button"
							on:click={() => removeSpeaker(index)}
							class="text-red-600 hover:text-red-800"
						>
							Remove Speaker
						</button>
					</div>
				</div>
			{/each}
			<button type="button" on:click={addSpeaker} class="text-primary hover:text-primary-dark mt-2">
				+ Add Speaker
			</button>
		</div>

		<div class="space-y-4">
			<h3 class="text-lg font-medium">Program Schedule</h3>
			{#each eventData.programSchedule as item, index}
				<div class="rounded-md border p-4">
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label for="time-{index}" class="block text-sm font-medium text-gray-700">Time</label>
							<input
								type="datetime-local"
								id="time-{index}"
								bind:value={item.time}
								class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
							/>
						</div>
						<div>
							<label for="period-{index}" class="block text-sm font-medium text-gray-700"
								>Period</label
							>
							<input
								type="text"
								id="period-{index}"
								bind:value={item.period}
								class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
							/>
						</div>
						<div>
							<label for="title-{index}" class="block text-sm font-medium text-gray-700"
								>Title</label
							>
							<input
								type="text"
								id="title-{index}"
								bind:value={item.title}
								class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
							/>
						</div>
						<div>
							<label for="location-{index}" class="block text-sm font-medium text-gray-700"
								>Location</label
							>
							<input
								type="text"
								id="location-{index}"
								bind:value={item.location}
								placeholder="e.g. Main Hall"
								class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
							/>
						</div>
						<div>
							<label for="description-{index}" class="block text-sm font-medium text-gray-700"
								>Description</label
							>
							<input
								type="text"
								id="description-{index}"
								bind:value={item.description}
								class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
							/>
						</div>
						<button
							type="button"
							on:click={() => removeProgramItem(index)}
							class="text-red-600 hover:text-red-800"
						>
							Remove Item
						</button>
					</div>
				</div>
			{/each}
			<button
				type="button"
				on:click={addProgramItem}
				class="text-primary hover:text-primary-dark mt-2"
			>
				+ Add Program Item
			</button>
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
