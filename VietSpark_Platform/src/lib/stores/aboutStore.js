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
    doc,
    setDoc
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// about store state
export const aboutStore = writable({
    history: '',
    mission: '',
    vision: '',
    coreValues: [],
    whatWeDo: [],
    boardOfDirectors: [],
    advisoryBoard: [],
    volunteers: [],
    faqs: []
});

export const aboutLoading = writable(false);
export const aboutError = writable(null);


// Handlers for about-related operations
export const aboutHandlers = {
    // Fetch about
    getAboutUs: async () => {
        try {
            const aboutsRef = collection(db, 'aboutUs');
            const snapshot = await getDocs(aboutsRef);
            if (!snapshot.empty) {
                console.log('About us found in Firestore:', snapshot.docs.length, 'documents');
                const aboutMain = snapshot.docs.find(doc => doc.id === 'main');
                if (aboutMain) {
                    const aboutData = aboutMain.data();
                    console.log('Main about document data:', aboutData);
                    aboutStore.set(aboutData);
                    return aboutData;
                } else {
                    console.warn('Main document not found');
                }
            } else {
                console.warn('No abouts found, create default about us');
                try {
                    // Create a default about us document
                    const aboutInfo = {
                        id: 'main',
                        createdAt: new Date().toISOString()
                    };
                    
                    // Use setDoc to create the document with a specific ID
                    const aboutDocRef = doc(db, 'aboutUs', 'main');
                    await setDoc(aboutDocRef, aboutInfo);
                    
                    console.log('Default about us document created successfully');
                    aboutStore.set(aboutInfo);
                    return aboutInfo;
                } catch (createError) {
                    console.error('Error creating default about us:', createError);
                    throw createError;
                }
            }
        } catch (error) {
            console.error('Error fetching abouts:', error);
        }
    },

    // Update an existing about
    updateAbout: async (aboutData) => {
        aboutLoading.set(true);
        aboutError.set(null);

        try {
            const aboutRef = doc(db, 'aboutUs', 'main');
            await updateDoc(aboutRef, aboutData);

            aboutStore.update(currentData => ({ 
                ...currentData, 
                ...aboutData, 
                lastUpdated: new Date().toISOString() 
            }));
        } catch (error) {
            aboutError.set(error.message);
            console.error('Error updating about:', error);
            throw error;
        } finally {
            aboutLoading.set(false);
        }
    },

    // Upload about image to Firebase Storage
    uploadBoardOfDirectorsImage: async (directorId, file) => {
        aboutLoading.set(true);
        aboutError.set(null);

        try {
            // Create a storage reference
            const storageRef = ref(storage, `board-of-directors-images/${directorId}`);

            // Upload the file
            const snapshot = await uploadBytes(storageRef, file);

            // Get the download URL
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Get current about data
            const aboutRef = doc(db, 'aboutUs', 'main');
            const aboutSnap = await getDoc(aboutRef);
            const currentAbout = aboutSnap.data();

            // Find and update the specific director by ID
            const updatedBoardOfDirectors = currentAbout.boardOfDirectors.map(director => 
                director.id === directorId 
                    ? { ...director, profileImage: downloadURL }
                    : director
            );

            // Update the about data with the updated board of directors
            await updateDoc(aboutRef, { boardOfDirectors: updatedBoardOfDirectors });

            // Update the store
            aboutStore.update(currentData => ({
                ...currentData,
                boardOfDirectors: updatedBoardOfDirectors, 
                lastUpdated: new Date().toISOString()
            }));

            return downloadURL;
        } catch (error) {
            aboutError.set(error.message);
            console.error('Error uploading image:', error);
            throw error;
        } finally {
            aboutLoading.set(false);
        }
    },

    // Upload advisory board image to Firebase Storage
    uploadAdvisoryBoardImage: async (advisorId, file) => {
        aboutLoading.set(true);
        aboutError.set(null);

        try {
            // Create a storage reference
            const storageRef = ref(storage, `advisory-board-images/${advisorId}`);

            // Upload the file
            const snapshot = await uploadBytes(storageRef, file);

            // Get the download URL
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Get current about data
            const aboutRef = doc(db, 'aboutUs', 'main');
            const aboutSnap = await getDoc(aboutRef);
            const currentAbout = aboutSnap.data();

            // Find and update the specific advisor by ID
            const updatedAdvisoryBoard = currentAbout.advisoryBoard.map(advisor => 
                advisor.id === advisorId 
                    ? { ...advisor, profileImage: downloadURL }
                    : advisor
            );

            // Update the about data with the updated advisory board
            await updateDoc(aboutRef, { advisoryBoard: updatedAdvisoryBoard });

            // Update the store
            aboutStore.update(currentData => ({
                ...currentData,
                advisoryBoard: updatedAdvisoryBoard
            }));

            return downloadURL;
        } catch (error) {
            aboutError.set(error.message);
            console.error('Error uploading advisory board image:', error);
            throw error;
        } finally {
            aboutLoading.set(false);
        }
    },

    // Upload volunteer image to Firebase Storage
    uploadVolunteerImage: async (volunteerId, file) => {
        aboutLoading.set(true);
        aboutError.set(null);

        try {
            // Create a storage reference
            const storageRef = ref(storage, `volunteer-images/${volunteerId}`);

            // Upload the file
            const snapshot = await uploadBytes(storageRef, file);

            // Get the download URL
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Get current about data
            const aboutRef = doc(db, 'aboutUs', 'main');
            const aboutSnap = await getDoc(aboutRef);
            const currentAbout = aboutSnap.data();

            // Find and update the specific volunteer by ID
            const updatedVolunteers = currentAbout.volunteers.map(volunteer => 
                volunteer.id === volunteerId 
                    ? { ...volunteer, profileImage: downloadURL }
                    : volunteer
            );

            // Update the about data with the updated volunteers
            await updateDoc(aboutRef, { volunteers: updatedVolunteers });

            // Update the store
            aboutStore.update(currentData => ({
                ...currentData,
                volunteers: updatedVolunteers
            }));

            return downloadURL;
        } catch (error) {
            aboutError.set(error.message);
            console.error('Error uploading volunteer image:', error);
            throw error;
        } finally {
            aboutLoading.set(false);
        }
    },

};