import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    Search,
    ClipboardList,
    Sparkles,
    Clock3,
    ArrowRight,
    CheckCircle2,
    Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Surveys = () => {
    const [surveys, setSurveys] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const fetchSurveys = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/survey/surveys");
            setSurveys(response.data.data || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch surveys");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSurveys();
    }, []);

    const categories = useMemo(() => {
        const unique = [
            "All",
            ...new Set(
                surveys
                    .map((item) => item.category_id?.name)
                    .filter(Boolean)
            )
        ];
        return unique;
    }, [surveys]);

    const filteredSurveys = useMemo(() => {
        let filtered = [...surveys];

        if (search.trim()) {
            filtered = filtered.filter(
                (survey) =>
                    survey.title?.toLowerCase().includes(search.toLowerCase()) ||
                    survey.description?.toLowerCase().includes(search.toLowerCase()) ||
                    survey.category_id?.name?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (selectedCategory !== "All") {
            filtered = filtered.filter(
                (survey) => survey.category_id?.name === selectedCategory
            );
        }

        return filtered;
    }, [surveys, search, selectedCategory]);

    const handleParticipate = (survey) => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token || role !== "viewer") {
            navigate("/login");
            return;
        }

        navigate(`/surveys/${survey._id}`);
    };

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
                            Answer quick surveys to improve recommendations, offers, and ad experiences.
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
                            Share your interests and improve your ad experience
                        </h2>

                        <p className="mt-4 text-emerald-100 leading-7">
                            Your responses help us show more relevant offers, ads, and promotions.
                        </p>
                    </div>
                </div>
            </section>

            {/* Survey cards */}
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
                                key={survey._id}
                                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300"
                            >
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                        {survey.category_id?.name && (
                                            <span className="px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-xs font-semibold text-slate-800">
                                                {survey.category_id.name}
                                            </span>
                                        )}

                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${survey.status === "active"
                                                ? "bg-emerald-50 text-emerald-600"
                                                : "bg-slate-100 text-slate-500"
                                                }`}
                                        >
                                            {survey.status}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-semibold text-slate-900">
                                        {survey.title}
                                    </h3>

                                    <p className="text-slate-600 text-sm leading-6 mt-4">
                                        {survey.description || "No description available"}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 mt-5">
                                        <div className="rounded-2xl bg-slate-50 p-3 text-center border border-slate-200">
                                            <p className="text-xs text-slate-500">Questions</p>
                                            <p className="text-sm font-semibold text-slate-900 mt-1">
                                                {survey.questions?.length || 0}
                                            </p>
                                        </div>

                                        <div className="rounded-2xl bg-slate-50 p-3 text-center border border-slate-200">
                                            <p className="text-xs text-slate-500">Campaign</p>
                                            <p className="text-sm font-semibold text-slate-900 mt-1 line-clamp-1">
                                                {survey.campaign_id?.name || "General"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <button
                                            onClick={() => handleParticipate(survey)}
                                            className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition"
                                        >
                                            View Details
                                            <ArrowRight size={16} />
                                        </button>

                                        <button
                                            disabled={survey.status !== "active"}
                                            onClick={() => handleParticipate(survey)}
                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${survey.status === "active"
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

            {loading && (
                <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2 rounded-xl shadow-lg text-sm">
                    Loading surveys...
                </div>
            )}
        </div>
    );
};

export default Surveys;