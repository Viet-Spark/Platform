import { writable } from 'svelte/store';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';

// Create a writable store for blog posts
export const blogPosts = writable([]);

// Create a writable store for loading state
export const blogLoading = writable(false);

// Create a writable store for error state
export const blogError = writable(null);

// Function to fetch all blog post s
export const fetchBlogPosts = async () => {
    blogLoading.set(true);
    try {
        const blogRef = collection(db, 'blog');
        const q = query(blogRef, orderBy('publishedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const postsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        blogPosts.set(postsList);
        blogError.set(null);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        blogError.set(error.message);
    } finally {
        blogLoading.set(false);
    }
};

// Function to create a new blog post
export const createBlogPost = async (postData) => {
    try {
        const blogRef = collection(db, 'blog');
        const docRef = await addDoc(blogRef, {
            ...postData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: postData.published ? new Date().toISOString() : null
        });
        await fetchBlogPosts(); // Refresh the blog posts list
        return docRef.id;
    } catch (error) {
        console.error('Error creating blog post:', error);
        blogError.set(error.message);
        throw error;
    }
};

// Function to update a blog post
export const updateBlogPost = async (postId, postData) => {
    try {
        const postRef = doc(db, 'blog', postId);
        await updateDoc(postRef, {
            ...postData,
            updatedAt: new Date().toISOString(),
            publishedAt: postData.published ? postData.publishedAt || new Date().toISOString() : null
        });
        await fetchBlogPosts(); // Refresh the blog posts list
    } catch (error) {
        console.error('Error updating blog post:', error);
        blogError.set(error.message);
        throw error;
    }
};

// Function to delete a blog post
export const deleteBlogPost = async (postId) => {
    try {
        const postRef = doc(db, 'blog', postId);
        await deleteDoc(postRef);
        await fetchBlogPosts(); // Refresh the blog posts list
    } catch (error) {
        console.error('Error deleting blog post:', error);
        blogError.set(error.message);
        throw error;
    }
};
