<script>
	import { onMount, onDestroy } from 'svelte';
	import { authUser, logout, authLoading } from '$lib/stores/authStore';
	import { aboutStore, aboutLoading, aboutError, aboutHandlers } from '$lib/stores/aboutStore';
    import MarkdownEditor from '$lib/components/MarkdownEditor.svelte';
	import { goto } from '$app/navigation';
    import { userData } from '$lib/stores/userStore';
	import defaultProfile from '$lib/images/About/placeHolderAvatar.jpg';

    let fileInputs = {
        history: {},
        volunteers: {},
        directors: {},
        advisors: {}
    }
	let isUploading = {
        history: {},
        volunteers: {},
        directors: {},
        advisors: {}
    };
	let localImagePreviews = {
        history: {},
        volunteers: {},
        directors: {},
        advisors: {}   
    };
    let uploadError = null;
	let loadingError = null;
	let loadingTimeout;
	let isSaving = false;
    let isDataReady = false;

    $: if ($authUser && $userData) {
		isDataReady = true;
	}

	$: if (isDataReady && $authUser && !$userData?.isAdmin) {
		goto('/');
	}


	// Function to generate unique IDs
	function generateUniqueId() {
		return Date.now().toString(36) + Math.random().toString(36).substr(2);
	}

	function handleAvatarClick(object, index) {
		if (fileInputs[object][index]) {
			fileInputs[object][index].click();
		}
	}

	async function handleFileChange(event, object, index) {
		const file = event.target.files[0];
		if (!file) return;

		// Check file type
		if (!file.type.startsWith('image/')) {
			uploadError = {
                object: object, 
                message: 'Please select an image file'
            };
			return;
		}

		// Check file size (max 2MB)
		if (file.size > 2 * 1024 * 1024) {
			uploadError = {
                object: object, 
                message: 'Image size should be less than 2MB'
            };
			return;
		}

		uploadError = null;
		isUploading[object][index] = true;

		// Show preview immediately
		const reader = new FileReader();
		reader.onload = (e) => {
			localImagePreviews[object][index] = e.target.result;
		};
		reader.readAsDataURL(file);

        if (object === 'volunteers') {
            try {
                await aboutHandlers.updateAbout({
                    volunteers: $aboutStore.volunteers,
                    lastUpdated: new Date().toISOString()
                });
                await aboutHandlers.uploadVolunteerImage($aboutStore.volunteers[index].id, file);
            } catch (error) {
                console.error('Upload Volunteer Image Error:', error);
                uploadError = {
                    object: object, 
                    message: `Upload Volunteer Image Failed: ${error.message}`
                };
            } finally {
                isUploading[object][index] = false;
            }
        } else if (object === 'directors') {
            try {
                await aboutHandlers.updateAbout({
                    boardOfDirectors: $aboutStore.boardOfDirectors,
                    lastUpdated: new Date().toISOString()
                });
                await aboutHandlers.uploadBoardOfDirectorsImage($aboutStore.boardOfDirectors[index].id, file);
            } catch (error) {
                console.error('Upload Board of Directors Image Error:', error);
                uploadError = {
                    object: object, 
                    message: `Upload Board of Directors Image Failed: ${error.message}`
                };
            } finally {
                isUploading[object][index] = false;
            }
        } else if (object === 'advisors') {
            try {
                await aboutHandlers.updateAbout({
                    advisoryBoard: $aboutStore.advisoryBoard,
                    lastUpdated: new Date().toISOString()
                });
                await aboutHandlers.uploadAdvisoryBoardImage($aboutStore.advisoryBoard[index].id, file);
            } catch (error) {
                console.error('Upload Advisory Board Image Error:', error); 
                uploadError = {
                    object: object, 
                    message: `Upload Advisory Board Image Failed: ${error.message}`
                };
            } finally {
                isUploading[object][index] = false;
            } 
        } else if (object === 'history') {
            try {
                await aboutHandlers.uploadHistoryImage(file);
            } catch (error) {
                console.error('Upload History Image Error:', error);
                uploadError = {
                    object: object, 
                    message: `Upload History Image Failed: ${error.message}`
                };
            } finally {
                isUploading[object] = false;
            }
        }
    }

	async function loadAboutUs() {
		// Set a timeout to force loading to end after 15 seconds
		loadingTimeout = setTimeout(() => {
			if ($aboutLoading) {
				console.log('About Us loading timed out');
				aboutLoading.set(false);
				loadingError = 'Loading timed out. Please try again.';
			}
		}, 15000);

		try {
			console.log('Loading About Us');
			await aboutHandlers.getAboutUs();
			console.log('About Us loaded successfully:', $aboutStore);
		} catch (error) {
			console.error('Error loading about us:', error);
			loadingError = `Failed to load about us: ${error.message}`;
			aboutLoading.set(false); // Force loading to end on error
		}
	}

	onMount(async () => {
		await loadAboutUs();
	});

	onDestroy(() => {
		// Clear the timeout if component is destroyed
		if (loadingTimeout) {
			clearTimeout(loadingTimeout);
		}
	});
</script>

<svelte:head>
	<title>About Us - VietSpark</title>
	<meta
		name="description"
		content="Manage VietSpark's About Us Page"
	/>
</svelte:head>

{#if $aboutLoading}
	<div class="flex min-h-screen items-center justify-center">
		<div class="text-center">
			<div
				class="border-primary inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2"
			></div>
			<p class="mt-4 text-gray-600">Loading About Us...</p>
			{#if loadingError}
				<p class="mt-2 text-red-500">{loadingError}</p>
				<button
					class="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
					on:click={() => window.location.reload()}
				>
					Retry
				</button>
			{/if}
		</div>
	</div>
{:else if isDataReady}
	<div class="flex flex-col items-center justify-center bg-primary text-white p-4">
		<h1 class="text-2xl font-bold">About Us</h1>
		<p>Manage VietSpark's About Us Page</p>
	</div>

	<!-- About Us Content -->
	<section class="min-h-[50vh] bg-gray-50 py-12">
		<div class="container mx-auto px-4">
				<div class="rounded-lg bg-white p-6 shadow-md">
					<form
						class="space-y-6"
						on:submit|preventDefault={async () => {
                            try {
                                isSaving = true;
                                await aboutHandlers.updateAbout({
                                    history: $aboutStore.history,
                                    historyImage: $aboutStore.historyImage,
                                    mission: $aboutStore.mission,
                                    vision: $aboutStore.vision,
                                    coreValues: $aboutStore.coreValues,
                                    whatWeDo: $aboutStore.whatWeDo,
                                    volunteers: $aboutStore.volunteers,
                                    boardOfDirectors: $aboutStore.boardOfDirectors,
                                    advisoryBoard: $aboutStore.advisoryBoard,
                                    lastUpdated: new Date().toISOString()
                                });
                                alert('About Us updated successfully!');
                                uploadError = null;
                            } catch (error) {
                                console.error('Error updating about us:', error);
                                alert(`Error updating about us: ${error.message}`);
                            } finally {
                                isSaving = false;
                            }
						}}
					>
						<div>
							<label for="history" class="mb-2 block text-gray-700 font-bold">History</label>
							<MarkdownEditor
                                bind:value={$aboutStore.history}
                                id="history"
                                placeholder=""
                                onInput={(newValue) => $aboutStore.history = newValue}
                            />
						</div>

                        <div>
							<label for="historyImage" class="mb-2 block text-gray-700 font-bold">History Image</label>
                            {#if uploadError && uploadError.object === 'history'}
								<div class="mb-4 rounded-md bg-red-50 p-4 text-red-700">
									{uploadError.message}
								</div>
							{/if}
                            <input
                                type="file"
                                id="historyImage"
                                accept="image/*"
                                style="display: none;"
                                bind:this={fileInputs["history"][0]}
                                on:change={(e) => handleFileChange(e, "history", 0)}
                            />
                            <div
                                class="text-primary relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden bg-blue-200 text-4xl font-bold"
                                on:click={() => handleAvatarClick("history", 0)}
                                on:keydown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Space') {
                                        e.preventDefault();
                                        handleAvatarClick("history", 0);
                                    }
                                }}
                                role="button"
                                tabindex="0"
                                aria-label="Upload history picture"
                            >
                                {#if isUploading["history"][0]}
                                    <div
                                        class="absolute inset-0 flex items-center justify-center bg-blue-200 bg-opacity-80"
                                    >
                                        <div
                                            class="h-24 w-24 animate-spin rounded-full border-2 border-white border-t-transparent"
                                        ></div>
                                    </div>
                                {:else if localImagePreviews["history"][0]}
                                    <img
                                        src={localImagePreviews["history"][0]}
                                        alt="Profile Preview"
                                        class="absolute inset-0 h-full w-full object-cover"
                                    />
                                {:else if $aboutStore.historyImage}
                                    <img
                                        src={$aboutStore.historyImage}
                                        alt="Profile"
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

						<div>
							<label for="mission" class="mb-2 block font-bold text-gray-700">Mission</label>
							<textarea
								id="mission"
                                rows="2"
                                bind:value={$aboutStore.mission}
								class="focus:ring-primary w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2"
							></textarea>
						</div>

						<div>
							<label for="vision" class="mb-2 block font-bold text-gray-700">Vision</label>
							<textarea
								id="vision"
                                rows="2"
                                bind:value={$aboutStore.vision}
								class="focus:ring-primary w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2"
							></textarea>
						</div>

						<div>
							<label for="coreValues" class="mb-2 block font-bold text-gray-700">Core Values</label>
							{#each $aboutStore.coreValues as coreValue, index}
                                <div class="mb-4 flex gap-4 items-center rounded-lg bg-blue-100 p-4 shadow-md">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        class="w-1/4 rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        bind:value={coreValue.name}
                                    />
                                    <input
                                        placeholder="Icon Name"
                                        class="w-1/4 rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        rows="2"
                                        bind:value={coreValue.iconName}
                                    />
                                    <i class="fas {coreValue.iconName} text-2xl"></i>
                                    <input
                                        placeholder="Description"
                                        class="w-3/4 rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        rows="2"
                                        bind:value={coreValue.description}
                                    />
                                    
                                    <button
                                        type="button"
                                        class="ml-2 text-red-500"
                                        on:click={() => {
                                            const newCoreValues = [...$aboutStore.coreValues];
                                            newCoreValues.splice(index, 1);
                                            aboutStore.update((data) => ({
                                                ...data,
                                                coreValues: newCoreValues
                                            }));
                                        }}
                                        aria-label="Remove core value"
                                    >
                                        &times;
                                    </button>
                                </div>
                            {/each}
                            <button
                                type="button"
                                class="hover:text-primary hover:border-primary rounded-full border border-dashed border-gray-300 px-3 py-1 text-gray-500"
                                on:click={() => $aboutStore.coreValues = [...$aboutStore.coreValues, { name: '', description: '', iconName: '' }]}
                            >
                                Add Core Value
                            </button>
						</div>

						<div>
							<label for="whatWeDo" class="mb-2 block font-bold text-gray-700">What We Do</label>
                            <textarea
								id="whatWeDo"
								rows="2"
                                placeholder="Summary"
                                bind:value={$aboutStore.whatWeDo.summary}
								class="focus:ring-primary w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2"
							></textarea>
                            <div class="m-4 flex-col gap-4 items-center">
                                {#each $aboutStore.whatWeDo.pillars as value, index}
                                    <div class="relative flex flex-col gap-4 rounded-lg bg-blue-100 p-8 shadow-md mb-8">
                                        <button
                                            type="button"
                                            class="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                            on:click={() => {
                                                const newPillars = [...$aboutStore.whatWeDo.pillars];
                                                newPillars.splice(index, 1);
                                                aboutStore.update((data) => ({
                                                    ...data,
                                                    whatWeDo: {
                                                        ...data.whatWeDo,
                                                        pillars: newPillars
                                                    }
                                                }));
                                            }}
                                            aria-label="Remove pillar"
                                        >
                                            &times;
                                        </button>
                                        <input
                                            type="text"
                                            placeholder="Title"
                                            class="w-1/3 rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                            bind:value={value.title}
                                        />
                                        <div class="flex items-center gap-2">
                                            <input
                                            type="text"
                                            placeholder="Icon Name"
                                            class="w-1/3 rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                            bind:value={value.iconName}
                                            />
                                            <i class="fas {value.iconName} text-2xl"></i>
                                        </div>
                                        
                                        <input
                                            placeholder="Description"
                                            class="rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                            rows="2"
                                            bind:value={value.description}
                                        />
                                        <ul class="list-inside list-disc space-y-2">
                                            {#each value.list as item, itemIndex}
                                                <li>
                                                    <input
                                                        type="text"
                                                        placeholder="Bullet Point"
                                                        class="rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary w-3/4"
                                                        bind:value={item}
                                                    />
                                                    <button
                                                        type="button"
                                                        class="ml-2 text-red-500"
                                                        on:click={() => {
                                                            const newBulletPoints = [...value.list];
                                                            newBulletPoints.splice(itemIndex, 1);
                                                            const newPillars = [...$aboutStore.whatWeDo.pillars];
                                                            newPillars[index].list = newBulletPoints;
                                                            aboutStore.update((data) => ({
                                                                ...data,
                                                                whatWeDo: {
                                                                    ...data.whatWeDo,
                                                                    pillars: newPillars
                                                                }
                                                            }));
                                                        }}
                                                        aria-label="Remove bullet point"
                                                    >
                                                        &times;
                                                    </button>
                                                </li>
                                            {/each}
                                                <button
                                                type="button"
                                                class="hover:text-primary hover:border-primary rounded-full border border-dashed border-gray-300 px-3 py-1 text-gray-500"
                                                on:click={() => {
                                                    if (!value.list) {
                                                        value.list = [];
                                                    }
                                                    const newBulletPoints = [...value.list];
                                                    newBulletPoints.push('');
                                                    const newPillars = [...$aboutStore.whatWeDo.pillars];
                                                    newPillars[index].list = newBulletPoints;
                                                    aboutStore.update((data) => ({
                                                        ...data,
                                                        whatWeDo: {
                                                            ...data.whatWeDo,
                                                            pillars: newPillars
                                                        }
                                                    }));
                                                }}
                                            >
                                                +
                                            </button>
                                        </ul>
                                       
                                    </div>
                                {/each}
                                <button
                                    type="button"
                                    class="hover:text-primary hover:border-primary rounded-full border border-dashed border-gray-300 px-3 py-1 text-gray-500"
                                    on:click={() => $aboutStore.whatWeDo.pillars = [...$aboutStore.whatWeDo.pillars, { title: '', description: '' }]}
                                >
                                    Add Item
                                </button>
                            </div>
                            
						</div>

						<div>
							<label for="boardOfDirectors" class="mb-2 block font-bold text-gray-700">Board of Directors</label>
							{#each $aboutStore.boardOfDirectors as director, index}
                                <div class="mb-4 flex gap-4 items-center rounded-lg bg-blue-100 p-4 shadow-md">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        class="w-1/5 rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        bind:value={director.name}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        class="w-1/5 rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        bind:value={director.title}
                                    />
                                    <input
                                        type="text"
                                        placeholder="LinkedIn"
                                        class="w-1/5 rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        bind:value={director.linkedIn}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Quote"
                                        class="w-1/5 rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        bind:value={director.quote}
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style="display: none;"
                                        bind:this={fileInputs["directors"][index]}
                                        on:change={(e) => handleFileChange(e, "directors", index)}
                                    />
                                    <div
                                        class="text-primary relative flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-blue-200 text-4xl font-bold"
                                        on:click={() => handleAvatarClick("directors", index)}
                                        on:keydown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Space') {
                                                e.preventDefault();
                                                handleAvatarClick("directors", index);
                                            }
                                        }}
                                        role="button"
                                        tabindex="0"
                                        aria-label="Upload profile picture"
                                    >
                                        {#if isUploading["directors"][index]}
                                            <div
                                                class="absolute inset-0 flex items-center justify-center bg-blue-200 bg-opacity-80"
                                            >
                                                <div
                                                    class="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent"
                                                ></div>
                                            </div>
                                        {:else if localImagePreviews["directors"][index]}
                                            <img
                                                src={localImagePreviews["directors"][index]}
                                                alt="Profile Preview"
                                                class="absolute inset-0 h-full w-full object-cover"
                                            />
                                        {:else if $aboutStore.boardOfDirectors[index].profileImage}
                                            <img
                                                src={$aboutStore.boardOfDirectors[index].profileImage}
                                                alt="Profile"
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
                                    <button
                                        type="button"
                                        class="ml-2 text-red-500"
                                        on:click={() => {
                                            const newBoardOfDirectors = [...$aboutStore.boardOfDirectors];
                                            newBoardOfDirectors.splice(index, 1);
                                            aboutStore.update((data) => ({
                                                ...data,
                                                boardOfDirectors: newBoardOfDirectors
                                            }));
                                        }}
                                        aria-label="Remove a board of director"
                                    >
                                        &times;
                                    </button>
                                </div>
                            {/each}
                            {#if uploadError && uploadError.object === 'directors'}
                                <div class="mb-4 rounded-md bg-red-50 p-4 text-red-700">
                                    {uploadError.message}
                                </div>
                            {/if}
                            <button
                                type="button"
                                class="hover:text-primary hover:border-primary rounded-full border border-dashed border-gray-300 px-3 py-1 text-gray-500"
                                on:click={() => $aboutStore.boardOfDirectors = [...$aboutStore.boardOfDirectors, { 
                                    id: generateUniqueId(),
                                    name: '', 
                                    title: '', 
                                    linkedIn: '', 
                                    quote: '', 
                                    profileImage: '' 
                                }]}
                            >
                                Add Board of Director
                            </button>
						</div>

                        <div>
							<label for="advisoryBoard" class="mb-2 block font-bold text-gray-700">Advisory Board</label>
							{#each $aboutStore.advisoryBoard as advisor, index}
                                <div class="mb-4 flex gap-4 items-center rounded-lg bg-blue-100 p-4 shadow-md">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        class="w-1/5 rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        bind:value={advisor.name}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        class="w-1/5 rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        bind:value={advisor.title}
                                    />
                                    <input
                                        type="text"
                                        placeholder="LinkedIn"
                                        class="w-1/5 rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        bind:value={advisor.linkedIn}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Quote"
                                        class="w-1/5 rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        bind:value={advisor.quote}
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style="display: none;"
                                        bind:this={fileInputs["advisors"][index]}
                                        on:change={(e) => handleFileChange(e, "advisors", index)}
                                    />
                                    <div
                                        class="text-primary relative flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-blue-200 text-4xl font-bold"
                                        on:click={() => handleAvatarClick("advisors", index)}
                                        on:keydown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Space') {
                                                e.preventDefault();
                                                handleAvatarClick("advisors", index);
                                            }
                                        }}
                                        role="button"
                                        tabindex="0"
                                        aria-label="Upload profile picture"
                                    >
                                        {#if isUploading["advisors"][index]}
                                            <div
                                                class="absolute inset-0 flex items-center justify-center bg-blue-200 bg-opacity-80"
                                            >
                                                <div
                                                    class="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent"
                                                ></div>
                                            </div>
                                        {:else if localImagePreviews["advisors"][index]}
                                            <img
                                                src={localImagePreviews["advisors"][index]}
                                                alt="Profile Preview"
                                                class="absolute inset-0 h-full w-full object-cover"
                                            />
                                        {:else if $aboutStore.advisoryBoard[index].profileImage}
                                            <img
                                                src={$aboutStore.advisoryBoard[index].profileImage}
                                                alt="Profile"
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
                                    <button
                                        type="button"
                                        class="ml-2 text-red-500"
                                        on:click={() => {
                                            const newAdvisoryBoard = [...$aboutStore.advisoryBoard];
                                            newAdvisoryBoard.splice(index, 1);
                                            aboutStore.update((data) => ({
                                                ...data,
                                                advisoryBoard: newAdvisoryBoard
                                            }));
                                        }}
                                        aria-label="Remove an advisor board member"
                                    >
                                        &times;
                                    </button>
                                </div>
                            {/each}
                            {#if uploadError && uploadError.object === 'advisors'}
								<div class="mb-4 rounded-md bg-red-50 p-4 text-red-700">
									{uploadError.message}
								</div>
							{/if}
                            <button
                                type="button"
                                class="hover:text-primary hover:border-primary rounded-full border border-dashed border-gray-300 px-3 py-1 text-gray-500"
                                on:click={() => $aboutStore.advisoryBoard = [...$aboutStore.advisoryBoard, { 
                                    id: generateUniqueId(),
                                    name: '', 
                                    title: '', 
                                    linkedIn: '', 
                                    quote: '', 
                                    profileImage: '' 
                                }]}
                            >
                                Add Advisory Board Member
                            </button>
						</div>

                        <div>
							<label for="volunteers" class="mb-2 block font-bold text-gray-700">Volunteers</label>
							{#each $aboutStore.volunteers as volunteer, index}
                                <div class="mb-4 flex gap-4 items-center rounded-lg bg-blue-100 p-4 shadow-md">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        class="w-1/5 rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        bind:value={volunteer.name}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        class="w-1/5 rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        bind:value={volunteer.title}
                                    />
                                    <input
                                        type="text"
                                        placeholder="LinkedIn"
                                        class="w-1/5 rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        bind:value={volunteer.linkedIn}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Quote"
                                        class="w-1/5 rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                        bind:value={volunteer.quote}
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style="display: none;"
                                        bind:this={fileInputs["volunteers"][index]}
                                        on:change={(e) => handleFileChange(e, "volunteers", index)}
                                    />
                                    <div
                                        class="text-primary relative flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-blue-200 text-4xl font-bold"
                                        on:click={() => handleAvatarClick("volunteers", index)}
                                        on:keydown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Space') {
                                                e.preventDefault();
                                                handleAvatarClick("volunteers", index);
                                            }
                                        }}
                                        role="button"
                                        tabindex="0"
                                        aria-label="Upload profile picture"
                                    >
                                        {#if isUploading["volunteers"][index]}
                                            <div
                                                class="absolute inset-0 flex items-center justify-center bg-blue-200 bg-opacity-80"
                                            >
                                                <div
                                                    class="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent"
                                                ></div>
                                            </div>
                                        {:else if localImagePreviews["volunteers"][index]}
                                            <img
                                                src={localImagePreviews["volunteers"][index]}
                                                alt="Profile Preview"
                                                class="absolute inset-0 h-full w-full object-cover"
                                            />
                                        {:else if $aboutStore.volunteers[index].profileImage}
                                            <img
                                                src={$aboutStore.volunteers[index].profileImage}
                                                alt="Profile"
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
                                    <button
                                        type="button"
                                        class="ml-2 text-red-500"
                                        on:click={() => {
                                            const newVolunteers = [...$aboutStore.volunteers];
                                            newVolunteers.splice(index, 1);
                                            aboutStore.update((data) => ({
                                                ...data,
                                                volunteers: newVolunteers
                                            }));
                                        }}
                                        aria-label="Remove a volunteer"
                                    >
                                        &times;
                                    </button>
                                </div>
                            {/each}
                            {#if uploadError && uploadError.object === 'volunteers'}
                                <div class="mb-4 rounded-md bg-red-50 p-4 text-red-700">
                                    {uploadError.message}
                                </div>
                            {/if}
                            <button
                                type="button"
                                class="hover:text-primary hover:border-primary rounded-full border border-dashed border-gray-300 px-3 py-1 text-gray-500"
                                on:click={() => $aboutStore.volunteers = [...$aboutStore.volunteers, { 
                                    id: generateUniqueId(),
                                    name: '', 
                                    title: '', 
                                    linkedIn: '', 
                                    quote: '', 
                                    profileImage: '' 
                                }]}
                            >
                                Add Volunteer
                            </button>
						</div>

	
						<div class="flex justify-end pt-4">
							<button 
								type="submit" 
                                class="btn bg-primary hover:bg-primary-dark text-white"								
                                disabled={isSaving}
							>
								{#if isSaving}
									<div class="flex items-center gap-2">
										<div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
										Saving...
									</div>
								{:else}
									Save Changes
								{/if}
							</button>
						</div>
					</form>
				</div>
		</div>
	</section>
{:else}
	<div class="flex min-h-screen items-center justify-center">
		<div class="p-8 text-center">
			<div class="mb-6 text-6xl text-gray-300">
				<i class="fas fa-user-lock"></i>
			</div>
			<h2 class="mb-4 text-2xl font-bold">Please Log In</h2>
			<p class="mb-6 text-gray-600">You need to be logged in and an admin to view the admin page for About Us.</p>
			<a href="/login" class="btn bg-primary hover:bg-primary-dark text-white">Log In</a>
		</div>
	</div>
{/if}

<style>
	.btn {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		font-weight: 500;
		border-radius: 0.375rem;
		transition: all 0.2s;
	}
</style>
