<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		// Redirect to the correct URL
		goto('/events/tech-summit-2023');
	});
</script>

<svelte:head>
	<title>Redirecting...</title>
	<meta http-equiv="refresh" content="0;url=/events/tech-summit-2023" />
</svelte:head>

<div class="flex h-screen items-center justify-center">
	<div class="text-center">
		<p class="mb-4 text-xl">Redirecting to Tech Summit 2023...</p>
		<a href="/events/tech-summit-2023" class="text-primary hover:underline"
			>Click here if you are not redirected</a
		>
	</div>
</div>
