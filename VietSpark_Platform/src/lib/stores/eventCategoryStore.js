import { writable } from 'svelte/store';
import { collection, getDocs, addDoc, deleteDoc, query, orderBy, where, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '$lib/firebase/firebase';

export const eventCategories = writable([]);

export const eventCategoriesLoading = writable(false);
export const eventCategoriesError = writable(null);

export const eventCategoryHandlers = {
    fetchEventCategories: async () => {
        eventCategoriesLoading.set(true);
        eventCategoriesError.set(null);
    
        try {
            const categoriesRef = collection(db, 'eventCategories');
            const q = query(categoriesRef, orderBy('name'));
            const querySnapshot = await getDocs(q);
            const categories = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            console.log('Event Categories fetched:', categories);
            eventCategories.set(categories);
        } catch (error) {
            console.error('Error fetching event categories:', error);
            eventCategoriesError.set(error.message);
            throw error;
        } finally {
            eventCategoriesLoading.set(false);
        }
    }, 

    addEventCategory: async (category) => {
        eventCategoriesLoading.set(true);
        eventCategoriesError.set(null);
    
        try {
            const categoriesRef = collection(db, 'eventCategories');
            const docRef = await addDoc(categoriesRef, {
                name: category,
                createdAt: new Date()
            });
            await eventCategoryHandlers.fetchEventCategories(); // Refresh the categories list
            return docRef.id;
        } catch (error) {
            console.error('Error adding event category:', error);
            eventCategoriesError.set(error.message);
            throw error;
        } finally {
            eventCategoriesLoading.set(false);
        }
    }, 

    removeEventCategory: async (id) => {
        eventCategoriesLoading.set(true);
        eventCategoriesError.set(null);
    
        try {
            const categoriesRef = doc(db, 'eventCategories', id);
            await deleteDoc(categoriesRef);
            const eventsRef = collection(db, 'events');
            const q = query(eventsRef, where('eventCategoryId', '==', id));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
            await eventCategoryHandlers.fetchEventCategories(); // Refresh the categories list
        } catch (error) {
            console.error('Error removing event category:', error);
            eventCategoriesError.set(error.message);
            throw error;
        } finally {
            eventCategoriesLoading.set(false);
        }
    },

    updateEventCategory: async (id, newCategory) => {
        eventCategoriesLoading.set(true);
        eventCategoriesError.set(null);
    
        try {
            const categoriesRef = doc(db, 'eventCategories', id);
            await updateDoc(categoriesRef, {
                name: newCategory,
                updatedAt: new Date().toISOString()
            });
            await eventCategoryHandlers.fetchEventCategories(); // Refresh the categories list
        } catch (error) {
            console.error('Error updating event category:', error);
            eventCategoriesError.set(error.message);
            throw error;
        } finally {
            eventCategoriesLoading.set(false);
        }
    }
};
