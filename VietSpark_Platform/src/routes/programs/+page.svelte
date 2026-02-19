<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { programs, programHandlers, programLoading, programError } from '$lib/stores/programStore';
    import { formatDateFromStr} from '$lib/utils/formatDate'; 

	let filterStatus = 'all'; // all | upcoming | past
	let filteredPrograms = writable([]);

	onMount(async () => {
		// `+layout.svelte` already fetches programs, but this makes /programs robust on its own too.
		if (!$programs || $programs.length === 0) {
			await programHandlers.getPrograms();
		}
	});

	function getStatus(program) {
		const start = new Date(program?.startDate);
		const end = new Date(program?.endDate);
		if (!start) return 'unknown';
		if (start >= new Date()) {
			return 'upcoming'; 
		} else {
			return end >= new Date() ? 'current' : 'past';
		}
	}


	$: if ($programs) {
		filteredPrograms.set(
			$programs
				.filter((program) => {
					const status = getStatus(program);
					if (filterStatus === 'upcoming') return status === 'upcoming';
					if (filterStatus === 'past') return status === 'past';
					if (filterStatus === 'current') return status === 'current';
					return true;
				})
				.sort((a, b) => (new Date(b?.startDate)?.getTime() || 0) - (new Date(a?.startDate)?.getTime() || 0))
		);
	}
</script>

<svelte:head>
	<title>Programs - VietSpark</title>
	<meta
		name="description"
		content="Explore VietSpark programs and cohorts, including timelines, details, and highlights."
	/>
</svelte:head>

<!-- Hero -->
<section class="bg-primary py-16 text-white">
	<div class="container mx-auto px-4 text-center">
		<h1 class="mb-4 text-4xl font-bold">VietSpark Programs</h1>
		<p class="mx-auto max-w-3xl text-xl">
			Connect, educate, and empower Vietnamese professionals in tech.
		</p>
	</div>
</section>

<!-- Filters -->
<section class="border-b bg-white py-8">
	<div class="container mx-auto px-4">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<h2 class="text-2xl font-bold">Browse Programs</h2>
			<div class="flex flex-wrap gap-2">
				<button
					class="rounded-full px-4 py-2 text-sm font-medium transition-colors {filterStatus === 'all'
						? 'bg-primary text-white'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
					on:click={() => (filterStatus = 'all')}
				>
					All
				</button>
				<button
					class="rounded-full px-4 py-2 text-sm font-medium transition-colors {filterStatus === 'upcoming'
						? 'bg-primary text-white'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
					on:click={() => (filterStatus = 'upcoming')}
				>
					Upcoming
				</button>
				<button
					class="rounded-full px-4 py-2 text-sm font-medium transition-colors {filterStatus === 'current'
						? 'bg-primary text-white'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
					on:click={() => (filterStatus = 'current')}
				>
					Current
				</button>
				<button
					class="rounded-full px-4 py-2 text-sm font-medium transition-colors {filterStatus === 'past'
						? 'bg-primary text-white'
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
					on:click={() => (filterStatus = 'past')}
				>
					Past
				</button>
			</div>
		</div>
	</div>
</section>

<!-- List -->
<section class="bg-gray-50 py-16">
	<div class="container mx-auto px-4">
		{#if $programLoading}
			<div class="flex min-h-[40vh] items-center justify-center">
				<div class="text-center">
					<div class="border-primary inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2"></div>
					<p class="mt-4 text-gray-600">Loading programs...</p>
				</div>
			</div>
		{:else if $programError}
			<div class="rounded-lg bg-white p-6 text-center shadow-sm">
				<p class="font-semibold text-red-700">Failed to load programs</p>
				<p class="mt-2 text-gray-600">{$programError}</p>
				<button class="btn bg-primary hover:bg-primary-dark mt-6 text-white" on:click={() => programHandlers.getPrograms()}>
					Try again
				</button>
			</div>
		{:else if $filteredPrograms.length === 0}
			<div class="rounded-lg bg-white p-10 text-center shadow-sm">
				<p class="text-gray-600">No programs found.</p>
				<button class="text-primary mt-4 hover:underline" on:click={() => (filterStatus = 'all')}>
					View all programs
				</button>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				{#each $filteredPrograms as program (program.id)}
					<div class="group flex h-full flex-col h-70 overflow-hidden rounded-lg bg-white shadow-md transition">
						{#if program.coverUrl}
							<img src={program.coverUrl} alt={program.title} class="h-48 w-full object-cover" />
						{:else}
							<div class="bg-primary/20 h-48 w-full"></div>
						{/if}
						<div class="flex flex-1 flex-col p-6">
							<div class="mb-3 flex items-start justify-between gap-3">
								<div class="min-w-0">
									<h3 class="line-clamp-2 text-2xl font-bold">{program.title}</h3>
									{#if program.year}
										<p class="mt-1 text-sm text-gray-500">{program.year}</p>
									{/if}
								</div>
								<span
									class="inline-block rounded-full px-3 py-1 text-xs font-semibold {getStatus(program) === 'upcoming'
										? 'bg-green-100 text-green-700'
										: getStatus(program) === 'past'
											? 'bg-gray-100 text-gray-700'
											: 'bg-blue-100 text-blue-700'}"
								>
									{getStatus(program) === 'upcoming' ? 'Upcoming' : getStatus(program) === 'past' ? 'Past' : 'Current'}
								</span>
							</div>

							{#if program.startDate || program.endDate}
								<p class="mb-3 text-sm text-gray-600">
									{#if program.startDate}{formatDateFromStr(program.startDate)}{/if}
									{#if program.startDate && program.endDate} – {/if}
									{#if program.endDate}{formatDateFromStr(program.endDate)}{/if}
								</p>
							{/if}

							<div class="mt-auto pt-5">
								<a 
									href={`/programs/${program.id}`}
									class="btn bg-primary hover:bg-primary-dark text-center text-white text-base w-full block">
									View Details
								</a>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
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
