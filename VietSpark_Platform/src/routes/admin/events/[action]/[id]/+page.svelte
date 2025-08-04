<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { eventCategories, eventCategoriesLoading, addEventCategory, removeEventCategory, updateEventCategory } from '$lib/stores/eventCategoryStore';
	import MarkdownEditor from '$lib/components/MarkdownEditor.svelte';
	import MediaUploader from '$lib/components/MediaUploader.svelte';
	import { eventStore, eventHandlers } from '$lib/stores/eventStore2';
	import { validateFile, validateImageFile, validateVideoFile} from '$lib/utils/validator.js';

	let eventData = {
		eventCategoryId: '',
		title: '',
		eventId: '',
		year: new Date().getFullYear(),
		description: '',
		shortDescription: '',
		coverImage: '',
		tempCoverFile: null,
		images: [],
		tempGalleryFiles: [],
		videos: [],
		tempVideoFiles: [],
		attendees: [],
		tags: [],
		location: {
			addressLine1: '',
			addressLine2: '',
			city: '',
			state: '',
			zipCode: '',
			country: '',
			displayText: ''
		},
		registrationPricing: 0,
		earlyBirdRegistrationPricing: 0,
		registrationLink: '',
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
		sponsors: [],
		testimonials: [],
		eventContactEmail: '',
		programSchedule: [],
		createdAt: null,
		updatedAt: null
	};

	let isEditing = $page.params.action === 'edit';
	let eventId = $page.params.id;
	let isSubmitting = false;
	let error = null;
	let event = null;
	let uploadError = null;
	let activeTab = 'details'; // Possible values: details, speakers, testimonials, sponsors, program

	onMount(() => {
		if (isEditing && eventId) {
			event = $eventStore.events.find((e) => e.id === eventId);
			if (event) {
				// Only update fields that come from the store, preserve temp fields
				const oldTestimonials = eventData.testimonials;
				eventData = {
					...eventData,
					...event,
					eventDate: {
						start: formatDateForInput(event.eventDate?.start),
						end: formatDateForInput(event.eventDate?.end)
					},
					// If testimonials already have temp fields, keep them
					testimonials: oldTestimonials.length > 0 ? oldTestimonials : (event.testimonials || [])
				};
				if (eventData.programSchedule) {
					eventData.programSchedule = eventData.programSchedule.map(item => {
						if (item.startTime) {
							item.startTime = formatDateForInput(item.startTime);
						}
						if (item.endTime) {
							item.endTime = formatDateForInput(item.endTime);
						}
						return item;
					})
				}
			}
		}
	});

	// Function to format date for datetime-local input
	const formatDateForInput = (timestamp) => {
		if (!timestamp) return '';
		
		let date;
		if (timestamp.seconds) {
			date = new Date(timestamp.seconds * 1000); // Convert Firestore Timestamp
		} else {
			date = new Date(timestamp); // Handle regular date string
		}
			
		if (isNaN(date.getTime())) return ''; // Invalid date
		
		// Format to YYYY-MM-DDThh:mm
		const pad = (num) => num.toString().padStart(2, '0');
		const year = date.getFullYear();
		const month = pad(date.getMonth() + 1); // Months are 0-based
		const day = pad(date.getDate());
		const hours = pad(date.getHours());
		const minutes = pad(date.getMinutes());
		
		return `${year}-${month}-${day}T${hours}:${minutes}`;
	};

	function addSpeaker() {
		eventData.speakers = [
			...eventData.speakers,
			{
				id: crypto.randomUUID(),
				firstName: '',
				lastName: '',
				tempFile: null,
				phone: '',
				title: '',
				bio: '',
				image: '', 
				socials: {
					facebook: '',
					x: '',
					linkedIn: '',
					email: '', 
					website: ''
				}
			}
		];
	}

	function removeSpeaker(index) {
		eventData.speakers = eventData.speakers.filter((_, i) => i !== index);
	}

	function addTestimonial() {
		eventData.testimonials = [
			...eventData.testimonials,
			{
				id: crypto.randomUUID(),
				firstName: '',
				lastName: '',
				title: '',
				videoUrl: '',
				imageUrls: [],
				tempImageFiles: [],
				tempVideoFile: null,
				headerText: '',
				text: ''
			}
		];
	}

	function removeTestimonial(index) {
		eventData.testimonials = eventData.testimonials.filter((_, i) => i !== index);
	}

	function addSponsor() {
		eventData.sponsors = [
			...eventData.sponsors,
			{
				id: crypto.randomUUID(),
				sponsor_name: '',
				sponsor_logo: '',
				sponsor_url: '',
				tempLogoFile: null
			}
		];
	}

	function removeSponsor(index) {
		eventData.sponsors = eventData.sponsors.filter((_, i) => i !== index);
	}

	function addProgramItem() {
		eventData.programSchedule = [
			...eventData.programSchedule,
			{
				id: crypto.randomUUID(),
				startTime: '',
				endTime: '',
				title: '',
				description: '',
				location: '',
				images: [],
				tempFiles: []
			}
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

	function handleCoverUpload(event) {
		const [file] = event.detail.files;
		const validationError = validateImageFile(file);
		if (validationError) {
			uploadError = validationError;
			return;
		}
		// Cleanup previous cover image blob URL if exists
		if (eventData.coverImage && eventData.coverImage.startsWith('blob:')) {
			URL.revokeObjectURL(eventData.coverImage);
		}
		eventData.tempCoverFile = file;
		// Create temporary preview URL
		const reader = new FileReader();
		reader.onloadend = () => {
			eventData.coverImage = reader.result;
		};
		reader.readAsDataURL(file);
	}

	function handleGalleryUpload(event) {
		eventData.tempGalleryFiles = [...eventData.tempGalleryFiles, ...event.detail.files];
		// Create temporary preview URLs
		event.detail.files.forEach(file => {
			const validationError = validateImageFile(file);
			if (validationError) {
				uploadError = validationError;
				return;
			}
			const reader = new FileReader();
			reader.onloadend = () => {
				eventData.images = [...eventData.images, reader.result];
			};
			reader.readAsDataURL(file);
		});
	}

	function handleSpeakerImageUpload(event) {
		const { files, speakerId } = event.detail;
		const [file] = files;
		const validationError = validateImageFile(file);
		if (validationError) {
			uploadError = validationError;
			return;
		}
		
		eventData.speakers = eventData.speakers.map(speaker => {
			if (speaker.id === speakerId) {
				// Cleanup previous speaker image blob URL if exists
				if (speaker.image && speaker.image.startsWith('blob:')) {
					URL.revokeObjectURL(speaker.image);
				}
				return { ...speaker, tempFile: file, image: URL.createObjectURL(file) };
			}
			return speaker;
		});
	}

	function handleVideosUpload(event) {
		const files = event.detail?.files || [];
		if (!files.length) return;

		// Initialize arrays if they don't exist
		eventData.tempVideoFiles ??= [];
		eventData.videos ??= [];

		files.forEach(file => {
			const validationError = validateVideoFile(file);
			if (validationError) {
				uploadError = validationError;
				console.warn("Video validation failed:", uploadError);
				return;
			}

			// Store the file and its preview URL
			eventData.tempVideoFiles = [...eventData.tempVideoFiles, file];
			const previewUrl = URL.createObjectURL(file);
			eventData.videos.push(previewUrl);

		});
		console.log("Video:", eventData)
	}

	function handleSponsorLogoUpload(event) {
		const { files, sponsorId } = event.detail;
		const [file] = files;
		const validationError = validateImageFile(file);
		if (validationError) {
			uploadError = validationError;
			return;
		}
		
		eventData.sponsors = eventData.sponsors.map(sponsor => {
			if (sponsor.id === sponsorId) {
				// Cleanup previous sponsor logo blob URL if exists
				if (sponsor.sponsor_logo && sponsor.sponsor_logo.startsWith('blob:')) {
					URL.revokeObjectURL(sponsor.sponsor_logo);
				}
				return { ...sponsor, tempLogoFile: file, sponsor_logo: URL.createObjectURL(file) };
			}
			return sponsor;
		});
	}

	function handleProgramImagesUpload(event) {
		const {files, programItemId} = event.detail;
		const errors = [];

		files.forEach(file => {	
			const validationError = validateImageFile(file);
			if (validationError) {
				errors.push(`${file.name}: ${validationError}`);
				return;
			}
			const previewUrl = URL.createObjectURL(file);
			eventData.programSchedule = eventData.programSchedule.map(item => {
				if (item.id === programItemId) {
					return { ...item, tempFiles: [...item.tempFiles, file], images: [...item.images, previewUrl] };
				}
				return item;
			});
		});

		if (errors.length > 0) {
			uploadError = errors.join('\n');
		}
	}

	function handleTestimonialsImagesUpload(event) {
		const {files, testimonialId} = event.detail;
		const errors = [];
		
		// Process all files
		files.forEach(file => {
			const validationError = validateImageFile(file);
			if (validationError) {
				errors.push(`${file.name}: ${validationError}`);
				return;
			}
			
			// Create temporary URL for preview
			const previewUrl = URL.createObjectURL(file);
			
			eventData.testimonials = eventData.testimonials.map(testimonial => {
				if (testimonial.id === testimonialId) {
					// Store both the file and its preview URL
					return {
						...testimonial,
						tempImageFiles: [...testimonial.tempImageFiles, file],
						imageUrls: [...testimonial.imageUrls, previewUrl]
					};
				}
				return testimonial;
			});
		});

		if (errors.length > 0) {
			uploadError = errors.join('\n');
		}
	}

	function handleTestimonialsVideoUpload(event) {
		const {files, testimonialId} = event.detail;
		const [file] = files;
		const validationError = validateVideoFile(file);
		
		if (validationError) {
			uploadError = validationError;
			return;
		}

		// Create temporary URL for preview
		const previewUrl = URL.createObjectURL(file);
		
		eventData.testimonials = eventData.testimonials.map(testimonial => {
			if (testimonial.id === testimonialId) {
				if (testimonial.videoUrl?.startsWith('blob:')) {
					URL.revokeObjectURL(testimonial.videoUrl);
				}
				return {
					...testimonial,
					tempVideoFile: file,
					videoUrl: previewUrl
				};
			}
			return testimonial;
		});
		eventData = { ...eventData, testimonials: [...eventData.testimonials] };
		console.log(eventData.testimonials)
	}

	async function handleSubmit(e) {
		console.log('Form submission started', eventData);
		isSubmitting = true;
		error = null;

		try {
			console.log('Uploading files...');
			// Create an event first to get eventId
			let eventId = ''; 
			const originalEventData = {
				title: eventData.title,
			};
			if (isEditing) {
				eventId = $page.params.id;
			} else {
				eventId = await eventHandlers.createEvent(originalEventData);
			}

			// Upload cover image
			let coverImageUrl = eventData.coverImage;
			if (eventData.tempCoverFile) {
				coverImageUrl = await eventHandlers.uploadCoverImage(eventData.tempCoverFile, eventId);
			}

			// Upload sponsor logos
			const sponsors = await Promise.all(eventData.sponsors.map(async (sponsor) => {
				if (sponsor.tempLogoFile) {
					const logoUrl = await eventHandlers.uploadSponsorLogo(sponsor.tempLogoFile, { eventId, sponsorId: sponsor.id });
					return { 
						...sponsor, 
						sponsor_logo: logoUrl,
						tempLogoFile: null // Remove temporary file
					};
				}
				return sponsor;
			}));

			// Upload gallery images
			let galleryUrls = eventData.images.filter(url => !url.startsWith('data:') && !url.startsWith('blob:')); // Keep existing URLs
			if (eventData.tempGalleryFiles?.length > 0) {
				const newUrls = await eventHandlers.uploadMultipleImages(eventData.tempGalleryFiles, eventId);
				galleryUrls = [...galleryUrls, ...newUrls];
			}

			// Upload speaker images
			const speakers = await Promise.all(eventData.speakers.map(async (speaker) => {
				if (speaker.tempFile) {
					const imageUrl = await eventHandlers.uploadSpeakerImages(speaker.tempFile, { eventId, speakerId: speaker.id });
					return { 
						...speaker, 
						image: imageUrl,
						tempFile: null // Remove temporary file
					};
				}
				return speaker;
			}));

			// Upload videos
			let videoUrls = eventData.videos.filter(url => !url.startsWith('data:') && !url.startsWith('blob:')); // Keep existing URLs
			console.log(eventData.tempVideoFiles); 
			if (eventData.tempVideoFiles?.length > 0) {
				const newUrls = await eventHandlers.uploadMultipleVideos(eventData.tempVideoFiles, eventId);
				console.log(newUrls);
				videoUrls = [...videoUrls, ...newUrls];
			}

			// Upload program schedule images
			const programSchedule = await Promise.all(eventData.programSchedule.map(async (item) => {
				if (item.tempFiles?.length > 0) {
					const imageUrls = await eventHandlers.uploadProgramScheduleImages(item.tempFiles, eventId, item.id);
					return {
						...item,
						images: [...item.images.filter(url => !url.startsWith('data:') && !url.startsWith('blob:')), ...imageUrls],
						tempFiles: [] // Remove temporary files
					};
				}
				if (item.startTime) {
					item.startTime = new Date(item.startTime);
				}

				if (item.endTime) {
					item.endTime = new Date(item.endTime);
				}

				return {
					...item,
					images: item.images.filter(url => !url.startsWith('data:') && !url.startsWith('blob:')),
					tempFiles: [] // Remove temporary files
				};
			}));

			// Upload testimonials images and videos
			let testimonials = await Promise.all(eventData.testimonials.map(async (testimonial) => {
				let updatedTestimonial = { ...testimonial };
				
				// Upload images if any
				if (testimonial.tempImageFiles?.length > 0) {
					const imageUrls = await eventHandlers.uploadTestimonialsImages(testimonial.tempImageFiles, eventId, testimonial.id);
					updatedTestimonial = {
						...updatedTestimonial,
						imageUrls: [...testimonial.imageUrls.filter(url => !url.startsWith('data:') && !url.startsWith('blob:')), ...imageUrls],
						tempImageFiles: [] // Remove temporary files
					};
				} else {
					updatedTestimonial = {
						...updatedTestimonial,
						imageUrls: testimonial.imageUrls.filter(url => !url.startsWith('data:') && !url.startsWith('blob:')),
						tempImageFiles: [] // Remove temporary files
					};
				}

				// Upload video if any
				if (testimonial.tempVideoFile) {
					const videoUrl = await eventHandlers.uploadTestimonialsVideo(testimonial.tempVideoFile, eventId, testimonial.id);
					updatedTestimonial = {
						...updatedTestimonial,
						videoUrl: videoUrl,
						tempVideoFile: null // Remove temporary file
					};
				}
				return updatedTestimonial;
			}));

			console.log('Preparing data to submit...');
			const dataToSubmit = {
				...eventData,
				coverImage: coverImageUrl,
				sponsors,
				images: galleryUrls,
				videos: videoUrls,
				speakers,
				programSchedule,
				testimonials,
				eventDate: {
					start: new Date(eventData.eventDate.start),
					end: new Date(eventData.eventDate.end)
				},
				createdAt: isEditing ? eventData.createdAt : new Date(),
				updatedAt: new Date()
			};

			// Remove all temporary fields and blob URLs
			delete dataToSubmit.tempCoverFile;
			delete dataToSubmit.tempGalleryFiles;
			delete dataToSubmit.tempVideoFiles;

			console.log('Saving event...', { isEditing, eventId });
			await eventHandlers.updateEvent(eventId, dataToSubmit);
			console.log('Event saved successfully');
			goto('/admin/events');
		} catch (err) {
			console.error('Error saving event:', err);
			error = err.message;
		} finally {
			isSubmitting = false;
		}
	}

	// Update the cleanup function in onMount to handle all blob URLs
	onMount(() => {
		return () => {
			// Cleanup cover image
			if (eventData.coverImage?.startsWith('blob:')) {
				URL.revokeObjectURL(eventData.coverImage);
			}

			// Cleanup gallery images
			eventData.images.forEach(url => {
				if (url.startsWith('blob:')) {
					URL.revokeObjectURL(url);
				}
			});

			// Cleanup speaker images
			eventData.speakers.forEach(speaker => {
				if (speaker.image?.startsWith('blob:')) {
					URL.revokeObjectURL(speaker.image);
				}
			});

			// Cleanup sponsor logos
			eventData.sponsors.forEach(sponsor => {
				if (sponsor.sponsor_logo?.startsWith('blob:')) {
					URL.revokeObjectURL(sponsor.sponsor_logo);
				}
			});

			// Cleanup program schedule images
			eventData.programSchedule.forEach(item => {
				item.images.forEach(url => {
					if (url.startsWith('blob:')) {
						URL.revokeObjectURL(url);
					}
				});
			});

			// Cleanup videos
			eventData.videos.forEach(url => {
				if (url.startsWith('blob:')) {
					URL.revokeObjectURL(url);
				}
			});

			// Cleanup testimonial images and videos (already implemented)
			eventData.testimonials.forEach(testimonial => {
				testimonial.imageUrls.forEach(url => {
					if (url.startsWith('blob:')) {
						URL.revokeObjectURL(url);
					}
				});
				
				if (testimonial.videoUrl?.startsWith('blob:')) {
					URL.revokeObjectURL(testimonial.videoUrl);
				}
			});
		};
	});
</script>

<div class="container mx-auto px-4 py-8">
	{#if $eventCategoriesLoading}
		<div class="text-center">
			<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			<p class="mt-4">Loading event categories...</p>
		</div>
	{:else}
		<h1 class="flex flex-col items-center justify-center bg-primary text-white p-4 mb-8">
			{isEditing ? 'Edit Event' : 'Create New Event'}
		</h1>
		<section class="min-h-[50vh] bg-gray-50 py-12">
			<div class="container mx-auto px-4">
				<div class="rounded-lg bg-white p-6 shadow-md">
					<form 
						on:submit|preventDefault={handleSubmit}
						class="space-y-6"
					>
						<!-- Tab Navigation -->
						<div class="border-b border-gray-200">
							<nav class="-mb-px flex space-x-8" aria-label="Tabs">
								<button
									type="button"
									class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium {activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
									on:click={() => activeTab = 'details'}
								>
									Event Details
								</button>
								<button
									type="button"
									class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium {activeTab === 'speakers' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
									on:click={() => activeTab = 'speakers'}
								>
									Speakers
								</button>
								<button
									type="button"
									class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium {activeTab === 'testimonials' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
									on:click={() => activeTab = 'testimonials'}
								>
									Testimonials
								</button>
								<button
									type="button"
									class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium {activeTab === 'sponsors' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
									on:click={() => activeTab = 'sponsors'}
								>
									Sponsors
								</button>
								<button
									type="button"
									class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium {activeTab === 'program' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
									on:click={() => activeTab = 'program'}
								>
									Program Schedule
								</button>
							</nav>
						</div>

						<!-- Tab Content -->
						{#if activeTab === 'details'}
							<div class="space-y-6">
								<!-- Basic Event Information -->
								<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label for="title" class="block text-sm font-medium text-gray-700">Event Title</label>
										<input
											type="text"
											id="title"
											bind:value={eventData.title}
											required
											class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
										/>
									</div>

									<div>
										<label for="eventCategory" class="block text-sm font-medium text-gray-700"
											>Event Category</label
										>
										<select
											id="eventCategory"
											bind:value={eventData.eventCategoryId}
											required
											class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
										>
											<option value="">Select a category</option>
											{#each $eventCategories as category}
												<option value={category.id}>{category.name}</option>
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
											class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
										/>
									</div>

									<div>
										<label for="registrationLink" class="block text-sm font-medium text-gray-700">Registration Link</label>
										<input
											type="url"
											id="registrationLink"
											bind:value={eventData.registrationLink}
											class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
										/>
									</div>
								</div>

								<div>
									<label for="shortDescription" class="block text-sm font-medium text-gray-700">Short Description</label>
									<input
										type="text"
										id="shortDescription"
										bind:value={eventData.shortDescription}
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
									/>
								</div>

								<div>
									<label for="coverImage" class="block text-sm font-medium text-gray-700">Cover Image</label>
									<div>
										{#if eventData.coverImage}
											<div class="mt-2 h-40 w-40 relative">
												<img
													src={eventData.coverImage}
													alt="Event cover"
													class="rounded-lg object-cover h-40 w-40"
												/>
												<button
													type="button"
													class="absolute top-1 right-1 rounded-full p-1 bg-white text-red-500 hover:text-red-800 shadow-sm"
													on:click={() => {
														eventData.coverImage = '';
														eventData.tempCoverFile = null;
													}}
													aria-label="Remove cover image"
												>
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
														<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
													</svg>
												</button>
											</div>
										{:else}
											<MediaUploader
												type="cover"
												on:upload={handleCoverUpload}
												id="coverImage"
											/>
										{/if}
									</div>
								</div>

								<div>
									<label for="eventDescription" class="block text-sm font-medium text-gray-700">Description</label>
									<MarkdownEditor
										bind:value={eventData.description}
										id="eventDescription"
										placeholder=""
										onInput={(newValue) => {
											eventData.description = newValue;
										}}
									/>
								</div>

								<!-- Tags Section -->
								<div class="space-y-4">
									<h3 class="text-lg font-medium">Tags</h3>
									{#each eventData.tags as tag, index}
										<div class="flex items-center gap-2">
											<input
												type="text"
												bind:value={eventData.tags[index]}
												placeholder="Enter a tag"
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
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
									<button type="button" on:click={addTag} class="text-primary hover:text-primary-dark">
										+ Add Tag
									</button>
								</div>

								<!-- Event Dates -->
								<div class="space-y-4">
									<h3 class="text-lg font-medium">Event Dates</h3>
									<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label for="startDate" class="block text-sm font-medium text-gray-700">Start Date & Time</label>
											<input
												type="datetime-local"
												id="startDate"
												bind:value={eventData.eventDate.start}
												required
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
											/>
										</div>
										<div>
											<label for="endDate" class="block text-sm font-medium text-gray-700">End Date & Time</label>
											<input
												type="datetime-local"
												id="endDate"
												bind:value={eventData.eventDate.end}
												required
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
											/>
										</div>
									</div>
								</div>

								<!-- Location -->
								<div class="space-y-4">
									<h3 class="text-lg font-medium">Location</h3>
									<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label for="displayText" class="block text-sm font-medium text-gray-700">Display Text</label>
											<input
												type="text"
												id="displayText"
												bind:value={eventData.location.displayText}
												placeholder="e.g., Online (Zoom)"
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
											/>
										</div>
										<div>
											<label for="addressLine1" class="block text-sm font-medium text-gray-700">Address Line 1</label>
											<input
												type="text"
												id="addressLine1"
												bind:value={eventData.location.addressLine1}
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
											/>
										</div>
										<div>
											<label for="addressLine2" class="block text-sm font-medium text-gray-700">Address Line 2</label>
											<input
												type="text"
												id="addressLine2"
												bind:value={eventData.location.addressLine2}
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
											/>
										</div>
										<div>
											<label for="city" class="block text-sm font-medium text-gray-700">City</label>
											<input
												type="text"
												id="city"
												bind:value={eventData.location.city}
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
											/>
										</div>
										<div>
											<label for="state" class="block text-sm font-medium text-gray-700">State</label>
											<input
												type="text"
												id="state"
												bind:value={eventData.location.state}
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
											/>
										</div>
										<div>
											<label for="zipCode" class="block text-sm font-medium text-gray-700">ZIP Code</label>
											<input
												type="text"
												id="zipCode"
												bind:value={eventData.location.zipCode}
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
											/>
										</div>
										<div>
											<label for="country" class="block text-sm font-medium text-gray-700">Country</label>
											<input
												type="text"
												id="country"
												bind:value={eventData.location.country}
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
											/>
										</div>
									</div>
								</div>

								<!-- Pricing and Capacity -->
								<div class="space-y-4">
									<h3 class="text-lg font-medium">Pricing and Capacity</h3>
									<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label for="registrationPricing" class="block text-sm font-medium text-gray-700"
												>Regular Price</label
											>
											<input
												type="number"
												id="registrationPricing"
												bind:value={eventData.registrationPricing}
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
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
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
											/>
										</div>
										<div>
											<label for="seatsAvailable" class="block text-sm font-medium text-gray-700"
												>Total Seats Available</label
											>
											<input
												type="number"
												id="seatsAvailable"
												bind:value={eventData.seatsAvailable}
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
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
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
											/>
										</div>
									</div>
								</div>

								<!-- Social Media Links -->
								<div class="space-y-4">
									<h3 class="text-lg font-medium">Social Media Links</h3>
									<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
										{#each Object.entries(eventData.socialMediaLinks) as [platform, value]}
											<div>
												<label
													for="social_{platform}"
													class="block text-sm font-medium text-gray-700"
													>{platform.charAt(0).toUpperCase() + platform.slice(1)}</label
												>
												<input
													type="url"
													id="social_{platform}"
													bind:value={eventData.socialMediaLinks[platform]}
													class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
												/>
											</div>
										{/each}
										<div>
											<label for="eventContactEmail" class="block text-sm font-medium text-gray-700">Event Contact Email</label>
											<input
												type="email"
												id="eventContactEmail"
												bind:value={eventData.eventContactEmail}
												required
												class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
											/>
										</div>
									</div>
								</div>

								<!-- Gallery Images -->
								<div>
									<label for="galleryImages" class="block text-sm font-medium text-gray-700">Gallery Images</label>
									<div class="mt-1">
										<MediaUploader
											{eventId}
											type="gallery"
											id="galleryImages"
											multiple
											maxFiles={20}
											on:upload={handleGalleryUpload}
										/>
									</div>
									<div class="mt-2 grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-7">
										{#if eventData.images.length > 0}
											{#each eventData.images as image, index}
												<div class="relative bg-gray-100 rounded-lg p-2">
													<img
														src={image}
														alt="Gallery preview"
														class="aspect-square rounded-lg bg-white object-cover"
													/>
													<button
														type="button"
														on:click={() => eventData.images = eventData.images.filter((_, i) => i !== index)}
														class="absolute top-1 right-1 rounded-full p-1 bg-white text-red-500 hover:text-red-800 shadow-sm"
														aria-label="Remove image"
													>
														<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
															<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
														</svg>	
													</button>
												</div>
											{/each}
										{/if}
									</div>
								</div>

								<!-- Videos -->
								<div>
									<label for="videos" class="block text-sm font-medium text-gray-700">Videos</label>
									<div class="mt-1">
										<MediaUploader
											{eventId}
											type="videos"
											id="videos"
											multiple
											maxFiles={5}
											on:upload={handleVideosUpload}
										/>
									</div>
									<div class="mt-2 grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-7">
										{#if eventData.videos.length > 0}
											{#each eventData.videos as video, index}
												<div class="relative bg-gray-100 rounded-lg p-2">
													<video
														src={video}
														controls
														class="w-full rounded-lg"
													>
														<track kind="captions" />
													</video>
													<button
														type="button"
														on:click={() => eventData.videos = eventData.videos.filter((_, i) => i !== index)}
														class="absolute top-1 right-1 rounded-full p-1 bg-white text-red-500 hover:text-red-800 shadow-sm"
														aria-label="Remove video"
													>
														<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
															<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
														</svg>	
													</button>
												</div>
											{/each}
										{/if}
									</div>
								</div>
							</div>
						{:else if activeTab === 'speakers'}
							<div class="space-y-4">
								<div class="flex items-center justify-between">
									<h3 class="text-lg font-medium text-gray-900">Speakers</h3>
								</div>

								{#each eventData.speakers as speaker, index (speaker.id)}
									<div class="rounded-lg border bg-white p-4 shadow-sm">
										<div class="grid gap-6 md:grid-cols-[200px,1fr]">
											<!-- Speaker Image -->
											<div>
												<label for="speakerImage_{index}" class="block text-sm font-medium text-gray-700">Speaker Image</label>
											</div>
											{#if speaker.image}
												<div class="mt-2 h-40 w-40 relative">
													<img
														src={speaker.image}
														alt={speaker.name || 'Speaker photo'}
														class="rounded-lg object-cover h-40 w-40"
													/>
													<button
														type="button"
														class="absolute top-1 right-1 rounded-full p-1 bg-white text-red-500 hover:text-red-800 shadow-sm"
														on:click={() => {
															eventData.speakers[index].image = '';
															eventData.speakers[index].tempFile = null;
														}}
														aria-label="Remove speaker image"
													>
														<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
															<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
														</svg>
													</button>
												</div>
											{:else}
												<MediaUploader
													type="speakers"
													eventId={eventData.id}
													speakerId={speaker.id}
													on:upload={handleSpeakerImageUpload}
													id="speakerImage_{index}"
												/>
											{/if}

											<!-- Speaker Details -->
											<div class="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<label for="speakerFirstName_{index}" class="block text-sm font-medium text-gray-700">First Name</label>
													<input
														type="text"
														id="speakerFirstName_{index}"
														bind:value={speaker.firstName}
														class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
														placeholder="Speaker First Name"
													/>
												</div>

												<div>
													<label for="speakerLastName_{index}" class="block text-sm font-medium text-gray-700">Last Name</label>
													<input
														type="text"
														id="speakerLastName_{index}"
														bind:value={speaker.lastName}
														class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
														placeholder="Speaker Last Name"
													/>
												</div>

												<div>
													<label for="speakerTitle_{index}" class="block text-sm font-medium text-gray-700">Title</label>
													<input
														type="text"
														id="speakerTitle_{index}"
														bind:value={speaker.title}
														class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
														placeholder="Speaker Title or Role"
													/>
												</div>

												<div>
													<label for="speakerPhone_{index}" class="block text-sm font-medium text-gray-700">Phone Number</label>
													<input
														type="text"
														id="speakerPhone_{index}"
														bind:value={speaker.socials.phone}
														class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
														placeholder="Speaker Phone Number"
													/>
												</div>
												
												<div>
													<label for="speakerEmail_{index}" class="block text-sm font-medium text-gray-700">Email</label>
													<input
														type="text"
														id="speakerEmail_{index}"
														bind:value={speaker.socials.email}
														class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
														placeholder="Speaker Email"
													/>
												</div>

												<div>
													<label for="speakerFacebook_{index}" class="block text-sm font-medium text-gray-700">Facebook</label>
													<input
														type="text"
														id="speakerFacebook_{index}"
														bind:value={speaker.socials.facebook}
														class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
														placeholder="Speaker Facebook"
													/>
												</div>

												<div>
													<label for="speakerX_{index}" class="block text-sm font-medium text-gray-700">X</label>
													<input
														type="text"
														id="speakerX_{index}"
														bind:value={speaker.socials.x}
														class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
														placeholder="Speaker X"
													/>
												</div>

												<div>
													<label for="speakerLinkedin_{index}" class="block text-sm font-medium text-gray-700">LinkedIn</label>
													<input
														type="text"
														id="speakerLinkedin_{index}"
														bind:value={speaker.socials.linkedIn}
														class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
														placeholder="Speaker LinkedIn"
													/>
												</div>

												<div>
													<label for="speakerWebsite_{index}" class="block text-sm font-medium text-gray-700">Website</label>
													<input
														type="text"
														id="speakerWebsite_{index}"
														bind:value={speaker.socials.website}
														class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
														placeholder="Speaker Website"
													/>
												</div>
											</div>
											
											<div>
												<label for="speakerBio_{index}" class="block text-sm font-medium text-gray-700">Bio</label>
												<textarea
													id="speakerBio_{index}"
													bind:value={speaker.bio}
													rows="3"
													class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
													placeholder="Speaker Biography"
												></textarea>
											</div>

											<div class="flex justify-end">
												<button
													type="button"
													class="inline-flex items-center rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
													on:click={() => {
														eventData.speakers = eventData.speakers.filter((_, i) => i !== index);
													}}
												>
													Remove Speaker
												</button>
											</div>
										</div>
									</div>
								{/each}
								<button type="button" on:click={addSpeaker} class="text-primary hover:text-primary-dark">
									+ Add Speaker
								</button>
							</div>
						{:else if activeTab === 'testimonials'}
							<div class="space-y-4">
								<div class="flex items-center justify-between">
									<h3 class="text-lg font-medium text-gray-900">Testimonials</h3>
								</div>

								{#each eventData.testimonials as testimonial, index (testimonial.id)}
									<div class="rounded-lg border bg-white p-4 shadow-sm">
										<div class="grid gap-6 md:grid-cols-[200px,1fr]">
											<!-- Testimonial Images -->
											<div>
												<label for="testimonialImage_{index}" class="block text-sm font-medium text-gray-700">Testimonial Images</label>
											</div>
											{#if testimonial.imageUrls.length > 0}
												<div class="mt-2 grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-7">
													{#each testimonial.imageUrls as image, imageIndex}
														<div class="relative bg-gray-100 rounded-lg p-2">
															<img
																src={image}
																alt="{testimonial.name} testimonial image {imageIndex + 1}"
																class="rounded-lg object-cover bg-white"
															/>
															<button
																type="button"
																class="absolute top-1 right-1 rounded-full p-1 bg-white text-red-500 hover:text-red-800 shadow-sm"
																on:click={() => {
																	eventData.testimonials[index].imageUrls = testimonial.imageUrls.filter((_, i) => i !== imageIndex);
																}}
																aria-label="Remove testimonial image"
															>
																<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
																	<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
																</svg>
															</button>
														</div>
													{/each}
												</div>
											{/if}
											<MediaUploader
												type="testimonialsImages"
												eventId={eventData.id}
												testimonialId={testimonial.id}
												on:upload={handleTestimonialsImagesUpload}
												id="testimonialImage_{index}"
												multiple
												maxFiles={10}
											/>
											
											<!-- Testimonial Video -->
											<div>
												<label for="testimonialVideo_{index}" class="block text-sm font-medium text-gray-700">Video</label>
											</div>
											{#if testimonial.videoUrl}
												<div class="mt-2 relative">
													<video
														src={testimonial.videoUrl}
														controls
														class="w-full rounded-lg"
														aria-label="Testimonial video"
														style="height: 400px;"
													>
														<track kind="captions" />
													</video>
													<button
														type="button"
														class="absolute top-1 right-1 rounded-full p-1 bg-white text-red-500 hover:text-red-800 shadow-sm"
														on:click={() => {
															eventData.testimonials = eventData.testimonials.map((t, i) =>
																i === index
																	? { ...t, videoUrl: '', tempVideoFile: null }
																	: t
															);
														}}
														aria-label="Remove testimonial video"
													>
														<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
															<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
														</svg>
													</button>
												</div>
											{:else}
												<MediaUploader
													type="testimonialsVideo"
													eventId={eventData.id}
													testimonialId={testimonial.id}
													on:upload={handleTestimonialsVideoUpload}
												/>
											{/if}

											<!-- Testimonial Details -->
											<div class="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<label for="testimonialFirstName_{index}" class="block text-sm font-medium text-gray-700">First Name</label>
													<input
														type="text"
														id="testimonialFirstName_{index}"
														bind:value={testimonial.firstName}
														class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
														placeholder="Testimonial First Name"
													/>
												</div>

												<div>
													<label for="testimonialLastName_{index}" class="block text-sm font-medium text-gray-700">Last Name</label>
													<input
														type="text"
														id="testimonialLastName_{index}"
														bind:value={testimonial.lastName}
														class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
														placeholder="Testimonial Last Name"
													/>
												</div>

												<div>
													<label for="testimonialTitle_{index}" class="block text-sm font-medium text-gray-700">Title</label>
													<input
														type="text"
														id="testimonialTitle_{index}"
														bind:value={testimonial.title}
														class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
														placeholder="Testimonial Title"
													/>
												</div>
											</div>

											<div>
												<label for="testimonialHeaderText_{index}" class="block text-sm font-medium text-gray-700">Short Description</label>
												<input
													type="text"
													id="testimonialHeaderText_{index}"
													bind:value={testimonial.headerText}
													class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
													placeholder="Testimonial Short Description"
												/>
											</div>

											<div>
												<label for="testimonialText{index}" class="block text-sm font-medium text-gray-700">Description</label>
												<MarkdownEditor
													bind:value={testimonial.text}
													id="testimonialText_{index}"
													placeholder=""
													onInput={(newValue) => {
														eventData.testimonials[index].text = newValue;
													}}
												/>
											</div>
												
											<div class="flex justify-end">
												<button
													type="button"
													class="inline-flex items-center rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
													on:click={() => {
														eventData.testimonials = eventData.testimonials.filter((_, i) => i !== index);
													}}
												>
													Remove Testimonial
												</button>
											</div>
										</div>
									</div>
								{/each}
								<button type="button" on:click={addTestimonial} class="text-primary hover:text-primary-dark">
									+ Add Testimonial
								</button>
							</div>
						{:else if activeTab === 'sponsors'}
							<div class="space-y-4">
								<h3 class="text-lg font-medium">Sponsors</h3>
								{#each eventData.sponsors as sponsor, index}
									<div class="rounded-md border p-4">
										<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<label for="sponsor_name_{index}" class="block text-sm font-medium text-gray-700"
													>Sponsor Name</label
												>
												<input
													type="text"
													id="sponsor_name_{index}"
													bind:value={sponsor.sponsor_name}
													class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
												/>
											</div>
											<div>
												<label for="sponsor_url_{index}" class="block text-sm font-medium text-gray-700"
													>Website URL</label
												>
												<input
													type="url"
													id="sponsor_url_{index}"
													bind:value={sponsor.sponsor_url}
													class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
												/>
											</div>		
										</div>
										<div class="mt-4">
											<label for="sponsor_logo_{sponsor.id}" class="block text-sm font-medium text-gray-700">Logo</label>
											{#if sponsor.sponsor_logo}
												<div class="relative mt-2 h-40 w-40">
													<img
														src={sponsor.sponsor_logo}
														alt="Sponsor logo preview"
														class="rounded-lg object-contain h-40 w-40"
													/>
													<button
														type="button"
														class="absolute top-1 right-1 rounded-full p-1 bg-white text-red-500 hover:text-red-800 shadow-sm"
														on:click={() => {
															eventData.sponsors[index].sponsor_logo = '';
															eventData.sponsors[index].tempLogoFile = null;
														}}
														aria-label="Remove sponsor logo"
													>
														<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
															<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
														</svg>
													</button>
												</div>
											{:else}
												<div class="mt-1">
													<MediaUploader
														type="sponsors"
														sponsorId={sponsor.id}
														on:upload={handleSponsorLogoUpload}
														id="sponsor_logo_{sponsor.id}"
													/>
												</div>
											{/if}
										</div>
										<div class="flex justify-end">
											<button
												type="button"
												on:click={() => removeSponsor(index)}
												class="mt-4 text-red-600 hover:text-red-800 "
											>
												Remove Sponsor
											</button>
										</div>
									</div>
								{/each}
								<button type="button" on:click={addSponsor} class="text-primary hover:text-primary-dark">
									+ Add Sponsor
								</button>
							</div>
						{:else if activeTab === 'program'}
							<div class="space-y-4">
								<h3 class="text-lg font-medium">Program Schedule</h3>
								{#each eventData.programSchedule as item, index}
									<div class="rounded-md border p-4">
										<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<label for="startTime_{index}" class="block text-sm font-medium text-gray-700"
													>Start Time</label
												>
												<input
													type="datetime-local"
													id="startTime_{index}"
													bind:value={item.startTime}
													class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
												/>
											</div>
											<div>
												<label for="endTime_{index}" class="block text-sm font-medium text-gray-700"
													>End Time</label
												>
												<input
													type="datetime-local"
													id="endTime_{index}"
													bind:value={item.endTime}
													class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
												/>
											</div>
											<div>
												<label for="title_{index}" class="block text-sm font-medium text-gray-700">Title</label>
												<input
													type="text"
													id="title_{index}"
													bind:value={item.title}
													class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
												/>
											</div>
											<div>
												<label for="location_{index}" class="block text-sm font-medium text-gray-700"
													>Location</label
												>
												<input
													type="text"
													id="location_{index}"
													bind:value={item.location}
													class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
												/>
											</div>
											<div class="col-span-2">
												<label for="description_{index}" class="block text-sm font-medium text-gray-700"
													>Description</label
												>
												<MarkdownEditor
													bind:value={item.description}
													id="description_{index}"
													placeholder=""
													onInput={(newValue) => {
														eventData.programSchedule[index].description = newValue;
													}}
												/>
											</div>
											<div class="col-span-2">
												<label for="program_images_{item.id}" class="block text-sm font-medium text-gray-700">Images</label>
												{#if item.images.length > 0}
													<div class="mt-2 grid grid-cols-3 gap-4 sm:grid-cols-3 md:grid-cols-7">
														{#each item.images as image, imageIndex}
															<div class="relative bg-gray-100 rounded-lg p-2">
																<img
																	src={image}
																	alt="Program item"
																	class="rounded-lg object-cover bg-white"
																/>
																<button
																	type="button"
																	class="absolute top-1 right-1 rounded-full p-1 bg-white text-red-500 hover:text-red-800 shadow-sm"
																	on:click={() => {
																		eventData.programSchedule[index].images = item.images.filter((_, i) => i !== imageIndex);
																		if (eventData.programSchedule[index].tempFiles?.[imageIndex]) {
																			eventData.programSchedule[index].tempFiles = item.tempFiles.filter((_, i) => i !== imageIndex);
																		}
																	}}
																	aria-label="Remove program image"
																>
																	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
																		<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
																	</svg>
																</button>
															</div>
														{/each}
													</div>
												{/if}
												<div class="mt-2">
													<MediaUploader
														type="programImages"
														programItemId={item.id}
														on:upload={handleProgramImagesUpload}
														id="program_images_{item.id}"
														multiple
														maxFiles={10}
													/>
												</div>
											</div>
										</div>
										<div class="flex justify-end">
											<button
												type="button"
												on:click={() => removeProgramItem(index)}
												class="mt-4 text-red-600 hover:text-red-800"
											>
												Remove Item
											</button>
										</div>
										
									</div>
								{/each}
								<button type="button" on:click={addProgramItem} class="text-primary hover:text-primary-dark">
									+ Add Program Item
								</button>
							</div>
						{/if}

						<!-- Form Actions -->
						<div class="flex justify-end space-x-4">
							<a
								href="/admin/events"
								class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
							>
								Cancel
							</a>
							<button
								type="submit"
								class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark text-sm font-medium"
								disabled={isSubmitting}
							>
								{isSubmitting ? 'Saving...' : 'Save Event'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</section>
	{/if}
</div>



