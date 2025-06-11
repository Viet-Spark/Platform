<script>
	import { onDestroy, onMount } from 'svelte';
	import { devStore, devHandlers } from '$lib/stores/devStore';
	import AddDevForm from './devComponents/AddDevForm.svelte';
	import EditDevForm from './devComponents/EditDevForm.svelte';

	let devStoreUnsubscribe = null;
	let devs = [];

	let requestIdValue = '';

	let responseDevName = '';
	let responseDevId = '';

	async function handleSearch(requestIdValue) {
		responseDevName = await devHandlers.getDevNameFromId(requestIdValue);
		responseDevId = requestIdValue;
	}

	devStoreUnsubscribe = devStore.subscribe((state) => {
		devs = state.devs || [];
		console.log('devStore state:', state);
	});

	onDestroy(() => {
		if (devStoreUnsubscribe) {
			devStoreUnsubscribe();
		}
	});

	onMount(async () => {
		await devHandlers.getDevs();
		// Initial fetch or setup can be done here if needed
		console.log('Dev page mounted');
	});
</script>

<div>hello world, i'm the dev page</div>

<div>
	Add Dev Form:
	<AddDevForm />
</div>

<div>DEVS:</div>
{#each devs as dev (dev.id)}
	<div class=" flex flex-col items-start justify-start rounded-lg border bg-white p-4 shadow-md">
		Dev ID: {dev.id}
		<p>{dev.name}</p>
		<p>{dev.email}</p>
		<div>
			Edit Dev Form:
			<EditDevForm devId={dev.id} />
		</div>
	</div>
{/each}

<input
	type="text"
	bind:value={requestIdValue}
	placeholder="Search devs..."
	class="w-full rounded-md px-3 py-2 focus:outline-none"
/>
<button
	on:click={() => handleSearch(requestIdValue)}
	type="button"
	class="rounded-md bg-white px-4 py-2 text-black hover:bg-gray-200"
>
	Search
</button>
<div class="flex flex-col items-start justify-start rounded-lg border bg-white p-4 shadow-md">
	Dev ID: {responseDevId}
	<p>{responseDevName}</p>
</div>
