import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param {File} file - The file to upload.
 * @param {string} path - The storage path (e.g., 'events/coverImages/').
 * @returns {Promise<string>} - The download URL of the uploaded file.
 */
export async function uploadImage(file, path = 'events/images/') {
    if (!file) throw new Error('No file provided');
    const fileRef = ref(storage, `${path}${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
}
