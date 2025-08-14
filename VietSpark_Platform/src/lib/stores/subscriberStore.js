import { writable } from 'svelte/store';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, getDoc } from 'firebase/firestore';
import { db, storage } from '$lib/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Create a writable store for subscribers
export const subscribers = writable([]);

// Create a writable store for loading state
export const subscriberLoading = writable(false);

// Create a writable store for error state
export const subscriberError = writable(null);

export const subscriberHandlers = {
    // Function to fetch all subscribers
    fetchSubscribers: async () => {
        subscriberLoading.set(true);
        try {
            const subscribersRef = collection(db, 'subscribers');
            const q = query(subscribersRef, orderBy('subscribedAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const subscribersList = querySnapshot.docs.map(doc => ({
                ...doc.data(), 
                id: doc.id,
            }));
            subscribers.set(subscribersList);
            subscriberError.set(null);
        } catch (error) {
            console.error('Error fetching subscribers:', error);
            subscriberError.set(error.message);
        } finally {
            subscriberLoading.set(false);
        }
    }, 

    // Function to add a new subscriber
    addSubscriber: async (email) => {
        try {
            const subscribersRef = collection(db, 'subscribers');
            const docRef = await addDoc(subscribersRef, {
                email: email.toLowerCase(),
                subscribedAt: new Date(),
                active: true, 
                unsubscribedAt: null
            });
            await subscriberHandlers.fetchSubscribers(); // Refresh the subscribers list
            return docRef.id;
        } catch (error) {
            console.error('Error adding subscriber:', error);
            subscriberError.set(error.message);
            throw error;
        }
    },

    // Function to unsubscribe
    unsubscribe: async (subscriberId, subscriberData) => {
        try {
            const subscriberRef = doc(db, 'subscribers', subscriberId);
            await updateDoc(subscriberRef, {
                ...subscriberData,
                active: false, 
                unsubscribedAt: new Date(),
                updatedAt: new Date(),
            });
            await subscriberHandlers.fetchSubscribers();
        } catch (error) {
            console.error('Error unsubscribing:', error);
            subscriberError.set(error.message);
            throw error;
        }
    },

    // Function to update a 
    resubscribe: async (subscriberId, subscriberData) => {
        try {
            const subscriberRef = doc(db, 'subscribers', subscriberId);
            await updateDoc(subscriberRef, {
                ...subscriberData,
                active: true, 
                unsubscribedAt: null,
                updatedAt: new Date(),
            });
            await subscriberHandlers.fetchSubscribers();
        } catch (error) {
            console.error('Error resubscribing:', error);
            subscriberError.set(error.message);
            throw error;
        }
    },

    // Function to remove a subscriber
    deleteSubscriber: async (subscriberId) => {
        try {
            const subscriberRef = doc(db, 'subscribers', subscriberId);
            await deleteDoc(subscriberRef);
            await subscriberHandlers.fetchSubscribers();
        } catch (error) {
            console.error('Error removing subscriber:', error);
            subscriberError.set(error.message);
            throw error;
        }
    },
}
