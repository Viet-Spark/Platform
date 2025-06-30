<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { authUser } from '$lib/stores/authStore';
	import { userData } from '$lib/stores/userStore';
	import { partners, updatePartner, fetchPartners, uploadPartnerImage } from '$lib/stores/partnerStore';
    import { writable } from 'svelte/store';
    import defaultProfile from '$lib/images/About/placeHolderAvatar.jpg';

	let isDataReady = false;
	let partnerData = writable({
		name: '',
		image: '',
		website: ''
	});

    let fileInput;
	let uploadError = null;
	let isUploading = false;
	let localImagePreview = null;
    let file = null;

	$: if ($authUser && $userData) {
		isDataReady = true;
	}

	$: if (isDataReady && $authUser && !$userData?.isAdmin) {
		goto('/');
	}

	let partnerId = $page.params.id;

	onMount(async () => {
		if (partnerId) {
			await fetchPartners();
			const partner = $partners.find((p) => p.id === partnerId);
			if (partner) {
				partnerData.set({
					name: partner.name,
					image: partner.image,
					website: partner.website,
                    id: partner.id
				});
			} else {
				// Partner not found, redirect back to partners list
				goto('/admin/partners');
			}
		}
	});

	async function handleSubmit() {
		uploadError = null;
		isUploading = true;

        try {
            if (file) {
                // Upload to Firebase Storage
			    await uploadPartnerImage($partnerData.id, file);
            }
            goto('/admin/partners');
		} catch (error) {
			console.error('Upload error:', error);
			uploadError = `Upload failed: ${error.message}`;
		} finally {
			isUploading = false;
		}
	}

    function handleAvatarClick() {
		if (fileInput) {
			fileInput.click();
		}
	}

	async function handleFileChange(event) {
		file = event.target.files[0];
		if (!file) return;

		// Check file type
		if (!file.type.startsWith('image/')) {
			uploadError = 'Please select an image file';
			return;
		}

		// Check file size (max 2MB)
		if (file.size > 2 * 1024 * 1024) {
			uploadError = 'Image size should be less than 2MB';
			return;
		}

		// Show preview immediately
		const reader = new FileReader();
		reader.onload = (e) => {
			localImagePreview = e.target.result;
		};
		reader.readAsDataURL(file);
	}

</script>

<svelte:head>
	<title>Edit Partner - VietSpark</title>
	<meta
		name="description"
		content="Edit Partner for VietSpark"
	/>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	{#if !isDataReady}
		<div class="flex h-screen items-center justify-center">
			<p class="text-xl">Loading...</p>
		</div>
	{:else}
        <div class="flex flex-col items-center justify-center bg-primary text-white p-4">
            <h1 class="text-2xl font-bold">Edit Partner</h1>
        </div>

        <section class="min-h-[50vh] bg-gray-50 py-12">
            <div class="container mx-auto px-4">
                <div class="rounded-lg bg-white p-6 shadow-md">
                    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
                        <div>
                            <label for="name" class="block text-sm font-bold text-gray-700">Partner Name</label>
                            <input
                                type="text"
                                id="name"
                                bind:value={$partnerData.name}
                                class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>
                        <div>
                            <label for="website" class="block text-sm font-bold text-gray-700">Website URL</label>
                            <input
                                type="url"
                                id="website"
                                bind:value={$partnerData.website}
                                class="focus:border-primary focus:ring-primary mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>
                        <div>
                            <label for="logo" class="block text-sm font-bold text-gray-700">Logo</label>
                            <input
                                type="file"
                                accept="image/*"
                                style="display: none;"
                                bind:this={fileInput}
                                on:change={(e) => handleFileChange(e)}
                            />
                            <div
                                class="text-primary relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden bg-blue-200 text-4xl font-bold"
                                on:click={() => handleAvatarClick()}
                                on:keydown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Space') {
                                        e.preventDefault();
                                        handleAvatarClick();
                                    }
                                }}
                                role="button"
                                tabindex="0"
                                aria-label="Upload logo picture"
                            >
                                {#if isUploading}
                                    <div class="absolute inset-0 flex items-center justify-center bg-blue-200 bg-opacity-80">
                                        <div
                                            class="h-12 w-12 animate-spin rounded-full border-2 border-white border-t-transparent"
                                        ></div>
                                    </div>
                                {:else if localImagePreview}
                                    <img
                                        src={localImagePreview}
                                        alt="Logo Preview"
                                        class="absolute inset-0 h-full w-full object-cover"
                                    />
                                {:else if $partnerData.image}
                                    <img
                                        src={$partnerData.image}
                                        alt="Logo Preview"
                                        class="absolute inset-0 h-full w-full object-cover"
                                    />
                                {:else}
                                    <img
                                        src={defaultProfile}
                                        alt="Default Profile"
                                        class="absolute inset-0 h-full w-full object-cover"
                                    />
                                {/if}
                            </div>
                        </div>

                        <div class="flex justify-end space-x-4">
                            <a
                                href="/admin/partners"
                                class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </a>
                            <button
                                type="submit"
                                class="bg-primary hover:bg-primary-dark rounded-md px-4 py-2 text-sm font-medium text-white"
                            >
                                Update Partner
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
	{/if}
</div> 