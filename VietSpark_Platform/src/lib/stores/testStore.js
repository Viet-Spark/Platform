import { writable } from "svelte/store";

export const testStore = writable({
    isLoading: false,
    tests: [],
    currentTest: null,
});

export const testStoreHandler = {
    getAllTests: async() => {
        testStore.set({
            isLoading: true,
            tests: ['test1', 'test2'],
            currentTest: null,
        })
    },

    createNewTest: async(newTest) => {
        testStore.update((state) => ({
            ...state,
            tests: [...state.tests, newTest]
        }))
    },

}