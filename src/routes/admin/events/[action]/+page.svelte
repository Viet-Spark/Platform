<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import {
		createEvent,
		updateEvent,
		events,
		fetchEvents,
	} from '$lib/stores/eventStore';
	import { EventCategory } from '$lib/types/event';
	import { v4 as uuidv4 } from 'uuid';
	import { uploadImage } from '$lib/firebase/uploadImage';

	let isEditing = $page.params.action === 'edit';
	let isNew = $page.params.action === 'new';
	let eventId = $page.params.id;

	let eventData = {
		uuid: uuidv4(),
		title: '',
		slug: '',
		description: '',
		eventCategory: 'Vietnam Tech Summit',
		year: new Date().getFullYear(),
		coverImage: '',
		images: [],
		attendees: [],
		location: {
			addressLine1: '',
			addressLine2: '',
			city: '',
			state: '',
			zipCode: '',
			country: '',
		},
		registrationPricing: {
			amount: 0,
			currency: 'USD',
			description: '',
		},
		earlyBirdRegistrationPricing: {
			amount: 0,
			currency: 'USD',
			description: '',
		},
		eventDate: {
			start: '',
			end: '',
		},
		eventTime: '',
		seatsAvailable: 0,
		seatsPurchased: 0,
		socialMediaLinks: {
			facebook: '',
			x: '',
			linkedin: '',
			email: '',
		},
		speakers: [],
		eventContactEmail: '',
		programSchedule: [],
		status: 'draft',
		tags: [],
		isFeatured: false,
		registrationDeadline: '',
		refundPolicy: '',
		requirements: [],
		targetAudience: [],
		whatToBring: [],
		additionalInfo: '',
	};

	let imagesText = '';
	let isMultiDayEvent = false;

	// Add state for file inputs
	let coverImageFile = null;
	let galleryImageFiles = [];
	let uploadingCover = false;
	let uploadingGallery = false;
	let uploadError = '';

	function updateImagesText() {
		imagesText = eventData.images.join('\n');
	}

	function handleImagesInput(event) {
		const urls = event.target.value.split('\n').filter((url) => url.trim());
		eventData.images = urls;
	}

	let newSpeaker = { userId: '', metaData: {} };
	let newScheduleItem = {
		time: '',
		period: '',
		title: '',
		description: '',
		location: '',
	};
	let newTag = '';
	let newRequirement = '';
	let newTargetAudience = '';
	let newWhatToBring = '';

	onMount(async () => {
		if (isEditing && eventId) {
			await fetchEvents();
			const event = $events.find((e) => e.id === eventId);
			if (event) {
				const eventDate =
					typeof event.eventDate === 'object'
						? event.eventDate
						: {
								start: new Date(event.eventDate)
									.toISOString()
									.split('T')[0],
								end: new Date(event.eventDate)
									.toISOString()
									.split('T')[0],
							};
				isMultiDayEvent = eventDate.start !== eventDate.end;

				eventData = {
					...event,
					eventDate,
					registrationDeadline: event.registrationDeadline
						? new Date(event.registrationDeadline)
								.toISOString()
								.split('T')[0]
						: '',
				};
				updateImagesText();
			}
		} else if (isNew) {
			// Set default values for new events
			eventData = {
				...eventData,
				uuid: uuidv4(),
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				status: 'draft',
				seatsPurchased: 0,
			};
		}
	});

	function addSpeaker() {
		if (newSpeaker.userId) {
			eventData.speakers = [...eventData.speakers, { ...newSpeaker }];
			newSpeaker = { userId: '', metaData: {} };
		}
	}

	function removeSpeaker(index) {
		eventData.speakers = eventData.speakers.filter((_, i) => i !== index);
	}

	function addScheduleItem() {
		if (newScheduleItem.time && newScheduleItem.title) {
			eventData.programSchedule = [
				...eventData.programSchedule,
				{ ...newScheduleItem },
			];
			newScheduleItem = {
				time: '',
				period: '',
				title: '',
				description: '',
				location: '',
			};
		}
	}

	function removeScheduleItem(index) {
		eventData.programSchedule = eventData.programSchedule.filter(
			(_, i) => i !== index
		);
	}

	function addTag() {
		if (newTag && !eventData.tags.includes(newTag)) {
			eventData.tags = [...eventData.tags, newTag];
			newTag = '';
		}
	}

	function removeTag(tag) {
		eventData.tags = eventData.tags.filter((t) => t !== tag);
	}

	function addRequirement() {
		if (
			newRequirement &&
			!eventData.requirements.includes(newRequirement)
		) {
			eventData.requirements = [
				...eventData.requirements,
				newRequirement,
			];
			newRequirement = '';
		}
	}

	function removeRequirement(req) {
		eventData.requirements = eventData.requirements.filter(
			(r) => r !== req
		);
	}

	function addTargetAudience() {
		if (
			newTargetAudience &&
			!eventData.targetAudience.includes(newTargetAudience)
		) {
			eventData.targetAudience = [
				...eventData.targetAudience,
				newTargetAudience,
			];
			newTargetAudience = '';
		}
	}

	function removeTargetAudience(audience) {
		eventData.targetAudience = eventData.targetAudience.filter(
			(a) => a !== audience
		);
	}

	function addWhatToBring() {
		if (newWhatToBring && !eventData.whatToBring.includes(newWhatToBring)) {
			eventData.whatToBring = [...eventData.whatToBring, newWhatToBring];
			newWhatToBring = '';
		}
	}

	function removeWhatToBring(item) {
		eventData.whatToBring = eventData.whatToBring.filter((i) => i !== item);
	}

	// Handle cover image upload
	async function handleCoverImageChange(event) {
		const file = event.target.files[0];
		if (!file) return;
		uploadingCover = true;
		uploadError = '';
		try {
			const url = await uploadImage(file, 'events/coverImages/');
			eventData.coverImage = url;
		} catch (err) {
			uploadError = 'Failed to upload cover image.';
		} finally {
			uploadingCover = false;
		}
	}

	// Handle gallery images upload
	async function handleGalleryImagesChange(event) {
		const files = Array.from(event.target.files);
		if (!files.length) return;
		uploadingGallery = true;
		uploadError = '';
		try {
			const urls = [];
			for (const file of files) {
				const url = await uploadImage(file, 'events/galleryImages/');
				urls.push(url);
			}
			eventData.images = urls;
			updateImagesText();
		} catch (err) {
			uploadError = 'Failed to upload gallery images.';
		} finally {
			uploadingGallery = false;
		}
	}

	async function handleSubmit() {
		try {
			const dataToSubmit = {
				...eventData,
				eventDate: {
					start: new Date(eventData.eventDate.start),
					end: new Date(eventData.eventDate.end),
				},
				createdAt: isEditing ? eventData.createdAt : new Date(),
				updatedAt: new Date(),
			};

			if (isEditing) {
				await updateEvent(eventId, dataToSubmit);
			} else {
				await createEvent(dataToSubmit);
			}
			goto('/admin/events');
		} catch (error) {
			console.error('Error saving event:', error);
		}
	}
</script>

<div class="max-w-4xl mx-auto">
	<h1 class="mb-8 text-3xl font-bold">
		{isEditing ? 'Edit Event' : 'Create New Event'}
	</h1>

	{#if isNew || isEditing}
		<form
			on:submit|preventDefault={handleSubmit}
			class="space-y-8"
		>
			<!-- Basic Information -->
			<div class="space-y-6">
				<h2 class="text-xl font-semibold">Basic Information</h2>

				<div>
					<label
						for="title"
						class="block text-sm font-medium text-gray-700"
						>Title</label
					>
					<input
						type="text"
						id="title"
						bind:value={eventData.title}
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
					/>
				</div>

				<div>
					<label
						for="slug"
						class="block text-sm font-medium text-gray-700"
						>Slug</label
					>
					<input
						type="text"
						id="slug"
						bind:value={eventData.slug}
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
					/>
				</div>

				<div>
					<label
						for="description"
						class="block text-sm font-medium text-gray-700"
						>Description</label
					>
					<textarea
						id="description"
						bind:value={eventData.description}
						rows="4"
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
					></textarea>
				</div>

				<div>
					<label
						for="eventCategory"
						class="block text-sm font-medium text-gray-700"
						>Category</label
					>
					<select
						id="eventCategory"
						bind:value={eventData.eventCategory}
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
					>
						{#each Object.values(EventCategory) as category}
							<option value={category}>{category}</option>
						{/each}
					</select>
				</div>

				<div>
					<label
						for="year"
						class="block text-sm font-medium text-gray-700"
						>Year</label
					>
					<input
						type="number"
						id="year"
						bind:value={eventData.year}
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
					/>
				</div>
			</div>

			<!-- Images -->
			<div class="space-y-6">
				<h2 class="text-xl font-semibold">Images</h2>

				<div>
					<label
						for="coverImage"
						class="block text-sm font-medium text-gray-700"
						>Cover Image</label
					>
					<input
						type="file"
						id="coverImage"
						accept="image/*"
						on:change={handleCoverImageChange}
					/>
					{#if uploadingCover}
						<p class="text-sm text-blue-600">
							Uploading cover image...
						</p>
					{/if}
					{#if eventData.coverImage}
						<img
							src={eventData.coverImage}
							alt="Cover Preview"
							class="mt-2 max-h-40 rounded"
						/>
					{/if}
				</div>

				<div>
					<label
						for="galleryImages"
						class="block text-sm font-medium text-gray-700"
						>Gallery Images</label
					>
					<input
						type="file"
						id="galleryImages"
						accept="image/*"
						multiple
						on:change={handleGalleryImagesChange}
					/>
					{#if uploadingGallery}
						<p class="text-sm text-blue-600">
							Uploading gallery images...
						</p>
					{/if}
					{#if eventData.images.length}
						<div class="flex flex-wrap gap-2 mt-2">
							{#each eventData.images as img, idx}
								<img
									src={img}
									alt="Gallery {idx}"
									class="max-h-24 rounded"
								/>
							{/each}
						</div>
					{/if}
				</div>
				{#if uploadError}
					<p class="text-sm text-red-600">{uploadError}</p>
				{/if}
			</div>

			<!-- Location -->
			<div class="space-y-6">
				<h2 class="text-xl font-semibold">Location</h2>

				<div>
					<label
						for="addressLine1"
						class="block text-sm font-medium text-gray-700"
						>Address Line 1</label
					>
					<input
						type="text"
						id="addressLine1"
						bind:value={eventData.location.addressLine1}
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
					/>
				</div>

				<div>
					<label
						for="addressLine2"
						class="block text-sm font-medium text-gray-700"
						>Address Line 2</label
					>
					<input
						type="text"
						id="addressLine2"
						bind:value={eventData.location.addressLine2}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
					/>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label
							for="city"
							class="block text-sm font-medium text-gray-700"
							>City</label
						>
						<input
							type="text"
							id="city"
							bind:value={eventData.location.city}
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
						/>
					</div>

					<div>
						<label
							for="state"
							class="block text-sm font-medium text-gray-700"
							>State</label
						>
						<input
							type="text"
							id="state"
							bind:value={eventData.location.state}
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
						/>
					</div>

					<div>
						<label
							for="zipCode"
							class="block text-sm font-medium text-gray-700"
							>ZIP Code</label
						>
						<input
							type="text"
							id="zipCode"
							bind:value={eventData.location.zipCode}
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
						/>
					</div>

					<div>
						<label
							for="country"
							class="block text-sm font-medium text-gray-700"
							>Country</label
						>
						<input
							type="text"
							id="country"
							bind:value={eventData.location.country}
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
						/>
					</div>
				</div>
			</div>

			<!-- Pricing -->
			<div class="space-y-6">
				<h2 class="text-xl font-semibold">Pricing</h2>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label
							for="regularPrice"
							class="block text-sm font-medium text-gray-700"
							>Regular Price</label
						>
						<div class="mt-1 flex rounded-md shadow-sm">
							<span
								class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500"
							>
								$
							</span>
							<input
								type="number"
								id="regularPrice"
								bind:value={
									eventData.registrationPricing.amount
								}
								required
								class="block w-full rounded-none rounded-r-md border-gray-300 focus:border-primary focus:ring-primary"
							/>
						</div>
					</div>

					<div>
						<label
							for="earlyBirdPrice"
							class="block text-sm font-medium text-gray-700"
							>Early Bird Price</label
						>
						<div class="mt-1 flex rounded-md shadow-sm">
							<span
								class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500"
							>
								$
							</span>
							<input
								type="number"
								id="earlyBirdPrice"
								bind:value={
									eventData.earlyBirdRegistrationPricing
										.amount
								}
								class="block w-full rounded-none rounded-r-md border-gray-300 focus:border-primary focus:ring-primary"
							/>
						</div>
					</div>
				</div>
			</div>

			<!-- Date and Time -->
			<div class="space-y-6">
				<h2 class="text-xl font-semibold">Date and Time</h2>

				<div class="flex items-center mb-4">
					<input
						type="checkbox"
						id="isMultiDayEvent"
						bind:checked={isMultiDayEvent}
						class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
					/>
					<label
						for="isMultiDayEvent"
						class="ml-2 block text-sm text-gray-700"
					>
						This is a multi-day event
					</label>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label
							for="eventDateStart"
							class="block text-sm font-medium text-gray-700"
						>
							{isMultiDayEvent ? 'Start Date' : 'Event Date'}
						</label>
						<input
							type="date"
							id="eventDateStart"
							bind:value={eventData.eventDate.start}
							required
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
						/>
					</div>

					{#if isMultiDayEvent}
						<div>
							<label
								for="eventDateEnd"
								class="block text-sm font-medium text-gray-700"
							>
								End Date
							</label>
							<input
								type="date"
								id="eventDateEnd"
								bind:value={eventData.eventDate.end}
								required
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
							/>
						</div>
					{/if}
				</div>

				<div>
					<label
						for="eventTime"
						class="block text-sm font-medium text-gray-700"
					>
						Event Time
					</label>
					<input
						type="text"
						id="eventTime"
						bind:value={eventData.eventTime}
						required
						placeholder="e.g., 9:00 AM - 5:00 PM PST"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
					/>
				</div>

				<div>
					<label
						for="registrationDeadline"
						class="block text-sm font-medium text-gray-700"
					>
						Registration Deadline
					</label>
					<input
						type="date"
						id="registrationDeadline"
						bind:value={eventData.registrationDeadline}
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
					/>
				</div>
			</div>

			<!-- Capacity -->
			<div class="space-y-6">
				<h2 class="text-xl font-semibold">Capacity</h2>

				<div>
					<label
						for="seatsAvailable"
						class="block text-sm font-medium text-gray-700"
						>Total Seats Available</label
					>
					<input
						type="number"
						id="seatsAvailable"
						bind:value={eventData.seatsAvailable}
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
					/>
				</div>
			</div>

			<!-- Social Media -->
			<div class="space-y-6">
				<h2 class="text-xl font-semibold">Social Media Links</h2>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label
							for="facebook"
							class="block text-sm font-medium text-gray-700"
							>Facebook</label
						>
						<input
							type="url"
							id="facebook"
							bind:value={eventData.socialMediaLinks.facebook}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
						/>
					</div>

					<div>
						<label
							for="x"
							class="block text-sm font-medium text-gray-700"
							>X (Twitter)</label
						>
						<input
							type="url"
							id="x"
							bind:value={eventData.socialMediaLinks.x}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
						/>
					</div>

					<div>
						<label
							for="linkedin"
							class="block text-sm font-medium text-gray-700"
							>LinkedIn</label
						>
						<input
							type="url"
							id="linkedin"
							bind:value={eventData.socialMediaLinks.linkedin}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
						/>
					</div>

					<div>
						<label
							for="email"
							class="block text-sm font-medium text-gray-700"
							>Email</label
						>
						<input
							type="email"
							id="email"
							bind:value={eventData.socialMediaLinks.email}
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
						/>
					</div>
				</div>
			</div>

			<!-- Speakers -->
			<div class="space-y-6">
				<h2 class="text-xl font-semibold">Speakers</h2>

				<div class="space-y-4">
					{#each eventData.speakers as speaker, index}
						<div
							class="flex items-center space-x-4 rounded-lg border p-4"
						>
							<div class="flex-1">
								<p class="font-medium">
									Speaker ID: {speaker.userId}
								</p>
								{#if speaker.metaData.title}
									<p class="text-sm text-gray-600">
										{speaker.metaData.title}
									</p>
								{/if}
							</div>
							<button
								type="button"
								on:click={() => removeSpeaker(index)}
								class="text-red-600 hover:text-red-800"
							>
								Remove
							</button>
						</div>
					{/each}

					<div class="flex space-x-4">
						<input
							type="text"
							bind:value={newSpeaker.userId}
							placeholder="Speaker User ID"
							class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
						/>
						<button
							type="button"
							on:click={addSpeaker}
							class="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-dark"
						>
							Add Speaker
						</button>
					</div>
				</div>
			</div>

			<!-- Program Schedule -->
			<div class="space-y-6">
				<h2 class="text-xl font-semibold">Program Schedule</h2>

				<div class="space-y-4">
					{#each eventData.programSchedule as item, index}
						<div class="rounded-lg border p-4">
							<div class="mb-2 flex items-center justify-between">
								<h3 class="font-medium">{item.title}</h3>
								<button
									type="button"
									on:click={() => removeScheduleItem(index)}
									class="text-red-600 hover:text-red-800"
								>
									Remove
								</button>
							</div>
							<p class="text-sm text-gray-600">
								{item.time} - {item.period}
							</p>
							<p class="mt-2">{item.description}</p>
						</div>
					{/each}

					<div class="space-y-4 rounded-lg border p-4">
						<div>
							<label
								class="block text-sm font-medium text-gray-700"
								>Time</label
							>
							<input
								type="text"
								bind:value={newScheduleItem.time}
								placeholder="e.g., 9:00 AM"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
							/>
						</div>

						<div>
							<label
								class="block text-sm font-medium text-gray-700"
								>Period</label
							>
							<input
								type="text"
								bind:value={newScheduleItem.period}
								placeholder="e.g., Morning Session"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
							/>
						</div>

						<div>
							<label
								class="block text-sm font-medium text-gray-700"
								>Title</label
							>
							<input
								type="text"
								bind:value={newScheduleItem.title}
								placeholder="Session Title"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
							/>
						</div>

						<div>
							<label
								class="block text-sm font-medium text-gray-700"
								>Description</label
							>
							<textarea
								bind:value={newScheduleItem.description}
								rows="3"
								placeholder="Session Description"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
							></textarea>
						</div>

						<div>
							<label
								class="block text-sm font-medium text-gray-700"
								>Location</label
							>
							<input
								type="text"
								bind:value={newScheduleItem.location}
								placeholder="e.g. Main Hall"
								class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
							/>
						</div>

						<button
							type="button"
							on:click={addScheduleItem}
							class="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-dark"
						>
							Add Schedule Item
						</button>
					</div>
				</div>
			</div>

			<!-- Additional Information -->
			<div class="space-y-6">
				<h2 class="text-xl font-semibold">Additional Information</h2>

				<div>
					<label
						for="eventContactEmail"
						class="block text-sm font-medium text-gray-700"
						>Contact Email</label
					>
					<input
						type="email"
						id="eventContactEmail"
						bind:value={eventData.eventContactEmail}
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
					/>
				</div>

				<div>
					<label
						for="refundPolicy"
						class="block text-sm font-medium text-gray-700"
						>Refund Policy</label
					>
					<textarea
						id="refundPolicy"
						bind:value={eventData.refundPolicy}
						rows="3"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
					></textarea>
				</div>

				<div>
					<label
						for="additionalInfo"
						class="block text-sm font-medium text-gray-700"
						>Additional Information</label
					>
					<textarea
						id="additionalInfo"
						bind:value={eventData.additionalInfo}
						rows="4"
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
					></textarea>
				</div>
			</div>

			<!-- Tags -->
			<div class="space-y-6">
				<h2 class="text-xl font-semibold">Tags</h2>

				<div class="flex flex-wrap gap-2">
					{#each eventData.tags as tag}
						<span
							class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm"
						>
							{tag}
							<button
								type="button"
								on:click={() => removeTag(tag)}
								class="ml-2 text-gray-500 hover:text-gray-700"
							>
								×
							</button>
						</span>
					{/each}
				</div>

				<div class="flex space-x-4">
					<input
						type="text"
						bind:value={newTag}
						placeholder="Add a tag"
						class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
					/>
					<button
						type="button"
						on:click={addTag}
						class="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-dark"
					>
						Add Tag
					</button>
				</div>
			</div>

			<!-- Requirements -->
			<div class="space-y-6">
				<h2 class="text-xl font-semibold">Requirements</h2>

				<div class="space-y-2">
					{#each eventData.requirements as requirement}
						<div
							class="flex items-center justify-between rounded-lg border p-2"
						>
							<span>{requirement}</span>
							<button
								type="button"
								on:click={() => removeRequirement(requirement)}
								class="text-red-600 hover:text-red-800"
							>
								Remove
							</button>
						</div>
					{/each}
				</div>

				<div class="flex space-x-4">
					<input
						type="text"
						bind:value={newRequirement}
						placeholder="Add a requirement"
						class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
					/>
					<button
						type="button"
						on:click={addRequirement}
						class="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-dark"
					>
						Add Requirement
					</button>
				</div>
			</div>

			<!-- Target Audience -->
			<div class="space-y-6">
				<h2 class="text-xl font-semibold">Target Audience</h2>

				<div class="space-y-2">
					{#each eventData.targetAudience as audience}
						<div
							class="flex items-center justify-between rounded-lg border p-2"
						>
							<span>{audience}</span>
							<button
								type="button"
								on:click={() => removeTargetAudience(audience)}
								class="text-red-600 hover:text-red-800"
							>
								Remove
							</button>
						</div>
					{/each}
				</div>

				<div class="flex space-x-4">
					<input
						type="text"
						bind:value={newTargetAudience}
						placeholder="Add target audience"
						class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
					/>
					<button
						type="button"
						on:click={addTargetAudience}
						class="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-dark"
					>
						Add Audience
					</button>
				</div>
			</div>

			<!-- What to Bring -->
			<div class="space-y-6">
				<h2 class="text-xl font-semibold">What to Bring</h2>

				<div class="space-y-2">
					{#each eventData.whatToBring as item}
						<div
							class="flex items-center justify-between rounded-lg border p-2"
						>
							<span>{item}</span>
							<button
								type="button"
								on:click={() => removeWhatToBring(item)}
								class="text-red-600 hover:text-red-800"
							>
								Remove
							</button>
						</div>
					{/each}
				</div>

				<div class="flex space-x-4">
					<input
						type="text"
						bind:value={newWhatToBring}
						placeholder="Add item to bring"
						class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
					/>
					<button
						type="button"
						on:click={addWhatToBring}
						class="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-dark"
					>
						Add Item
					</button>
				</div>
			</div>

			<!-- Status and Featured -->
			<div class="space-y-6">
				<h2 class="text-xl font-semibold">Status</h2>

				<div>
					<label
						for="status"
						class="block text-sm font-medium text-gray-700"
						>Event Status</label
					>
					<select
						id="status"
						bind:value={eventData.status}
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
					>
						<option value="draft">Draft</option>
						<option value="published">Published</option>
						<option value="cancelled">Cancelled</option>
					</select>
				</div>

				<div class="flex items-center">
					<input
						type="checkbox"
						id="isFeatured"
						bind:checked={eventData.isFeatured}
						class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
					/>
					<label
						for="isFeatured"
						class="ml-2 block text-sm text-gray-700"
					>
						Feature this event on the homepage
					</label>
				</div>
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
					class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
				>
					{isEditing ? 'Update Event' : 'Create Event'}
				</button>
			</div>
		</form>
	{:else}
		<div class="text-center py-8">
			<p class="text-gray-600">
				Invalid action. Please use "new" or "edit".
			</p>
			<a
				href="/admin/events"
				class="text-primary hover:text-primary-dark mt-4 inline-block"
			>
				Return to Events
			</a>
		</div>
	{/if}
</div>
