<script>
	import { faqs, faqsLoading } from '$lib/stores/faqStore';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	// Form handling
	let name = '';
	let email = '';
	let subject = '';
	let message = '';
	let formSubmitted = false;
	let formError = false;
	let contactFaqs = writable([]);

	$: if ($faqs) {
		contactFaqs.set($faqs.filter(faq => faq.category === 'Contact'));
		console.log("Contact FAQs: ", $contactFaqs);
	}

	function handleSubmit() {
		if (name && email && message) {
			// Here you would typically send the form data to a server
			console.log('Form submitted:', { name, email, subject, message });
			formSubmitted = true;
			formError = false;

			// Reset form
			name = '';
			email = '';
			subject = '';
			message = '';
		} else {
			formError = true;
		}
	}
</script>

<svelte:head>
	<title>Contact Us - VietSpark</title>
	<meta
		name="description"
		content="Get in touch with the VietSpark team for questions, partnerships, or to learn more about our community."
	/>
</svelte:head>

{#if $faqsLoading}
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-center">
			<div
				class="border-primary inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2"
			></div>
			<p class="mt-4 text-gray-600">Loading Contact Page</p>
		</div>
	</div>
{:else}
	<!-- Hero Section -->
	<section class="bg-primary py-16 text-white">
		<div class="container mx-auto px-4 text-center">
			<h1 class="mb-4 text-4xl font-bold">Contact Us</h1>
			<p class="mx-auto max-w-3xl text-xl">
				We'd love to hear from you. Reach out with any questions, ideas, or feedback.
			</p>
		</div>
	</section>

	<!-- Contact Info Section -->
	<section class="bg-white py-16">
		<div class="container mx-auto px-4">
			<div class="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
				<div class="rounded-lg bg-gray-50 p-6 text-center transition-shadow hover:shadow-md">
					<div
						class="text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
					>
						<i class="fas fa-envelope text-2xl"></i>
					</div>
					<h3 class="mb-2 text-xl font-bold">Email Us</h3>
					<p class="mb-4 text-gray-600">For general inquiries and information</p>
					<a href="mailto:info@vietspark.org" class="text-primary hover:underline"
						>contact@vietspark.org</a
					>
				</div>

				<div class="rounded-lg bg-gray-50 p-6 text-center transition-shadow hover:shadow-md">
					<div
						class="text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
					>
						<i class="fas fa-hands-helping text-2xl"></i>
					</div>
					<h3 class="mb-2 text-xl font-bold">Partnership Inquiries</h3>
					<p class="mb-4 text-gray-600">For sponsorships and collaborations</p>
					<a href="mailto:partnerships@vietspark.org" class="text-primary hover:underline"
						>fundraising@vietspark.org</a
					>
				</div>

				<div class="rounded-lg bg-gray-50 p-6 text-center transition-shadow hover:shadow-md">
					<div
						class="text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
					>
						<i class="fas fa-user-plus text-2xl"></i>
					</div>
					<h3 class="mb-2 text-xl font-bold">Join Our Team</h3>
					<p class="mb-4 text-gray-600">For volunteer and career opportunities</p>
					<a href="/work-with-us" class="text-primary hover:underline">Work with us</a>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
				<!-- <div>
					<h2 class="mb-6 text-3xl font-bold">Send Us a Message</h2>
					<p class="mb-6 text-gray-600">
						Have a question or want to get involved? Use the form below to send us a message, and
						we'll get back to you as soon as possible.
					</p>

					{#if formSubmitted}
						<div class="mb-6 rounded-md bg-green-100 p-4 text-green-700">
							<p class="font-medium">Thank you for your message!</p>
							<p>We've received your inquiry and will get back to you soon.</p>
						</div>
					{/if}

					{#if formError}
						<div class="mb-6 rounded-md bg-red-100 p-4 text-red-700">
							<p class="font-medium">Please complete all required fields.</p>
						</div>
					{/if}

					<form on:submit|preventDefault={handleSubmit} class="space-y-6">
						<div>
							<label for="name" class="mb-2 block font-medium text-gray-700">Your Name *</label>
							<input
								type="text"
								id="name"
								bind:value={name}
								required
								class="focus:ring-primary w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2"
							/>
						</div>

						<div>
							<label for="email" class="mb-2 block font-medium text-gray-700">Email Address *</label>
							<input
								type="email"
								id="email"
								bind:value={email}
								required
								class="focus:ring-primary w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2"
							/>
						</div>

						<div>
							<label for="subject" class="mb-2 block font-medium text-gray-700">Subject</label>
							<input
								type="text"
								id="subject"
								bind:value={subject}
								class="focus:ring-primary w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2"
							/>
						</div>

						<div>
							<label for="message" class="mb-2 block font-medium text-gray-700">Message *</label>
							<textarea
								id="message"
								bind:value={message}
								rows="6"
								required
								class="focus:ring-primary w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2"
							></textarea>
						</div>

						<div class="flex items-center">
							<input type="checkbox" id="privacy" class="text-primary h-5 w-5 rounded" required />
							<label for="privacy" class="ml-2 text-gray-700">
								I agree to the <a href="/privacy-policy" class="text-primary hover:underline"
									>privacy policy</a
								>
							</label>
						</div>

						<div>
							<button type="submit" class="btn bg-primary hover:bg-primary-dark text-white">
								Send Message
							</button>
						</div>
					</form>
				</div> -->

				<div>
					<h2 class="mb-6 text-3xl font-bold">Connect With Us</h2>
					<p class="mb-6 text-gray-600">
						Follow us on social media to stay updated on events, opportunities, and community news.
					</p>

					<div class="mb-8 grid grid-cols-2 gap-4">
						<a
							href="https://linkedin.com"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center rounded-md bg-gray-50 p-4 transition-colors hover:bg-blue-50"
						>
							<i class="fab fa-linkedin mr-4 text-3xl text-blue-700"></i>
							<span class="font-medium">LinkedIn</span>
						</a>

						<a
							href="https://facebook.com"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center rounded-md bg-gray-50 p-4 transition-colors hover:bg-blue-50"
						>
							<i class="fab fa-facebook-square mr-4 text-3xl text-blue-600"></i>
							<span class="font-medium">Facebook</span>
						</a>
					</div>

					<div class="rounded-lg bg-gray-50 p-6">
						<h3 class="mb-4 text-xl font-bold">Subscribe to Our Newsletter</h3>
						<p class="mb-4 text-gray-600">
							Get the latest updates, events, and opportunities delivered to your inbox.
						</p>
						<form class="flex flex-col sm:flex-row">
							<input
								type="email"
								placeholder="Your email address"
								class="focus:ring-primary mb-2 flex-1 border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 sm:mb-0 sm:rounded-l-md sm:rounded-r-none"
							/>
							<button
								type="submit"
								class="btn bg-primary hover:bg-primary-dark text-white sm:rounded-l-none sm:px-6"
							>
								Subscribe
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- FAQ Section -->
	<section class="bg-gray-50 py-16">
		<div class="container mx-auto px-4">
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-3xl font-bold">Frequently Asked Questions</h2>
				<div class="bg-primary mx-auto mb-6 h-1 w-24"></div>
			</div>

			<div class="mx-auto max-w-3xl">
				<div class="space-y-6">
					{#each $contactFaqs as faq}
						<div class="rounded-lg bg-white p-6 shadow-sm">
							<h3 class="mb-2 text-xl font-bold">{faq.question}</h3>
							<p class="text-gray-600">
								{faq.answer}
							</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>
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
