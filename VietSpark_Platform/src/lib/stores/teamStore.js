import { writable } from 'svelte/store';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, getDoc } from 'firebase/firestore';
import { db, storage } from '$lib/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Create a writable store for team
export const teams = writable([]);

// Create a writable store for loading state
export const teamLoading = writable(false);

// Create a writable store for error state
export const teamError = writable(null);

export const teamHandlers = {
    // Function to fetch all teams
    getTeams: async (orderByColumn = "name") => {
        teamLoading.set(true);
        try {
            const teamRef = collection(db, 'teams');
            const q = query(teamRef, orderBy(orderByColumn));
            const querySnapshot = await getDocs(q);
            const teamsList = querySnapshot.docs.map(doc => ({
                ...doc.data(), 
                id: doc.id
            }));
            teams.set(teamsList);
            console.log("Teams found in Firestore: ", teamsList);
            teamError.set(null);
        } catch (error) {
            console.error('Error fetching teams:', error);
            teamError.set(error.message);
        } finally {
            teamLoading.set(false);
        }
    },

    // Function to get a team by ID
    getTeam: async (teamId) => {
        try {
            const teamRef = doc(db, "teams", teamId); 
            const teamDoc = await getDoc(teamRef); 
            if (teamDoc.exists()) {
                return {
                    ...teamDoc.data(), 
                    id: teamDoc.id,
                    
                }
            } else {
                console.warn(`Team with ID ${teamId} does not exist.`); 
            }
        } catch (error) {
            console.error(`Error fetching team:`, error);
        }
    },

    // Function to create a new team
    createTeam: async (teamData) => {
        try {
            const teamRef = collection(db, 'teams');
            const docRef = await addDoc(teamRef, {
                ...teamData,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            await teamHandlers.getTeams(); // Refresh the team list
            return docRef.id;
        } catch (error) {
            console.error('Error creating team:', error);
            teamError.set(error.message);
            throw error;
        }
    }, 

    // Function to update a team
    updateTeam: async (teamId, teamData) => {
        try {
            const teamRef = doc(db, 'teams', teamId);
            await updateDoc(teamRef, {
                ...teamData,
                updatedAt: new Date()
            });
            await teamHandlers.getTeams(); // Refresh the team list
        } catch (error) {
            console.error('Error updating team:', error);
            teamError.set(error.message);
            throw error;
        }
    },

    // Function to delete a team
    deleteTeam:  async (teamId) => {
        try {
            const teamRef = doc(db, 'teams', teamId);
            await deleteDoc(teamRef);
            await teamHandlers.getTeams(); // Refresh the team list
        } catch (error) {
            console.error('Error deleting team:', error);
            teamError.set(error.message);
            throw error;
        }
    }, 

    // Upload team logo
    uploadTeamLogo: async (file, teamId) => {
        const fileRef = ref(storage, `teams/${teamId}/logo${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    },
}

