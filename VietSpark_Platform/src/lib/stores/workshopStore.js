import { writable } from 'svelte/store';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, getDoc } from 'firebase/firestore';
import { db, storage } from '$lib/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Create a writable store for workshop
export const workshops = writable([]);

// Create a writable store for loading state
export const workshopLoading = writable(false);

// Create a writable store for error state
export const workshopError = writable(null);

export const workshopHandlers = {
    // Function to fetch all workshops
    getWorkshops: async (orderByColumn = "startTime") => {
        workshopLoading.set(true);
        try {
            const workshopRef = collection(db, 'workshops');
            const q = query(workshopRef, orderBy(orderByColumn, 'desc'));
            const querySnapshot = await getDocs(q);
            const workshopsList = querySnapshot.docs.map(doc => ({
                ...doc.data(), 
                id: doc.id,
            }));
            workshops.set(workshopsList);
            console.log("Workshops found in Firestore: ", workshopsList);
            workshopError.set(null);
        } catch (error) {
            console.error('Error fetching workshops:', error);
            workshopError.set(error.message);
        } finally {
            workshopLoading.set(false);
        }
    },

    // Function to get a workshop by ID
    getWorkshop: async (workshopId) => {
        try {
            const workshopRef = doc(db, "workshops", workshopId); 
            const workshopDoc = await getDoc(workshopRef); 
            if (workshopDoc.exists()) {
                return {
                    ...workshopDoc.data(), 
                    id: workshopDoc.id,
                    
                }
            } else {
                console.warn(`Workshop with ID ${workshopId} does not exist.`); 
            }
        } catch (error) {
            console.error(`Error fetching workshop:`, error);
        }
    },

    // Function to create a new workshop
    createWorkshop: async (workshopData) => {
        try {
            const workshopRef = collection(db, 'workshops');
            const docRef = await addDoc(workshopRef, {
                ...workshopData,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await workshopHandlers.getWorkshops(); // Refresh the workshop list
            return docRef.id;
        } catch (error) {
            console.error('Error creating workshop:', error);
            workshopError.set(error.message);
            throw error;
        }
    }, 

    // Function to update a workshop
    updateWorkshop: async (workshopId, workshopData) => {
        try {
            const workshopRef = doc(db, 'workshops', workshopId);
            await updateDoc(workshopRef, {
                ...workshopData,
                updatedAt: new Date(),
            });
            await workshopHandlers.getWorkshops(); // Refresh the workshop list
        } catch (error) {
            console.error('Error updating workshop:', error);
            workshopError.set(error.message);
            throw error;
        }
    },

    // Function to delete a workshop
    deleteWorkshop:  async (workshopId) => {
        try {
            const workshopRef = doc(db, 'workshops', workshopId);
            await deleteDoc(workshopRef);
            await workshopHandlers.getWorkshops(); // Refresh the workshop list
        } catch (error) {
            console.error('Error deleting workshop:', error);
            workshopError.set(error.message);
            throw error;
        }
    }, 

    // Upload cover image
    uploadCoverImage: async (file, workshopId) => {
        const fileRef = ref(storage, `/workshops/${workshopId}/cover_${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    },

    // Upload workshops images
    uploadWorkshopsImages: async (files, workshopId) => {
        const uploadPromises = files.map(async (file) => {
            const fileRef = ref(storage, `/workshops/${workshopId}/${Date.now()}_${file.name}`);
            await uploadBytes(fileRef, file);
            return await getDownloadURL(fileRef);
        });
        return await Promise.all(uploadPromises);
    },
}

