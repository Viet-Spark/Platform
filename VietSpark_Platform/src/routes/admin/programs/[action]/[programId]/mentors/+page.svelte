<script>
    import { goto } from '$app/navigation';
    import { userData, userLoading } from '$lib/stores/userStore';
    import { authUser } from '$lib/stores/authStore';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { programHandlers, programLoading, curProgram } from '$lib/stores/programStore';
    import { applications, applicationHandlers, applicationLoading } from '$lib/stores/applicationStore';    // Redirect if not admin
    import { writable } from 'svelte/store';
    import { formatDate } from '$lib/utils/formatDate'; 

    $: if (!$userLoading && $authUser && $userData && !$userData.isAdmin) {
        goto('/');
    }

    let mentorApplications = []; 
    let loading = true;
    let error = '';
    let filterStatus = 'all'; // all, rejected, pending, approved, withdrawn
	let filteredApplications = [];
    $: programId = $page.params.programId;

    onMount(async () => {
        await programHandlers.getProgram(programId);
        await applicationHandlers.getApplications(); 
        mentorApplications = $applications.filter((app => $curProgram.mentorApplicantIds.includes(app.id))); 
        loading = false; 
    })

    $: filteredApplications = mentorApplications.filter((application) => {
        if (filterStatus === 'all') return true;
        return application.status.toLowerCase() === filterStatus;
    });

</script>

<section class="container mx-auto">
    {#if loading}
        <div class="flex h-screen items-center justify-center">
            <span>Loading...</span>
        </div>
    {:else}
		<div class="flex flex-col items-center justify-center bg-primary text-white p-4 mb-8">
			<h1 class="text-2xl font-bold">Mentor Applications</h1>
			<p>Manage {$curProgram.title} Mentor Applications</p>
		</div>
		{#if mentorApplications.length === 0}
			<div class="rounded-lg bg-gray-100 p-8 text-center">
				<p class="text-gray-600">There are currently no mentor applications.</p>
			</div>
		{:else}
            <div class="overflow-x-auto">
                <div class="mb-6">
                    <div class="flex gap-4">
                        <button
                            class="rounded-md px-4 py-2 {filterStatus === 'all'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
                            on:click={() => (filterStatus = 'all')}
                        >
                            All Applications
                        </button>
                        <button
                            class="rounded-md px-4 py-2 {filterStatus === 'approved'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
                            on:click={() => (filterStatus = 'approved')}
                        >
                            Approved
                        </button>
                        <button
                            class="rounded-md px-4 py-2 {filterStatus === 'pending'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
                            on:click={() => (filterStatus = 'pending')}
                        >
                            Pending
                        </button>
                        <button
                            class="rounded-md px-4 py-2 {filterStatus === 'rejected'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
                            on:click={() => (filterStatus = 'rejected')}
                        >
                            Rejected
                        </button>
                        <button
                            class="rounded-md px-4 py-2 {filterStatus === 'withdrawn'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
                            on:click={() => (filterStatus = 'withdrawn')}
                        >
                            Withdrawn
                        </button>
                    </div>
                </div>
                <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Applied</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        {#each filteredApplications as application}
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{application.name}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{application.email}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{formatDate(application.createdAt)}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        {(application.status === "Approved") ? "text-green-500" : (application.status === "Pending" ? "text-grey-700" : "text-red-500")}"
                                    >
										{application.status}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex space-x-2 justify-start">
                                        <a
                                            href="/admin/programs/edit/{$curProgram.id}/applications/{application.id}"
                                            class="text-blue-600 hover:text-blue-800"
                                        >
                                            Edit
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
                <div class="flex justify-end p-2">
                    <p class="text-gray-500">Count: {filteredApplications.length}</p>
                </div>
            </div>
		{/if}
	{/if}
</section>

