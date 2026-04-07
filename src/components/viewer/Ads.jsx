import React, { useMemo, useState } from "react";
import {
    Search,
    SlidersHorizontal,
    Image as ImageIcon,
    Video,
    ArrowRight,
    Heart,
    Eye,
    Tag
} from "lucide-react";

const adsData = [
    {
        id: 1,
        title: "iPhone 15 Discount",
        desc: "Get the latest iPhone with exclusive festive discounts and exchange offers.",
        category: "Electronics",
        type: "Image",
        image:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
        brand: "Apple Zone",
        views: 1240,
        badge: "Trending"
    },
    {
        id: 2,
        title: "Fashion Fest Sale",
        desc: "Upgrade your wardrobe with the newest styles and special offers.",
        category: "Fashion",
        type: "Image",
        image:
            "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
        brand: "Urban Style",
        views: 980,
        badge: "Hot Deal"
    },
    {
        id: 3,
        title: "Travel Maldives Promo",
        desc: "Plan your dream trip with luxury stays and discount packages.",
        category: "Travel",
        type: "Video",
        image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        brand: "TravelX",
        views: 860,
        badge: "Featured"
    },
    {
        id: 4,
        title: "Smart TV Weekend Offer",
        desc: "Bring cinema home with top-brand TVs at limited-time prices.",
        category: "Electronics",
        type: "Image",
        image:
            "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1200&q=80",
        brand: "Vision Hub",
        views: 730,
        badge: "Limited"
    },
    {
        id: 5,
        title: "Food Combo Festival",
        desc: "Try delicious combos and save more on your next order.",
        category: "Food",
        type: "Image",
        image:
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
        brand: "FoodBox",
        views: 670,
        badge: "Popular"
    },
    {
        id: 6,
        title: "Beauty Essentials Launch",
        desc: "Shop premium skincare and beauty kits with launch offers.",
        category: "Beauty",
        type: "Video",
        image:
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
        brand: "Glow Studio",
        views: 540,
        badge: "New"
    }
];

const categories = ["All", "Electronics", "Fashion", "Travel", "Food", "Beauty"];
const adTypes = ["All", "Image", "Video"];
const sortOptions = ["Newest", "Most Viewed", "A-Z"];

const Ads = () => {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedType, setSelectedType] = useState("All");
    const [sortBy, setSortBy] = useState("Newest");

    const filteredAds = useMemo(() => {
        let filtered = [...adsData];

        if (search.trim()) {
            filtered = filtered.filter(
                (ad) =>
                    ad.title.toLowerCase().includes(search.toLowerCase()) ||
                    ad.brand.toLowerCase().includes(search.toLowerCase()) ||
                    ad.category.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (selectedCategory !== "All") {
            filtered = filtered.filter((ad) => ad.category === selectedCategory);
        }

        if (selectedType !== "All") {
            filtered = filtered.filter((ad) => ad.type === selectedType);
        }

        if (sortBy === "Most Viewed") {
            filtered.sort((a, b) => b.views - a.views);
        } else if (sortBy === "A-Z") {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        }

        return filtered;
    }, [search, selectedCategory, selectedType, sortBy]);

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
                                {categories.map((item) => (
                                    <option key={item} value={item}>
                                        {item} Category
                                    </option>
                                ))}
                            </select>

                            {/* Type */}
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            >
                                {adTypes.map((item) => (
                                    <option key={item} value={item}>
                                        {item} Type
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-4 flex justify-end">
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
                        </div>
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
                                key={ad.id}
                                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={ad.image}
                                        alt={ad.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />

                                    <div className="absolute top-4 left-4 flex items-center gap-2">
                                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-slate-800">
                                            {ad.badge}
                                        </span>

                                        <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-xs font-medium text-white inline-flex items-center gap-1">
                                            {ad.type === "Image" ? <ImageIcon size={12} /> : <Video size={12} />}
                                            {ad.type}
                                        </span>
                                    </div>

                                    <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-700 hover:bg-white transition">
                                        <Heart size={16} />
                                    </button>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="inline-flex px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium">
                                            {ad.category}
                                        </span>

                                        <div className="flex items-center gap-1 text-sm text-slate-500">
                                            <Eye size={14} />
                                            {ad.views}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-semibold text-slate-900 mt-4">
                                        {ad.title}
                                    </h3>

                                    <p className="text-sm text-slate-500 mt-2">
                                        by <span className="font-medium text-slate-700">{ad.brand}</span>
                                    </p>

                                    <p className="text-slate-600 text-sm leading-6 mt-4">
                                        {ad.desc}
                                    </p>

                                    <div className="mt-6 flex items-center justify-between">
                                        <button className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition">
                                            View Details
                                            <ArrowRight size={16} />
                                        </button>

                                        <button className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition">
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