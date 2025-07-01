import { writable } from 'svelte/store';
import { collection, getDocs, addDoc, deleteDoc, query, orderBy, where, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '$lib/firebase/firebase';

export const faqCategories = writable([]);

export const faqCategoriesLoading = writable(false);
export const faqCategoriesError = writable(null);

// Function to fetch categories from Firestore
export const fetchFaqCategories = async () => {
    faqCategoriesLoading.set(true);
    faqCategoriesError.set(null);

    try {
        const categoriesRef = collection(db, 'faqCategories');
        const q = query(categoriesRef, orderBy('name'));
        const querySnapshot = await getDocs(q);
        const categories = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        faqCategories.set(categories);
    } catch (error) {
        console.error('Error fetching FAQ categories:', error);
        faqCategoriesError.set(error.message);
        throw error;
    } finally {
        faqCategoriesLoading.set(false);
    }
};

// Function to add a new category
export const addFaqCategory = async (category) => {
    faqCategoriesLoading.set(true);
    faqCategoriesError.set(null);

    try {
        const categoriesRef = collection(db, 'faqCategories');
        const docRef = await addDoc(categoriesRef, {
            name: category,
            createdAt: new Date()
        });
        await fetchFaqCategories(); // Refresh the categories list
        return docRef.id;
    } catch (error) {
        console.error('Error adding faq category:', error);
        faqCategoriesError.set(error.message);
        throw error;
    } finally {
        faqCategoriesLoading.set(false);
    }
};

// Function to remove a category
export const removeFaqCategory = async (id) => {
    faqCategoriesLoading.set(true);
    faqCategoriesError.set(null);

    try {
        const categoriesRef = doc(db, 'faqCategories', id);
        await deleteDoc(categoriesRef);
        const faqsRef = collection(db, 'faqs');
        const q = query(faqsRef, where('categoryId', '==', id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });
        await fetchFaqCategories(); // Refresh the categories list
    } catch (error) {
        console.error('Error removing faq category:', error);
        faqCategoriesError.set(error.message);  
        throw error;
    } finally {
        faqCategoriesLoading.set(false);
    }
};

// Function to update a category
export const updateFaqCategory = async (id, newCategory) => {
    faqCategoriesLoading.set(true);
    faqCategoriesError.set(null);

    try {
        const categoriesRef = doc(db, 'faqCategories', id);
        await updateDoc(categoriesRef, { 
            name: newCategory,
            updatedAt: new Date().toISOString()
        });
        await fetchFaqCategories(); // Refresh the categories list
    } catch (error) {
        console.error('Error updating faq category:', error);
        faqCategoriesError.set(error.message);
        throw error;
    } finally {
        faqCategoriesLoading.set(false);
    }
};