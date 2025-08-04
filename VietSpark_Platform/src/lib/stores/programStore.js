import { writable } from 'svelte/store';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, getDoc } from 'firebase/firestore';
import { db, storage } from '$lib/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Create a writable store for program programs
export const programs = writable([]);

// Create a writable store for loading state
export const programLoading = writable(false);

// Create a writable store for error state
export const programError = writable(null);

export const curProgram = writable({
    title: '',
    description: '',
    year: new Date().getFullYear(),
    startDate: '',
    endDate: '',
    presentationDate: '',
    teamIds: [],
    workshops: [],
    testimonialIds: [],
    projectIds: [],
    coverUrl: '',
    coverTempFile: null,
    imageUrls: [],
    imageTempFiles: []
}); 

export const programHandlers = {
    // Function to fetch all program program
    getPrograms: async () => {
        programLoading.set(true);
        try {
            const programRef = collection(db, 'programs');
            const q = query(programRef, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const programsList = querySnapshot.docs.map(doc => ({
                ...doc.data(), 
                id: doc.id,
            }));
            programs.set(programsList);
            console.log("Programs found in Firestore: ", programsList);
            programError.set(null);
        } catch (error) {
            console.error('Error fetching programs:', error);
            programError.set(error.message);
        } finally {
            programLoading.set(false);
        }
    },

    // Function to get a program by ID
    getProgram: async (programId) => {
        try {
            const programRef = doc(db, "programs", programId); 
            const programDoc = await getDoc(programRef); 
            if (programDoc.exists()) {
                let programData =  {
                    ...programDoc.data(),
                    id: programDoc.id
                }
                curProgram.set(programData);
                return programData; 
            } else {
                console.warn(`Program with ID ${programId} does not exist.`); 
            }
        } catch (error) {
            console.error(`Error fetching program:`, error);
        }
    },

    // Function to create a new program program
    createProgram: async (programData) => {
        try {
            const programRef = collection(db, 'programs');
            const docRef = await addDoc(programRef, {
                ...programData,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await programHandlers.getPrograms(); // Refresh the program programs list
            return docRef.id;
        } catch (error) {
            console.error('Error creating program:', error);
            programError.set(error.message);
            throw error;
        }
    }, 

    // Function to update a program program
    updateProgram: async (programId, programData) => {
        try {
            const programRef = doc(db, 'programs', programId);
            await updateDoc(programRef, {
                ...programData,
                updatedAt: new Date()
            });
            await programHandlers.getPrograms(); // Refresh the program programs list
        } catch (error) {
            console.error('Error updating program:', error);
            programError.set(error.message);
            throw error;
        }
    },

    // Function to delete a program program
    deleteProgram:  async (programId) => {
        try {
            const programRef = doc(db, 'programs', programId);
            await deleteDoc(programRef);
            await programHandlers.getPrograms(); // Refresh the program programs list
        } catch (error) {
            console.error('Error deleting program:', error);
            programError.set(error.message);
            throw error;
        }
    }, 

    // Upload multiple images to program
    uploadImages: async (files, programId) => {
        const uploadPromises = files.map(async (file) => {
            const fileRef = ref(storage, `programs/${programId}/images/${Date.now()}_${file.name}`);
            await uploadBytes(fileRef, file);
            return await getDownloadURL(fileRef);
        });
    
        return await Promise.all(uploadPromises);
    }, 

    // Upload cover image
    uploadCoverImage: async (file, programId) => {
        const fileRef = ref(storage, `programs/${programId}/cover_${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    },

    uploadWorkshopImages: async (files, programId, workshopId ) => {
        const uploadPromises = files.map(async (file) => {
            const fileRef = ref(storage, `programs/${programId}/workshops/${workshopId}/${Date.now()}_${file.name}`);
            await uploadBytes(fileRef, file);
            return await getDownloadURL(fileRef);
        });
    
        return await Promise.all(uploadPromises);
    }
}

