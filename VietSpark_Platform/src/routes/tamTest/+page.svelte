<script>

    import { testStore, testStoreHandler } from "$lib/stores/testStore";

    let tests = []
    let newTestName = ''

    testStore.subscribe((state)=>{
        tests = state.tests
    }) 

    async function allTests() {
        await testStoreHandler.getAllTests()
    }

    async function newTest(newTestName) {
        await testStoreHandler.createNewTest(newTestName)
    }

    $: console.log(tests)

</script>



<div>
    This is my test page for understanding stores.
</div>

<button type='button' class='bg-white round-lg hover:bg-gray-100' on:click={allTests}>
    Get all tests
</button>

<form on:submit|preventDefault={newTest(newTestName)}>
    <input
        type="text"
        bind:value={newTestName}
        placeholder="Enter new test name"
        class="border rounded-md px-2 py-1 mr-2"
    />
    <button type="submit" class="bg-white round-lg hover:bg-gray-100">Create new test</button>
</form>

<pre>
    {JSON.stringify(tests, null, 2)}
</pre>

