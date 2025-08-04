import { writable } from 'svelte/store';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, getDoc } from 'firebase/firestore';
import { db, storage } from '$lib/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Create a writable store for testimonial
export const testimonials = writable([]);

// Create a writable store for loading state
export const testimonialLoading = writable(false);

// Create a writable store for error state
export const testimonialError = writable(null);

export const testimonialHandlers = {
    // Function to fetch all testimonials
    getTestimonials: async (orderByColumn = "createdAt") => {
        testimonialLoading.set(true);
        try {
            const testimonialRef = collection(db, 'testimonials');
            const q = query(testimonialRef, orderBy(orderByColumn, 'desc'));
            const querySnapshot = await getDocs(q);
            const testimonialsList = querySnapshot.docs.map(doc => ({
                ...doc.data(), 
                id: doc.id,
            }));
            testimonials.set(testimonialsList);
            console.log("Testimonials found in Firestore: ", testimonialsList);
            testimonialError.set(null);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            testimonialError.set(error.message);
        } finally {
            testimonialLoading.set(false);
        }
    },

    // Function to get a testimonial by ID
    getTestimonial: async (testimonialId) => {
        try {
            const testimonialRef = doc(db, "testimonials", testimonialId); 
            const testimonialDoc = await getDoc(testimonialRef); 
            if (testimonialDoc.exists()) {
                return {
                    ...testimonialDoc.data(), 
                    id: testimonialDoc.id,
                    
                }
            } else {
                console.warn(`Testimonial with ID ${testimonialId} does not exist.`); 
            }
        } catch (error) {
            console.error(`Error fetching testimonial:`, error);
        }
    },

    // Function to create a new testimonial
    createTestimonial: async (testimonialData) => {
        try {
            const testimonialRef = collection(db, 'testimonials');
            const docRef = await addDoc(testimonialRef, {
                ...testimonialData,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await testimonialHandlers.getTestimonials(); // Refresh the testimonial list
            return docRef.id;
        } catch (error) {
            console.error('Error creating testimonial:', error);
            testimonialError.set(error.message);
            throw error;
        }
    }, 

    // Function to update a testimonial
    updateTestimonial: async (testimonialId, testimonialData) => {
        try {
            const testimonialRef = doc(db, 'testimonials', testimonialId);
            await updateDoc(testimonialRef, {
                ...testimonialData,
                updatedAt: new Date(),
            });
            await testimonialHandlers.getTestimonials(); // Refresh the testimonial list
        } catch (error) {
            console.error('Error updating testimonial:', error);
            testimonialError.set(error.message);
            throw error;
        }
    },

    // Function to delete a testimonial
    deleteTestimonial:  async (testimonialId) => {
        try {
            const testimonialRef = doc(db, 'testimonials', testimonialId);
            await deleteDoc(testimonialRef);
            await testimonialHandlers.getTestimonials(); // Refresh the testimonial list
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            testimonialError.set(error.message);
            throw error;
        }
    }, 

    // Upload testimonials images
    uploadTestimonialsImages: async (files, programId, testimonialId) => {
        const uploadPromises = files.map(async (file) => {
            const fileRef = ref(storage, `programs/${programId}/testimonials/${testimonialId}/${Date.now()}_${file.name}`);
            await uploadBytes(fileRef, file);
            return await getDownloadURL(fileRef);
        });
        return await Promise.all(uploadPromises);
    },

    // Upload testimonials video
    uploadTestimonialsVideo: async (file, programId, testimonialId) => {
        const fileRef = ref(storage, `programs/${programId}/testimonials/${testimonialId}/video_${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    },
}

