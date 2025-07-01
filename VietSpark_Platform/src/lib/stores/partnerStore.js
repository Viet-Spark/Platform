import { writable } from 'svelte/store';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db, storage } from '$lib/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Create a writable store for partners
export const partners = writable([]);

// Create a writable store for loading state
export const partnersLoading = writable(false);

// Create a writable store for error state
export const partnersError = writable(null);

// Function to fetch all partners
export const fetchPartners = async () => {

    partnersLoading.set(true);
    partnersError.set(null);

    try {
        const partnersRef = collection(db, 'partners');
        const q = query(partnersRef, orderBy('name', 'asc'));
        const querySnapshot = await getDocs(q);
        const partnersList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        partners.set(partnersList);
        console.log("Partners found in Firestore: ", partnersList);
    } catch (error) {
        console.error('Error fetching partners:', error);
        partnersError.set(error.message);
        throw error;
    } finally {
        partnersLoading.set(false);
    }
};

// Function to create a new partner
export const createPartner = async (partnerData) => {
    partnersLoading.set(true);
    partnersError.set(null);

    try {
        const partnersRef = collection(db, 'partners');
        const docRef = await addDoc(partnersRef, {
            ...partnerData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        await fetchPartners(); // Refresh the partners list
        return docRef.id;
    } catch (error) {
        console.error('Error creating partner:', error);
        partnersError.set(error.message);
        throw error;
    } finally {
        partnersLoading.set(false);
    }
};

// Function to update a partner
export const updatePartner = async (partnerId, partnerData) => {
    partnersLoading.set(true);
    partnersError.set(null);

    try {
        const partnerRef = doc(db, 'partners', partnerId);
        await updateDoc(partnerRef, {
            ...partnerData,
            updatedAt: new Date().toISOString()
        });
        await fetchPartners(); // Refresh the partners list
    } catch (error) {
        console.error('Error updating partner:', error);
        partnersError.set(error.message);
        throw error;
    } finally {
        partnersLoading.set(false);
    }
};

// Function to delete a partner
export const deletePartner = async (partnerId) => {
    partnersLoading.set(true);
    partnersError.set(null);

    try {
        const partnerRef = doc(db, 'partners', partnerId);
        await deleteDoc(partnerRef);
        await fetchPartners(); // Refresh the partners list
    } catch (error) {
        console.error('Error deleting partner:', error);
        partnersError.set(error.message);
        throw error;
    } finally {
        partnersLoading.set(false);
    }
};

 // Upload about image to Firebase Storage
export const uploadPartnerImage = async (partnerId, file) => {
    partnersLoading.set(true);
    partnersError.set(null);

    try {
        // Create a storage reference
        const storageRef = ref(storage, `partners-images/${partnerId}`);

        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Update the partner image with the image URL
        await updatePartner(partnerId, { image: downloadURL });

        return downloadURL;
    } catch (error) {
        partnersError.set(error.message);
        console.error('Error uploading image:', error);
        throw error;
    } finally {
        partnersLoading.set(false);
    }
};
