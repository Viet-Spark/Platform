<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authUser } from '$lib/stores/authStore';
	import { userData } from '$lib/stores/userStore';
	import { programs, programHandlers, programLoading, programError } from '$lib/stores/programStore';
    import { writable } from 'svelte/store';
	import { projectHandlers } from '$lib/stores/projectStore';
	import { teamHandlers } from '$lib/stores/teamStore';
	import { testimonialHandlers } from '$lib/stores/testimonialStore';

	let isDataReady = false;
	let filterStatus = 'all'; // all, upcoming, past
    let filteredPrograms = writable([]);

	$: if ($authUser && $userData) {
		isDataReady = true;
	}

	$: if (isDataReady && $authUser && !$userData?.isAdmin) {
		goto('/');
	}

	$: if ($programs) {
        filteredPrograms.set($programs
		.filter((program) => {
			const now = new Date();
			const programDate = new Date(program.startDate);

			if (filterStatus === 'upcoming') {
				return programDate >= now;
			} else if (filterStatus === 'past') {
				return programDate < now;
			}
			return true;
		})
		.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)));
    }

	async function handleDelete(program) {
		if (confirm('Are you sure you want to delete this program?')) {
			// Delete projects associated with this program
			if (program.projectIds.length > 0) {
				for (const projectId of program.projectIds) {
					await projectHandlers.deleteProject(projectId); 
				}
			} 
			// Delete teams associated with this program 
			if (program.teamIds.length > 0) {
				for (const teamId of program.teamIds) {
					await teamHandlers.deleteTeam(teamId); 
				}
			} 
			// Delete testimonials associated with this program 
			if (program.testimonialIds.length > 0) {
				for (const testimonialId of program.testimonialIds) {
					await testimonialHandlers.deleteTestimonial(testimonialId);
				}
			} 
			await programHandlers.deleteProgram(program.id);
		}
	};

	function formatDate(date) {
		return new Date(date).toLocaleString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})
	};

</script>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Programs</h1>
		<a
			href="/admin/programs/new"
			class="bg-primary hover:bg-primary-dark rounded-md px-4 py-2 text-white"
		>
			Create New Program
		</a>
	</div>

	<div class="mb-6">
		<div class="flex gap-4">
			<button
				class="rounded-md px-4 py-2 {filterStatus === 'all'
					? 'bg-primary text-white'
					: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				on:click={() => (filterStatus = 'all')}
			>
				All Programs
			</button>
			<button
				class="rounded-md px-4 py-2 {filterStatus === 'upcoming'
					? 'bg-primary text-white'
					: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				on:click={() => (filterStatus = 'upcoming')}
			>
				Upcoming
			</button>
			<button
				class="rounded-md px-4 py-2 {filterStatus === 'past'
					? 'bg-primary text-white'
					: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				on:click={() => (filterStatus = 'past')}
			>
				Past
			</button>
		</div>
	</div>

	{#if $programLoading}
		<div class="py-8 text-center">Loading...</div>
	{:else if $filteredPrograms.length === 0}
		<div class="py-8 text-center text-gray-500">No programs found</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each $filteredPrograms as program}
				<div class="overflow-hidden rounded-lg bg-white shadow">
					{#if program.coverUrl}
						<img src={program.coverUrl} alt={program.title} class="h-48 w-full object-cover" />
					{:else}
						<div class="h-48 w-full bg-primary-300"></div>
					{/if}
					<div class="p-4">
						<h3 class="mb-2 text-xl font-semibold">{program.title}</h3>
						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-500">
								{#if program.startDate}
									{formatDate(program.startDate)}
								{:else}
									Date not set
								{/if}
							</span>
							<div class="flex gap-2">
								<a
									href="/admin/programs/edit/{program.id}"
									class="text-primary hover:text-primary-dark"
								>
									Edit
								</a>
								<button
									on:click={() => handleDelete(program)}
									class="text-red-600 hover:text-red-800"
								>
									Delete
								</button>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
