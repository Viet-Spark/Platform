<script>
	import { eventStore, eventHandlers } from '$lib/stores/eventStore2';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { marked } from 'marked';
    import DOMPurify from 'dompurify';
    import { writable } from 'svelte/store';

	let eventId = $page.params.id;
    let error = null;
    let event = writable(null);
    let currentSlide = 0;
    let tabList = [];
    let eventImagesList = writable([]);
    let length = 0

    $: if (eventId && $eventStore.events) {
        event.set($eventStore.events.find(e => e.id === eventId));
    }

    $: if ($event) {
        tabList = [
            { key: 'description', label: 'Description', show: true },
            { key: 'speakers', label: 'Speakers', show: $event.speakers && $event.speakers.length > 0 },
            { key: 'sponsors', label: 'Sponsors', show: $event.sponsors && $event.sponsors.length > 0 },
            { key: 'testimonials', label: 'Testimonials', show: $event.testimonials && $event.testimonials.length > 0 },
            { key: 'program', label: 'Program Schedule', show: $event.programSchedule && $event.programSchedule.length > 0 }
        ];
        if ($event.coverImage) {
            eventImagesList.set([$event.coverImage]); 
        }
        if ($event.images) {
            eventImagesList.set([...$eventImagesList, ...$event.images]);
        }
        if ($event.videos) {
            eventImagesList.set([...$eventImagesList, ...$event.videos]);
        }
        length = $eventImagesList.length;
        console.log(eventImagesList);
    }
    
    function formatDate(timestamp) {
        if (!timestamp || !timestamp.seconds) return '';
        return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }

    function formatDetailDate(timestamp) {
        if (!timestamp) return '';
		
		let date;
		if (timestamp.seconds) {
			date = new Date(timestamp.seconds * 1000); // Convert Firestore Timestamp
		} else {
			date = new Date(timestamp); // Handle regular date string
		}
			
		if (isNaN(date.getTime())) return ''; // Invalid date
		
		return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            timeZoneName: 'short'
        }).format(date);
    }

    function formatTime(timestamp) {
		if (!timestamp || !timestamp.seconds) return '';

		const date = new Date(timestamp.seconds * 1000);

		const formatAMPM = date => {
			let hours = date.getHours();
			let minutes = date.getMinutes();
			const ampm = hours >= 12 ? 'PM' : 'AM';
			hours = hours % 12 || 12; // Convert to 12-hour format
			minutes = String(minutes).padStart(2, '0');
			return `${hours}:${minutes} ${ampm}`;
		};

		return formatAMPM(date);
	}

    function getTimezoneAbbreviation(date = new Date()) {
		// Convert date to string and extract abbreviation from parentheses
		const match = date.toString().match(/\(([^)]+)\)/);
		if (match && match[1]) {
			return match[1].split(' ').map(word => word[0]).join('');
		}
		return 'UTC'; // fallback if no match
	}

    function parseMarkdown(content) {
        if (!content) return 'No description available';
        // First parse markdown to HTML
        const rawHtml = marked(content);
        // Then sanitize the HTML to prevent XSS
        return DOMPurify.sanitize(rawHtml);
    }

    function prev() {
        currentSlide = (currentSlide - 1 + length) % length;
    }

    function next() {
        currentSlide = (currentSlide + 1 + length) % length;
    }

    let activeTab = 'description';

    function toggleTab(tab) {
        activeTab = activeTab === tab ? '' : tab;
    }
    
    // Lightbox modal state for testimonial images
    let showImageModal = false;
    let modalImageUrl = '';
    
</script>

<svelte:head>
	{#if $event}
	    <title>{$event.title} - VietSpark Events</title>
	    <meta name="shortDescription" content={$event.shortDescription} />
    {/if}
</svelte:head>

{#if $eventStore.isLoading}
    <div class="flex h-screen items-center justify-center">
        <div class="text-center">
            <p class="mb-4 text-xl">Loading event...</p>
        </div>
    </div>
{:else if !$event}
    <div class="flex h-screen items-center justify-center">
        <div class="text-center">
            <p class="mb-4 text-xl">Event not found</p>
            <a href="/events" class="text-primary hover:underline">Back to Events</a>
        </div>
    </div>
{:else}
    <section class="bg-primary py-16 text-white">
        <div class="container mx-auto px-4">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="mb-4 text-4xl font-bold">{$event.title}</h1>
                    <div class="flex items-center space-x-4 text-lg">
                        <div class="flex items-center">
                            <i class="fas fa-calendar-day mr-2"></i>
                            <span>{formatDate($event.eventDate?.start)} - {formatDate($event.eventDate?.end)}</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-clock mr-2"></i>
                            <span>{formatTime($event.eventDate?.start)} - {formatTime($event.eventDate?.end)} {getTimezoneAbbreviation()}</span>
                        </div>
                        {#if $event.location?.displayText}
                            <div class="flex items-center">
                                <i class="fas fa-map-marker-alt mr-2"></i>
                                <span>{$event.location.displayText}</span>
                            </div>
                        {/if}
                    </div>
                </div>
                <a
                    href="/events"
                    class="btn hover:text-primary border-2 border-white bg-transparent hover:bg-white"
                >
                    Back to Events
                </a>
            </div>
        </div>
    </section>

    <!-- Event Content -->
    <section class="py-16">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 gap-12 lg:grid-cols-3">
                <div class="lg:col-span-2">
                    {#if $event.coverImage}
                        <div class="flex justify-center">
                            {#if $eventImagesList.length > 1}
                                <div class="relative w-full" style="height: 400px;">
                                    {#if currentSlide < $event.images.length + 1}
                                        <img
                                            src={$eventImagesList[currentSlide]}
                                            alt={$event.title}
                                            class="w-full rounded-lg object-cover shadow-md"
                                            style="height: 400px;"
                                        />
                                    {:else }
                                        <video
                                            src={$eventImagesList[currentSlide]}
                                            controls
                                            class="w-full rounded-lg"
                                            style="height: 400px;"
                                        >
                                            <track kind="captions" />
                                        </video>
                                    {/if}
                                        
                                    <!-- Left arrow -->
                                    <button
                                        on:click={() => prev()}
                                        aria-label="Previous image"
                                        class="opacity-50 absolute top-1/2 left-4 -translate-y-1/2 bg-black bg-opacity-30 text-white p-5 rounded-full hover:bg-opacity-50 transition-all duration-200 w-14 h-14 flex items-center justify-center text-xl cursor-pointer"
                                    >
                                        ‹
                                    </button>
                                    <!-- Right arrow -->
                                    <button
                                        on:click={() => next()}
                                        aria-label="Next image"
                                        class="opacity-50 absolute top-1/2 right-4 -translate-y-1/2 bg-black bg-opacity-30 text-white p-5 rounded-full hover:bg-opacity-50 transition-all duration-200 w-14 h-14 flex items-center justify-center text-xl cursor-pointer"
                                    >
                                        ›
                                    </button>

                                </div>
					{:else if $eventImagesList.length === 1}
						<div class="flex justify-center">
							<img
								src={$eventImagesList[0]}
								alt={$event.title}
								class="mb-8 h-full rounded-lg object-cover shadow-md"
								style="height: 400px;"
							/>
						</div>
					{/if}
                        </div>
                    {/if}

                    <!-- Event Details Tabs -->
                    <div class="mt-12">
                        <div class="border-b border-gray-200 mb-6">
                            <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                                {#each tabList as tab (tab.key)}
                                    {#if tab.show}
                                        <button
                                            type="button"
                                            class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium {activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
                                            on:click={() => toggleTab(tab.key)}
                                        >
                                            {tab.label}
                                        </button>
                                    {/if}
                                {/each}
                            </nav>
                        </div>

                        <!-- Description Tab -->
                        {#if activeTab === 'description'}
                            <div class="prose prose-lg max-w-none prose-a:text-blue-600 prose-a:hover:text-blue-800">
                                {@html parseMarkdown($event.description)}
                            </div>
                        {/if}

                        <!-- Speakers Tab -->
                        {#if activeTab === 'speakers'}
                            <section>
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {#each $event.speakers as speaker}
                                    <div class="rounded-lg bg-gray-50 p-6 shadow-sm flex flex-col items-center text-center">
                                        {#if speaker.image}
                                            <img src={speaker.image} alt={speaker.firstName + ' ' + speaker.lastName} class="w-32 h-32 rounded-full object-cover mb-4 border-2 border-primary-200" />
                                        {/if}
                                        <h3 class="text-xl font-semibold">{speaker.firstName} {speaker.lastName}</h3>
                                        {#if speaker.title}
                                            <p class="text-primary font-medium">{speaker.title}</p>
                                        {/if}
                                        {#if speaker.bio}
                                            <p class="mt-2 text-gray-700">{speaker.bio}</p>
                                        {/if}
                                        {#if speaker.socials}
                                            <div class="flex space-x-3 mt-3">
                                                {#if speaker.socials.facebook}
                                                    <a href={speaker.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                                                {/if}
                                                {#if speaker.socials.x}
                                                    <a href={speaker.socials.x} target="_blank" rel="noopener noreferrer" aria-label="X"><i class="fab fa-twitter"></i></a>
                                                {/if}
                                                {#if speaker.socials.linkedIn}
                                                    <a href={speaker.socials.linkedIn} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                                                {/if}
                                                {#if speaker.socials.email}
                                                    <a href={speaker.socials.email} target="_blank" rel="noopener noreferrer" aria-label="Email"><i class="fas fa-envelope"></i></a>
                                                {/if}
                                                {#if speaker.socials.website}
                                                    <a href={speaker.socials.website} target="_blank" rel="noopener noreferrer" aria-label="Website"><i class="fas fa-globe"></i></a>
                                                {/if}
                                            </div>
                                        {/if}
                                    </div>
                                    {/each}
                                </div>
                            </section>
                        {/if}

                        <!-- Sponsors Tab -->
                        {#if activeTab === 'sponsors'}
                            <section>
                                <div class="grid grid-cols-2 md:grid-cols-3 gap-8 items-center">
                                    {#each $event.sponsors as sponsor}
                                    <div class="flex flex-col items-center">
                                        {#if sponsor.sponsor_logo}
                                            <a href={sponsor.sponsor_url} target="_blank" rel="noopener noreferrer">
                                                <img src={sponsor.sponsor_logo} alt={sponsor.sponsor_name} class="h-40 w-auto object-contain mb-2 bg-white rounded-lg p-2" />
                                            </a>
                                        {/if}
                                        <div class="text-center font-bold mt-2 text-primary">
                                            <span>{sponsor.sponsor_name}</span>
                                        </div>
                                    </div>
                                    {/each}
                                </div>
                            </section>
                        {/if}

                        <!-- Testimonials Tab -->
                        {#if activeTab === 'testimonials'}
                            <section>
                                <div class="space-y-8">
                                    {#each $event.testimonials as testimonial}
                                    <div class="rounded-lg bg-gray-50 p-6 shadow-sm">
                                        <div class="flex items-center space-x-4 mb-2">
                                            <div>
                                                <h3 class="text-lg font-semibold">{testimonial.firstName} {testimonial.lastName}</h3>
                                                {#if testimonial.title}
                                                    <span class="font-medium">{testimonial.title}</span> 
                                                {/if}
                                            </div>
                                        </div>
                                        {#if testimonial.imageUrls && testimonial.imageUrls.length > 0}
                                            <div class="flex space-x-2 mb-2">
                                                {#each testimonial.imageUrls as img}
                                                    <button
                                                        type="button"
                                                        on:click={() => { modalImageUrl = img; showImageModal = true; }}
                                                        class="focus:outline-none"
                                                    >
                                                        <img src={img} alt={`Testimonial_${testimonial.firstName}_${testimonial.lastName} image`} class="w-16 h-16 object-cover rounded transition-transform hover:scale-105" />
                                                    </button>
                                                {/each}
                                            </div>
                                        {/if}
                                        {#if testimonial.videoUrl}
                                            <div class="mb-2">
                                                <video src={testimonial.videoUrl} controls class="w-full rounded">
                                                    <track kind="captions" src={testimonial.videoUrl} srclang="en" label="English" />
                                                </video>
                                            </div>
                                        {/if}
                                        {#if testimonial.headerText}
                                            <p class="text-primary font-medium">{testimonial.headerText}</p>
                                        {/if}
                                        {#if testimonial.text}
                                            <div class="prose max-w-none mt-2">
                                                {@html parseMarkdown(testimonial.text)}
                                            </div>
                                        {/if}
                                    </div>
                                    {/each}
                                </div>
                            </section>
                        {/if}

                        <!-- Program Schedule Tab -->
                        {#if activeTab === 'program'}
                            <section>
                                <div class="space-y-8">
                                    {#each $event.programSchedule as item}
                                    <div class="rounded-lg bg-gray-50 p-6 shadow-sm">
                                        <div class="flex flex-col md:flex-row md:items-center md:space-x-6 mb-2">
                                            <div class="flex-1">
                                                <h3 class="text-lg font-semibold">{item.title}</h3>
                                                <div class="flex items-center">
                                                    <i class="fas fa-calendar-day mr-2"></i>
                                                    <span>{formatDetailDate(item.startTime)} - {formatDetailDate(item.endTime)}</span>
                                                </div>
                                                {#if item.location}
                                                    <div class="flex items-center">
                                                        <i class="fas fa-map-marker-alt mr-2"></i>
                                                        <span>{item.location}</span>
                                                    </div>
                                                {/if}
                                            </div>
                                        </div>
                                        {#if item.images && item.images.length > 0}
                                            <div class="flex space-x-2 mb-2">
                                                {#each item.images as img}
                                                    <button
                                                        type="button"
                                                        on:click={() => { modalImageUrl = img; showImageModal = true; }}
                                                        class="focus:outline-none"
                                                    >
                                                        <img src={img} alt="Program_{item.title} image" class="w-16 h-16 object-cover rounded transition-transform hover:scale-105" />
                                                    </button>
                                                {/each}
                                            </div>
                                        {/if}
                                        {#if item.description}
                                            <div class="prose max-w-none mt-2">
                                                {@html parseMarkdown(item.description)}
                                            </div>
                                        {/if}
                                    </div>
                                    {/each}
                                </div>
                            </section>
                        {/if}
                    </div>

                </div>

                <div class="lg:col-span-1">
                    <div class="mb-8 rounded-lg bg-gray-50 p-6 shadow-sm">
                        <h3 class="mb-4 text-xl font-bold">Event Details</h3>
                        <ul class="space-y-4">
                            <li class="flex items-start">
                                <div class="text-primary mr-3 mt-1">
                                    <i class="fas fa-calendar-alt"></i>
                                </div>
                                <div>
                                    <strong>Date</strong>
                                    <p>{formatDate($event.eventDate?.start)} - {formatDate($event.eventDate?.end)}</p>
                                </div>
                            </li>
                            <li class="flex items-start">
                                <div class="text-primary mr-3 mt-1">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div>
                                    <strong>Time</strong>
                                    <p>{formatTime($event.eventDate?.start)} - {formatTime($event.eventDate?.end)} {getTimezoneAbbreviation()}</p>
                                </div>
                            </li>
                            {#if $event.location?.displayText}
                                <li class="flex items-start">
                                    <div class="text-primary mr-3 mt-1">
                                        <i class="fas fa-map-marker-alt"></i>
                                    </div>
                                    <div>
                                        <strong>Location</strong>
                                        <p>{$event.location.displayText}</p>
                                    </div>
                                </li>
                            {/if}
                            {#if $event.earlyBirdRegistrationPricing && $event.registrationPricing}
                                <li class="flex items-start">
                                    <div class="text-primary mr-3 mt-1">
                                        <i class="fas fa-ticket-alt"></i>
                                    </div>
                                    <div>
                                        <strong>Registration</strong>
                                        <p>${$event.earlyBirdRegistrationPricing} - ${$event.registrationPricing} (Early bird pricing available)</p>
                                    </div>
                                </li>
                            {/if}
                        </ul>

                        {#if $event.registrationLink}
                            <div class="mt-6">
                                <a href={$event.registrationLink}
                                    aria-label="Register for {$event.title}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <button class="btn bg-primary hover:underline hover:bg-primary-dark w-full text-white">
                                        Register Now
                                    </button>
                                </a>
                            </div>
                        {/if}
                    </div>

                    {#if $event.socialMediaLinks}
                        <div class="rounded-lg bg-gray-50 p-6 shadow-sm">
                            <h3 class="mb-4 text-xl font-bold">Share This Event</h3>
                            <div class="flex space-x-4">
                                {#if $event.socialMediaLinks.facebook}
                                    <a
                                        href={$event.socialMediaLinks.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-gray-600 hover:text-blue-600"
                                        aria-label="Share on Facebook"
                                    >
                                        <i class="fab fa-facebook-f text-xl"></i>
                                    </a>
                                {/if}
                                {#if $event.socialMediaLinks.x}
                                    <a
                                        href={$event.socialMediaLinks.x}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-gray-600 hover:text-blue-600"
                                        aria-label="Share on X"
                                    >
                                        <i class="fab fa-twitter text-xl"></i>
                                    </a>
                                {/if}
                                {#if $event.socialMediaLinks.linkedIn}
                                    <a
                                        href={$event.socialMediaLinks.linkedIn}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-gray-600 hover:text-blue-600"
                                        aria-label="Share on LinkedIn"
                                    >
                                        <i class="fab fa-linkedin-in text-xl"></i>
                                    </a>
                                {/if}
                                {#if $event.socialMediaLinks.email}
                                    <a
                                        href={$event.socialMediaLinks.email}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-gray-600 hover:text-blue-600"
                                        aria-label="Share via Email"
                                    >   
                                        <i class="fas fa-envelope text-xl"></i>
                                    </a>
                                {/if}
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="bg-primary py-16 text-white">
        <div class="container mx-auto px-4 text-center">
            <h2 class="mb-4 text-3xl font-bold">Want to speak at our events?</h2>
            <p class="mx-auto mb-8 max-w-2xl text-xl">
                We're always looking for knowledgeable speakers to share their expertise and experiences.
            </p>
            <a href="/contact" class="btn text-primary bg-white hover:bg-gray-100">Contact Us</a>
        </div>
    </section>

    <!-- Place this modal markup near the root, after the opening <section> or main container -->
    {#if showImageModal}
        <div
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
            on:click={() => showImageModal = false}
            aria-label="Close image modal"
            tabindex="0"
            role="button"
            on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') showImageModal = false; }}
        >
            <div 
                class="relative" 
                on:click|stopPropagation 
                aria-label="Expanded testimonial image" 
                role="button" 
                tabindex="0"
                on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') showImageModal = false; }}
            >
                <img 
                    src={modalImageUrl} 
                    alt={`Testimonial image of ${modalImageUrl}`}
                    class="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg" 
                />
                <button
                    class="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-2 text-gray-800 hover:text-red-600"
                    on:click={() => showImageModal = false}
                    aria-label="Close"
                    on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') showImageModal = false; }}
                    tabindex="0"
                    type="button"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    {/if}
{/if}

<style>
    .btn {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        font-weight: 500;
        border-radius: 0.375rem;
        transition: all 0.2s;
    }
</style>
