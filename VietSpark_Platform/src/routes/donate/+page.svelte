<script>
	// Donation amount options
	const donationOptions = [25, 50, 100, 250, 500];
	let selectedAmount = 50;
	let customAmount = '';
	let isCustomAmount = false;
	let donorName = '';
	let donorEmail = '';
	let isAnonymous = false;
	let showCompanyField = false;
	let companyName = '';
	let donationMessage = '';

	function setAmount(amount) {
		selectedAmount = amount;
		isCustomAmount = false;
	}

	function setCustomAmount() {
		isCustomAmount = true;
	}

	function handleSubmit() {
		// Here you would typically handle the payment processing
		// This is just a placeholder for demonstration
		const donationAmount = isCustomAmount ? parseFloat(customAmount) : selectedAmount;

		console.log('Processing donation:', {
			amount: donationAmount,
			name: isAnonymous ? 'Anonymous' : donorName,
			email: donorEmail,
			company: companyName,
			message: donationMessage,
			isAnonymous
		});

		// Redirect to a payment processor would happen here
		alert('This would redirect to a payment processor in a real implementation.');
	}
</script>

<svelte:head>
	<title>Donate - VietSpark</title>
	<meta
		name="description"
		content="Support VietSpark's mission to empower Vietnamese professionals in the tech industry through your generous donation."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="bg-primary py-16 text-white">
	<div class="container mx-auto px-4 text-center">
		<h1 class="mb-4 text-4xl font-bold">Support Our Mission</h1>
		<p class="mx-auto max-w-3xl text-xl">
			Your donation helps us empower Vietnamese professionals in the tech industry through
			education, mentorship, and community building.
		</p>
	</div>
</section>

<!-- Impact Section -->
<section class="bg-white py-16">
	<div class="container mx-auto px-4">
		<div class="mb-12 text-center">
			<h2 class="mb-4 text-3xl font-bold">Your Donation Makes a Difference</h2>
			<div class="bg-primary mx-auto mb-6 h-1 w-24"></div>
			<p class="mx-auto max-w-3xl text-lg text-gray-600">
				Every contribution helps us expand our programs and reach more professionals in the
				community. Please contact @email.com for direct donation.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			<div class="rounded-lg bg-gray-50 p-6 text-center">
				<div
					class="text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
				>
					<i class="fas fa-graduation-cap text-2xl"></i>
				</div>
				<h3 class="mb-3 text-xl font-bold">Educational Programs</h3>
				<p class="text-gray-600">
					Fund workshops, seminars, and educational resources to help Vietnamese professionals
					develop the skills needed to excel in tech.
				</p>
			</div>

			<div class="rounded-lg bg-gray-50 p-6 text-center">
				<div
					class="text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
				>
					<i class="fas fa-users text-2xl"></i>
				</div>
				<h3 class="mb-3 text-xl font-bold">Mentorship Initiatives</h3>
				<p class="text-gray-600">
					Support our mentorship program connecting experienced professionals with those starting
					their career or transitioning into tech.
				</p>
			</div>

			<div class="rounded-lg bg-gray-50 p-6 text-center">
				<div
					class="text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
				>
					<i class="fas fa-handshake text-2xl"></i>
				</div>
				<h3 class="mb-3 text-xl font-bold">Community Events</h3>
				<p class="text-gray-600">
					Help us organize networking events, tech summits, and social gatherings that foster
					connections within our community.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Donation Form Section -->
<section class="bg-gray-50 py-16">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-3xl overflow-hidden rounded-lg bg-white shadow-md">
			<div class="bg-primary p-6 text-white">
				<h2 class="text-2xl font-bold">Make a Donation</h2>
				<p>Your support helps us create opportunities for Vietnamese professionals in tech.</p>
			</div>

			<form on:submit|preventDefault={handleSubmit} class="space-y-6 p-6">
				<!-- Donation Amount -->
				<div>
					<fieldset>
						<legend class="mb-4 block font-medium text-gray-700">Select Donation Amount</legend>
						<div class="grid grid-cols-3 gap-2 md:grid-cols-5">
							{#each donationOptions as amount}
								<button
									type="button"
									class="rounded-md border px-4 py-2 {selectedAmount === amount && !isCustomAmount
										? 'bg-primary border-primary text-white'
										: 'hover:border-primary border-gray-300 text-gray-700'}"
									on:click={() => setAmount(amount)}
								>
									${amount}
								</button>
							{/each}
							<button
								type="button"
								class="rounded-md border px-4 py-2 {isCustomAmount
									? 'bg-primary border-primary text-white'
									: 'hover:border-primary border-gray-300 text-gray-700'}"
								on:click={setCustomAmount}
							>
								Custom
							</button>
						</div>

						{#if isCustomAmount}
							<div class="mt-3">
								<label for="custom-amount" class="sr-only">Custom amount</label>
								<div class="relative">
									<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
										<span class="text-gray-500">$</span>
									</div>
									<input
										type="number"
										id="custom-amount"
										bind:value={customAmount}
										placeholder="Enter amount"
										min="1"
										step="1"
										class="focus:ring-primary w-full rounded-md border px-4 py-2 pl-8 focus:outline-none focus:ring-2"
									/>
								</div>
							</div>
						{/if}
					</fieldset>
				</div>

				<!-- Donor Information -->
				<div>
					<h3 class="mb-4 text-lg font-bold">Donor Information</h3>

					<div class="space-y-4">
						<div class="flex items-center">
							<input
								type="checkbox"
								id="anonymous"
								bind:checked={isAnonymous}
								class="text-primary h-5 w-5 rounded"
							/>
							<label for="anonymous" class="ml-2 text-gray-700">
								Make this donation anonymous
							</label>
						</div>

						{#if !isAnonymous}
							<div>
								<label for="donor-name" class="mb-2 block font-medium text-gray-700">Name *</label>
								<input
									type="text"
									id="donor-name"
									bind:value={donorName}
									required
									class="focus:ring-primary w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2"
								/>
							</div>
						{/if}

						<div>
							<label for="donor-email" class="mb-2 block font-medium text-gray-700">Email *</label>
							<input
								type="email"
								id="donor-email"
								bind:value={donorEmail}
								required
								class="focus:ring-primary w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2"
							/>
							<p class="mt-1 text-sm text-gray-600">Receipt will be sent to this email</p>
						</div>

						<div class="flex items-center">
							<input
								type="checkbox"
								id="company-donation"
								bind:checked={showCompanyField}
								class="text-primary h-5 w-5 rounded"
							/>
							<label for="company-donation" class="ml-2 text-gray-700">
								This is a donation from a company
							</label>
						</div>

						{#if showCompanyField}
							<div>
								<label for="company-name" class="mb-2 block font-medium text-gray-700"
									>Company Name *</label
								>
								<input
									type="text"
									id="company-name"
									bind:value={companyName}
									required={showCompanyField}
									class="focus:ring-primary w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2"
								/>
							</div>
						{/if}

						<div>
							<label for="donation-message" class="mb-2 block font-medium text-gray-700"
								>Message (Optional)</label
							>
							<textarea
								id="donation-message"
								bind:value={donationMessage}
								rows="3"
								class="focus:ring-primary w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2"
								placeholder="Share why you're supporting VietSpark..."
							></textarea>
						</div>
					</div>
				</div>

				<!-- Submit Button -->
				<div class="pt-4">
					<button
						type="submit"
						class="bg-primary hover:bg-primary-dark focus:ring-primary w-full rounded-md py-3 font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
					>
						Donate ${isCustomAmount ? customAmount || '0' : selectedAmount}
					</button>
					<p class="mt-3 text-center text-sm text-gray-600">
						Your donation is tax-deductible to the extent allowed by law.
					</p>
				</div>
			</form>
		</div>
	</div>
</section>

<!-- Other Ways to Support -->
<section class="bg-white py-16">
	<div class="container mx-auto px-4">
		<div class="mb-12 text-center">
			<h2 class="mb-4 text-3xl font-bold">Other Ways to Support</h2>
			<div class="bg-primary mx-auto mb-6 h-1 w-24"></div>
		</div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			<div class="rounded-lg bg-gray-50 p-6">
				<div
					class="text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100"
				>
					<i class="fas fa-hand-holding-usd text-xl"></i>
				</div>
				<h3 class="mb-3 text-xl font-bold">Corporate Matching</h3>
				<p class="mb-4 text-gray-600">
					Many companies match employee donations. Check if your employer has a matching gift
					program to double your impact.
				</p>
				<a href="/contact" class="text-primary hover:underline">Learn More →</a>
			</div>

			<div class="rounded-lg bg-gray-50 p-6">
				<div
					class="text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100"
				>
					<i class="fas fa-gift text-xl"></i>
				</div>
				<h3 class="mb-3 text-xl font-bold">In-Kind Donations</h3>
				<p class="mb-4 text-gray-600">
					Support our work through donations of services, products, or resources that help us
					fulfill our mission.
				</p>
				<a href="/contact" class="text-primary hover:underline">Contact Us →</a>
			</div>

			<div class="rounded-lg bg-gray-50 p-6">
				<div
					class="text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100"
				>
					<i class="fas fa-briefcase text-xl"></i>
				</div>
				<h3 class="mb-3 text-xl font-bold">Corporate Sponsorship</h3>
				<p class="mb-4 text-gray-600">
					Partner with us through sponsorships of our events, programs, or initiatives with various
					recognition benefits.
				</p>
				<a href="/contact?subject=Corporate Sponsorship" class="text-primary hover:underline"
					>Become a Sponsor →</a
				>
			</div>
		</div>
	</div>
</section>

<!-- Donor Recognition -->
<section class="bg-gray-50 py-16">
	<div class="container mx-auto px-4 text-center">
		<h2 class="mb-4 text-3xl font-bold">Our Supporters</h2>
		<p class="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
			We are grateful to the individuals and organizations whose generous support makes our work
			possible.
		</p>

		<!-- Placeholder for donor recognition wall -->
		<div class="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
			{#each Array(6) as _, i}
				<div class="flex h-24 items-center justify-center rounded-lg bg-white p-4 shadow-sm">
					<span class="text-gray-400">Supporter {i + 1}</span>
				</div>
			{/each}
		</div>

		<p class="mt-8 text-gray-600">
			Want to see your name or company here? <a
				href="#donation-form"
				class="text-primary hover:underline">Make a donation today</a
			>.
		</p>
	</div>
</section>

<!-- FAQ Section -->
<section class="bg-white py-16">
	<div class="container mx-auto px-4">
		<div class="mb-12 text-center">
			<h2 class="mb-4 text-3xl font-bold">Frequently Asked Questions</h2>
			<div class="bg-primary mx-auto mb-6 h-1 w-24"></div>
		</div>

		<div class="mx-auto max-w-3xl">
			<div class="space-y-6">
				<div class="rounded-lg bg-gray-50 p-6">
					<h3 class="mb-2 text-xl font-bold">Is my donation tax-deductible?</h3>
					<p class="text-gray-600">
						Yes, VietSpark is a registered 501(c)(3) non-profit organization, and your donation is
						tax-deductible to the extent allowed by law. You will receive a receipt for your
						donation via email.
					</p>
				</div>

				<div class="rounded-lg bg-gray-50 p-6">
					<h3 class="mb-2 text-xl font-bold">How will my donation be used?</h3>
					<p class="text-gray-600">
						Your donation supports our educational programs, mentorship initiatives, community
						events, and operational costs to maintain and grow our impact within the Vietnamese tech
						community.
					</p>
				</div>

				<div class="rounded-lg bg-gray-50 p-6">
					<h3 class="mb-2 text-xl font-bold">Can I make a recurring donation?</h3>
					<p class="text-gray-600">
						Yes, we offer monthly, quarterly, and annual recurring donation options. Select the
						"Make this a recurring donation" option on the donation form to set up your preferred
						schedule.
					</p>
				</div>

				<div class="rounded-lg bg-gray-50 p-6">
					<h3 class="mb-2 text-xl font-bold">
						Do you accept donations via check or wire transfer?
					</h3>
					<p class="text-gray-600">
						Yes, we accept donations through various payment methods. For information on how to
						donate via check, wire transfer, or other methods, please contact us at
						donations@vietspark.org.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="bg-primary py-16 text-white">
	<div class="container mx-auto px-4 text-center">
		<h2 class="mb-4 text-3xl font-bold">Ready to Make a Difference?</h2>
		<p class="mx-auto mb-8 max-w-2xl text-xl">
			Your support helps us create opportunities and build a stronger community for Vietnamese
			professionals in tech.
		</p>
		<a href="#donation-form" class="btn text-primary bg-white hover:bg-gray-100"> Donate Now </a>
	</div>
</section>

<style>
	.btn {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		font-weight: 500;
		border-radius: 0.375rem;
		transition: all 0.2s;
	}
</style>
