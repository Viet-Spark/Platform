import { writable } from 'svelte/store';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';

// Create a writable store for partners
export const partners = writable([]);

// Create a writable store for loading state
export const partnersLoading = writable(false);

// Create a writable store for error state
export const partnersError = writable(null);

// Function to fetch all partners
export const fetchPartners = async () => {
    partnersLoading.set(true);
    try {
        const partnersRef = collection(db, 'partners');
        const q = query(partnersRef, orderBy('name', 'asc'));
        const querySnapshot = await getDocs(q);
        const partnersList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        partners.set(partnersList);
        partnersError.set(null);
    } catch (error) {
        console.error('Error fetching partners:', error);
        partnersError.set(error.message);
    } finally {
        partnersLoading.set(false);
    }
};

// Function to create a new partner
export const createPartner = async (partnerData) => {
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
    }
};

// Function to update a partner
export const updatePartner = async (partnerId, partnerData) => {
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
    }
};

// Function to delete a partner
export const deletePartner = async (partnerId) => {
    try {
        const partnerRef = doc(db, 'partners', partnerId);
        await deleteDoc(partnerRef);
        await fetchPartners(); // Refresh the partners list
    } catch (error) {
        console.error('Error deleting partner:', error);
        partnersError.set(error.message);
        throw error;
    }
};
