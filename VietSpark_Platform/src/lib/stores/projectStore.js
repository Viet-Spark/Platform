import { writable } from 'svelte/store';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, getDoc } from 'firebase/firestore';
import { db, storage } from '$lib/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Create a writable store for project
export const projects = writable([]);

// Create a writable store for loading state
export const projectLoading = writable(false);

// Create a writable store for error state
export const projectError = writable(null);

export const projectHandlers = {
    // Function to fetch all projects
    getProjects: async (orderByColumn = "name") => {
        projectLoading.set(true);
        try {
            const projectRef = collection(db, 'projects');
            const q = query(projectRef, orderBy(orderByColumn));
            const querySnapshot = await getDocs(q);
            const projectsList = querySnapshot.docs.map(doc => ({
                ...doc.data(), 
                id: doc.id
            }));
            projects.set(projectsList);
            console.log("Projects found in Firestore: ", projectsList);
            projectError.set(null);
        } catch (error) {
            console.error('Error fetching projects:', error);
            projectError.set(error.message);
        } finally {
            projectLoading.set(false);
        }
    },

    // Function to get a project by ID
    getProject: async (projectId) => {
        try {
            const projectRef = doc(db, "projects", projectId); 
            const projectDoc = await getDoc(projectRef); 
            if (projectDoc.exists()) {
                return {
                    ...projectDoc.data(), 
                    id: projectDoc.id,
                }
            } else {
                console.warn(`Project with ID ${projectId} does not exist.`); 
            }
        } catch (error) {
            console.error(`Error fetching project:`, error);
        }
    },

    // Function to create a new project
    createProject: async (projectData) => {
        try {
            const projectRef = collection(db, 'projects');
            const docRef = await addDoc(projectRef, {
                ...projectData,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            await projectHandlers.getProjects(); // Refresh the project list
            return docRef.id;
        } catch (error) {
            console.error('Error creating project:', error);
            projectError.set(error.message);
            throw error;
        }
    }, 

    // Function to update a project
    updateProject: async (projectId, projectData) => {
        try {
            const projectRef = doc(db, 'projects', projectId);
            await updateDoc(projectRef, {
                ...projectData,
                updatedAt: new Date()
            });
            await projectHandlers.getProjects(); // Refresh the project list
        } catch (error) {
            console.error('Error updating project:', error);
            projectError.set(error.message);
            throw error;
        }
    },

    // Function to delete a project
    deleteProject:  async (projectId) => {
        try {
            const projectRef = doc(db, 'projects', projectId);
            await deleteDoc(projectRef);
            await projectHandlers.getProjects(); // Refresh the project list
        } catch (error) {
            console.error('Error deleting project:', error);
            projectError.set(error.message);
            throw error;
        }
    }, 

    // Upload multiple images to project
    uploadMultipleImages: async (files, projectId) => {
        const uploadPromises = files.map(async (file) => {
            const fileRef = ref(storage, `projects/${projectId}/images/${Date.now()}_${file.name}`);
            await uploadBytes(fileRef, file);
            return await getDownloadURL(fileRef);
        });
    
        return await Promise.all(uploadPromises);
    }, 

}

