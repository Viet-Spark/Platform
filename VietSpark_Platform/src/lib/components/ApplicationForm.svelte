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
        interestInSupport: null,
        goals: '',
        previousPartcipate: null,
        hasOtherPrograms: null,
        desiredPos: [],
        leaderInterest: null, 
        coachingInterest: null, 
        //Project-based Coaching Interest
        coachingTrack: '', 
        hourCommitted: '',
        projectIdea: '', 
        presentingInterest: null, 

        // Mentor fields
        experience: '',
        lastJobSearch: '', 
        phone: '', 
        availability: [], 
        introduction: '', 
        mentoringInterest: '', 
        projectTrack: '', 
        informationAllowed: null, 
        receiveMentorship: '', 
        seniorMentorship: [], 
        topics: [], 
        otherTopic: '', 
        suggestions: ''
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
                        "Product Operations", "Software Engineering", "Supply Chain", "Others"];

    let workExperienceOptions = ["2 - 3 years", "3 - 4 years", "5+ years", "I'm at a manager level"];

    let lastJobSearchOptions = ["Within last 12 months", "1 - 2 years ago", "2 - 3 years ago", "More than 3 years ago"];

    let availabilityOptions = ["Weekday evening", "Weekend morning", "Weekend evening"]; 

    let mentoringOptions = ["Career mentorship: work with a small cohort of 2–3 mentees. You will help them refine résumés, prepare for interviews, improve LinkedIn profiles, and navigate the job search process with confidence.", 
                            "Project-based:  guide mentees through a hands-on project", "I have bandwidth to offer both"];

    let projectBasedTracks = ["Software Engineering", "Data Analytics / Data Science", "Artificial Intelligence", 
                            "Project Management", "Finance Planning", "Other"]; 
    
    let simpleAnswers = ["Yes", "No"];

    let mentorshipTypes = ["1:1 professional coaching", "Group mentorship circles", "Leadership and management development", "Technical deep dives"]; 

    let topics = ["Career advancement in tech", "Breaking into management roles", "Communication & leadership skills", "Technical specialization (AI, data, engineering, etc.)", 
                    "Work–life balance / burnout prevention", "Opportunities in Vietnam’s tech ecosystem and/or outside of the US", 
                    "Entrepreneurship / building a startup", "Side hustle ideas and support"];
                             
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

    function toggleAvailability(availability) {
        if (formData.availability.includes(availability)) {
            formData.availability = formData.availability.filter( a => a !== availability);
        } else {
            formData.availability = [...formData.availability, availability];
        }
    }

    function toggleType(type) {
        if (formData.seniorMentorship.includes(type)) {
            formData.seniorMentorship = formData.seniorMentorship.filter( t => t !== type);
        } else {
            formData.seniorMentorship = [...formData.seniorMentorship, type];
        }
    }

    function toggleTopics(topic) {
        if (formData.topics.includes(topic)) {
            formData.topics = formData.topics.filter( t => t !== topic);
        } else {
            formData.topics = [...formData.topics, topic];
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
                        <label for="position" class="block font-semibold mb-1">
                            {role === "mentee" ? "Your current Company & Position (or Grad School name & Graduation year if you're a student)" : "Let us know your company and title"}
                        </label>
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
                {#if role === 'mentee'}
                    <div class="flex flex-col gap-4">
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
                                    <input type="radio" required bind:group={formData.interestInSupport} value={true} name="interestInSupport" class="accent-blue-600">
                                        Yes
                                </label>
                            
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" bind:group={formData.interestInSupport} value={false} name="interestInSupport" class="accent-blue-600">
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
                                    <input type="radio" required bind:group={formData.previousPartcipate} value={true} name="previousPartcipate" class="accent-blue-600">
                                        Yes
                                </label>
                            
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" bind:group={formData.previousPartcipate} value={false} name="previousPartcipate" class="accent-blue-600">
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
                                    <input type="radio" required bind:group={formData.hasOtherPrograms} value={true} name="hasOtherPrograms" class="accent-blue-600">
                                        Yes
                                </label>
                                
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" bind:group={formData.hasOtherPrograms} value={false} name="hasOtherPrograms" class="accent-blue-600">
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
                                    <input type="radio" required bind:group={formData.leaderInterest} value={true} name="leaderInterest" class="accent-blue-600">
                                        Yes
                                </label>
                                
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" bind:group={formData.leaderInterest} value={false} name="leaderInterest" class="accent-blue-600">
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
                                    {#each simpleAnswers as option}
                                        <label class="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" required bind:group={formData.presentingInterest} value={option} name="presentingInterest" class="accent-blue-600">
                                                {option}
                                        </label>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}

                <!-- Mentor's Fields  -->
                {#if role === 'mentor'}
                    <div class="flex flex-col gap-4">
                        <!-- Year of Experience -->
                        <div>
                            <div class="block font-semibold mb-1">
                                If you are not at a manager level, how many years of work experience do you have?
                            </div>
                            <div class="space-y-2 mb-1">
                                {#each workExperienceOptions as option, i}
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" required={i === 0} bind:group={formData.experience} value={option} name="experience" class="accent-blue-600">
                                            {option}
                                    </label>
                                {/each}
                            </div>
                        </div>

                        <!-- Last Job Search -->
                        <div>
                            <div class="block font-semibold mb-1">
                                When was the most recent time you were looking for jobs?
                            </div>
                            <div class="space-y-2 mb-1">
                                {#each lastJobSearchOptions as option, i}
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" required={i === 0} bind:group={formData.lastJobSearch} value={option} name="lastJobSearch" class="accent-blue-600">
                                            {option}
                                    </label>
                                {/each}
                            </div>
                        </div>

                        <!-- Phone Number -->
                        <div>
                            <label for="phone" class="block font-semibold mb-1">What is your phone number?</label>
                            <input type="tel" id="phone" bind:value={formData.phone} required placeholder="Your Phone Number" class="w-full border rounded px-3 py-2 mb-1" />
                        </div>

                        <!-- Availability -->
                        <div>
                            <div class="block font-semibold mb-1">
                                Let us know your weekly availability for Q1 2026.
                            </div>
                            <div class="block mb-1">
                                We know things can shift, but having a general idea helps us schedule BIT program workshops, mentor meetings, and group sessions.
                            </div>
                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-1">
                                {#each availabilityOptions as a}
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            value={a}
                                            checked={formData.availability.includes(a)}
                                            on:change={() => toggleAvailability(a)}
                                            class="accent-blue-600"
                                        >
                                        {a}
                                    </label>
                                {/each}
                            </div>
                        </div>

                        <!-- Introduction -->
                        <div>
                            <label for="introduction" class="block font-semibold mb-1">
                                If you were introducing yourself to volunteers, what would you like them to know about you?
                            </label>
                            <textarea type="text" id="introduction" rows=3 bind:value={formData.introduction} required placeholder="Your answer" class="w-full border rounded px-3 py-2 mb-1" >
                            </textarea>
                        </div>

                        <!-- Mentoring Types -->
                        <div>
                            <div class="block font-semibold mb-1">
                                What types of mentoring would you be interested in?
                            </div>

                            <div class="grid grid-cols-1 gap-2 mb-1">
                                {#each mentoringOptions as option, i}
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" required={i === 0} bind:group={formData.mentoringInterest} value={option} name="mentoringInterest" class="accent-blue-600">
                                            {option}
                                    </label>
                                {/each}
                            </div>
                        </div>

                        <!-- "Project-based Mentoring Track" -->
                        <div>
                            <div class="block font-semibold mb-1">
                                If you select "project-based" mentoring, please select your track: 
                            </div>

                            <div class="grid grid-cols-2 gap-2 mb-1">
                                {#each projectBasedTracks as option, i}
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" required={i === 0} bind:group={formData.projectTrack} value={option} name="projectTrack" class="accent-blue-600">
                                            {option}
                                    </label>
                                {/each}
                            </div>
                        </div>

                        <!-- Information Allowed -->
                        <div>
                            <div class="block font-semibold mb-1">
                                May we use the profile information and headshot you provided to highlight you in program communications (such as emails, web pages, or promotional posts)?
                            </div>
                            <div class="space-y-2 mb-1">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" required bind:group={formData.informationAllowed} value={true} name="informationAllowed" class="accent-blue-600">
                                        Yes, feel free to use them
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" bind:group={formData.informationAllowed} value={false} name="informationAllowed" class="accent-blue-600">
                                        No, please do not use them
                                </label>
                            </div>
                        </div>

                        <!-- Interest in Receiving Mentorship -->
                        <div>
                            <div class="block font-semibold mb-1">
                                Would you be interested in receiving mentorship from senior industry leaders?
                            </div>
                            <div class="space-y-2 mb-1">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" required bind:group={formData.receiveMentorship} value="Yes" name="receiveMentorship" class="accent-blue-600">
                                        Yes
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" bind:group={formData.receiveMentorship} value="No" name="receiveMentorship" class="accent-blue-600">
                                        No
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" bind:group={formData.receiveMentorship} value="Maybe - I'd like more information" name="receiveMentorship" class="accent-blue-600">
                                        Maybe - I'd like more information
                                </label>
                            </div>
                        </div>

                        <!-- Type of Senior-level mentorship -->
                        <div>
                            <div class="block font-semibold mb-1">
                                What type of senior-level mentorship would be most valuable to you? (Check all that apply)
                            </div>
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-1">
                                {#each mentorshipTypes as type}
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            value={type}
                                            checked={formData.seniorMentorship.includes(type)}
                                            on:change={() => toggleType(type)}
                                            class="accent-blue-600"
                                        >
                                        {type}
                                    </label>
                                {/each}
                            </div>
                        </div>

                        <!-- Topics -->
                        <div>
                            <div class="block font-semibold mb-1">
                                What topics would you like senior mentors to help you with? (check all that apply)
                            </div>
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-1">
                                {#each topics as topic}
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            value={topic}
                                            checked={formData.topics.includes(topic)}
                                            on:change={() => toggleTopics(topic)}
                                            class="accent-blue-600"
                                        >
                                        {topic}
                                    </label>
                                {/each}
                            </div>
                        </div>
                    
                        <!-- Other Topic -->
                        <div>
                            <label for="otherTopic" class="block font-semibold mb-1">What specific topics, speakers, or types of senior mentors would you love to learn from?</label>
                            <input type="text" id="otherTopic" bind:value={formData.otherTopic} required placeholder="I would like to learn about ..." class="w-full border rounded px-3 py-2 mb-1" />
                        </div>

                        <!-- Suggestions -->
                        <div>
                            <label for="suggestions" class="block font-semibold mb-1">Any additional suggestions for how BIT can support your growth as a mentor and a professional?</label>
                            <input type="text" id="suggestions" bind:value={formData.suggestions} required placeholder="Suggestions" class="w-full border rounded px-3 py-2 mb-1" />
                        </div>
                    </div>
                {/if}

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
