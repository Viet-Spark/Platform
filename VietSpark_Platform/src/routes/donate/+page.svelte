<script>
	import zelleQrCode from '$lib/images/Donate/vietspark-zelle-img.jpeg';

	const zelleEmail = 'finance@vietspark.org';

	const qrSteps = [
		'Log in to your bank mobile app.',
		'Go to the Zelle section.',
		'Select Send Money or tap the plus (+) sign to add a new recipient.',
		'Choose the option to scan or upload a QR code.',
		"Upload the Zelle QR code image below from your phone's photo library.",
		'Confirm that the Viet Spark Zelle account information appears automatically.',
		'Enter your donation amount, review the information, and submit.'
	];
</script>

<svelte:head>
	<title>Donate - Viet Spark</title>
	<meta
		name="description"
		content="Donate to Viet Spark via Zelle using finance@vietspark.org or the Viet Spark Zelle QR code."
	/>
</svelte:head>

<main class="min-h-screen bg-gray-50 text-gray-900">
	<section class="bg-primary text-white">
		<div class="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
			<p class="text-primary-100 mb-3 text-sm font-semibold tracking-wide uppercase">
				Viet Spark Donation
			</p>
			<h1 class="mx-auto max-w-3xl text-4xl leading-tight font-bold sm:text-5xl">
				Donate to Viet Spark via Zelle
			</h1>
			<p class="text-primary-50 mx-auto mt-5 max-w-3xl text-lg leading-8">
				Thank you for supporting Viet Spark and our mission as a nonprofit organization. You can
				send your donation directly to our NGO account through Zelle using either method below.
			</p>
		</div>
	</section>

	<section class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="space-y-8">
			<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<div class="mb-5 flex items-center gap-3">
					<div
						class="bg-primary flex h-10 w-10 items-center justify-center rounded-full text-white"
					>
						<i class="fas fa-envelope" aria-hidden="true"></i>
					</div>
					<div>
						<p class="text-primary text-sm font-semibold uppercase">Option 1</p>
						<h2 class="text-2xl font-bold">Send by Email</h2>
					</div>
				</div>

				<p class="text-gray-700">
					Open Zelle through <strong>YOUR BANK&rsquo;S MOBILE APP</strong> or online banking account
					and enter the following email address:
				</p>

				<div class="border-primary-100 bg-primary-25 mt-5 rounded-md border p-4">
					<p class="text-sm font-semibold text-gray-600">Zelle Email</p>
					<a href={`mailto:${zelleEmail}`} class="text-primary mt-1 block text-xl font-bold">
						{zelleEmail}
					</a>
				</div>

				<p class="mt-5 text-gray-700">
					Please verify that the recipient information matches Viet Spark before completing your
					donation.
				</p>
			</div>

			<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<div class="mb-5 flex items-center gap-3">
					<div
						class="bg-secondary flex h-10 w-10 items-center justify-center rounded-full text-white"
					>
						<i class="fas fa-qrcode" aria-hidden="true"></i>
					</div>
					<div>
						<p class="text-secondary text-sm font-semibold uppercase">Option 2</p>
						<h2 class="text-2xl font-bold">Scan the Zelle QR Code</h2>
					</div>
				</div>

				<ol class="space-y-3">
					{#each qrSteps as step, index (step)}
						<li class="flex gap-3 text-gray-700">
							<span
								class="text-primary mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold"
							>
								{index + 1}
							</span>
							{#if index === 0}
								<span>Log in to <strong>YOUR BANK&rsquo;S MOBILE APP</strong>.</span>
							{:else}
								<span>{step}</span>
							{/if}
						</li>
					{/each}
				</ol>
			</div>

			<div class="rounded-lg border border-gray-200 bg-white p-5 text-center shadow-sm">
				<h2 class="mb-4 text-xl font-bold">Viet Spark Zelle QR Code</h2>
				<img
					src={zelleQrCode}
					alt="Viet Spark Zelle QR code for donations"
					class="mx-auto w-full max-w-xs rounded-md border border-gray-200"
				/>
				<p class="mt-4 text-sm text-gray-600">
					Save this image to your phone, then upload or scan it from your bank's Zelle flow.
				</p>
			</div>

			<div class="border-tertiary-300 bg-tertiary-50 rounded-lg border p-6">
				<div class="flex gap-3">
					<div
						class="bg-tertiary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
					>
						<i class="fas fa-circle-info" aria-hidden="true"></i>
					</div>
					<div>
						<h2 class="text-xl font-bold text-gray-900">Important</h2>
						<p class="mt-2 text-gray-800">
							In the memo or message section, please include your full name so our team can properly
							record and acknowledge your donation.
						</p>
						<p class="mt-4 font-semibold text-gray-900">Thank you for your generous support!</p>
					</div>
				</div>
			</div>
		</div>
	</section>
</main>
