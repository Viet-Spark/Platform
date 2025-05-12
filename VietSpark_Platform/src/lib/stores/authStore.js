import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { writable } from 'svelte/store';
import { auth } from '$lib/firebase/firebase';
import { initializeUserData } from './userStore';

// Create stores for auth state
export const authUser = writable(null);
export const authLoading = writable(true);
export const authError = writable(null);

// Listen for auth state changes
onAuthStateChanged(auth, async (firebaseUser) => {
    authLoading.set(false);
    if (firebaseUser) {
        authUser.set(firebaseUser);
        // Initialize or update user data when auth state changes
        await initializeUserData(firebaseUser.uid, firebaseUser.email);
    } else {
        authUser.set(null);
    }
});

// Login with email and password
export async function loginWithEmail(email, password) {
    authError.set(null);
    authLoading.set(true);

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        authError.set(error.message);
        throw error;
    } finally {
        authLoading.set(false);
    }
}

// Register with email and password
export async function registerWithEmail(email, password) {
    authError.set(null);
    authLoading.set(true);

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        authError.set(error.message);
        throw error;
    } finally {
        authLoading.set(false);
    }
}

// Sign out
export async function logout() {
    authLoading.set(true);

    try {
        await signOut(auth);
    } catch (error) {
        authError.set(error.message);
        throw error;
    } finally {
        authLoading.set(false);
    }
}
