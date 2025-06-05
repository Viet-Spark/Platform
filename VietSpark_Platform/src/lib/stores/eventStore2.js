// @ts-nocheck
// template for stores file dealing with wathlist collection inside our firebase
import { writable } from 'svelte/store';
import { db } from '$lib/firebase/firebase.client';
import {
    addDoc,
    deleteDoc,
    updateDoc,
    getDoc,
    getDocs,
    collection,
    doc
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const eventsRef = collection(db, 'events');

// Event store state
export const eventStore = writable({
    isLoading: true,
    events: [],
    currentEvent: null
});


// Event object references/examples
// Handlers for event-related operations
export const eventHandlers = {
    // Fetch all events
    getEvents: async () => {
        try {
            const snapshot = await getDocs(eventsRef);
            const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            eventStore.set({ isLoading: false, events });
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    },

    // Fetch a single event by ID
    getEvent: async (eventId) => {
        try {
            const eventRef = doc(db, 'events', eventId);
            const eventDoc = await getDoc(eventRef);
            if (eventDoc.exists()) {
                eventStore.update(state => ({
                    ...state,
                    isLoading: false,
                    currentEvent: { id: eventDoc.id, ...eventDoc.data() }
                }));
            } else {
                console.warn(`Event with ID ${eventId} does not exist.`);
                eventStore.update(state => ({
                    ...state,
                    isLoading: false,
                    currentEvent: null
                }));
            }
        } catch (error) {
            console.error('Error fetching event:', error);
        }
    },

    // Add a new event
    createEvent: async (eventData) => {
        try {
            const newEventRef = await addDoc(eventsRef, {
                ...eventData,
                imageUrls: [] // Initialize with an empty imageUrls array
            });
            return newEventRef.id;
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    },

    // Upload event images and update the event with URLs
    uploadImages: async (eventId, imageFiles) => {
        try {
            const storage = getStorage();
            const imageUrls = await Promise.all(
                imageFiles.map(async (file) => {
                    const storageRef = ref(storage, `event_images/${eventId}/${file.name}`);
                    await uploadBytes(storageRef, file);
                    return getDownloadURL(storageRef);
                })
            );

            const eventRef = doc(db, 'events', eventId);
            await updateDoc(eventRef, { imageUrls });
            return imageUrls;
        } catch (error) {
            console.error('Error uploading images:', error);
            throw error;
        }
    },

    // Update an existing event
    updateEvent: async (eventId, eventData) => {
        try {
            const eventRef = doc(db, 'events', eventId);
            await updateDoc(eventRef, eventData);
            return eventId;
        } catch (error) {
            console.error('Error updating event:', error);
            throw error;
        }
    },

    // Delete a event
    deleteEvent: async (eventId) => {
        const confirmation = window.confirm('Are you sure you want to delete this event?');
        if (confirmation) {
            try {
                const eventRef = doc(db, 'events', eventId);
                await deleteDoc(eventRef);
                alert('Event successfully deleted.');
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        }
    },

    // Fetch a event image URL
    fetchImageUrl: async (eventId) => {
        try {
            const storage = getStorage();
            const storageRef = ref(storage, `event_images/${eventId}`);
            return await getDownloadURL(storageRef);
        } catch (error) {
            console.error('Error fetching image URL:', error);
            throw error;
        }
    }
};