import { writable } from 'svelte/store';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '$lib/firebase/firebase';
import { user } from './authStore';
import { get } from 'svelte/store';

// Create stores
export const profileData = writable({
    name: '',
    email: '',
    title: 'Software Engineer',
    company: 'Tech Company',
    location: 'San Francisco, CA',
    bio: 'Passionate about technology and community building.',
    interests: ['Web Development', 'AI/ML', 'Community Building'],
    profileImage: null,
    events: []
});

export const profileLoading = writable(false);
export const profileError = writable(null);

// Get user profile data
export async function getUserProfile(userId) {
    if (!userId) {
        console.error('Cannot get profile: No user ID provided');
        profileError.set('No user ID provided');
        profileLoading.set(false);
        return null;
    }

    profileLoading.set(true);
    profileError.set(null);

    try {
        console.log(`Fetching profile for user: ${userId}`);
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log('Profile found in Firestore:', docSnap.data());
            const userData = docSnap.data();

            // Ensure field mappings are consistent - convert displayName to name if needed
            const profileInfo = {
                ...userData,
                name: userData.name || userData.displayName || 'VietSpark Member'
            };

            profileData.set(profileInfo);
            return profileInfo;
        } else {
            console.log('No profile found, creating default profile');
            // Get current user info
            const currentUser = get(user);

            // If no profile exists, create a default one
            const defaultProfile = {
                name: currentUser ? currentUser.displayName || 'VietSpark Member' : 'VietSpark Member',
                displayName: currentUser ? currentUser.displayName || 'VietSpark Member' : 'VietSpark Member',
                email: currentUser ? currentUser.email : '',
                title: 'Software Engineer',
                company: 'Tech Company',
                location: 'San Francisco, CA',
                bio: 'Passionate about technology and community building.',
                interests: ['Web Development', 'AI/ML', 'Community Building'],
                profileImage: null,
                events: [],
                createdAt: new Date().toISOString()
            };

            try {
                await setDoc(docRef, defaultProfile);
                console.log('Default profile created successfully');
            } catch (error) {
                console.error('Error creating default profile:', error);
                // Even if we fail to save the default profile, return it anyway for display
            }

            profileData.set(defaultProfile);
            return defaultProfile;
        }
    } catch (error) {
        console.error('Error in getUserProfile:', error);
        profileError.set(error.message);
        throw error;
    } finally {
        profileLoading.set(false);
    }
}

// Update user profile data
export async function updateUserProfile(userId, data) {
    profileLoading.set(true);
    profileError.set(null);

    try {
        const docRef = doc(db, 'users', userId);
        await updateDoc(docRef, data);
        profileData.update(currentData => ({ ...currentData, ...data }));
    } catch (error) {
        profileError.set(error.message);
        console.error('Error updating profile:', error);
        throw error;
    } finally {
        profileLoading.set(false);
    }
}

// Upload profile image to Firebase Storage
export async function uploadProfileImage(userId, file) {
    profileLoading.set(true);
    profileError.set(null);

    try {
        // Create a storage reference
        const storageRef = ref(storage, `profile-images/${userId}`);

        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Update the user profile with the image URL
        await updateUserProfile(userId, { profileImage: downloadURL });

        return downloadURL;
    } catch (error) {
        profileError.set(error.message);
        console.error('Error uploading image:', error);
        throw error;
    } finally {
        profileLoading.set(false);
    }
}
