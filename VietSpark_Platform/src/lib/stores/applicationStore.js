import { writable } from 'svelte/store';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, getDoc } from 'firebase/firestore';
import { db, storage } from '$lib/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Create a writable store for application
export const applications = writable([]);

// Create a writable store for loading state
export const applicationLoading = writable(false);

// Create a writable store for error state
export const applicationError = writable(null);

export const applicationHandlers = {
    // Function to fetch all applications
    getApplications: async (orderByColumn = "createdAt") => {
        applicationLoading.set(true);
        try {
            const applicationRef = collection(db, 'applications');
            const q = query(applicationRef, orderBy(orderByColumn));
            const querySnapshot = await getDocs(q);
            const applicationsList = querySnapshot.docs.map(doc => ({
                ...doc.data(), 
                id: doc.id
            }));
            applications.set(applicationsList);
            console.log("Applications found in Firestore: ", applicationsList);
            applicationError.set(null);
        } catch (error) {
            console.error('Error fetching applications:', error);
            applicationError.set(error.message);
        } finally {
            applicationLoading.set(false);
        }
    },

    // Function to get a application by ID
    getApplication: async (applicationId) => {
        try {
            const applicationRef = doc(db, "applications", applicationId); 
            const applicationDoc = await getDoc(applicationRef); 
            if (applicationDoc.exists()) {
                return {
                    ...applicationDoc.data(), 
                    id: applicationDoc.id,
                }
            } else {
                console.warn(`Application with ID ${applicationId} does not exist.`); 
            }
        } catch (error) {
            console.error(`Error fetching application:`, error);
        }
    },

    // Function to create a new application
    createApplication: async (applicationData) => {
        try {
            const applicationRef = collection(db, 'applications');
            const docRef = await addDoc(applicationRef, {
                ...applicationData,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            await applicationHandlers.getApplications(); // Refresh the application list
            return docRef.id;
        } catch (error) {
            console.error('Error creating application:', error);
            applicationError.set(error.message);
            throw error;
        }
    }, 

    // Function to update a application
    updateApplication: async (applicationId, applicationData) => {
        try {
            const applicationRef = doc(db, 'applications', applicationId);
            const applicationDoc = await getDoc(applicationRef); 
            await updateDoc(applicationRef, {
                ...applicationDoc.data(),
                ...applicationData,
                updatedAt: new Date()
            });
            await applicationHandlers.getApplications(); // Refresh the application list
        } catch (error) {
            console.error('Error updating application:', error);
            applicationError.set(error.message);
            throw error;
        }
    },

    // Function to delete a application
    deleteApplication:  async (applicationId) => {
        try {
            const applicationRef = doc(db, 'applications', applicationId);
            await deleteDoc(applicationRef);
            await applicationHandlers.getApplications(); // Refresh the application list
        } catch (error) {
            console.error('Error deleting application:', error);
            applicationError.set(error.message);
            throw error;
        }
    }, 

    // Upload resume to application
    uploadResume: async (file, applicationId) => {
        const fileRef = ref(storage, `applications/${applicationId}/resume/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    }, 

}

