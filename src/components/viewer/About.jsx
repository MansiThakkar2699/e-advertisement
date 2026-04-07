import React from "react";
import {
    Megaphone,
    Target,
    Eye,
    Lightbulb,
    ShieldCheck,
    Users,
    Sparkles,
    ArrowRight
} from "lucide-react";

const features = [
    {
        icon: <Target size={22} />,
        title: "Relevant Promotions",
        desc: "We help viewers discover advertisements and offers that match their interests and preferences."
    },
    {
        icon: <Eye size={22} />,
        title: "Better Ad Experience",
        desc: "Our platform focuses on clean, engaging, and less intrusive ad discovery for a smoother viewing experience."
    },
    {
        icon: <Lightbulb size={22} />,
        title: "Interactive Engagement",
        desc: "Viewers can participate in surveys, explore offers, and interact with content in meaningful ways."
    },
    {
        icon: <ShieldCheck size={22} />,
        title: "Trust & Transparency",
        desc: "We aim to keep the platform organized, secure, and useful for both advertisers and viewers."
    }
];

const stats = [
    { value: "10K+", label: "Active Viewers" },
    { value: "250+", label: "Campaigns" },
    { value: "40+", label: "Categories" },
    { value: "120+", label: "Surveys" }
];

const About = () => {
    return (
        <div className="w-full">
            {/* Hero */}
            <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-5">
                            <Sparkles size={16} className="text-indigo-300" />
                            <span className="text-sm font-medium">About our advertising platform</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Building Smarter Connections Between Brands and Viewers
                        </h1>

                        <p className="mt-5 text-slate-300 text-base md:text-lg leading-8 max-w-2xl">
                            Our platform helps viewers explore relevant promotions, exciting offers,
                            and interactive campaigns while giving brands better ways to engage audiences.
                        </p>
                    </div>
                </div>
            </section>

            {/* Intro */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                    <div>
                        <p className="text-indigo-600 text-sm font-medium">Who We Are</p>
                        <h2 className="text-3xl font-bold text-slate-900 mt-2">
                            A modern platform for digital advertisement discovery
                        </h2>
                        <p className="text-slate-600 leading-8 mt-5">
                            We created this platform to make advertisements more engaging, better
                            targeted, and more useful for people who browse them. Instead of random
                            promotions, viewers can discover category-based ads, exclusive offers,
                            and interactive survey experiences in one place.
                        </p>
                        <p className="text-slate-600 leading-8 mt-4">
                            Our goal is to improve engagement, trust, and relevance so viewers enjoy
                            a cleaner promotional experience and advertisers can connect with the
                            right audience more effectively.
                        </p>
                    </div>

                    <div className="rounded-[2rem] overflow-hidden border border-slate-200 shadow-lg">
                        <img
                            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80"
                            alt="about"
                            className="w-full h-[420px] object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-white border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-14">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {stats.map((item, index) => (
                            <div
                                key={index}
                                className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center"
                            >
                                <h3 className="text-3xl font-bold text-slate-900">{item.value}</h3>
                                <p className="text-slate-500 text-sm mt-2">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-3xl bg-indigo-50 border border-indigo-100 p-8">
                        <div className="w-14 h-14 rounded-2xl bg-white text-indigo-600 flex items-center justify-center shadow-sm">
                            <Megaphone size={22} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mt-6">Our Mission</h3>
                        <p className="text-slate-600 leading-7 mt-4">
                            To create a platform where digital advertisements are more relevant,
                            engaging, and valuable for viewers while enabling advertisers to
                            achieve better results through smarter targeting and interaction.
                        </p>
                    </div>

                    <div className="rounded-3xl bg-emerald-50 border border-emerald-100 p-8">
                        <div className="w-14 h-14 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shadow-sm">
                            <Users size={22} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mt-6">Our Vision</h3>
                        <p className="text-slate-600 leading-7 mt-4">
                            To shape the future of online promotion through personalization,
                            interactivity, and meaningful viewer engagement across categories,
                            offers, surveys, and campaign experiences.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-slate-50 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
                    <div className="text-center mb-10">
                        <p className="text-indigo-600 text-sm font-medium">Why Choose Us</p>
                        <h2 className="text-3xl font-bold text-slate-900 mt-2">
                            What makes our platform better
                        </h2>
                        <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
                            We combine relevance, interaction, trust, and design to deliver a
                            more modern ad viewing experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {features.map((item, index) => (
                            <div
                                key={index}
                                className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 mt-5">
                                    {item.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-6 mt-3">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
                <div className="rounded-[2rem] bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-10 md:p-14 shadow-xl">
                    <div className="max-w-3xl">
                        <p className="text-indigo-100 text-sm font-medium">Explore More</p>
                        <h2 className="text-3xl md:text-4xl font-bold mt-3 leading-tight">
                            Discover ads, categories, offers, and surveys built around your interests
                        </h2>
                        <p className="mt-4 text-indigo-100 leading-7">
                            Stay connected with smart promotions and interactive content in a
                            modern browsing experience.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <button className="px-6 py-3 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-slate-100 transition">
                                Explore Ads
                            </button>

                            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition font-semibold">
                                Contact Us
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;