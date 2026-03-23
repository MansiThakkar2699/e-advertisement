import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";

function FeedbackPage() {

    const [feedbacks, setFeedbacks] = useState([]);
    const [advertisements, setAdvertisements] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const [search, setSearch] = useState("");
    const [selectedAd, setSelectedAd] = useState("");
    const [sort, setSort] = useState("");

    const [page, setPage] = useState(1);
    const limit = 6;

    const fetchFeedbacks = async () => {
        try {

            const res = await axios.get("/feedback/feedback", {
                params: {
                    search,
                    advertisement: selectedAd,
                    sort,
                    page,
                    limit
                }
            });

            console.log(res)

            setFeedbacks(res.data.data);
            setTotalPages(res.data.totalPages);

        } catch (error) {
            console.log(error);
        }
    };

    const fetchAdvertisements = async () => {
        const res = await axios.get("/ads/advertisements");
        setAdvertisements(res.data.data);
    };

    useEffect(() => {
        fetchFeedbacks();
    }, [search, selectedAd, sort, page]);

    useEffect(() => {
        fetchAdvertisements();
    }, []);

    return (
        <div className="p-8 bg-gray-50 min-h-screen">

            {/* Page Title */}
            <h1 className="text-2xl font-bold text-slate-900 mb-6">
                Feedback Dashboard
            </h1>

            <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search viewer..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }
                        }
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto"
                    value={selectedAd}
                    onChange={(e) => {
                        setAdvertisement(e.target.value);
                        setPage(1);
                    }}>
                    <select className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="">All Advertisements</option>
                        {advertisements.map((ad) => (
                            <option key={ad._id} value={ad._id}>
                                {ad.ad_title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2 w-full md:w-auto"
                    value={sort}
                    onChange={(e) => {
                        setSort(e.target.value);
                        setPage(1);
                    }}>
                    <select className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="">Sort by Rating</option>
                        <option value="high">Highest Rating</option>
                        <option value="low">Lowest Rating</option>
                    </select>
                </div>
            </div>

            {/* Feedback Cards */}
            <div className="grid md:grid-cols-2 gap-6">

                {feedbacks.map((feedback) => (

                    <div
                        key={feedback._id}
                        className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition"
                    >

                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">

                            <div className="flex items-center gap-3">

                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-600">
                                    {feedback.viewer?.profilePic ? (
                                        <img
                                            src={feedback.viewer.profilePic}
                                            alt="profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span>
                                            {feedback.viewer?.fullName?.charAt(0)}
                                        </span>
                                    )}
                                </div>

                                <div>

                                    <p className="font-semibold text-gray-800">
                                        {feedback.viewer?.fullName}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {feedback.advertisement?.ad_title}
                                    </p>

                                </div>

                            </div>


                            {/* Rating */}
                            <div className="flex text-yellow-400 text-lg">
                                {"★".repeat(feedback.rating)}
                                {"☆".repeat(5 - feedback.rating)}
                            </div>

                        </div>


                        {/* Comment */}
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {feedback.comments}
                        </p>

                    </div>

                ))}

            </div>


            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-10">

                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 border rounded-md hover:bg-gray-100"
                >
                    Prev
                </button>


                {[...Array(totalPages)].map((_, index) => {

                    const pageNumber = index + 1;

                    return (
                        <button
                            key={pageNumber}
                            onClick={() => setPage(pageNumber)}
                            className={`px-3 py-1 rounded-md border ${page === pageNumber
                                ? "bg-indigo-600 text-white border-indigo-600"
                                : "hover:bg-gray-100"
                                }`}
                        >
                            {pageNumber}
                        </button>
                    );

                })}


                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1 border rounded-md hover:bg-gray-100"
                >
                    Next
                </button>

            </div>

        </div>
    );
}

export default FeedbackPage;