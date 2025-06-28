import { writable } from 'svelte/store';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db, storage } from '$lib/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Create a writable store for faqs
export const faqs = writable([]);

// Create a writable store for loading state
export const faqsLoading = writable(false);

// Create a writable store for error state
export const faqsError = writable(null);

// Function to fetch all faqs
export const fetchFAQs = async () => {
    faqsLoading.set(true);
    try {
        const faqsRef = collection(db, 'faqs');
        const querySnapshot = await getDocs(faqsRef);
        const faqsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        faqs.set(faqsList);
        console.log("FAQs found in Firestore: ", faqsList);
        faqsError.set(null);
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        faqsError.set(error.message);
    } finally {
        faqsLoading.set(false);
    }
};

// Function to create a new faq
export const createFAQ = async (faqData) => {
    try {
        const faqsRef = collection(db, 'faqs');
        const docRef = await addDoc(faqsRef, {
            ...faqData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        await fetchFAQs(); // Refresh the faqs list
        return docRef.id;
    } catch (error) {
        console.error('Error creating FAQ:', error);
        faqsError.set(error.message);
        throw error;
    }
};

// Function to update a faq
export const updateFAQ = async (faqId, faqData) => {
    try {
        const faqRef = doc(db, 'faqs', faqId);
        await updateDoc(faqRef, {
            ...faqData,
            updatedAt: new Date().toISOString()
        });
        await fetchFAQs(); // Refresh the faqs list
    } catch (error) {
        console.error('Error updating FAQ:', error);
        faqsError.set(error.message);
        throw error;
    }
};

// Function to delete a faq
export const deleteFAQ = async (faqId) => {
    try {
        const faqRef = doc(db, 'faqs', faqId);
        await deleteDoc(faqRef);
        await fetchFAQs(); // Refresh the faqs list
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        faqsError.set(error.message);
        throw error;
    }
};

// Function to rename a category
export const renameCategory = async (oldCategory, newCategory) => {
    try {
        const faqsRef = collection(db, 'faqs');
        const querySnapshot = await getDocs(faqsRef);
        const faqsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        const faqsToUpdate = faqsList.filter(faq => faq.category === oldCategory);
        if (faqsToUpdate) {
            faqsToUpdate.forEach(async (faq) => {
                await updateDoc(doc(db, 'faqs', faq.id), {
                    category: newCategory
                });
            });
        }
        await fetchFAQs(); // Refresh the faqs list
    } catch (error) {
        console.error('Error renaming category:', error);
        faqsError.set(error.message);
        throw error;
    }
};

// Function to delete a category
export const deleteCategory = async (category) => {
    try {
        const faqsRef = collection(db, 'faqs');
        const querySnapshot = await getDocs(faqsRef);
        const faqsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        const faqsToDelete = faqsList.filter(faq => faq.category === category);
        if (faqsToDelete) {
            faqsToDelete.forEach(async (faq) => {
                await deleteDoc(doc(db, 'faqs', faq.id));
            });
        }
        await fetchFAQs(); // Refresh the faqs list
    } catch (error) { 
        console.error('Error deleting category:', error);
        faqsError.set(error.message);
        throw error;
    }
};