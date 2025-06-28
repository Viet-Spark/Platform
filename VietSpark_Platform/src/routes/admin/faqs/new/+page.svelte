<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authUser } from '$lib/stores/authStore';
	import { userData } from '$lib/stores/userStore';
	import { createFAQ, faqs} from '$lib/stores/faqStore';
    import { writable } from 'svelte/store';
    import defaultProfile from '$lib/images/About/placeHolderAvatar.jpg';

	let isDataReady = false;
	let faqData = writable({
        category: '',
        newCategory: '',
		question: '',
		answer: '',
	});
    let isUploading = false;
    let uploadError = null;
    let categories = [];

	$: if ($authUser && $userData) {
		isDataReady = true;
	}

	$: if (isDataReady && $authUser && !$userData?.isAdmin) {
		goto('/');
	}
    onMount(async () => {
        categories = new Set($faqs.map(faq => faq.category));
        categories.add('Others')
        categories = Array.from(categories).sort();
    });

	async function handleSubmit() {
        uploadError = null;
		isUploading = true;

        try {
            await createFAQ({
                question: $faqData.question,
                answer: $faqData.answer,
                category: $faqData.category === 'Others' ? $faqData.newCategory : $faqData.category
            });
            goto('/admin/faqs');
		} catch (error) {
			console.error('Upload error:', error);
			uploadError = `Upload failed: ${error.message}`;
		} finally {
			isUploading = false;
		}
	}
</script>

<svelte:head>
	<title>Create New FAQ - VietSpark</title>
	<meta
		name="description"
		content="Create New FAQ for VietSpark"
	/>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	{#if !isDataReady}
		<div class="flex h-screen items-center justify-center">
			<p class="text-xl">Loading...</p>
		</div>
	{:else}
        <div class="flex flex-col items-center justify-center bg-primary text-white p-4">
            <h1 class="text-2xl font-bold">Create New FAQ</h1>
        </div>

        <section class="min-h-[50vh] bg-gray-50 py-12">
            <div class="container mx-auto px-4">
                <div class="rounded-lg bg-white p-6 shadow-md">
                    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
                        <div>
                            <label for="category" class="block text-sm font-bold text-gray-700">Category</label>
                            <select 
                                id="category" 
                                bind:value={$faqData.category} 
                                class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            >
                                {#each categories as category}
                                    <option value={category}>{category}</option>
                                {/each}
                            </select>
                            {#if $faqData.category === 'Others'}
                                <label for="newCategory" class="block mt-4 text-sm font-bold text-gray-700">New Category Name</label>
                                <input
                                    type="text"
                                    id="newCategory"
                                    bind:value={$faqData.newCategory}
                                    placeholder="Enter new category name"
                                    class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                />
                            {/if}
                        </div>
                        <div>
                            <label for="question" class="block text-sm font-bold text-gray-700">Question</label>
                            <input
                                type="text"
                                id="question"
                                bind:value={$faqData.question}
                                class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>
                        <div>
                            <label for="answer" class="block text-sm font-bold text-gray-700">Answer</label>
                            <textarea
                                id="answer"
                                rows="2"
                                bind:value={$faqData.answer}
                                class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            ></textarea>
                        </div>
                        <div class="flex justify-end space-x-4">
                            <a
                                href="/admin/faqs"
                                class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </a>
                            <button
                                type="submit"
                                class="bg-primary hover:bg-primary-dark rounded-md px-4 py-2 text-sm font-medium text-white"
                            >
                                Create FAQ
                            </button>
                        </div>
                    </form>
                </div>
            </div>
		</section>
	{/if}
</div> 