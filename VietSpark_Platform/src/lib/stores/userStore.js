import { writable } from 'svelte/store';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs} from 'firebase/firestore';
import { db, storage } from '$lib/firebase/firebase';

// Create stores
export const userData = writable(null);
export const userLoading = writable(true);
export const userError = writable(null);
export const usersList = writable(null);

// Get user data from firebase
export async function getUsers() {
    userLoading.set(true);
    userError.set(null);

    try {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        const users = snapshot.docs.map(doc => (
            {
                uid: doc.id,
                ...doc.data()
            }
        ));
        usersList.set(users);
    } catch (error) {
        userError.set(error.message);
        throw error;
    } finally {
        userLoading.set(false);
    }
}

// Update user data, this is used for admin to update user data
export async function updateUser(uid, data) {
    userLoading.set(true);
    userError.set(null);

    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            ...data,
            updatedAt: new Date().toISOString()
        });
        await getUsers();
    } catch (error) {
        console.error('Error updating user:', error);
        userError.set(error.message);
        throw error;
    } finally {
        userLoading.set(false);
    }
}

// Initialize or update user data
export async function initializeUserData(uid, email) {
    userLoading.set(true);
    userError.set(null);

    try {
        const userRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            // Create new user document with default values
            const newUserData = {
                email,
                isAdmin: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            await setDoc(userRef, newUserData);
            userData.set(newUserData);
        } else {
            // Get existing user data
            const existingData = userDoc.data();

            // Update user data with any new fields while preserving existing data
            const updatedData = {
                ...existingData,
                email, // Always update email to ensure it's current
                updatedAt: new Date().toISOString()
            };

            // Update the document with new fields while preserving existing data
            await updateDoc(userRef, updatedData);
            userData.set(updatedData);
        }
    } catch (error) {
        userError.set(error.message);
        throw error;
    } finally {
        userLoading.set(false);
    }
}

// Update user data
export async function updateUserData(uid, data) {
    userLoading.set(true);
    userError.set(null);

    try {
        const userRef = doc(db, 'users', uid);
        const updateData = {
            ...data,
            updatedAt: new Date().toISOString()
        };
        await updateDoc(userRef, updateData);

        // Update local store
        userData.update(current => ({
            ...current,
            ...updateData
        }));
    } catch (error) {
        userError.set(error.message);
        throw error;
    } finally {
        userLoading.set(false);
    }
}

// Get user data
export async function getUserData(uid) {
    userLoading.set(true);
    userError.set(null);

    try {
        const userRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            userData.set(userDoc.data());
        } else {
            userData.set(null);
        }
    } catch (error) {
        userError.set(error.message);
        throw error;
    } finally {
        userLoading.set(false);
    }
}
