import { writable } from 'svelte/store';
import { collection, addDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';

// Create a writable store for subscribers
export const subscribers = writable([]);

// Create a writable store for loading state
export const newsletterLoading = writable(false);

// Create a writable store for error state
export const newsletterError = writable(null);

// Function to fetch all subscribers
export const fetchSubscribers = async () => {
    newsletterLoading.set(true);
    try {
        const subscribersRef = collection(db, 'newsletter');
        const q = query(subscribersRef, orderBy('subscribedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const subscribersList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        subscribers.set(subscribersList);
        newsletterError.set(null);
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        newsletterError.set(error.message);
    } finally {
        newsletterLoading.set(false);
    }
};

// Function to add a new subscriber
export const addSubscriber = async (email) => {
    try {
        const subscribersRef = collection(db, 'newsletter');
        const docRef = await addDoc(subscribersRef, {
            email,
            subscribedAt: new Date().toISOString(),
            active: true
        });
        await fetchSubscribers(); // Refresh the subscribers list
        return docRef.id;
    } catch (error) {
        console.error('Error adding subscriber:', error);
        newsletterError.set(error.message);
        throw error;
    }
};

// Function to remove a subscriber
export const removeSubscriber = async (subscriberId) => {
    try {
        const subscriberRef = doc(db, 'newsletter', subscriberId);
        await deleteDoc(subscriberRef);
        await fetchSubscribers(); // Refresh the subscribers list
    } catch (error) {
        console.error('Error removing subscriber:', error);
        newsletterError.set(error.message);
        throw error;
    }
};
