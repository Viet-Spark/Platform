<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { blogHandlers } from '$lib/stores/blogStore';
    import { marked } from 'marked';
    import DOMPurify from 'dompurify';


    let blog = null;
    let loading = true;
    let error = '';
    let blogId = $page.params.id;

    // Lightbox modal state for testimonial images
    let showImageModal = false;
    let modalImageUrl = '';

    onMount(async () => {
        loading = true;
        try {
            blog = await blogHandlers.getBlog(blogId);
            if (!blog) error = 'Blog not found.';
        } catch (e) {
            error = 'Failed to load blog.';
        } finally {
            loading = false;
        }
    });

    function parseMarkdown(content) {
        if (!content) return 'No description available';
        // First parse markdown to HTML
        const rawHtml = marked(content);
        // Then sanitize the HTML to prevent XSS
        return DOMPurify.sanitize(rawHtml);
    }
</script>

<div class="mx-auto bg-white">
    {#if loading}
        <div class="flex items-center justify-center h-40">
            <span>Loading...</span>
        </div>
    {:else if error}
        <div class="text-center text-red-600">{error}</div>
    {:else if blog}
        <article class="max-w-5xl mx-auto rounded-lg p-10">
            <h1 class="text-3xl font-bold m-2">{blog.title}</h1>
            <div class="flex items-center gap-4 mb-4 my-8">
                {#if blog.authorImage}
                    <img src={blog.authorImage} alt={blog.author} class="h-12 w-12 rounded-full object-cover border" />
                {/if}
                <div>
                    <div class="font-semibold">{blog.author}</div>
                    {#if blog.authorTitle}
                        <div class="text-sm text-gray-500">{blog.authorTitle}</div>
                    {/if}
                    <div class="text-xs text-gray-400">
                        {blog.publishedAt ? `Published: ${new Date(blog.publishedAt).toLocaleString()}` : `Created: ${new Date(blog.createdAt).toLocaleString()}`}
                        {blog.readTime ? `• ${blog.readTime} min read` : ``}
                    </div>
                </div>
            </div>
            {#if blog.description}
                <p class="mb-4 text-lg text-gray-700">{blog.description}</p>
            {/if}
            {#if blog.tags && blog.tags.length > 0}
                <div class="mb-4 flex flex-wrap gap-2">
                    {#each blog.tags as tag}
                        <span class="bg-gray-200 rounded-full px-3 py-1 text-xs">{tag}</span>
                    {/each}
                </div>
            {/if}
            {#if blog.images && blog.images.length > 0}
                <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {#each blog.images as img, index}
                        <button 
                            type="button"
                            on:click={() => {modalImageUrl = img; showImageModal = true;}}
                            class="focus:outline-none"
                        >
                            <img src={img} alt="Blog image_{index}" class="rounded-lg object-cover w-full h-80" />
                        </button>
                    {/each}
                </div>
            {/if}
            <div class="prose prose-lg max-w-none prose-a:text-blue-600 prose-a:hover:text-blue-800 flex flex-col justify-center text-justify">
                {@html parseMarkdown(blog.content)}
            </div>        
        </article>
    {/if}
    <!-- Place this modal markup near the root, after the opening <section> or main container -->
    {#if showImageModal}
        <div
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
            on:click={() => showImageModal = false}
            aria-label="Close image modal"
            tabindex="0"
            role="button"
            on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') showImageModal = false; }}
        >
            <div 
                class="relative" 
                on:click|stopPropagation 
                aria-label="Expanded testimonial image" 
                role="button" 
                tabindex="0"
                on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') showImageModal = false; }}
            >
                <img 
                    src={modalImageUrl} 
                    alt={`Testimonial image of ${modalImageUrl}`}
                    class="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg" 
                />
                <button
                    class="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-2 text-gray-800 hover:text-red-600"
                    on:click={() => showImageModal = false}
                    aria-label="Close"
                    on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') showImageModal = false; }}
                    tabindex="0"
                    type="button"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    {/if}
</div>
