<script>
	import { goto } from '$app/navigation';
	import { authUser } from '$lib/stores/authStore';
	import { userData } from '$lib/stores/userStore';
    import { usersList, userLoading, userError, updateUser } from '$lib/stores/userStore';
    import {writable} from 'svelte/store';
	import defaultProfile from '$lib/images/About/placeHolderAvatar.jpg';
    
    let isDataReady = false;
    let searchQuery = '';
    let filteredUsers = [];

    $: if ($authUser && $userData) {
        isDataReady = true;
    }

    $: if (isDataReady && $authUser && !$userData?.isAdmin) {
        goto('/');
    }

    // Filter users based on search query
    $: if ($usersList) {
        filteredUsers = $usersList.filter(user => {
            const searchLower = searchQuery.toLowerCase();
            const name = (user.name || user.displayName || '').toLowerCase();
            const email = (user.email || '').toLowerCase();
            const adminStatus = user.isAdmin ? 'admin' : 'user';

            return name.includes(searchLower) || 
                   email.includes(searchLower) || 
                   adminStatus.includes(searchLower);
        });
    }
    
    async function toggleAdmin(uid, isAdmin) {
        if (isAdmin) {
            if (confirm('Are you sure you want to remove admin status for this user?')) {
                try {
                    await updateUser(uid, { isAdmin: false });
                } catch (error) {
                    console.error('Error updating user:', error);
                }
            }
        } else {
            if (confirm('Are you sure you want to make this user an admin?')) {
                try {
                    await updateUser(uid, { isAdmin: true });
                } catch (error) {
                    console.error('Error updating user:', error);
                }
            }
        }
    }

</script>

<div class="container mx-auto px-4">
    {#if !isDataReady}
        <div class="flex h-screen items-center justify-center">
            <p class="text-xl">Loading...</p>
        </div>
    {:else}
        <div class="flex flex-col items-center justify-center bg-primary text-white p-4 mb-8">
            <h1 class="text-2xl font-bold">Users</h1>
            <p>Manage VietSpark's Users</p>
        </div>

        <!-- Search Bar -->
        <div class="mb-6">
            <div class="relative">
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Search by name, email, or admin status..."
                    class="w-full px-4 py-2 pl-10 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    {#each filteredUsers as user}
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">
                                {#if user.profileImage}
                                    <img src={user.profileImage} alt={user.name} class="w-10 h-10 rounded-full object-cover">
                                {:else}
                                    <img src={defaultProfile} alt={user.name} class="w-10 h-10 rounded-full object-cover">
                                {/if}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">{user.name || user.displayName}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-500">{user.email}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                                    {user.isAdmin ? 'Admin' : 'User'}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button 
                                    class="{user.isAdmin ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-dark'} text-white px-3 py-1 rounded-md text-sm"
                                    on:click={() => toggleAdmin(user.uid, user.isAdmin)}
                                >
                                    {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>