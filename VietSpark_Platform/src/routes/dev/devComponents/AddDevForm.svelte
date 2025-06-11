<script>
	import { devHandlers } from '$lib/stores/devStore';
	let email = '';
	let name = '';
	let devId = '';

	async function handleSubmit() {
		try {
			// Simulate form submission
			console.log('Form submitted with:', { email, name });
			devId = await devHandlers.createDev({ email, name });
			alert(`Form submitted successfully! new Dev ID: ${devId}`);
			email = '';
			name = '';
		} catch (error) {
			console.error('Error submitting form:', error);
			alert('Failed to submit form.');
		}
	}
</script>

<div>
	<input
		type="text"
		bind:value={name}
		placeholder="Enter your name"
		class="w-full rounded-md px-3 py-2 focus:outline-none"
	/>
	<input
		type="email"
		bind:value={email}
		placeholder="Enter your email"
		class="w-full rounded-md px-3 py-2 focus:outline-none"
	/>
	<button
		class="rounded-md bg-white px-4 py-2 text-black hover:bg-gray-200"
		type="button"
		on:click={() => {
			handleSubmit();
		}}>Submit</button
	>
</div>
