// @ts-nocheck
// template for stores file dealing with wathlist collection inside our firebase
import { writable } from 'svelte/store';
import { db, storage } from '$lib/firebase/firebase';
import {
    addDoc,
    deleteDoc,
    updateDoc,
    getDoc,
    getDocs,
    collection,
    doc,
    query,
    orderBy
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Event store state
export const eventStore = writable({
    isLoading: true,
    events: [],
});


// Event object references/examples
// Handlers for event-related operations
export const eventHandlers = {
    // Fetch all events
    getEvents: async () => {
        try {
            const eventsRef = collection(db, 'events');
            const q = query(eventsRef, orderBy('eventDate.start', 'desc'));
            const querySnapshot = await getDocs(q);
            const eventsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log('Events fetched:', eventsList);
            eventStore.set({ isLoading: false, events: eventsList });
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
                    isLoading: false
                }));
                return eventDoc.data();
            } else {
                console.warn(`Event with ID ${eventId} does not exist.`);
                eventStore.update(state => ({
                    ...state,
                    isLoading: false
                }));
            }
        } catch (error) {
            console.error('Error fetching event:', error);
        }
    },

    // Add a new event
    createEvent: async (eventData) => {
        try {
            const eventsRef = collection(db, 'events');
            const newEventRef = await addDoc(eventsRef, {
                ...eventData,
            });
            eventHandlers.getEvents();
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
            eventHandlers.getEvents();
            return eventId;
        } catch (error) {
            console.error('Error updating event:', error);
            throw error;
        }
    },

    // Delete a event
    deleteEvent: async (eventId) => {
        try {
            const eventRef = doc(db, 'events', eventId);
            await deleteDoc(eventRef);
            alert('Event successfully deleted.');
            eventHandlers.getEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
            throw error;
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
    },


    // Upload cover image
    uploadCoverImage: async (file, eventId) => {
        const fileRef = ref(storage, `events/${eventId}/cover_${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    },
    
    // Upload multiple images to event gallery
    uploadMultipleImages: async (files, eventId) => {
        const uploadPromises = files.map(async (file) => {
            const fileRef = ref(storage, `events/${eventId}/gallery/${Date.now()}_${file.name}`);
            await uploadBytes(fileRef, file);
            return await getDownloadURL(fileRef);
        });
    
        return await Promise.all(uploadPromises);
    }, 

    // Upload speaker images
    uploadSpeakerImages: async (file, { eventId, speakerId }) => {
        const fileRef = ref(storage, `events/${eventId}/speakers/${speakerId}/profile_${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    },
    
    // Upload sponsor logo
    uploadSponsorLogo: async (file, { eventId, sponsorId }) => {
        const fileRef = ref(storage, `events/${eventId}/sponsors/${sponsorId}/logo_${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    }, 

    // Upload video
    uploadVideo: async (file, eventId) => {
        const fileRef = ref(storage, `events/${eventId}/videos/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    }, 

    // Upload multiple videos
    uploadMultipleVideos: async (files, eventId) => {
        const uploadPromises = files.map(async (file) => {
            const fileRef = ref(storage, `events/${eventId}/videos/${Date.now()}_${file.name}`);
            await uploadBytes(fileRef, file);
            return await getDownloadURL(fileRef);
        });
    
        return await Promise.all(uploadPromises);
    }, 

    // Upload program schedule images
    uploadProgramScheduleImages: async (files, eventId, programId) => {
        const uploadPromises = files.map(async (file) => {
            const fileRef = ref(storage, `events/${eventId}/program/${programId}/${Date.now()}_${file.name}`);
            await uploadBytes(fileRef, file);
            return await getDownloadURL(fileRef);
        });
        return await Promise.all(uploadPromises);
    },

    // Upload testimonials images
    uploadTestimonialsImages: async (files, eventId, testimonialId) => {
        const uploadPromises = files.map(async (file) => {
            const fileRef = ref(storage, `events/${eventId}/testimonials/${testimonialId}/${Date.now()}_${file.name}`);
            await uploadBytes(fileRef, file);
            return await getDownloadURL(fileRef);
        });
        return await Promise.all(uploadPromises);
    },

    // Upload testimonials video
    uploadTestimonialsVideo: async (file, eventId, testimonialId) => {
        const fileRef = ref(storage, `events/${eventId}/testimonials/${testimonialId}/video_${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    },

};