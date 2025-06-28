// @ts-nocheck
// template for stores file dealing with wathlist collection inside our firebase
import { writable } from 'svelte/store';
import { db, storage } from '$lib/firebase/firebase';
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

// home store state
export const homeStore = writable({
    whoWeAre: '',
    missionSummary: '',
    visionSummary: '',
    coreValuesSummary: '',
});

export const homeLoading = writable(false);
export const homeError = writable(null);


// Handlers for home-related operations
export const homeHandlers = {
    // Fetch home
    getHome: async () => {
        try {
            const homesRef = collection(db, 'aboutUs');
            const snapshot = await getDocs(homesRef);
            if (!snapshot.empty) {
                console.log('Home Docs found in Firestore:', snapshot.docs.length, 'documents');
                const homeMain = snapshot.docs.find(doc => doc.id === 'homePage');
                if (homeMain) {
                    const homeData = homeMain.data();
                    console.log('Main home document data:', homeData);
                    homeStore.set(homeData);
                    return homeData;
                } else {
                    console.warn('Main document not found');
                }
            } else {
                console.warn('No home found, create default home');
                try {
                    // Create a default home document
                    const homeInfo = {
                        ...homeStore,
                        id: 'main',
                        createdAt: new Date().toISOString()
                    };
                    
                    // Use setDoc to create the document with a specific ID
                    const homeDocRef = doc(db, 'aboutUs', 'homePage');
                    await setDoc(homeDocRef, homeInfo);
                    
                    console.log('Default home document created successfully');
                    homeStore.set(homeInfo);
                    return homeInfo;
                } catch (createError) {
                    console.error('Error creating default home us:', createError);
                    throw createError;
                }
            }
        } catch (error) {
            console.error('Error fetching home docs:', error);
        }
    },

    // Update an existing home
    updateHome: async (homeData) => {
        homeLoading.set(true);
        homeError.set(null);

        try {
            const homeRef = doc(db, 'aboutUs', 'homePage');
            await updateDoc(homeRef, homeData);

            homeStore.update(currentData => ({ 
                ...currentData, 
                ...homeData, 
                lastUpdated: new Date().toISOString() 
            }));
        } catch (error) {
            homeError.set(error.message);
            console.error('Error updating home:', error);
            throw error;
        } finally {
            homeLoading.set(false);
        }
    }
};