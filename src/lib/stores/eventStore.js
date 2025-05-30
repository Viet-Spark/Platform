import { writable } from 'svelte/store';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, where, getDoc } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from 'firebase/auth';

// Create a writable store for events
export const events = writable([]);

// Create a writable store for loading state
export const eventsLoading = writable(false);

// Create a writable store for error state
export const eventsError = writable(null);

// Create a writable store for featured events
export const featuredEvents = writable([]);

// Function to fetch all events
export const fetchEvents = async () => {
    eventsLoading.set(true);
    try {
        const eventsRef = collection(db, 'events');
        const q = query(eventsRef, orderBy('eventDate.start', 'desc'));
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

// Function to fetch featured events
export const fetchFeaturedEvents = async () => {
    try {
        const eventsRef = collection(db, 'events');
        const q = query(
            eventsRef,
            where('isFeatured', '==', true),
            where('status', '==', 'published'),
            orderBy('eventDate', 'desc'),
            limit(3)
        );
        const querySnapshot = await getDocs(q);
        const featuredList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        featuredEvents.set(featuredList);
    } catch (error) {
        console.error('Error fetching featured events:', error);
        eventsError.set(error.message);
    }
};

// Function to fetch events by category
export const fetchEventsByCategory = async (category) => {
    eventsLoading.set(true);
    try {
        const eventsRef = collection(db, 'events');
        const q = query(
            eventsRef,
            where('eventCategory', '==', category),
            orderBy('eventDate.start', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const eventsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        events.set(eventsList);
        eventsError.set(null);
    } catch (error) {
        console.error('Error fetching events by category:', error);
        eventsError.set(error.message);
    } finally {
        eventsLoading.set(false);
    }
};

// Function to fetch events by tag
export const fetchEventsByTag = async (tag) => {
    eventsLoading.set(true);
    try {
        const eventsRef = collection(db, 'events');
        const q = query(
            eventsRef,
            where('tags', 'array-contains', tag),
            orderBy('eventDate.start', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const eventsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        events.set(eventsList);
        eventsError.set(null);
    } catch (error) {
        console.error('Error fetching events by tag:', error);
        eventsError.set(error.message);
    } finally {
        eventsLoading.set(false);
    }
};

// Function to create a new event
export const createEvent = async (eventData) => {
    try {
        const eventsRef = collection(db, 'events');
        const now = new Date();
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
            throw new Error('User must be logged in to create an event');
        }

        const dataToSubmit = {
            ...eventData,
            uuid: eventData.uuid || uuidv4(),
            createdAt: now,
            updatedAt: now,
            eventAuthor: currentUser.uid,
            eventDate: {
                start: new Date(eventData.eventDate.start),
                end: new Date(eventData.eventDate.end)
            },
            seatsPurchased: 0
        };

        const docRef = await addDoc(eventsRef, dataToSubmit);
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
        const now = new Date();

        const dataToSubmit = {
            ...eventData,
            updatedAt: now,
            eventDate: {
                start: new Date(eventData.eventDate.start),
                end: new Date(eventData.eventDate.end)
            }
        };

        await updateDoc(eventRef, dataToSubmit);
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

// Function to register for an event
export const registerForEvent = async (eventId, userId, ticketType = 'standard') => {
    try {
        const eventRef = doc(db, 'events', eventId);
        const eventDoc = await getDoc(eventRef);
        const eventData = eventDoc.data();

        if (!eventData) {
            throw new Error('Event not found');
        }

        if (eventData.seatsPurchased >= eventData.seatsAvailable) {
            throw new Error('Event is full');
        }

        // Check if user is already registered
        const isAlreadyRegistered = eventData.attendees.some(
            attendee => (typeof attendee === 'string' ? attendee === userId : attendee.userId === userId)
        );

        if (isAlreadyRegistered) {
            throw new Error('Already registered for this event');
        }

        // Add new attendee with ticket type
        const newAttendee = {
            userId,
            ticketType,
            checkedIn: false
        };

        await updateDoc(eventRef, {
            attendees: [...eventData.attendees, newAttendee],
            seatsPurchased: eventData.seatsPurchased + 1,
            updatedAt: new Date()
        });

        await fetchEvents(); // Refresh the events list
    } catch (error) {
        console.error('Error registering for event:', error);
        eventsError.set(error.message);
        throw error;
    }
};

// Function to unregister from an event
export const unregisterFromEvent = async (eventId, userId) => {
    try {
        const eventRef = doc(db, 'events', eventId);
        const eventDoc = await getDoc(eventRef);
        const eventData = eventDoc.data();

        if (!eventData) {
            throw new Error('Event not found');
        }

        // Find and remove the attendee
        const updatedAttendees = eventData.attendees.filter(attendee =>
            typeof attendee === 'string' ? attendee !== userId : attendee.userId !== userId
        );

        if (updatedAttendees.length === eventData.attendees.length) {
            throw new Error('Not registered for this event');
        }

        await updateDoc(eventRef, {
            attendees: updatedAttendees,
            seatsPurchased: eventData.seatsPurchased - 1,
            updatedAt: new Date()
        });

        await fetchEvents(); // Refresh the events list
    } catch (error) {
        console.error('Error unregistering from event:', error);
        eventsError.set(error.message);
        throw error;
    }
};
