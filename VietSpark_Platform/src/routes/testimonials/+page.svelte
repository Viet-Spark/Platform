<script lang="ts">
    import MenteeThaoBao from '$lib/images/Testimonials/Mentee Thach Bao.jpg'
    import MenteeTriNguyen from '$lib/images/Testimonials/Mentee Tri Nguyen.jpeg'
    interface Testimonial {
        paragraphs: string[];
        imageSrc: string;
        imageAlt: string;
        name: string;
        title: string;
        company: string;
    }

  const testimonials: Testimonial[] = [
        {
            paragraphs: [
                "<b>Success Story from Break Into Tech: Bao Thanh's Journey to Google</b>",
                "<br>",
                "🚀“When I joined BIT, I knew almost nothing about the software engineering hiring process, and I had an interview coming up in just 2-3 months. BIT provided me with an incredible mentor and several supportive friends who guided me every step of the way, from networking and crafting my resume to securing referrals, submitting applications, and preparing for interviews.",
                "<br>",
                "Through BIT, I had the opportunity to participate in high-quality mock interviews with professional software engineers, which laid a strong foundation for my coding interviews with tech companies. My mentor even conducted mock interviews with me during her vacation.",
                "<br>",                
                "One of the friends I met through BIT later became my roommate during my internship and remains one of my close friends outside of work. All this selfless support is what made it possible for me to grow and secure the great job I have today.”",
                "<br>",                
                "We are thrilled to share the inspiring journey of <b>Bao Thach</b>, a BIT alum and now an <b>Incoming Software Engineer @ Google!</b> 🎉",
                "<br>",                
                "💡 Behind every successful BIT journey is the incredible partnership between mentees and mentors. Through their dedication and selflessness, mentors help guide mentees like Bao to navigate their career paths, build confidence, and achieve their dreams. Together, they create a supportive community that lifts everyone up. ",
                "<br>",
            ],
            imageSrc: MenteeThaoBao,
            imageAlt: "Profile picture of MenteeThaoBao",
            name: "Thao Bao",
            title: "Software Engineer",
            company: "Google",
        },
        {
            paragraphs: [
                "<b>Success Story from Break Into Tech: Tri Nguyen's Journey to Google</b>",
                "<br>",
                "Meet <b>Tri Nguyen</b>, a former BIT 2023 mentee and now an Incoming Software Engineer @ NVIDIA! His story exemplifies the power of mentorship, collaboration, and community in navigating the challenging US tech job market. Here's what he had to share about his BIT experience:",
                "💡 <i>“The program's workshops featured guest speakers from diverse backgrounds, ranging from big tech companies to financial institutions. These sessions broadened my perspective on possible avenues for entering the tech market, especially in such a challenging time.</i>",
                "<br>",                
                "🌟 Tri's BIT journey also led to a life-changing friendship:",
                "<i>“I met one of my best friends through my mentorship group, and we ended up sharing a house during my internship. That summer was eventful, full of ups and downs, but having a friend to navigate a new city made the experience enjoyable. We leveraged each other's networks to tackle the challenges of our internship projects and explore new opportunities. The advice we received ultimately helped us secure return offers.”</i>",
                "<br>",                
                "🔑 His advice to potential mentees:",
                "<i>“Utilize the mentors, fellow mentees, and guest speakers to practice your interview skills as much as possible. Conduct and give mock interviews. Most importantly, build on the connections you make during the program to form long-term, concrete networks.”</i>",
                "<br>",                
                "Break Into Tech isn't just a mentorship program—it's a pathway to lifelong friendships and career success. Are you ready to start your own journey?",
                "<br>",

            ],            
            imageSrc: MenteeTriNguyen,
            imageAlt: "Profile picture of Cecilia Regini, design manager at Lattimore and Friends",
            name: "Tri Nguyen",
            title: "Software Engineer",
            company: "Nvidia",
        },
  ];
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

<section id="testimonial" class="py-16 md:py-24 lg:py-32">
    <div class="px-4 md:px-8 lg:px-16 mx-auto max-w-7xl">
        <div class="container mx-auto px-4">
            <div class="mb-12 text-center">
                <h2 class="mb-4 text-3xl font-bold">Success Story from Break Into Tech</h2>
                <div class="bg-primary mx-auto mb-6 h-1 w-24"></div>
            </div>

            <div class="space-y-12">
                {#each testimonials as testimonial}
                    <div class="flex flex-col lg:flex-row lg:items-start lg:space-x-12">
                        <div class="lg:w-2/3">
                            {#each testimonial.paragraphs as paragraph}
                                <p>
                                    {@html paragraph}
                                </p>
                            {/each}
                        </div>
                        <div class="mt-8 lg:mt-0 lg:w-1/3">
                            <div class="flex items-center space-x-4">
                                <img
                                src={testimonial.imageSrc}
                                loading="lazy"
                                width="193"
                                alt={testimonial.imageAlt}
                                class="w-50 h-50 object-cover rounded-full"
                                />
                            <div>
                                <div class="font-bold text-gray-900">{testimonial.name}</div>
                                    <div class="text-gray-600">
                                        {testimonial.title}<br />{testimonial.company}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</section>
