import { writable } from 'svelte/store';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';

// Create a writable store for events
export const events = writable([]);

// Create a writable store for loading state
export const eventsLoading = writable(false);

// Create a writable store for error state
export const eventsError = writable(null);

// Function to fetch all events
export const fetchEvents = async () => {
    eventsLoading.set(true);
    try {
        const eventsRef = collection(db, 'events');
        const q = query(eventsRef, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const eventsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        events.set(eventsList);
        eventsError.set(null);
    } catch (error) {
        console.error('Error fetching events:', error);
        eventsError.set(error.message);
    } finally {
        eventsLoading.set(false);
    }
};

// Function to create a new event
export const createEvent = async (eventData) => {
    try {
        const eventsRef = collection(db, 'events');
        const docRef = await addDoc(eventsRef, {
            ...eventData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        await fetchEvents(); // Refresh the events list
        return docRef.id;
    } catch (error) {
        console.error('Error creating event:', error);
        eventsError.set(error.message);
        throw error;
    }
};

// Function to update an event
export const updateEvent = async (eventId, eventData) => {
    try {
        const eventRef = doc(db, 'events', eventId);
        await updateDoc(eventRef, {
            ...eventData,
            updatedAt: new Date().toISOString()
        });
        await fetchEvents(); // Refresh the events list
    } catch (error) {
        console.error('Error updating event:', error);
        eventsError.set(error.message);
        throw error;
    }
};

// Function to delete an event
export const deleteEvent = async (eventId) => {
    try {
        const eventRef = doc(db, 'events', eventId);
        await deleteDoc(eventRef);
        await fetchEvents(); // Refresh the events list
    } catch (error) {
        console.error('Error deleting event:', error);
        eventsError.set(error.message);
        throw error;
    }
};
