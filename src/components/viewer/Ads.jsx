import React, { useEffect, useMemo, useState } from "react";
import {
    Search,
    SlidersHorizontal,
    Image as ImageIcon,
    Video,
    ArrowRight,
    Heart,
    Eye,
    Tag,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const adTypes = ["All", "Image", "Video"];
const sortOptions = ["Newest", "Most Viewed", "A-Z"];

const Ads = () => {
    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const [sortBy, setSortBy] = useState("Newest");
    const [ads, setAds] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const categoryFromUrl = searchParams.get("category");
    const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || "All");

    const navigate = useNavigate();

    useEffect(() => {
        fetchAds();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl);
        }
    }, [categoryFromUrl]);

    useEffect(() => {
        const recordAdImpressions = async () => {
            try {
                for (const ad of ads) {
                    await axios.post(`/analytics/analytics/impression/${ad._id}`);
                }
            } catch (error) {
                console.log("Error recording ad impressions:", error);
            }
        };

        if (ads?.length > 0) {
            recordAdImpressions();
        }
    }, [ads]);

    const fetchAds = async () => {
        try {
            setLoading(true);
            // Calling your backend API
            const response = await axios.get('/ads/active-ads');

            // If you only want the first 3 on the frontend:
            const data = response.data.data || response.data; // Adjust based on your API structure
            setAds(data);
            setLoading(false);
            console.log("data", data)
        } catch (err) {
            console.error("Error fetching ads:", err);
            setError("Failed to load advertisements.");
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            setLoading(true);
            // Calling your backend API
            const response = await axios.get('/category/active-category');

            // If you only want the first 3 on the frontend:
            const data = response.data.data || response.data; // Adjust based on your API structure
            setCategories(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching categories:", err);
            setError("Failed to load categories.");
            setLoading(false);
        }
    }

    const filteredAds = useMemo(() => {
        console.log("selectedCategory :", selectedCategory)
        let filtered = [...ads];

        if (search.trim()) {
            filtered = filtered.filter(
                (ad) =>
                    ad.ad_title.toLowerCase().includes(search.toLowerCase())
                //ad.brand.toLowerCase().includes(search.toLowerCase()) ||
                //ad.category.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (selectedCategory !== "All") {
            filtered = filtered.filter((ad) => ad.category_id._id === selectedCategory);
        }

        // if (selectedType !== "All") {
        //     filtered = filtered.filter((ad) => ad.ad_type === selectedType);
        // }

        // if (sortBy === "Most Viewed") {
        //     filtered.sort((a, b) => b.views - a.views);
        // } else if (sortBy === "A-Z") {
        //     filtered.sort((a, b) => a.title.localeCompare(b.title));
        // }
        console.log("filtered : ", filtered)
        return filtered;
    }, [ads, search, selectedCategory]);
    //[search, selectedCategory, selectedType, sortBy]

    const handleViewDetails = async (ad) => {
        try {
            await axios.post(`/analytics/analytics/click/${ad._id}`);
            navigate(`/ads/${ad._id}`);
        } catch (error) {
            console.log("Error recording view details click:", error);
        }
    };

    const handleExplore = async (ad) => {
        try {
            await axios.post(`/analytics/analytics/click/${ad._id}`);

            if (ad.redirect_url) {
                window.open(ad.redirect_url, "_blank");
            } else {
                navigate(`/ads/${ad._id}`);
            }
        } catch (error) {
            console.log("Error recording explore click:", error);
        }
    };

    if (loading) return <p>Loading ads...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="w-full">
            {/* Hero */}
            <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-14">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-5">
                            <Tag size={16} className="text-indigo-300" />
                            <span className="text-sm font-medium">Explore live advertisements</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Discover Trending Ads, Promotions & Viewer Picks
                        </h1>

                        <p className="mt-5 text-slate-300 text-base md:text-lg leading-8 max-w-2xl">
                            Browse category-based advertisements, watch promo videos, and explore
                            top offers from brands tailored to your interests.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filter Section */}
            <section className="relative -mt-8 z-10">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                    <div className="bg-white border border-slate-200 shadow-lg rounded-3xl p-5 md:p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <SlidersHorizontal size={18} className="text-indigo-600" />
                            <h2 className="text-lg font-semibold text-slate-900">Filter Advertisements</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="relative xl:col-span-2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search ads, category, or brand..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                />
                            </div>

                            {/* Category */}
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            >
                                <option value="All">All</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            {/* Type */}
                            {/* <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            >
                                {adTypes.map((item) => (
                                    <option key={item} value={item}>
                                        {item} Type
                                    </option>
                                ))}
                            </select> */}
                        </div>

                        {/* <div className="mt-4 flex justify-end">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="min-w-[180px] px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            >
                                {sortOptions.map((item) => (
                                    <option key={item} value={item}>
                                        Sort: {item}
                                    </option>
                                ))}
                            </select>
                        </div> */}
                    </div>
                </div>
            </section>

            {/* Ads Grid */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-indigo-600 text-sm font-medium">Advertisements</p>
                        <h2 className="text-3xl font-bold text-slate-900 mt-1">
                            Browse Active Promotions
                        </h2>
                    </div>

                    <p className="text-sm text-slate-500">
                        Showing <span className="font-semibold text-slate-800">{filteredAds.length}</span> ads
                    </p>
                </div>

                {filteredAds.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredAds.map((ad) => (
                            <div
                                key={ad._id}
                                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={ad.content}
                                        alt={ad.ad_title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />

                                    <div className="absolute top-4 left-4 flex items-center gap-2">
                                        {/* <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-slate-800">
                                            {ad.badge}
                                        </span> */}

                                        <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-xs font-medium text-white inline-flex items-center gap-1">
                                            {ad.ad_type === "Image" ? <ImageIcon size={12} /> : <Video size={12} />}
                                            {ad.ad_type}
                                        </span>
                                    </div>

                                    <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-700 hover:bg-white transition">
                                        <Heart size={16} />
                                    </button>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="inline-flex px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium">
                                            {ad.category_id.name}
                                        </span>

                                        {/* <div className="flex items-center gap-1 text-sm text-slate-500">
                                            <Eye size={14} />
                                            {ad.views}
                                        </div> */}
                                    </div>

                                    <h3 className="text-xl font-semibold text-slate-900 mt-4">
                                        {ad.ad_title}
                                    </h3>

                                    {/* <p className="text-sm text-slate-500 mt-2">
                                        by <span className="font-medium text-slate-700">{ad.brand}</span>
                                    </p> */}

                                    <p className="text-slate-600 text-sm leading-6 mt-4">
                                        {ad.description ? ad.description : "No Description"}
                                    </p>

                                    <div className="mt-6 flex items-center justify-between">
                                        <button
                                            onClick={() => handleViewDetails(ad)}
                                            className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => handleExplore(ad)}
                                            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition"
                                        >
                                            Explore
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
                            No advertisements found
                        </h3>
                        <p className="text-slate-500 mt-2">
                            Try changing your search text or filters to explore more ads.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Ads;