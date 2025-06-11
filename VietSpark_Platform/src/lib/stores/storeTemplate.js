// @ts-nocheck
// template for stores file dealing with wathlist collection inside our firebase
import { writable } from 'svelte/store';
import { db } from '$lib/firebase/firebase';
import {
    addDoc,
    deleteDoc,
    updateDoc,
    getDoc,
    getDocs,
    collection,
    doc
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Watchlist store state
export const watchlistStore = writable({
    isLoading: true,
    watchlists: [],
    currentWatchlist: null
});


// Handlers for watchlist-related operations
export const watchlistHandlers = {
    // Fetch all watchlists
    getWatchlists: async () => {
        try {
            const watchlistsRef = collection(db, 'watchlists');
            const snapshot = await getDocs(watchlistsRef);
            const watchlists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            watchlistStore.set({ isLoading: false, watchlists });
        } catch (error) {
            console.error('Error fetching watchlists:', error);
        }
    },

    // Fetch a single watchlist by ID
    getWatchlist: async (watchlistId) => {
        try {
            const watchlistRef = doc(db, 'watchlists', watchlistId);
            const watchlistDoc = await getDoc(watchlistRef);
            if (watchlistDoc.exists()) {
                watchlistStore.update(state => ({
                    ...state,
                    isLoading: false,
                    currentWatchlist: { id: watchlistDoc.id, ...watchlistDoc.data() }
                }));
            } else {
                console.warn(`Watchlist with ID ${watchlistId} does not exist.`);
                watchlistStore.update(state => ({
                    ...state,
                    isLoading: false,
                    currentWatchlist: null
                }));
            }
        } catch (error) {
            console.error('Error fetching watchlist:', error);
        }
    },

    // Add a new watchlist
    createWatchlist: async (watchlistData) => {
        try {
            const watchlistsRef = collection(db, 'watchlists');
            const newWatchlistRef = await addDoc(watchlistsRef, {
                ...watchlistData,
                imageUrls: [] // Initialize with an empty imageUrls array
            });
            return newWatchlistRef.id;
        } catch (error) {
            console.error('Error creating watchlist:', error);
            throw error;
        }
    },

    // Upload watchlist images and update the watchlist with URLs
    uploadImages: async (watchlistId, imageFiles) => {
        try {
            const storage = getStorage();
            const imageUrls = await Promise.all(
                imageFiles.map(async (file) => {
                    const storageRef = ref(storage, `watchlist_images/${watchlistId}/${file.name}`);
                    await uploadBytes(storageRef, file);
                    return getDownloadURL(storageRef);
                })
            );

            const watchlistRef = doc(db, 'watchlists', watchlistId);
            await updateDoc(watchlistRef, { imageUrls });
            return imageUrls;
        } catch (error) {
            console.error('Error uploading images:', error);
            throw error;
        }
    },

    // Update an existing watchlist
    updateWatchlist: async (watchlistId, watchlistData) => {
        try {
            const watchlistRef = doc(db, 'watchlists', watchlistId);
            await updateDoc(watchlistRef, watchlistData);
            return watchlistId;
        } catch (error) {
            console.error('Error updating watchlist:', error);
            throw error;
        }
    },

    // Delete a watchlist
    deleteWatchlist: async (watchlistId) => {
        const confirmation = window.confirm('Are you sure you want to delete this watchlist?');
        if (confirmation) {
            try {
                const watchlistRef = doc(db, 'watchlists', watchlistId);
                await deleteDoc(watchlistRef);
                alert('Watchlist successfully deleted.');
            } catch (error) {
                console.error('Error deleting watchlist:', error);
            }
        }
    },

    // Fetch a watchlist image URL
    fetchImageUrl: async (watchlistId) => {
        try {
            const storage = getStorage();
            const storageRef = ref(storage, `watchlist_images/${watchlistId}`);
            return await getDownloadURL(storageRef);
        } catch (error) {
            console.error('Error fetching image URL:', error);
            throw error;
        }
    }
};
