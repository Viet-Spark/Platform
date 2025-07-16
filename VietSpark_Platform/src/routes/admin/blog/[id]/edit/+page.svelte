<script>
	import BlogForm from '$lib/components/BlogForm.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { blogs, blogHandlers, blogLoading, blogError } from '$lib/stores/blogStore';
	import { onMount } from 'svelte';

	let blog = null;
	let loading = false;
	let error = '';
	let isEditing = true;
	let blogId = $page.params.id;

	onMount(async () => {
		loading = true;
		blog = await blogHandlers.getBlog(blogId);
		loading = false;
	});

	async function handleEdit(event) {
		loading = true;
		error = '';
		const { detail } = event;
		try {
			// Upload author image
			let authorImageUrl = detail.authorImage;
			if (detail.authorImageFile) {
				authorImageUrl = await blogHandlers.uploadAuthorImage(detail.authorImageFile, blogId);
			}
			 // Upload gallery images
			 let imagesUrls = detail.images.filter(url => !url.startsWith('data:') && !url.startsWith('blob:')); // Keep existing URLs
			if (detail.tempImagesFiles?.length > 0) {
				const newUrls = await blogHandlers.uploadMultipleImages(detail.tempImagesFiles, blogId);
				imagesUrls = [...imagesUrls, ...newUrls];
			}
            console.log('Preparing data to submit...');
            const dataToSubmit = {
                ...detail, 
                images: imagesUrls, 
				authorImage: authorImageUrl
            }
            // Remove all temporary fields and blob URLs
            delete dataToSubmit.tempImagesFiles; 
			delete dataToSubmit.authorImageFile;
			
            console.log("Detail:", dataToSubmit);

            await blogHandlers.updateBlog(blogId, dataToSubmit)
            console.log('Blog saved successfully');
            goto('/admin/blog');
		} catch (e) {
            error = e.message || 'Failed to create blog post';
            console.error('Error saving blog:', error);
        } finally {
            loading = false;
        }
	};
</script>
{#if loading}
    <p>Loading...</p>
{:else if blog}
    <BlogForm {blog} {loading} {error} {isEditing} on:submit={handleEdit} />
{:else}
    <p>Blog not found.</p>
{/if}