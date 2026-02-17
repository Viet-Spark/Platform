<script>
    // import MenteeThaoBao from '$lib/images/Testimonials/Mentee Thach Bao.jpg'
    // import MenteeTriNguyen from '$lib/images/Testimonials/Mentee Tri Nguyen.jpeg'
    // interface Testimonial {
    //     paragraphs: string[];
    //     imageSrc: string;
    //     imageAlt: string;
    //     name: string;
    //     title: string;
    //     company: string;
    // }
    //   const testimonials: Testimonial[] = [
//         {
//             paragraphs: [
//                 "<b>Success Story from Break Into Tech: Bao Thanh's Journey to Google</b>",
//                 "<br>",
//                 "🚀“When I joined BIT, I knew almost nothing about the software engineering hiring process, and I had an interview coming up in just 2-3 months. BIT provided me with an incredible mentor and several supportive friends who guided me every step of the way, from networking and crafting my resume to securing referrals, submitting applications, and preparing for interviews.",
//                 "<br>",
//                 "Through BIT, I had the opportunity to participate in high-quality mock interviews with professional software engineers, which laid a strong foundation for my coding interviews with tech companies. My mentor even conducted mock interviews with me during her vacation.",
//                 "<br>",                
//                 "One of the friends I met through BIT later became my roommate during my internship and remains one of my close friends outside of work. All this selfless support is what made it possible for me to grow and secure the great job I have today.”",
//                 "<br>",                
//                 "We are thrilled to share the inspiring journey of <b>Bao Thach</b>, a BIT alum and now an <b>Incoming Software Engineer @ Google!</b> 🎉",
//                 "<br>",                
//                 "💡 Behind every successful BIT journey is the incredible partnership between mentees and mentors. Through their dedication and selflessness, mentors help guide mentees like Bao to navigate their career paths, build confidence, and achieve their dreams. Together, they create a supportive community that lifts everyone up. ",
//                 "<br>",
//             ],
//             imageSrc: MenteeThaoBao,
//             imageAlt: "Profile picture of MenteeThaoBao",
//             name: "Thao Bao",
//             title: "Software Engineer",
//             company: "Google",
//         },
//         {
//             paragraphs: [
//                 "<b>Success Story from Break Into Tech: Tri Nguyen's Journey to Google</b>",
//                 "<br>",
//                 "Meet <b>Tri Nguyen</b>, a former BIT 2023 mentee and now an Incoming Software Engineer @ NVIDIA! His story exemplifies the power of mentorship, collaboration, and community in navigating the challenging US tech job market. Here's what he had to share about his BIT experience:",
//                 "💡 <i>“The program's workshops featured guest speakers from diverse backgrounds, ranging from big tech companies to financial institutions. These sessions broadened my perspective on possible avenues for entering the tech market, especially in such a challenging time.</i>",
//                 "<br>",                
//                 "🌟 Tri's BIT journey also led to a life-changing friendship:",
//                 "<i>“I met one of my best friends through my mentorship group, and we ended up sharing a house during my internship. That summer was eventful, full of ups and downs, but having a friend to navigate a new city made the experience enjoyable. We leveraged each other's networks to tackle the challenges of our internship projects and explore new opportunities. The advice we received ultimately helped us secure return offers.”</i>",
//                 "<br>",                
//                 "🔑 His advice to potential mentees:",
//                 "<i>“Utilize the mentors, fellow mentees, and guest speakers to practice your interview skills as much as possible. Conduct and give mock interviews. Most importantly, build on the connections you make during the program to form long-term, concrete networks.”</i>",
//                 "<br>",                
//                 "Break Into Tech isn't just a mentorship program—it's a pathway to lifelong friendships and career success. Are you ready to start your own journey?",
//                 "<br>",

//             ],            
//             imageSrc: MenteeTriNguyen,
//             imageAlt: "Profile picture of Cecilia Regini, design manager at Lattimore and Friends",
//             name: "Tri Nguyen",
//             title: "Software Engineer",
//             company: "Nvidia",
//         },
//   ];

    import { onMount } from 'svelte';
	import { testimonials, testimonialHandlers, testimonialLoading, testimonialError} from '$lib/stores/testimonialStore';
	import defaultProfile from '$lib/images/About/placeHolderAvatar.jpg';
	import { marked } from 'marked';
	import { writable } from 'svelte/store';
	import DOMPurify from 'dompurify';

	let approvedTestimonial = writable([]); 

	$: if ($testimonials) {
		approvedTestimonial.set($testimonials.filter(t => t.moderationStatus === 'Approved' && t.visibility === "Public")); 
	}

	function parseMarkdown(content) {
		if (!content) return '';
		return DOMPurify.sanitize(marked(String(content)));
	}


</script>

<svelte:head>
	<title>Testimonials - VietSpark</title>
	<meta
		name="description"
		content="Learn about VietSpark's mission, vision, and the team behind our community."
	/>
</svelte:head>

<section class="bg-primary py-16 text-white">
	<div class="container mx-auto px-4 text-center">
		<h1 class="mb-4 text-4xl font-bold">Testimonials</h1>
		<p class="mx-auto max-w-3xl text-xl">
			Our Break Into Tech program is an online, three-month long program run between December and March, 
            designed to help Vietnamese professionals transition into the tech industry or advance their early-stage tech careers.
		</p>
	</div>
</section>

<section id="testimonial" class="py-8 md:py-16">
	<div class="px-4 md:px-8 mx-auto max-w-7xl">
		<div class="container mx-auto px-4">
			<div class="mb-12 text-center">
				<div class="mb-4 text-2xl font-bold">Success Stories from Break Into Tech</div>
				<div class="bg-primary mx-auto mb-6 h-1 w-24"></div>
			</div>

			{#if $testimonialLoading}
				<div class="flex justify-center py-12">
					<div class="text-center">
						<div
							class="border-primary inline-block h-10 w-10 animate-spin rounded-full border-b-2 border-t-2"
						></div>
						<p class="mt-3 text-gray-600">Loading testimonials...</p>
					</div>
				</div>
			{:else if $testimonialError}
				<div class="mx-auto max-w-xl rounded-lg bg-red-50 p-6 text-center text-red-700">
					<p class="font-semibold">Unable to load testimonials.</p>
					<p class="mt-1 text-sm">{$testimonialError}</p>
				</div>
			{:else if !$testimonials || $testimonials.length === 0}
				<div class="mx-auto max-w-xl text-center text-gray-600">
					<p>Testimonials will be published here soon. Check back later.</p>
				</div>
			{:else}
				<div class="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
					{#each $approvedTestimonial as testimonial (testimonial.id)}
						<a
							href={`/testimonials/${testimonial.id}`}
							class="group flex h-full flex-col rounded-xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							<div class="flex flex-col flex-1 text-center">
                                <p class="text-lg mb-2 italic text-gray-700 line-clamp-3">
									{@html parseMarkdown(testimonial.highlight)}
								</p>

                                <div class="flex items-center gap-2 justify-center mt-auto ">
                                    <img
                                        src={testimonial.authorCoverImage || defaultProfile}
                                        alt={testimonial.authorName || 'VietSpark member'}
                                        loading="lazy"
                                        class="h-24 w-24 md:h-30 md:w-30 rounded-full object-cover"
                                        />
                                    <div>
                                        <div>
                                            <p class="text-lg font-bold">
                                                {testimonial.authorName || 'VietSpark Member'}
                                            </p>
                                            {#if testimonial.authorTitle || testimonial.authorOrganization}
                                                <p class="mt-1 text-base text-gray-600">
                                                    {testimonial.authorTitle}
                                                    <br/>
                                                    {testimonial.authorOrganization}
                                                </p>
                                            {/if}
                                        </div>
                                    </div>
                                </div>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</section>
