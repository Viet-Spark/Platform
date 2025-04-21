import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { writable } from 'svelte/store';
import { app } from '$lib/firebase/firebase';

// Initialize Firebase auth
const auth = getAuth(app);

// Create a store for the user
export const user = writable(null);
export const authLoading = writable(true);
export const authError = writable(null);

// Listen for auth state changes
onAuthStateChanged(auth, (firebaseUser) => {
    authLoading.set(false);
    if (firebaseUser) {
        user.set(firebaseUser);
    } else {
        user.set(null);
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
