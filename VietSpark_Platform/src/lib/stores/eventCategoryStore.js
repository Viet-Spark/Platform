import { writable } from 'svelte/store';
import { collection, getDocs, addDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';

const initialCategories = [
    'Break into Tech',
    'Fall Forum',
    'Tech Summit'
];

export const eventCategories = writable(initialCategories);

// Function to fetch categories from Firestore
export const fetchEventCategories = async () => {
    try {
        const categoriesRef = collection(db, 'eventCategories');
        const q = query(categoriesRef, orderBy('name'));
        const querySnapshot = await getDocs(q);
        const categories = querySnapshot.docs.map(doc => doc.data().name);
        eventCategories.set(categories);
    } catch (error) {
        console.error('Error fetching event categories:', error);
    }
};

// Function to add a new category
export const addEventCategory = async (category) => {
    try {
        const categoriesRef = collection(db, 'eventCategories');
        await addDoc(categoriesRef, {
            name: category,
            createdAt: new Date()
        });
        await fetchEventCategories(); // Refresh the categories list
    } catch (error) {
        console.error('Error adding event category:', error);
        throw error;
    }
};

// Function to remove a category
export const removeEventCategory = async (category) => {
    try {
        const categoriesRef = collection(db, 'eventCategories');
        const q = query(categoriesRef, where('name', '==', category));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await deleteDoc(docRef);
            await fetchEventCategories(); // Refresh the categories list
        }
    } catch (error) {
        console.error('Error removing event category:', error);
        throw error;
    }
};
