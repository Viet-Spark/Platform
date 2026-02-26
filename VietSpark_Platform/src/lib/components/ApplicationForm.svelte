<script>
    import { createEventDispatcher } from 'svelte';
    import { usersList, getUsers } from '$lib/stores/userStore';
    import { onMount } from 'svelte';
    import { validateFile, validateImageFile, validateVideoFile} from '$lib/utils/validator.js';

    export let application = {
        // common fields
        id: '',
        programId: '',
        title: '',
        name: '', 
        role: '',
        userId: '',
        resume: '',
        resumeTempFile: null,
        position: '',
        location: '',
        timezone: '',
        email: '',
        status: 'Pending',
        links: {},
        // Mentee fields
        interestInSupport: false,
        goals: '',
        previousPartcipate: false,
        hasOtherPrograms: false,
        desiredPos: [],
        leaderInterest: false, 
        coachingInterest: false, 
        //Project-based Coaching Interest
        coachingTrack: '', 
        hourCommitted: '',
        projectIdea: '', 
        presentingInterest: false, 

        // Mentor fields
        experience: {
            twoThree: false, 
            threeFour: false, 
            fivePlus: false, 
            isManager: false
        },
        lastJobSearch: '', 
        phone: '', 
        availability: {
            weekdayEvening: false, 
            weekendMorning: false, 
            weekendEvening: false
        }, 
        introduction: '', 
        mentoringInterest: {
            career: false, 
            project: false, 
            both: false
        }, 
        projectTrack: '', 
        informationAllowed: false, 

    };
    export let loading = false;
    export let error = '';
    export let isEditing = false;
    export let displayStatus = false;
    export let handleCancel = () => {}; 
    export let programId = ''; 
    export let role = ''; 

    const dispatch = createEventDispatcher();
    let formData = { ...application, role: role, programId: programId };
    let statusOptions = ['Pending', 'Approved', 'Rejected', 'Withdrawn'];
    let jobFunctions = ["Accounting", "Business Development/ Partnership", "Corporate Strategy/ Internal Consultant", 
                        "Customer Service", "Data Analytics", "Data Science", "Finance", "Graphic Design/ UI-UX", 
                        "HR", "Product Management/ Program Management", "Product Marketing/ Digital Marketing", 
                        "Product Operations", "Software Engineering", "Supply Chain", "Others"]
    onMount(() => {
        getUsers();
    });

    
    function handleFileChange(event) {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            // Optional: Additional check if you want to enforce MIME type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(selectedFile.type)) {
                alert('Only PDF or DOC files are allowed.');
                event.target.value = ''; // Clear the input
                formData.resumeTempFile = null;
                return;
            }
            formData.resumeTempFile = selectedFile;
            console.log('Selected file:', formData.resumeTempFile);
        }
    }

    // Links
    let linkFields = ['portfolio', 'gitHub', 'linkedIn', 'website'];
    function handleLinkChange(field, value) {
        formData.links = { ...formData.links, [field]: value };
    }

    function toggleJob(job) {
        if (formData.desiredPos.includes(job)) {
            formData.desiredPos = formData.desiredPos.filter(j => j !== job);
        } else if (formData.desiredPos.length < 2) {
            formData.desiredPos = [...formData.desiredPos, job];
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        loading = true; 
        dispatch('submit', { ...formData });
    }
</script>

<h1 class="flex flex-col items-center justify-center bg-primary text-white p-4 mb-8">
    {isEditing ? 'Edit Application' : 'Create ' + role.charAt(0).toUpperCase() + role.slice(1) + ' Application'}
</h1>
<section class="min-h-[50vh]">
    <div class="container mx-auto">
        <div class="rounded-lg bg-white">
            <form on:submit={handleSubmit} class="space-y-6">
                <!-- Common fields -->
                <div class="flex flex-col gap-4 ">
                    <!-- Name -->
                    <div>
                        <label for="name" class="block font-semibold mb-1">Name</label>
                        <input type="text" id="name" bind:value={formData.name} required placeholder="Name" class="w-full border rounded px-3 py-2 mb-1" />
                    </div>

                    <!-- Email -->
                    <div>
                        <label for="email" class="block font-semibold mb-1">Email</label>
                        <input type="email" id="email" bind:value={formData.email} required placeholder="Email" class="w-full border rounded px-3 py-2 mb-1" />
                    </div>

                    <!-- Resume -->
                    <div>
                        <label for="resume" class="block font-semibold mb-1">Upload your resume</label>
                        <div class="flex flex-col gap-3 w-full max-w-md p-4 bg-white shadow rounded-md border">
                            <input
                                id="resume"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                on:change={handleFileChange}
                                class="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                            />
                        
                            {#if formData.resumeTempFile}
                                <p class="text-sm text-green-600 font-medium">Selected file: {formData.resumeTempFile.name}</p>
                            {:else if formData.resume}
                                <a
                                    href={formData.resume}
                                    target="_blank"
                                    class="text-blue-600 underline text-sm mt-2"
                                >
                                    View uploaded resume
                                </a>
                            {/if}
                        </div>
                    </div>

                    <!-- Position -->
                    <div>
                        <label for="position" class="block font-semibold mb-1">Your current Company & Position (or Grad School name & Graduation year if you're a student)</label>
                        <input type="text" id="position" bind:value={formData.position} required placeholder="Current Position" class="w-full border rounded px-3 py-2 mb-1" />
                    </div>

                    <!-- Location -->
                    <div>
                        <label for="location" class="block font-semibold mb-1">Where are you currently located (City, State)?</label>
                        <input type="text" id="position" bind:value={formData.location} placeholder="City, State" class="w-full border rounded px-3 py-2 mb-1" />
                    </div>

                    <!-- Timezone -->
                    <div>
                        <label for="timezone" class="block font-semibold mb-1">Please specify your current timezone. This will help us to match mentor that are in the same timezone as you.</label>
                        <input type="text" id="timezone" bind:value={formData.timezone} placeholder="Timezone" class="w-full border rounded px-3 py-2 mb-1" />
                    </div>

                    <!-- Links -->
                    <div>
                        <label for="links" class="block font-semibold mb-1">Links</label>
                        <div id="links" class="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {#each linkFields as field}
                                <div>
                                    <input
                                        type="url"
                                        placeholder={field.charAt(0).toUpperCase() + field.slice(1) + ' URL'}
                                        value={(formData.links && formData.links[field]) || ''}
                                        on:input={(e) => handleLinkChange(field, e.target.value)}
                                        class="w-full border rounded px-3 py-2"
                                    />
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>

                <!-- Mentee's Fields  -->
                <div class="flex flex-col gap-4 {role === 'mentee' ? 'block' : 'hidden'}">
                    <!-- Interest in Support -->
                    <div>
                        <div class="block font-semibold mb-1">
                            Are you also interested in supporting us to organize Viet Spark programs? 
                            As an organizing member, you will help planning our events, inviting speakers and mentors, etc. Time commitment: Approximately 1-2 hours/week.
                        </div>
                        <div class="block text-base mb-1">
                            Your application will not be evaluated based on your interest in joining the organizing team
                        </div>
                        <div class="space-y-2 mb-1">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" required bind:group={formData.interestInSupport} value=true name="interestInSupport" class="accent-blue-600">
                                    Yes
                            </label>
                          
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" bind:group={formData.interestInSupport} value=false name="interestInSupport" class="accent-blue-600">
                                    No
                            </label>
                        </div>
                    </div>

                    <!-- Goals -->
                    <div>
                        <label for="goals" class="block font-semibold mb-1">
                            What is a specific career or skill development goal for the next 3-6 months? 
                            Please outline any specific actions you plan to take to achieve this goal, and how you believe the Break Into Tech (BIT) program can support you.
                        </label>
                        <textarea type="text" id="goals" rows=4 bind:value={formData.goals} required placeholder="Tell us about your goals ..." class="w-full border rounded px-3 py-2 mb-1">
                        </textarea>
                    </div>

                    <!-- Previously Participate in VS -->
                    <div>
                        <div class="block font-semibold mb-1">
                            Did you participate in Break into Tech in previous years?
                        </div>
                        <div class="block text-base mb-1">
                            No worries, we welcome reapplication :)
                        </div>
                        <div class="space-y-2 mb-1">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" required bind:group={formData.previousPartcipate} value=true name="previousPartcipate" class="accent-blue-600">
                                    Yes
                            </label>
                          
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" bind:group={formData.previousPartcipate} value=false name="previousPartcipate" class="accent-blue-600">
                                    No
                            </label>
                        </div>
                    </div>

                    <!-- Currently participate in other programs -->
                    <div>
                        <div class="block font-semibold mb-1">
                            Are you currently participating in any other mentorship programs?
                        </div>
                        <div class="space-y-2 mb-1">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" required bind:group={formData.hasOtherPrograms} value=true name="hasOtherPrograms" class="accent-blue-600">
                                    Yes
                            </label>
                            
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" bind:group={formData.hasOtherPrograms} value=false name="hasOtherPrograms" class="accent-blue-600">
                                    No
                            </label>
                        </div>
                    </div>

                    <!-- Desired Job Functions -->
                    <div>
                        <div class="block font-semibold mb-1">
                            What is your desired job function in tech? (Please choose up to 2 ONLY)
                        </div>
                      
                        <div class="grid grid-cols-2 gap-2 mb-1">
                            {#each jobFunctions as job}
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        value={job}
                                        checked={formData.desiredPos.includes(job)}
                                        disabled={!formData.desiredPos.includes(job) && formData.desiredPos.length >= 2}
                                        on:change={() => toggleJob(job)}
                                        class="accent-blue-600"
                                    >
                                    {job}
                                </label>
                            {/each}
                        </div>
                      
                        <p class="text-sm text-gray-500 mt-2">
                          Selected: {formData.desiredPos.length} / 2
                        </p>
                    </div>

                    <!-- Leader Interest -->
                    <div>
                        <div class="block font-semibold mb-1">
                            Group mentoring is one activity in BIT program which enable you to practice interview in a group of peers while learning from a mentor. 
                            Each group should have 1-2 captain(s) to help facilitate this activity. Are you interested in being a team captain?
                        </div>
                        <div class="space-y-2 mb-1">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" required bind:group={formData.leaderInterest} value=true name="leaderInterest" class="accent-blue-600">
                                    Yes
                            </label>
                            
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" bind:group={formData.leaderInterest} value=false name="leaderInterest" class="accent-blue-600">
                                    No
                            </label>
                        </div>
                    </div>

                    <!-- Coaching Interest -->
                    <div>
                        <div class="block font-semibold mb-1">
                            We're also launching a program offering project-based coaching to a selected group of mentees in Software Engineering, 
                            Data Analytics, and Product Management. Would you be interested?
                        </div>
                        <div class="space-y-2 mb-1">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" required bind:group={formData.coachingInterest} value="Yes" name="coachingInterest" class="accent-blue-600">
                                    Yes, I'm interested!
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" bind:group={formData.coachingInterest} value="No" name="coachingInterest" class="accent-blue-600">
                                    No, I'm not interested.
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" bind:group={formData.coachingInterest} value="N/A" name="coachingInterest" class="accent-blue-600">
                                    Not applicable
                            </label>
                        </div>
                    </div>

                    <!-- Project-based Coaching Interest -->
                    <div class="{formData.coachingInterest === "Yes" ? 'block' : 'hidden'}">
                        <!-- Coaching Track -->
                        <div>
                            <div class="block font-semibold mb-1">
                                Which track would you prefer to join for the Project-based Coaching?
                            </div>
                            <div class="space-y-2 mb-1">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" required bind:group={formData.coachingTrack} value="Data Analytics" name="coachingTrack" class="accent-blue-600">
                                        Data Analytics
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" bind:group={formData.coachingTrack} value="Software Engineering" name="coachingTrack" class="accent-blue-600">
                                        Software Engineering
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" bind:group={formData.coachingTrack} value="Product Management" name="coachingTrack" class="accent-blue-600">
                                        Product Management
                                </label>
                            </div>
                        </div>

                        <!-- Hour Committed -->
                        <div>
                            <label for="hourCommitted" class="block font-semibold mb-1">
                                How many hours per week can you realistically commit to working on a project under this mentorship program?
                            </label>
                            <input type="number" id="hourCommitted" bind:value={formData.hourCommitted} required placeholder="Number of Hour" class="w-full border rounded px-3 py-2 mb-1" />
                        </div>

                        <!-- Project Ideas -->
                        <div>
                            <label for="projectIdea" class="block font-semibold mb-1">
                                Describe a project idea you'd like to work on during this mentorship. 
                                How does it align with your career goals?
                            </label>
                            <textarea type="text" id="projectIdea" rows=2 bind:value={formData.projectIdea} required placeholder="Tell us about your project idea ..." class="w-full border rounded px-3 py-2 mb-1">
                            </textarea>
                        </div>

                        <!-- Presenting Interest -->
                        <div>
                            <div class="block font-semibold mb-1">
                                Are you willing to present your completed project at the end of the program?
                            </div>
                            <div class="space-y-2 mb-1">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" required bind:group={formData.presentingInterest} value=true name="presentingInterest" class="accent-blue-600">
                                        Yes
                                </label>
                                
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" bind:group={formData.presentingInterest} value=false name="presentingInterest" class="accent-blue-600">
                                        No
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Status -->
                <div class="{displayStatus ? 'block' : 'hidden'}">
                    <label for="status" class="block font-semibold mb-1">Status</label>
                    <select id="status" bind:value={formData.status} required class="w-full border rounded px-3 py-2">
                    {#each statusOptions as s}
                        <option value={s}>{s}</option>
                    {/each}
                    </select>
                </div>
                
                {#if error}
                <div class="text-red-600">{error}</div>
                {/if}
                <div class="flex justify-end space-x-4 pt-6">
                    <button
                        type="button"
                        class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        on:click={handleCancel} disabled={loading}
                    >
                        Cancel
                    </button>
                    <button type="submit" class="bg-primary text-white px-6 py-2 rounded" disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    </div>
</section>
