import React, { useMemo, useState } from "react";
import {
    Search,
    ClipboardList,
    Sparkles,
    Clock3,
    ArrowRight,
    Gift,
    CheckCircle2,
    Filter
} from "lucide-react";

const surveysData = [
    {
        id: 1,
        title: "Favorite Gadget Brand Survey",
        category: "Electronics",
        questions: 8,
        duration: "3 min",
        reward: "50 Points",
        status: "Open",
        image:
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
        desc: "Share your opinion about smartphone and gadget preferences to help improve ad recommendations."
    },
    {
        id: 2,
        title: "Fashion Style Preference Poll",
        category: "Fashion",
        questions: 6,
        duration: "2 min",
        reward: "20 Points",
        status: "Open",
        image:
            "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
        desc: "Tell us which clothing styles, seasonal looks, and shopping trends you prefer most."
    },
    {
        id: 3,
        title: "Food Combo Choice Survey",
        category: "Food",
        questions: 10,
        duration: "4 min",
        reward: "Coupon",
        status: "Open",
        image:
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
        desc: "Help us understand your dining habits, combo preferences, and ordering patterns."
    },
    {
        id: 4,
        title: "Travel Destination Interest Form",
        category: "Travel",
        questions: 7,
        duration: "3 min",
        reward: "75 Points",
        status: "Closed",
        image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        desc: "Share your dream destinations and preferred travel experiences for future offers."
    },
    {
        id: 5,
        title: "Beauty Product Feedback Survey",
        category: "Beauty",
        questions: 9,
        duration: "4 min",
        reward: "Sample Pack",
        status: "Open",
        image:
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
        desc: "Give feedback on beauty products, skincare choices, and personal care preferences."
    },
    {
        id: 6,
        title: "Home Decor Taste Poll",
        category: "Home",
        questions: 5,
        duration: "2 min",
        reward: "30 Points",
        status: "Open",
        image:
            "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80",
        desc: "Tell us your favorite home design styles and decor product interests."
    }
];

const categories = ["All", "Electronics", "Fashion", "Food", "Travel", "Beauty", "Home"];

const Surveys = () => {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredSurveys = useMemo(() => {
        let filtered = [...surveysData];

        if (search.trim()) {
            filtered = filtered.filter(
                (survey) =>
                    survey.title.toLowerCase().includes(search.toLowerCase()) ||
                    survey.category.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (selectedCategory !== "All") {
            filtered = filtered.filter((survey) => survey.category === selectedCategory);
        }

        return filtered;
    }, [search, selectedCategory]);

    return (
        <div className="w-full">
            {/* Hero */}
            <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-14">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-5">
                            <ClipboardList size={16} className="text-emerald-300" />
                            <span className="text-sm font-medium">Interactive viewer surveys</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Participate in Surveys & Share Your Preferences
                        </h1>

                        <p className="mt-5 text-slate-300 text-base md:text-lg leading-8 max-w-2xl">
                            Take short surveys, answer interesting polls, and help improve
                            personalized promotions while earning rewards and offers.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filter */}
            <section className="relative -mt-8 z-10">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                    <div className="bg-white border border-slate-200 shadow-lg rounded-3xl p-5 md:p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <Filter size={18} className="text-emerald-600" />
                            <h2 className="text-lg font-semibold text-slate-900">Find Surveys</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative md:col-span-2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search survey or category..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                                />
                            </div>

                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            >
                                {categories.map((item) => (
                                    <option key={item} value={item}>
                                        {item} Category
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Banner */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
                <div className="rounded-[2rem] bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-8 md:p-10 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>

                    <div className="relative max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 mb-4">
                            <Sparkles size={16} className="text-yellow-300" />
                            <span className="text-sm font-medium">Featured Survey Opportunity</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                            Share your interests and get better offers in return
                        </h2>

                        <p className="mt-4 text-emerald-100 leading-7">
                            Participate in quick surveys to shape future campaigns, promotions,
                            and recommendations built around your choices.
                        </p>

                        <button className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-600 font-semibold hover:bg-slate-100 transition">
                            Start Featured Survey
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Survey Cards */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-emerald-600 text-sm font-medium">Surveys</p>
                        <h2 className="text-3xl font-bold text-slate-900 mt-1">
                            Available Surveys & Polls
                        </h2>
                    </div>

                    <p className="text-sm text-slate-500">
                        Showing{" "}
                        <span className="font-semibold text-slate-800">
                            {filteredSurveys.length}
                        </span>{" "}
                        surveys
                    </p>
                </div>

                {filteredSurveys.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredSurveys.map((survey) => (
                            <div
                                key={survey.id}
                                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300"
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={survey.image}
                                        alt={survey.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />

                                    <div className="absolute top-4 left-4 flex items-center gap-2">
                                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-slate-800">
                                            {survey.category}
                                        </span>

                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${survey.status === "Open"
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : "bg-slate-100 text-slate-500"
                                                }`}
                                        >
                                            {survey.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-slate-900">
                                        {survey.title}
                                    </h3>

                                    <p className="text-slate-600 text-sm leading-6 mt-4">
                                        {survey.desc}
                                    </p>

                                    <div className="grid grid-cols-3 gap-3 mt-5">
                                        <div className="rounded-2xl bg-slate-50 p-3 text-center border border-slate-200">
                                            <p className="text-xs text-slate-500">Questions</p>
                                            <p className="text-sm font-semibold text-slate-900 mt-1">
                                                {survey.questions}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-slate-50 p-3 text-center border border-slate-200">
                                            <p className="text-xs text-slate-500">Duration</p>
                                            <p className="text-sm font-semibold text-slate-900 mt-1 inline-flex items-center gap-1 justify-center">
                                                <Clock3 size={13} />
                                                {survey.duration}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-slate-50 p-3 text-center border border-slate-200">
                                            <p className="text-xs text-slate-500">Reward</p>
                                            <p className="text-sm font-semibold text-slate-900 mt-1 inline-flex items-center gap-1 justify-center">
                                                <Gift size={13} />
                                                {survey.reward}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <button className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition">
                                            View Details
                                            <ArrowRight size={16} />
                                        </button>

                                        <button
                                            disabled={survey.status !== "Open"}
                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${survey.status === "Open"
                                                    ? "bg-slate-900 text-white hover:bg-slate-800"
                                                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                                }`}
                                        >
                                            <CheckCircle2 size={15} />
                                            Participate
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                            <Search size={24} />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mt-5">
                            No surveys found
                        </h3>
                        <p className="text-slate-500 mt-2">
                            Try changing your search text or category filter.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Surveys;