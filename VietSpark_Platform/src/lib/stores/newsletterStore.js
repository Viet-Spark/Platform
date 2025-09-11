import { writable } from 'svelte/store';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, getDoc } from 'firebase/firestore';
import { db, storage } from '$lib/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Create a writable store for newsletter
export const newsletters = writable([]);

// Create a writable store for loading state
export const newsletterLoading = writable(false);

// Create a writable store for error state
export const newsletterError = writable(null);

export const newsletterHandlers = {
    // Function to fetch all newsletters
    getNewsletters: async () => {
        newsletterLoading.set(true);
        try {
            const newsletterRef = collection(db, 'newsletters');
            const q = query(newsletterRef, orderBy('createdAt'));
            const querySnapshot = await getDocs(q);
            const newslettersList = querySnapshot.docs.map(doc => ({
                ...doc.data(), 
                id: doc.id
            }));
            newsletters.set(newslettersList);
            console.log("Newsletters found in Firestore: ", newslettersList);
            newsletterError.set(null);
        } catch (error) {
            console.error('Error fetching newsletters:', error);
            newsletterError.set(error.message);
        } finally {
            newsletterLoading.set(false);
        }
    },

    // Function to get a newsletter by ID
    getNewsletter: async (newsletterId) => {
        try {
            const newsletterRef = doc(db, "newsletters", newsletterId); 
            const newsletterDoc = await getDoc(newsletterRef); 
            if (newsletterDoc.exists()) {
                return {
                    ...newsletterDoc.data(), 
                    id: newsletterDoc.id,
                    
                }
            } else {
                console.warn(`Newsletter with ID ${newsletterId} does not exist.`); 
            }
        } catch (error) {
            console.error(`Error fetching newsletter:`, error);
        }
    },

    // Function to create a new newsletter
    createNewsletter: async (newsletterData) => {
        try {
            const newsletterRef = collection(db, 'newsletters');
            const docRef = await addDoc(newsletterRef, {
                ...newsletterData,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            await newsletterHandlers.getNewsletters(); // Refresh the newsletter list
            return docRef.id;
        } catch (error) {
            console.error('Error creating newsletter:', error);
            newsletterError.set(error.message);
            throw error;
        }
    }, 

    // Function to update a newsletter
    updateNewsletter: async (newsletterId, newsletterData) => {
        try {
            const newsletterRef = doc(db, 'newsletters', newsletterId);
            await updateDoc(newsletterRef, {
                ...newsletterData,
                updatedAt: new Date()
            });
            await newsletterHandlers.getNewsletters(); // Refresh the newsletter list
        } catch (error) {
            console.error('Error updating newsletter:', error);
            newsletterError.set(error.message);
            throw error;
        }
    },

    // Function to delete a newsletter
    deleteNewsletter:  async (newsletterId) => {
        try {
            const newsletterRef = doc(db, 'newsletters', newsletterId);
            await deleteDoc(newsletterRef);
            await newsletterHandlers.getNewsletters(); // Refresh the newsletter list
        } catch (error) {
            console.error('Error deleting newsletter:', error);
            newsletterError.set(error.message);
            throw error;
        }
    }, 
}

