import React from "react";
import {
    ArrowRight,
    BadgePercent,
    Layers3,
    Megaphone,
    Sparkles,
    Star,
    ClipboardList,
    Gift,
    ShieldCheck
} from "lucide-react";

const featuredAds = [
    {
        id: 1,
        title: "iPhone 15 Pro Offer",
        desc: "Get exciting exchange bonuses and limited-time discounts.",
        image:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80",
        tag: "Electronics"
    },
    {
        id: 2,
        title: "Fashion Mega Sale",
        desc: "Discover trendy outfits with up to 60% off this weekend.",
        image:
            "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1000&q=80",
        tag: "Fashion"
    },
    {
        id: 3,
        title: "Travel to Maldives",
        desc: "Book now and unlock special holiday packages.",
        image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
        tag: "Travel"
    }
];

const categories = [
    {
        name: "Electronics",
        icon: "📱",
        desc: "Smart gadgets and latest tech deals"
    },
    {
        name: "Fashion",
        icon: "👗",
        desc: "Trending outfits and style collections"
    },
    {
        name: "Food",
        icon: "🍔",
        desc: "Yummy offers from top food brands"
    },
    {
        name: "Travel",
        icon: "✈️",
        desc: "Holiday packages and destination offers"
    }
];

const offers = [
    {
        title: "Weekend Deal",
        discount: "Up to 50% Off",
        color: "from-pink-500 to-rose-500"
    },
    {
        title: "Flash Sale",
        discount: "Buy 1 Get 1 Free",
        color: "from-indigo-500 to-violet-500"
    },
    {
        title: "Exclusive Promo",
        discount: "Extra 20% Cashback",
        color: "from-emerald-500 to-teal-500"
    }
];

const surveys = [
    {
        title: "Tell us your favorite gadget brand",
        desc: "Join our quick survey and help improve future ad recommendations."
    },
    {
        title: "What kind of offers do you like most?",
        desc: "Discounts, cashback, bundles, or exclusive launches — share your preference."
    }
];

const Home = () => {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80"
                        alt="hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/60"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-24 md:py-32">
                    <div className="max-w-3xl text-white">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
                            <Sparkles size={16} className="text-yellow-300" />
                            <span className="text-sm font-medium">
                                Smarter ads. Better offers. More engagement.
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                            Discover Personalized Ads, Deals & Interactive Experiences
                        </h1>

                        <p className="mt-6 text-lg text-slate-200 leading-8 max-w-2xl">
                            Explore trending campaigns, exclusive promotions, category-based
                            offers, and engaging surveys designed to match your interests.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition shadow-lg font-medium">
                                Explore Ads
                                <ArrowRight size={18} />
                            </button>

                            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition font-medium">
                                View Offers
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Strip */}
            <section className="relative -mt-10 z-10">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Active Promotions", value: "250+" },
                            { label: "Top Categories", value: "40+" },
                            { label: "Happy Viewers", value: "10K+" },
                            { label: "Interactive Surveys", value: "120+" }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-md border border-slate-200 p-5 text-center"
                            >
                                <h3 className="text-2xl font-bold text-slate-900">{item.value}</h3>
                                <p className="text-sm text-slate-500 mt-1">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Ads */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-indigo-600 font-medium text-sm">Featured Ads</p>
                        <h2 className="text-3xl font-bold text-slate-900 mt-1">
                            Trending Promotions
                        </h2>
                    </div>
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition">
                        View All
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {featuredAds.map((ad) => (
                        <div
                            key={ad.id}
                            className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300"
                        >
                            <div className="h-60 overflow-hidden">
                                <img
                                    src={ad.image}
                                    alt={ad.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                />
                            </div>

                            <div className="p-6">
                                <span className="inline-flex px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium">
                                    {ad.tag}
                                </span>

                                <h3 className="text-xl font-semibold text-slate-900 mt-4">
                                    {ad.title}
                                </h3>

                                <p className="text-slate-500 text-sm leading-6 mt-3">
                                    {ad.desc}
                                </p>

                                <button className="mt-5 inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition">
                                    Explore Now
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories */}
            <section className="bg-white border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
                    <div className="text-center mb-10">
                        <p className="text-indigo-600 font-medium text-sm">Categories</p>
                        <h2 className="text-3xl font-bold text-slate-900 mt-1">
                            Browse by Interest
                        </h2>
                        <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
                            Discover advertisements and promotions from categories you love most.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                className="rounded-3xl border border-slate-200 bg-slate-50 p-6 hover:bg-white hover:shadow-md transition"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl">
                                    {category.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 mt-5">
                                    {category.name}
                                </h3>
                                <p className="text-slate-500 text-sm mt-2 leading-6">
                                    {category.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Top Offers */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
                <div className="flex items-center gap-3 mb-8">
                    <BadgePercent className="text-rose-500" />
                    <h2 className="text-3xl font-bold text-slate-900">Top Offers</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {offers.map((offer, index) => (
                        <div
                            key={index}
                            className={`rounded-3xl bg-gradient-to-r ${offer.color} p-6 text-white shadow-md`}
                        >
                            <p className="text-sm uppercase tracking-wide text-white/80">
                                {offer.title}
                            </p>
                            <h3 className="text-2xl font-bold mt-3">{offer.discount}</h3>
                            <button className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/20 transition">
                                Grab Offer
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Surveys */}
            <section className="bg-slate-950 text-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
                    <div className="flex items-center gap-3 mb-8">
                        <ClipboardList className="text-indigo-400" />
                        <h2 className="text-3xl font-bold">Interactive Surveys</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {surveys.map((survey, index) => (
                            <div
                                key={index}
                                className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-6"
                            >
                                <h3 className="text-xl font-semibold">{survey.title}</h3>
                                <p className="text-slate-300 text-sm mt-3 leading-6">
                                    {survey.desc}
                                </p>
                                <button className="mt-5 inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-200 font-medium transition">
                                    Participate Now
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
                <div className="text-center mb-10">
                    <p className="text-indigo-600 font-medium text-sm">Why Choose Us</p>
                    <h2 className="text-3xl font-bold text-slate-900 mt-1">
                        Better Viewing Experience
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: <Layers3 size={22} />,
                            title: "Relevant Promotions",
                            desc: "See ads and offers based on your interests and categories."
                        },
                        {
                            icon: <Gift size={22} />,
                            title: "Exclusive Deals",
                            desc: "Unlock limited-time discounts and exciting promotional rewards."
                        },
                        {
                            icon: <ShieldCheck size={22} />,
                            title: "Trusted Experience",
                            desc: "Enjoy a secure, organized, and user-friendly platform experience."
                        }
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-md transition"
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
            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-16">
                <div className="rounded-[2rem] bg-gradient-to-r from-indigo-600 to-violet-600 p-10 md:p-14 text-white shadow-xl">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 mb-5">
                            <Star size={16} className="text-yellow-300" />
                            <span className="text-sm font-medium">Stay updated with trending ads</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                            Ready to explore more exciting campaigns and offers?
                        </h2>

                        <p className="mt-4 text-indigo-100 text-base leading-7">
                            Browse active promotions, discover deals from top brands, and engage with content tailored to your preferences.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <button className="px-6 py-3 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-slate-100 transition">
                                Browse Ads
                            </button>
                            <button className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition font-semibold">
                                Explore Categories
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;