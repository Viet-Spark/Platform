<script>
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import defaultProfile from '$lib/images/About/placeHolderAvatar.jpg';
	import { authLoading, authUser } from '$lib/stores/authStore';
	import { getUsers, userData, userLoading, usersList, getUserData} from '$lib/stores/userStore';
	import { applications, applicationLoading, applicationHandlers } from '$lib/stores/applicationStore';
	import { curProgram, programHandlers, programLoading } from '$lib/stores/programStore';
	import { teamHandlers } from '$lib/stores/teamStore';
	import { projects, projectHandlers, projectLoading } from '$lib/stores/projectStore';
	import { workshops, workshopHandlers, workshopLoading } from '$lib/stores/workshopStore';
	import { testimonials, testimonialHandlers, testimonialLoading } from '$lib/stores/testimonialStore';
	import { formatDateFromStr, formatDetailDate, formatDateForDateTimeInput } from '$lib/utils/formatDate';
	import { validateImageFile } from '$lib/utils/validator';
	import TeamForm from '$lib/components/TeamForm.svelte';
	import ProjectForm from '$lib/components/ProjectForm.svelte';
	import WorkshopForm from '$lib/components/WorkshopForm.svelte';

	const sections = [
		{ key: 'overview', label: 'Overview' },
		{ key: 'team', label: 'Team' },
		{ key: 'projects', label: 'Projects' },
		{ key: 'workshops', label: 'Workshops' },
		{ key: 'testimonials', label: 'Testimonials' }
	];

    let teamLinks = ['github', 'figma', 'notion', 'miro', 'presentation'];

    let teamIcons = {
        'github': "fab fa-github", 
        'figma': "fab fa-figma",
        'notion': "fas fa-note-sticky", 
        'miro': "fas fa-chalkboard",
        'presentation': 'fas fa-file-powerpoint'
    }

	let projectLinks = ['design', 'gitHub', 'demo', 'documentation', 'video'];

	let projectIcons = {
		'design': "fas fa-palette",
		'demo': "fas fa-play",
		'gitHub': "fab fa-github",
		'documentation': "fas fa-file-alt",
		'video': "fas fa-video"
	}

	function isTeamSection(key) {
		return key !== 'overview';
	}

	$: programId = $page.params.id;

	let activeSection = 'overview';
	let loading = true;
	let error = '';

	// Applicant + team state
	let myApplication = null;
	let team = null;

	// Derived content
	let teamProjects = [];
	let programWorkshops = [];
	let programTestimonials = [];

	// Prevent duplicate loads; reload when (uid, programId) changes.
	let lastLoadKey = null;

	// Toasts
	let toasts = [];
	let toastCounter = 0;
	function pushToast(message, type = 'success', timeoutMs = 3500) {
		const id = ++toastCounter;
		toasts = [...toasts, { id, message, type }];
		const t = setTimeout(() => {
			toasts = toasts.filter((x) => x.id !== id);
		}, timeoutMs);
		return () => clearTimeout(t);
	}

	function setActiveSection(key) {
		const s = sections.find((x) => x.key === key);
		const allowed = !isTeamSection(s?.key) || Boolean(myApplication?.assignedTeam);
		if (!allowed) return;
		activeSection = key;
	}

	async function loadData() {
		if (!programId) return;
		loading = true;
		error = '';
		try {
			// Ensure auth + user profile are ready before using applicationIds.
			// (Auth store initializes user data asynchronously via initializeUserData.)
			if ($authLoading) return;
			if (!$authUser?.uid) return;
			if (!$userData) {
				await getUserData($authUser.uid);
			}
			if ($userData && !$userData.id) {
				userData.update((cur) => (cur ? { ...cur, id: $authUser.uid } : cur));
			}

			await programHandlers.getProgram(programId);
			await applicationHandlers.getApplications();
			// Find this user's application for this program
			const ids = ($userData?.applicationIds || []).slice();
			myApplication = $applications.find((a) => ids.includes(a.id) && a.programId === programId && a.status === 'Approved') || null;

			if (!myApplication) {
				goto(`/programs/${programId}`);
			}
			if (myApplication?.assignedTeam) {
				team = await teamHandlers.getTeam(myApplication?.assignedTeam);

				await Promise.all([
					projectHandlers.getProjects(),
					workshopHandlers.getWorkshops(),
					testimonialHandlers.getTestimonials()
				]);

				teamProjects = $projects
					.filter((p) => ($curProgram.projectIds || []).includes(p.id))
					.filter((p) => p.teamId === team?.id);
				programWorkshops = $workshops.filter((w) => ($curProgram.workshopIds || []).includes(w.id) && w.visibility !== 'Public');
				// Get testimonial submitted by current logged in user
				const submitterId = $userData?.id || $authUser.uid;
				programTestimonials = $testimonials.filter(
					(t) =>
						($curProgram.testimonialIds || []).includes(t.id) &&
						t.submitterId === submitterId &&
						t.visibility !== 'Public'
				);
			} else {
				team = null;
				teamProjects = [];
				programWorkshops = [];
				programTestimonials = [];
				if (activeSection !== 'overview') activeSection = 'overview';
			}
		} catch (e) {
			console.error(e);
			error = e?.message || 'Failed to load program details.';
		} finally {
			loading = false;
		}
	}

	// Auto-load once auth + programId are ready, and re-load if either changes.
	$: if (browser) {
		const uid = $authUser?.uid;
		const key = uid && programId && !$authLoading ? `${uid}:${programId}` : null;
		if (!key) {
			lastLoadKey = null;
			myApplication = null;
			team = null;
		} else if (key !== lastLoadKey) {
			lastLoadKey = key;
			loadData();
		}
	}

    function getAvatarUrl(id) {
        let memberData = $usersList.find((u) => u.id === id); 
        if (memberData) {
            return memberData.profileImage;
        }
        return "";
    }


    async function handleDeleteProject(id) {
		if (confirm('Are you sure you want to delete this project?')) {
			await projectHandlers.deleteProject(id); 
		} 
        let projectIds = $curProgram.projectIds.filter(i => i != id); 
        let programData = {
            ...$curProgram, 
            projectIds: projectIds
        }
        await programHandlers.updateProgram(programId, programData); 
		pushToast("Project deleted successfully!");
		await loadData(); 
	}

	async function handleDeleteWorkshop(id) {
		if (confirm('Are you sure you want to delete this workshop?')) {
            loading = true; 
			await workshopHandlers.deleteWorkshop(id); 
		}
        const workshopIds = ($curProgram.workshopIds || []).filter(i => i != id); 
        let programData = {
            ...$curProgram, 
            workshopIds: workshopIds
        }
        await programHandlers.updateProgram(programId, programData); 
		pushToast("Workshop deleted successfully!");
        await loadData(); 
	}

	async function handleDeleteTestimonial(id) {
		if (confirm('Are you sure you want to delete this testimonial?')) {
			await testimonialHandlers.deleteTestimonial(id); 
		}
        const testimonialIds = ($curProgram.testimonialIds || []).filter(i => i != id); 
        let programData = {
            ...$curProgram, 
            testimonialIds: testimonialIds
        }
        await programHandlers.updateProgram(programId, programData); 
		pushToast("Testimonial deleted successfully!");
		await loadData(); 
	}

</script>

<svelte:head>
	<title>My Program - VietSpark</title>
</svelte:head>

{#if loading}
	<div class="min-h-screen bg-gray-50">
		<div class="bg-primary">
			<div class="container mx-auto px-4 py-10 text-white">
				<div class="h-8 w-72 animate-pulse rounded bg-white/20"></div>
				<div class="mt-3 h-4 w-96 animate-pulse rounded bg-white/15"></div>
			</div>
		</div>
		<div class="container mx-auto grid grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-12">
			<div class="lg:col-span-3">
				<div class="h-64 animate-pulse rounded-xl bg-white shadow"></div>
			</div>
			<div class="lg:col-span-9">
				<div class="h-10 w-56 animate-pulse rounded bg-gray-200"></div>
				<div class="mt-4 space-y-3">
					<div class="h-4 w-full animate-pulse rounded bg-gray-200"></div>
					<div class="h-4 w-11/12 animate-pulse rounded bg-gray-200"></div>
					<div class="h-4 w-10/12 animate-pulse rounded bg-gray-200"></div>
				</div>
			</div>
		</div>
	</div>
{:else if !$authUser}
	<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
		<div class="max-w-lg rounded-xl bg-white p-8 text-center shadow">
			<div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl text-primary">
				<i class="fas fa-user-lock"></i>
			</div>
			<h2 class="text-2xl font-bold">Please log in</h2>
			<p class="mt-2 text-gray-600">You need to be logged in to view your program.</p>
			<div class="mt-6">
				<a href="/login" class="btn bg-primary text-white hover:bg-primary-dark">Log In</a>
			</div>
		</div>
	</div>
{:else if error}
	<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
		<div class="max-w-xl rounded-xl bg-white p-8 text-center shadow">
			<p class="text-sm font-semibold text-red-700">Error</p>
			<p class="mt-2 text-gray-700">{error}</p>
			<div class="mt-6 flex flex-wrap justify-center gap-3">
				<button class="btn bg-primary text-white hover:bg-primary-dark cursor-pointer" on:click={loadAll}>Retry</button>
				<button class="btn border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 cursor-pointer" on:click={() => goto(`/programs/${programId}`)}>
                    Back to Program
                </button>
			</div>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-gray-50">
		<!-- Hero -->
		<section class="relative overflow-hidden bg-primary text-white">
			{#if $curProgram?.coverUrl}
				<div>
					<img src={$curProgram.coverUrl} alt="" class="h-full w-full object-cover" />
				</div>
			{/if}
        </section>

		<!-- Body -->
		<section class="container mx-auto grid grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-12">
			<!-- Sidebar nav -->
			<aside class="lg:col-span-3">
				<div class="sticky top-6 rounded-xl bg-white p-4 shadow">
					<h2 class="text-sm font-semibold text-gray-800">Sections</h2>
					<nav class="mt-3 space-y-1">
						{#each sections as s (s.key)}
							{@const allowed = !isTeamSection(s.key) || Boolean(myApplication?.assignedTeam)}
							<button
								type="button"
								class="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition cursor-pointer
									{activeSection === s.key ? 'bg-blue-50 text-primary' : 'text-gray-700 hover:bg-gray-50'}
									{!allowed ? 'opacity-50' : ''}"
								on:click={() => setActiveSection(s.key)}
								disabled={!allowed}
							>
								<span class="inline-flex items-center gap-2">
									{#if s.key === 'overview'}<i class="fas fa-circle-info"></i>{/if}
									{#if s.key === 'team'}<i class="fas fa-people-group"></i>{/if}
									{#if s.key === 'projects'}<i class="fas fa-diagram-project"></i>{/if}
									{#if s.key === 'workshops'}<i class="fas fa-chalkboard-teacher"></i>{/if}
									{#if s.key === 'testimonials'}<i class="fas fa-quote-left"></i>{/if}
									<span>{s.label}</span>
								</span>
								{#if isTeamSection(s.key) && !myApplication?.assignedTeam}
									<span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">Locked</span>
								{/if}
							</button>
						{/each}
					</nav>

					{#if !myApplication?.assignedTeam}
						<div class="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-900">
							<p class="font-semibold">Team Assignment Pending</p>
							<p class="mt-1 text-yellow-800">
								You’ll get access to Team, Projects, Workshops, and Testimonials once you’re placed on a team.
							</p>
						</div>
					{/if}
				</div>
			</aside>

			<!-- Main content -->
			<main class="lg:col-span-9">
				{#if activeSection === 'overview'}
					<div class="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center text-center gap-2">
                        <div>
                            <h1 class="mt-2 text-3xl font-bold sm:text-4xl">{$curProgram?.title || 'Program'} Overview</h1>
                        </div>

                        {#if $curProgram?.startDate && $curProgram?.endDate}
                            <div class="text-lg">
                                <div class="flex items-center">
                                    <i class="fas fa-calendar-day mr-2"></i>
                                    <span>
                                        {#if $curProgram.startDate}{formatDateFromStr($curProgram.startDate)}{/if}
                                        {#if $curProgram.startDate && $curProgram.endDate} – {/if}
                                        {#if $curProgram.endDate}{formatDateFromStr($curProgram.endDate)}{/if}
                                    </span>
                                </div>
                            </div>
                        {/if}

						{#if !myApplication?.assignedTeam}
							<div class="p-6 text-center">
								<div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl text-primary">
									<i class="fas fa-users"></i>
								</div>
								<h3 class="text-lg font-bold text-gray-900">You haven't been assigned to a team yet.</h3>
								<p class="mt-2 text-gray-600">Check back soon—we’re finalizing team placement.</p>
							</div>
                        {:else}
                            <div class="p-6 text-center">
                                <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl text-primary">
                                    <i class="fas fa-users"></i>
                                </div>
                                <h3 class="mb-2 text-lg font-bold text-gray-900">You have been assigned to {team.name}.</h3>
                                <button 
                                        on:click={() => activeSection = 'team'} 
                                        class="btn border-primary text-primary border-2 bg-transparent hover:bg-primary hover:text-white cursor-pointer"
                                >
                                    View Team Details
                                </button>
                            </div>

						{/if}
					</div>
				{:else if activeSection === 'team'}
					<div class="rounded-xl bg-white p-6 shadow">
						<div class="flex flex-col gap-3 sm:flex-row items-center sm:justify-between text-center">
							<div>
								<div class="text-2xl font-bold text-gray-900">{team?.name}</div>
							</div>
							<div class="flex flex-wrap gap-3">
								<button class="btn bg-primary text-white hover:bg-primary-dar cursor-pointer" on:click={() => goto(`/programs/${programId}/participant/team/${team.id}`)}>
									Edit Team Info
								</button>
							</div>
						</div>

						<div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
							<div class="lg:col-span-1">
								<div>
									<!-- <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Team photo</p> -->
									<div class="overflow-hidden rounded-full bg-gray-100">
										<img
											src={team?.logoUrl || defaultProfile}
											alt={team?.name || 'Team photo'}
											class="object-cover"
										/>
									</div>
								</div>
                                <div class="mt-6">
                                    <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Tags</p>
                                    <div class="flex flex-wrap gap-2 mt-2">
                                        {#each team?.tags as tag, idx}
                                            <span class="bg-gray-300 rounded-full px-3 py-1 flex items-center">{tag}</span>
                                        {/each}
                                    </div>
								</div>
                                <div class="mt-6">
                                    <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Links</p>
                                    <div class="flex flex-wrap gap-2 mt-2">
                                        {#each teamLinks as field}
                                            {#if team?.links[field]}
                                                <div>
                                                    <a
                                                        href={team?.links[field]} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        class="underline ml-2"
                                                        aria-label="{field} URL"
                                                    >
                                                        <i class="{teamIcons[field]} text-xl"></i>
                                                    </a>
                                                </div>
                                            {/if}
                                        {/each}
                                    </div>
                                </div>
							</div>

							<div class="lg:col-span-2">
								<div class="rounded-xl border p-4">
                                    <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Description</p>
                                    <p class="mt-2 whitespace-pre-wrap text-gray-700">{team?.description || '—'}</p>
								</div>

								<div class="mt-6 rounded-xl border p-4">
									<div class="flex items-center justify-between">
										<p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Members</p>
										<p class="text-sm text-gray-600">
											{(team?.users?.length || 0) + (team?.manager ? 1 : 0)} total
										</p>
									</div>

									<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
										{#if team?.manager}
											<div class="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
												<img src={getAvatarUrl(team.manager.userId) || defaultProfile} alt="" class="h-10 w-10 rounded-full object-cover" />
												<div class="min-w-0">
													<p class="truncate font-semibold text-gray-900">{team.manager.name || 'Manager'}</p>
													<p class="text-sm text-gray-600">Manager</p>
												</div>
											</div>
										{/if}
										{#each team?.users || [] as member (member.userId)}
											<div class="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
												<img src={getAvatarUrl(member.userId) || defaultProfile} alt="" class="h-10 w-10 rounded-full object-cover" />
												<div class="min-w-0">
													<p class="truncate font-semibold text-gray-900">{member.name || member.email || 'Member'}</p>
													<p class="text-sm text-gray-600">{member.role.slice(0, 1).toUpperCase() + member.role.slice(1)}</p>
												</div>
											</div>
										{/each}
									</div>
								</div>

                                {#if team?.notes}
                                    <div class="mt-6 rounded-xl border p-4">
                                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Notes to Admin</p>
                                        <p class="mt-2 whitespace-pre-wrap text-gray-700">{team?.notes}</p>
                                    </div>
                                {/if}
							</div>
						</div>
					</div>
				{:else if activeSection === 'projects'}
					<div class="rounded-xl bg-white p-6 shadow">
						<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
							<div>
								<div class="text-2xl font-bold text-gray-900">Projects</div>
								<p class="mt-1 text-gray-600">Track your team’s projects.</p>
							</div>
							<button class="btn bg-primary text-white hover:bg-primary-dark cursor-pointer" on:click={() => goto(`/programs/${programId}/participant/team/${team.id}/projects/new`)}>
								Add Project
							</button>
						</div>

						{#if $projectLoading}
							<p class="mt-6 text-gray-600">Loading projects…</p>
						{:else if teamProjects.length === 0}
							<div class="mt-8 rounded-xl bg-gray-50 p-6 text-center">
								<div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl text-primary">
									<i class="fas fa-diagram-project"></i>
								</div>
								<h3 class="text-lg font-bold text-gray-900">No projects yet</h3>
								<p class="mt-2 text-gray-600">Add your first project to get started.</p>
							</div>
						{:else}
							<div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
								{#each teamProjects as p (p.id)}
									<div class="group overflow-hidden rounded-xl border bg-white shadow-sm">
										<div class="relative h-36 bg-primary">
											{#if p.imageUrls?.[0]}
												<img
													src={p.imageUrls?.[0]}
													alt=""
													class="h-full w-full object-cover"
												/>
											{/if}
											<span
												class="absolute bottom-3 right-3 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-900"
											>
												{p.status || 'In Progress'}
											</span>
										</div>
										<div class="p-4">
											<div class="flex justify-between items-center">
												<div class="font-bold text-gray-900 text-lg">
													<button 
														type="button"
														class="text-primary hover:underline cursor-pointer" 
														on:click={() => goto(`/programs/${programId}/participant/team/${team.id}/projects/${p.id}`)}
													>
														{p.title}
													</button>
												</div>
												<div class="flex gap-2">
													<button
														type="button"
														class="rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-gray-900 hover:bg-white cursor-pointer"
														on:click={() => goto(`/programs/${programId}/participant/team/${team.id}/projects/${p.id}/edit`)}
													>
														Edit
													</button>
													<button
														type="button"
														class="rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-white cursor-pointer"
														on:click={() => handleDeleteProject(p.id)}
													>
														Delete
													</button>
												</div>
											</div>
											{#if p.presentationDate}
												<div class="mt-2">
													<p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Presentation Date</p>
													<div class="text-sm text-gray-600">{formatDateFromStr(p.presentationDate)}</div>
												</div>
											{/if}
											{#if p.tags.length > 0}
												<div class="mt-2">
													<p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Tags</p>
													<div class="flex flex-wrap gap-2 mt-2 text-sm">
														{#each p.tags as tag, idx}
															<span class="bg-gray-300 rounded-full px-3 py-1 flex items-center">{tag}</span>
														{/each}
													</div>
												</div>
											{/if}
											{#if Object.keys(p.links).length > 0}
												<div class="mt-2">
													<p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Links</p>
													<div class="flex flex-wrap gap-2 mt-2 text-sm">
														{#each projectLinks as field}
															{#if p.links[field]}
																<div>
																	<a
																		href={p.links[field]} 
																		target="_blank" 
																		rel="noopener noreferrer"
																		class="underline ml-2"
																		aria-label="{field} URL"
																	>
																		<i class="{projectIcons[field]} text-xl"></i>
																	</a>
																</div>
															{/if}
														{/each}
													</div>
												</div>
											{/if}
											{#if p.technologies.length > 0}
												<div class="mt-2">
													<p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Technologies</p>
													<div class="line-clamp-3 text-sm text-gray-600">{p.technologies.join(', ')}</div>
												</div>
											{/if}
											{#if p.description}
												<div class="mt-2">
													<p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Description</p>
													<div class="line-clamp-3 text-sm text-gray-600">{p.description}</div>
												</div>
											{/if}
											
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{:else if activeSection === 'workshops'}
					<div class="rounded-xl bg-white p-6 shadow">
						<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
							<div>
								<div class="text-2xl font-bold text-gray-900">Workshops</div>
								<p class="mt-1 text-gray-600">Workshops in your program.</p>
							</div>
							<button class="btn bg-primary text-white hover:bg-primary-dark cursor-pointer" on:click={() => goto(`/programs/${programId}/participant/workshops/new`)}>
								Add Workshop
							</button>
						</div>

						{#if $workshopLoading}
							<p class="mt-6 text-gray-600">Loading Workshops…</p>
						{:else if programWorkshops.length === 0}
							<div class="mt-8 rounded-xl bg-gray-50 p-6 text-center">
								<div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl text-primary">
									<i class="fas fa-chalkboard-teacher"></i>
								</div>
								<h3 class="text-lg font-bold text-gray-900">No internal workshops yet</h3>
								<p class="mt-2 text-gray-600">Add a workshop to help your team stay aligned.</p>
							</div>
						{:else}
							<section>
								<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 h-full mt-6">
									{#each programWorkshops as workshop (workshop.id)}
										<div class="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
											{#if workshop.coverUrl}
												<img
													src={workshop.coverUrl}
													alt={workshop.title}
													class="h-48 w-full object-cover"
													loading="lazy"
												/>
											{/if}
											<div class="flex flex-1 flex-col gap-3 p-4">
												<button
													class="text-lg font-semibold text-gray-900 hover:underline cursor-pointer"
													on:click={() => goto(`/programs/${programId}/participant/workshops/${workshop.id}`)}
												>
													{workshop.title}
												</button>
												{#if workshop.startTime}
													<p class="flex items-center text-sm text-gray-600">
														<i class="fas fa-calendar-alt mr-2 text-primary"></i>
														{formatDetailDate(workshop.startTime)}
													</p>
												{/if}
												{#if workshop.location}
													<p class="flex items-center text-sm text-gray-600">
														<i class="fas fa-map-marker-alt mr-2 text-primary"></i>
														{workshop.location}
													</p>
												{/if}
												<div class="flex flex-row gap-2 mt-auto text-center text-lg">
													<button
														type="button"
														class="flex-1 p-2 bg-primary text-white rounded-lg cursor-pointer hover:underline"
														on:click={() => goto(`/programs/${programId}/participant/workshops/${workshop.id}/edit`)}
													>
														Edit
													</button>
													<button
														type="button"
														on:click={() => handleDeleteWorkshop(workshop.id)}
														class="flex-1 p-2 bg-red-500 text-white rounded-lg cursor-pointer hover:underline"
													>
														Delete
													</button>
												</div>
											</div>
										</div>
									{/each}
								</div>
							</section>
								
						{/if}
					</div>
				{:else if activeSection === 'testimonials'}
					<div class="rounded-xl bg-white p-6 shadow">
						<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
							<div>
								<div class="text-2xl font-bold text-gray-900">Testimonials</div>
								<p class="mt-1 text-gray-600">Share and manage testimonials for your program.</p>
							</div>
							<button class="btn bg-primary text-white hover:bg-primary-dark" on:click={() => goto(`/programs/${programId}/participant/testimonials/new`)}>
								Add Testimonial
							</button>
						</div>

						{#if $testimonialLoading}
							<p class="mt-6 text-gray-600">Loading testimonials…</p>
						{:else if programTestimonials.length === 0}
							<div class="mt-8 rounded-xl bg-gray-50 p-6 text-center">
								<div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl text-primary">
									<i class="fas fa-quote-left"></i>
								</div>
								<h3 class="text-lg font-bold text-gray-900">No testimonials yet</h3>
								<p class="mt-2 text-gray-600">Add a testimonial to highlight impact and progress.</p>
							</div>
						{:else}
							<div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
								{#each programTestimonials as t (t.id)}
									<div class="rounded-xl border bg-white p-5 shadow-sm">
										<div class="flex items-start justify-between gap-4">
											<div class="flex items-center gap-3">
												<img
													src={t.authorCoverImage || defaultProfile}
													alt=""
													class="h-12 w-12 rounded-full object-cover"
												/>
												<div class="min-w-0">
													<p class="truncate font-bold text-gray-900">{t.authorName || 'Anonymous'}</p>
													<p class="truncate text-sm text-gray-600">{t.authorTitle || ''}</p>
												</div>
											</div>
										</div>
										<blockquote class="mt-4 border-l-4 border-blue-100 pl-4 text-gray-800 ">
											<button
												type="button"
												class="whitespace-pre-wrap hover:underline cursor-pointer"
												on:click={() => goto(`/programs/${programId}/participant/testimonials/${t.id}`)}
											>
												{t.highlight}
											</button>
										</blockquote>
										<div class="flex flex-row gap-2 mt-2 text-center text-lg">
											<button
												type="button"
												class="flex-1 p-2 bg-primary text-white rounded-lg cursor-pointer hover:underline"
												on:click={() => goto(`/programs/${programId}/participant/testimonials/${t.id}/edit`)}
											>
												Edit
											</button>
											<button
												type="button"
												on:click={() => handleDeleteTestimonial(t.id)}
												class="flex-1 p-2 bg-red-500 text-white rounded-lg cursor-pointer hover:underline"
											>
												Delete
											</button>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{:else}
					<div class="rounded-xl bg-white p-6 shadow">
						<h2 class="text-2xl font-bold text-gray-900">Section not found</h2>
						<p class="mt-2 text-gray-600">Please choose a section from the left.</p>
					</div>
				{/if}
			</main>
		</section>

		<!-- Toasts -->
		<div class="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(420px,calc(100vw-2rem))] flex-col gap-2">
			{#each toasts as t (t.id)}
				<div
					class="pointer-events-auto rounded-xl border bg-white px-4 py-3 shadow
						{t.type === 'error' ? 'border-red-200' : 'border-green-200'}"
					role="status"
					aria-live="polite"
				>
					<p class="text-sm font-semibold {t.type === 'error' ? 'text-red-700' : 'text-green-700'}">
						{t.message}
					</p>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.btn {
		display: inline-block;
		padding: 0.65rem 1.1rem;
		font-weight: 600;
		border-radius: 0.6rem;
		transition: all 0.2s;
	}
	/* Tailwind line-clamp utility may not be enabled everywhere */
	.line-clamp-2,
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
		line-clamp: 3;
	}
	.line-clamp-2 {
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}
	.line-clamp-3 {
		-webkit-line-clamp: 3;
		line-clamp: 3;
	}
</style>
