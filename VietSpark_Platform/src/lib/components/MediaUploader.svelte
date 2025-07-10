<script>
    import { createEventDispatcher } from 'svelte';
    import { Upload, X, Image as ImageIcon, Video, Users } from 'lucide-svelte';

    export let speakerId = undefined;
    export let type = 'cover';
    export let multiple = false;
    export let maxFiles = 10;
    export let testimonialId = undefined;
    export let sponsorId = undefined;
    export let programItemId = undefined;

    const dispatch = createEventDispatcher();

    let fileInput;
    let dragActive = false;
    let error = null;
    let preview = [];

    $: iconComponent = {
        cover: ImageIcon,
        gallery: ImageIcon,
        speakers: Users,
        testimonialsImages: ImageIcon,
        testimonialsVideo: Video,
        videos: Video
    }[type];

    function handleDragEnter(e) {
        e.preventDefault();
        e.stopPropagation();
        dragActive = true;
    }

    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        dragActive = false;
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        dragActive = false;
        
        const files = [...e.dataTransfer.files];
        if (files.length > 0) {
            handleFiles(files);
        }
    }

    function handleFileSelect(e) {
        const files = [...e.target.files];
        if (files.length > 0) {
            handleFiles(files);
        }
    }

    async function handleFiles(files) {
        if (!multiple && files.length > 1) {
            error = 'Only one file can be uploaded';
            return;
        }

        if (files.length > maxFiles) {
            error = `Maximum ${maxFiles} files allowed`;
            return;
        }

        error = null;

        try {
            // Create preview
            preview = await Promise.all(
                files.map(file => new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve({
                        url: reader.result,
                        name: file.name,
                        type: file.type
                    });
                    reader.readAsDataURL(file);
                }))
            );

            // Dispatch files based on type
            if (type === 'speakers') {
                if (!speakerId) throw new Error('Speaker ID is required for speaker image uploads');
                dispatch('upload', { files, speakerId });
            } else if (type === 'sponsors') {
                if (!sponsorId) throw new Error('Sponsor ID is required for sponsor image uploads');
                dispatch('upload', { files, sponsorId });
            } else if (type === 'programImages') {
                if (!programItemId) throw new Error('Program item ID is required for program image uploads');
                dispatch('upload', { files, programItemId });
            } else if (type === 'testimonialsImages') {
                if (!testimonialId) throw new Error('Testimonial ID is required for testimonial image uploads');
                dispatch('upload', { files, testimonialId });
            } else if (type === 'testimonialsVideo') {
                if (!testimonialId) throw new Error('Testimonial ID is required for testimonial video uploads');
                dispatch('upload', { files, testimonialId });
            } else {
                dispatch('upload', { files });
            }
            
            preview = [];
            if (fileInput) fileInput.value = '';
        } catch (err) {
            error = err.message;
        }
    }

    function removePreview(index) {
        preview = preview.filter((_, i) => i !== index);
    }
</script>

<div
    role="button"
    tabindex="0"
    class="relative rounded-lg border-2 border-dashed border-gray-300 p-6 text-center {dragActive ? 'border-blue-500 bg-blue-50' : ''}"
    on:dragenter={handleDragEnter}
    on:dragleave={handleDragLeave}
    on:dragover|preventDefault
    on:drop={handleDrop}
>
    <input
        bind:this={fileInput}
        type="file"
        accept={(type === 'videos' || type === 'testimonialsVideo' )? 'video/*' : 'image/*'}
        class="hidden"
        {multiple}
        on:change={handleFileSelect}
    />

    <div class="space-y-4">
        <div class="flex justify-center">
            <svelte:component this={iconComponent} size={40} class="text-gray-400" />
        </div>

        <div class="space-y-1">
            <p class="text-sm text-gray-500">
                {#if type === 'cover'}
                    Drop your cover image here
                {:else if type === 'gallery'}
                    Drop your gallery images here
                {:else if type === 'sponsors'}
                    Drop your sponsor logo here
                {:else if type === 'programImages'}
                    Drop your program images here
                {:else if type === 'speakers'}
                    Drop speaker image here
                {:else if type === 'testimonialsImages'}
                    Drop testimonial images here
                {:else if type === 'testimonialsVideo'}
                    Drop testimonial video here
                {:else if type === 'programImages'}
                    Drop program images here
                {:else}
                    Drop your videos here
                {/if}
            </p>
            <p class="text-xs text-gray-400">
                {#if type === 'videos'}
                    MP4 or WebM, max 150MB {multiple ? `(up to ${maxFiles} files)` : ''}
                {:else if type === 'testimonialsImages'}
                    PNG, JPG or WebP, max 5MB {multiple ? `(up to ${maxFiles} files)` : ''}
                {:else if type === 'testimonialsVideo'}
                    MP4 or WebM, max 150MB {multiple ? `(up to ${maxFiles} files)` : ''}
                {:else}
                    PNG, JPG or WebP, max {type === 'speakers' ? '2' : '5'}MB {multiple ? `(up to ${maxFiles} files)` : ''}
                {/if}
            </p>
        </div>

        <button
            type="button"
            class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            on:click={() => fileInput.click()}
        >
            <Upload class="mr-2 h-4 w-4" />
            Select file{multiple ? 's' : ''}
        </button>
    </div>

    {#if error}
        <div class="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
        </div>
    {/if}

    {#if preview.length > 0}
        <div class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {#each preview as item, i}
                <div class="relative aspect-square overflow-hidden rounded-lg">
                    {#if item.type.startsWith('image/')}
                        <img src={item.url} alt={item.name} class="h-full w-full object-cover" />
                    {:else}
                        <video src={item.url} class="h-full w-full object-cover">
                            <track kind="captions" />
                        </video>
                    {/if}
                    <button
                        type="button"
                        class="absolute right-1 top-1 rounded-full bg-white/80 p-1 text-gray-600 hover:bg-white hover:text-gray-900"
                        on:click={() => removePreview(i)}
                    >
                        <X class="h-4 w-4" />
                    </button>
                </div>
            {/each}
        </div>
    {/if}
</div> 