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

// Dev store state
export const devStore = writable({
    isLoading: true,
    devs: [],
    currentDev: null
});


// Handlers for dev-related operations
export const devHandlers = {
    // Fetch all devs
    getDevNameFromId: async (devId) => {
        try {
            const devRef = doc(db, 'devs', devId);
            const devDoc = await getDoc(devRef);
            if (devDoc.exists()) {
                return devDoc.data().name || 'Unknown Dev';
            } else {
                console.warn(`Dev with ID ${devId} does not exist.`);
                return 'Unknown Dev';
            }
        } catch (error) {
            console.error('Error fetching dev name:', error);
            return 'Unknown Dev';
        }
    },



    getDevs: async () => {
        try {
            const devsRef = collection(db, 'devs');
            const snapshot = await getDocs(devsRef);
            const devs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            devStore.set({ isLoading: false, devs });
        } catch (error) {
            console.error('Error fetching devs:', error);
        }
    },

    // Fetch a single dev by ID
    getDev: async (devId) => {
        try {
            const devRef = doc(db, 'devs', devId);
            const devDoc = await getDoc(devRef);
            if (devDoc.exists()) {
                devStore.update(state => ({
                    ...state,
                    isLoading: false,
                    currentDev: { id: devDoc.id, ...devDoc.data() }
                }));
            } else {
                console.warn(`Dev with ID ${devId} does not exist.`);
                devStore.update(state => ({
                    ...state,
                    isLoading: false,
                    currentDev: null
                }));
            }
        } catch (error) {
            console.error('Error fetching dev:', error);
        }
    },

    // Add a new dev
    createDev: async (devData) => {
        try {
            const devsRef = collection(db, 'devs');
            const newDevRef = await addDoc(devsRef, {
                ...devData,
            });
            devStore.update(state => ({
                ...state,
                devs: [...state.devs, { id: newDevRef.id, ...devData }],
                isLoading: false
            }));


            return newDevRef.id;
        } catch (error) {
            console.error('Error creating dev:', error);
            throw error;
        }
    },

    // Upload dev images and update the dev with URLs
    uploadImages: async (devId, imageFiles) => {
        try {
            const storage = getStorage();
            const imageUrls = await Promise.all(
                imageFiles.map(async (file) => {
                    const storageRef = ref(storage, `dev_images/${devId}/${file.name}`);
                    await uploadBytes(storageRef, file);
                    return getDownloadURL(storageRef);
                })
            );

            const devRef = doc(db, 'devs', devId);
            await updateDoc(devRef, { imageUrls });
            return imageUrls;
        } catch (error) {
            console.error('Error uploading images:', error);
            throw error;
        }
    },

    // Update an existing dev
    updateDev: async (devId, devData) => {
        try {
            const devRef = doc(db, 'devs', devId);
            await updateDoc(devRef, devData);

            devStore.update(state => {
                const updatedDevs = state.devs.map(dev =>
                    dev.id === devId ? { ...dev, ...devData } : dev
                );
                return { ...state, devs: updatedDevs, isLoading: false };
            })

            return devId;
        } catch (error) {
            console.error('Error updating dev:', error);
            throw error;
        }
    },

    // Delete a dev
    deleteDev: async (devId) => {
        const confirmation = window.confirm('Are you sure you want to delete this dev?');
        if (confirmation) {
            try {
                const devRef = doc(db, 'devs', devId);
                await deleteDoc(devRef);
                alert('Dev successfully deleted.');
            } catch (error) {
                console.error('Error deleting dev:', error);
            }
        }
    },

    // Fetch a dev image URL
    fetchImageUrl: async (devId) => {
        try {
            const storage = getStorage();
            const storageRef = ref(storage, `dev_images/${devId}`);
            return await getDownloadURL(storageRef);
        } catch (error) {
            console.error('Error fetching image URL:', error);
            throw error;
        }
    }
};
