import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
    Search,
    Star,
    MessageSquare,
    CalendarDays,
    MessageCircleMore,
    BadgeCheck,
    CircleAlert
} from "lucide-react";

function FeedbackPage() {
    // 1. State Declarations
    const [feedbacks, setFeedbacks] = useState([]);
    const [advertisements, setAdvertisements] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedAd, setSelectedAd] = useState("");
    const [sort, setSort] = useState("");
    const [page, setPage] = useState(1);
    const limit = 6;

    // 2. Helper Functions
    const getSentiment = (rating) => {
        if (rating >= 4) {
            return {
                label: "Positive",
                className: "bg-green-50 text-green-600 border border-green-200"
            };
        }
        if (rating === 3) {
            return {
                label: "Neutral",
                className: "bg-yellow-50 text-yellow-600 border border-yellow-200"
            };
        }
        return {
            label: "Negative",
            className: "bg-red-50 text-red-600 border border-red-200"
        };
    };

    // 3. Memoized Stats
    const stats = useMemo(() => {
        const total = feedbacks.length;
        const average =
            total > 0
                ? (
                    feedbacks.reduce((sum, item) => sum + (item.rating || 0), 0) / total
                ).toFixed(1)
                : "0.0";

        const positive = feedbacks.filter((item) => (item.rating || 0) >= 4).length;
        const negative = feedbacks.filter((item) => (item.rating || 0) <= 2).length;

        return { total, average, positive, negative };
    }, [feedbacks]);

    // 4. Data Fetching
    const fetchFeedbacks = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await axios.get("/feedback/feedback", {
                params: {
                    search,
                    advertisement: selectedAd,
                    sort,
                    page,
                    limit
                },
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
            );
            console.log("res", res);
            setFeedbacks(res.data.data || []);
            setTotalPages(res.data.totalPages || 1);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
        }
    };

    const fetchAdvertisements = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await axios.get("/ads/advertisements",
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            setAdvertisements(res.data.data || []);
        } catch (error) {
            console.error("Error fetching ads:", error);
        }
    };

    // 5. Lifecycle Effects
    useEffect(() => {
        fetchFeedbacks();
    }, [search, selectedAd, sort, page]);

    useEffect(() => {
        fetchAdvertisements();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Feedback Dashboard</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Review viewer feedback, ratings, and advertisement responses
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Total Feedback</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</h3>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <MessageCircleMore size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Average Rating</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.average}/5</h3>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Star size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Positive Feedback</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.positive}</h3>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                            <BadgeCheck size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Negative Feedback</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.negative}</h3>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                            <CircleAlert size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6">
                <div className="flex flex-col xl:flex-row gap-4 xl:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by viewer name..."
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>

                    <select
                        className="min-w-[220px] bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={selectedAd}
                        onChange={(e) => {
                            setSelectedAd(e.target.value); // Fixed the function name here
                            setPage(1);
                        }}
                    >
                        <option value="">All Advertisements</option>
                        {advertisements.map((ad) => (
                            <option key={ad._id} value={ad._id}>
                                {ad.ad_title}
                            </option>
                        ))}
                    </select>

                    <select
                        className="min-w-[180px] bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={sort}
                        onChange={(e) => {
                            setSort(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="">Sort by Rating</option>
                        <option value="high">Highest Rating</option>
                        <option value="low">Lowest Rating</option>
                    </select>
                </div>
            </div>

            {/* Feedback Cards */}
            {feedbacks.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {feedbacks.map((feedback) => {
                        const sentiment = getSentiment(feedback.rating || 0);
                        return (
                            <div
                                key={feedback._id}
                                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-12 h-12 rounded-full bg-indigo-100 overflow-hidden flex items-center justify-center font-semibold text-indigo-600 shrink-0">
                                            {feedback.viewer?.profilePic ? (
                                                <img
                                                    src={feedback.viewer.profilePic}
                                                    alt="profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span>
                                                    {feedback.viewer?.fullName?.charAt(0) || "U"}
                                                </span>
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="font-semibold text-slate-800 truncate">
                                                {feedback.viewer?.fullName || "Unknown Viewer"}
                                            </p>
                                            <p className="text-sm text-slate-500 truncate">
                                                {feedback.advertisement?.ad_title || "Unknown Advertisement"}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                                                <CalendarDays size={13} />
                                                <span>
                                                    {feedback.created_at
                                                        ? new Date(feedback.created_at).toLocaleDateString()
                                                        : "No date"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <div className="flex items-center justify-end gap-0.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={15}
                                                    className={
                                                        star <= (feedback.rating || 0)
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "text-slate-300"
                                                    }
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {(feedback.rating || 0).toFixed(1)} / 5
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2 mb-5">
                                    <MessageSquare size={16} className="text-slate-400 mt-0.5 shrink-0" />
                                    <p className="text-sm text-slate-600 leading-6">
                                        {feedback.comments || "No feedback comment provided."}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between gap-3 flex-wrap">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${sentiment.className}`}>
                                        {sentiment.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center">
                    <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                        <MessageSquare size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">No feedback found</h3>
                    <p className="text-sm text-slate-500 mt-1">Try changing your search or filter options.</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        Prev
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => setPage(index + 1)}
                            className={`w-10 h-10 rounded-lg border text-sm font-medium transition ${page === index + 1
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default FeedbackPage;