<script>
	import { goto } from '$app/navigation';
	import { userData } from '$lib/stores/userStore';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { projectHandlers } from '$lib/stores/projectStore';
	import { teamHandlers } from '$lib/stores/teamStore';
	import { programHandlers } from '$lib/stores/programStore';
	import { formatDate } from '$lib/utils/formatDate';

	$: programId = $page.params.id;
	$: projectId = $page.params.projectId;
	$: teamId = $page.params.teamId;

	const linkFields = [
		{ key: 'design', label: 'Design', icon:  "fas fa-palette"},
		{ key: 'gitHub', label: 'GitHub', icon:  "fab fa-github"},
		{ key: 'demo', label: 'Demo', icon: "fas fa-play" },
		{ key: 'documentation', label: 'Documentation', icon: "fas fa-file-alt" },
		{ key: 'video', label: 'Video', icon: "fas fa-video" }
	];

	let loading = true;
	let error = '';
	let project = null;

	let imageIndex = 0;
	let lightboxOpen = false;

	$: imageUrls = project?.imageUrls?.filter(Boolean) ?? [];

	$: if (imageUrls.length === 0) {
		imageIndex = 0;
	} else if (imageIndex >= imageUrls.length) {
		imageIndex = imageUrls.length - 1;
	}

	function nextImage() {
		if (imageUrls.length < 2) return;
		imageIndex = (imageIndex + 1) % imageUrls.length;
	}

	function prevImage() {
		if (imageUrls.length < 2) return;
		imageIndex = (imageIndex - 1 + imageUrls.length) % imageUrls.length;
	}

	function openLightbox() {
		if (!imageUrls.length) return;
		lightboxOpen = true;
	}

	function closeLightbox() {
		lightboxOpen = false;
	}

	function onLightboxKeydown(e) {
		if (!lightboxOpen) return;
		if (e.key === 'Escape') {
			closeLightbox();
		} else if (e.key === 'ArrowRight') {
			nextImage();
		} else if (e.key === 'ArrowLeft') {
			prevImage();
		}
	}

	onMount(async () => {
		loading = true;
		try {
			await programHandlers.getProgram(programId);
			project = await projectHandlers.getProject(projectId);
			const team = await teamHandlers.getTeam(teamId);

			if (!$userData?.id) {
				return;
			}

			const member = team?.users?.find((u) => u.userId === $userData.id);
			const isManager = team?.manager?.userId === $userData.id;
			if (!member && !isManager) {
				goto(`/programs/${programId}`);
				return;
			}

			if (project && project.teamId && project.teamId !== teamId) {
				goto(`/programs/${programId}/participant`);
				return;
			}
		} catch (e) {
			error = 'Failed to load project.';
		} finally {
			loading = false;
		}
	});
</script>

<svelte:window on:keydown={onLightboxKeydown} />

<svelte:head>
	<title>{project?.title ? `${project.title} · Project` : 'Project'} — VietSpark</title>
</svelte:head>

<section class="min-h-[50vh]">
	{#if loading}
		<div class="flex h-screen items-center justify-center">
			<span>Loading...</span>
		</div>
	{:else}
		<div class="container mx-auto md:my-5">
			<div class="rounded-lg bg-white p-6 shadow-md">
				{#if error}
					<div class="rounded-md bg-red-50 p-4">
						<h3 class="text-sm font-medium text-red-800">Error</h3>
						<p class="mt-2 text-sm text-red-700">{error}</p>
					</div>
				{/if}

				{#if project}
					<div class="space-y-8">
						{#if imageUrls.length > 0}
							<div
								class="relative h-[min(50vh,560px)] w-full overflow-hidden rounded-xl bg-gray-100 md:h-[min(55vh,620px)]"
							>
								<button
									type="button"
									class="group absolute inset-0 cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
									on:click={openLightbox}
									aria-label="View image fullscreen"
								>
									<img
										src={imageUrls[imageIndex]}
										alt=""
										class="h-full w-full object-cover"
									/>
									<span
										class="pointer-events-none absolute bottom-3 right-3 rounded-md bg-black/50 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100"
									>
										Click for full screen
									</span>
								</button>

								{#if imageUrls.length > 1}
									<button
										type="button"
										class="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md transition hover:bg-white md:left-3"
										on:click|stopPropagation={prevImage}
										aria-label="Previous image"
									>
										<i class="fas fa-chevron-left" aria-hidden="true"></i>
									</button>
									<button
										type="button"
										class="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md transition hover:bg-white md:right-3"
										on:click|stopPropagation={nextImage}
										aria-label="Next image"
									>
										<i class="fas fa-chevron-right" aria-hidden="true"></i>
									</button>
									<div
										class="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs text-white"
									>
										{imageIndex + 1} / {imageUrls.length}
									</div>
								{/if}
							</div>
						{/if}

						<header
							class="flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row items-center justify-center md:justify-between"
						>
							<div>
								<h1 class="text-2xl font-bold text-gray-900">{project.title}</h1>
							</div>
							<div class="flex flex-wrap gap-2">
								<button
                                    type="button"
									class="rounded-md border border-gray-300 bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                                    on:click={() => goto(`/programs/${programId}/participant/team/${teamId}/projects/${projectId}/edit`)}
								>
									Edit Project
                                </button>
								<button
									type="button"
									class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
									on:click={() => goto(`/programs/${programId}/participant`)}
								>
									Back to Program
								</button>
							</div>
						</header>

						<dl class="grid grid-cols-2 gap-6 md:grid-cols-3">
							<div>
								<dt class="text-sm font-medium text-gray-500">Status</dt>
								<dd class="mt-1 text-gray-900">{project.status ?? '—'}</dd>
							</div>
							<div>
								<dt class="text-sm font-medium text-gray-500">Start Date</dt>
								<dd class="mt-1 text-gray-900">{formatDate(project.startDate) || '—'}</dd>
							</div>
							<div>
								<dt class="text-sm font-medium text-gray-500">End Date</dt>
								<dd class="mt-1 text-gray-900">{formatDate(project.endDate) || '—'}</dd>
							</div>
							<div>
								<dt class="text-sm font-medium text-gray-500">Presentation Date</dt>
								<dd class="mt-1 text-gray-900">{formatDate(project.presentationDate) || '—'}</dd>
							</div>
                            {#if project.technologies?.length}
                                <div>
                                    <h2 class="text-sm font-medium text-gray-500">Technologies</h2>
                                    <ul class="mt-2 flex flex-wrap gap-2">
                                        {#each project.technologies as tech}
                                            <li class="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800">{tech}</li>
                                        {/each}
                                    </ul>
                                </div>
                            {/if}
                            {#if project.tags?.length}
                                <div>
                                    <h2 class="text-sm font-medium text-gray-500">Tags</h2>
                                    <ul class="mt-2 flex flex-wrap gap-2">
                                        {#each project.tags as tag}
                                            <li class="rounded-full bg-blue-50 px-3 py-1 text-sm text-primary">{tag}</li>
                                        {/each}
                                    </ul>
                                </div>
                            {/if}
						</dl>

						{#if project.links && Object.values(project.links).some(Boolean)}
							<div>
								<h2 class="text-sm font-medium text-gray-500">Links</h2>
								<ul class="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
									{#each linkFields as { key, label, icon }}
										{#if project.links[key]}
											<li class="flex items-center gap-2">
                                                <i class="{icon} text-xl"></i>
												<span class="text-sm text-gray-600">{label}:</span>
                                                
												<a
													href={project.links[key]}
													class=" break-all text-sm text-primary underline"
													target="_blank"
													rel="noopener noreferrer"
												>
													{project.links[key]}
												</a>
											</li>
										{/if}
									{/each}
								</ul>
							</div>
						{/if}
                        {#if project.description} 
                            <div>
                                <h2 class="text-sm font-medium text-gray-500">Description</h2>
                                <p class="mt-2 whitespace-pre-wrap text-gray-900">{project.description || '—'}</p>
                            </div>
                        {/if}
						
					</div>
				{:else}
					<div class="flex h-48 items-center justify-center">
						<p class="text-xl text-gray-600">Project not found.</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</section>

{#if lightboxOpen && imageUrls.length > 0}
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4 md:p-8"
		on:click={closeLightbox}
		role="presentation"
	>
		<button
			type="button"
			class="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
			on:click|stopPropagation={closeLightbox}
			aria-label="Close fullscreen"
		>
			×
		</button>

		{#if imageUrls.length > 1}
			<button
				type="button"
				class="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 md:left-6"
				on:click|stopPropagation={prevImage}
				aria-label="Previous image"
			>
				<i class="fas fa-chevron-left text-lg" aria-hidden="true"></i>
			</button>
			<button
				type="button"
				class="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 md:right-6"
				on:click|stopPropagation={nextImage}
				aria-label="Next image"
			>
				<i class="fas fa-chevron-right text-lg" aria-hidden="true"></i>
			</button>
		{/if}

		<div class="flex max-h-full max-w-full items-center justify-center" on:click|stopPropagation role="presentation">
			<img
				src={imageUrls[imageIndex]}
				alt=""
				class="max-h-[85vh] max-w-full object-contain"
			/>
		</div>

		{#if imageUrls.length > 1}
			<div class="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-sm text-white">
				{imageIndex + 1} / {imageUrls.length}
			</div>
		{/if}
	</div>
{/if}
