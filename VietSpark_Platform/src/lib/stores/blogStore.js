import { writable } from 'svelte/store';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, getDoc } from 'firebase/firestore';
import { db, storage } from '$lib/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Create a writable store for blog posts
export const blogs = writable([]);

// Create a writable store for loading state
export const blogLoading = writable(false);

// Create a writable store for error state
export const blogError = writable(null);

export const blogHandlers = {
    // Function to fetch all blog post
    getBlogs: async (orderByColumn = "createdAt") => {
        blogLoading.set(true);
        try {
            const blogRef = collection(db, 'blogs');
            const q = query(blogRef, orderBy(orderByColumn, 'desc'));
            const querySnapshot = await getDocs(q);
            const postsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            blogs.set(postsList);
            console.log("Blogs found in Firestore: ", postsList);
            blogError.set(null);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            blogError.set(error.message);
        } finally {
            blogLoading.set(false);
        }
    },

    // Function to get a blog by ID
    getBlog: async (blogId) => {
        try {
            const blogRef = doc(db, "blogs", blogId); 
            const blogDoc = await getDoc(blogRef); 
            if (blogDoc.exists()) {
                return blogDoc.data(); 
            } else {
                console.warn(`Blog with ID ${blogId} does not exist.`); 
            }
        } catch (error) {
            console.error(`Error fetching blog:`, error);
        }
    },

    // Function to create a new blog post
    createBlog: async (postData) => {
        try {
            const blogRef = collection(db, 'blogs');
            const docRef = await addDoc(blogRef, {
                ...postData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            await blogHandlers.getBlogs(); // Refresh the blog posts list
            return docRef.id;
        } catch (error) {
            console.error('Error creating blog post:', error);
            blogError.set(error.message);
            throw error;
        }
    }, 

    // Function to update a blog post
    updateBlog: async (postId, postData) => {
        try {
            const postRef = doc(db, 'blogs', postId);
            await updateDoc(postRef, {
                ...postData,
                updatedAt: new Date().toISOString(),
            });
            await blogHandlers.getBlogs(); // Refresh the blog posts list
        } catch (error) {
            console.error('Error updating blog post:', error);
            blogError.set(error.message);
            throw error;
        }
    },

    // Function to delete a blog post
    deleteBlog:  async (postId) => {
        try {
            const postRef = doc(db, 'blogs', postId);
            await deleteDoc(postRef);
            await blogHandlers.getBlogs(); // Refresh the blog posts list
        } catch (error) {
            console.error('Error deleting blog post:', error);
            blogError.set(error.message);
            throw error;
        }
    }, 

    // Upload multiple images to blog
    uploadMultipleImages: async (files, postId) => {
        const uploadPromises = files.map(async (file) => {
            const fileRef = ref(storage, `blogs/${postId}/images/${Date.now()}_${file.name}`);
            await uploadBytes(fileRef, file);
            return await getDownloadURL(fileRef);
        });
    
        return await Promise.all(uploadPromises);
    }, 

    // Upload author image to blog
    uploadAuthorImage: async (file, postId) => {
        const fileRef = ref(storage, `blogs/${postId}/author_${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    }

}

