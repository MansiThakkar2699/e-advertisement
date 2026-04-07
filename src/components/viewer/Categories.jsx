import React, { useMemo, useState } from "react";
import {
    Search,
    ArrowRight,
    Layers3,
    Sparkles,
    ShoppingBag,
    Smartphone,
    UtensilsCrossed,
    Plane,
    House,
    HeartPulse
} from "lucide-react";

const categoriesData = [
    {
        id: 1,
        name: "Electronics",
        icon: <Smartphone size={22} />,
        adsCount: 42,
        image:
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
        desc: "Discover smart gadgets, mobiles, laptops, TVs, and exciting tech offers."
    },
    {
        id: 2,
        name: "Fashion",
        icon: <ShoppingBag size={22} />,
        adsCount: 35,
        image:
            "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
        desc: "Explore seasonal fashion trends, clothing deals, and exclusive style collections."
    },
    {
        id: 3,
        name: "Food",
        icon: <UtensilsCrossed size={22} />,
        adsCount: 28,
        image:
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
        desc: "Check out delicious promotions, restaurant deals, and meal combo discounts."
    },
    {
        id: 4,
        name: "Travel",
        icon: <Plane size={22} />,
        adsCount: 19,
        image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        desc: "Find holiday packages, travel discounts, hotel stays, and adventure offers."
    },
    {
        id: 5,
        name: "Real Estate",
        icon: <House size={22} />,
        adsCount: 14,
        image:
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
        desc: "Browse property promotions, housing opportunities, and real-estate campaigns."
    },
    {
        id: 6,
        name: "Health & Beauty",
        icon: <HeartPulse size={22} />,
        adsCount: 21,
        image:
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
        desc: "Explore skincare launches, wellness products, beauty deals, and personal care ads."
    }
];

const Categories = () => {
    const [search, setSearch] = useState("");

    const filteredCategories = useMemo(() => {
        if (!search.trim()) return categoriesData;

        return categoriesData.filter((category) =>
            category.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    return (
        <div className="w-full">
            {/* Hero */}
            <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-violet-950 text-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-14">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-5">
                            <Layers3 size={16} className="text-indigo-300" />
                            <span className="text-sm font-medium">Explore ad categories</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Browse Advertisements by Category
                        </h1>

                        <p className="mt-5 text-slate-300 text-base md:text-lg leading-8 max-w-2xl">
                            Find ads and promotions from categories that match your interests,
                            from electronics and fashion to food, travel, and more.
                        </p>
                    </div>
                </div>
            </section>

            {/* Search */}
            <section className="relative -mt-8 z-10">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                    <div className="bg-white border border-slate-200 shadow-lg rounded-3xl p-5 md:p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Search size={18} className="text-indigo-600" />
                            <h2 className="text-lg font-semibold text-slate-900">
                                Search Categories
                            </h2>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search category..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Strip */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
                <div className="rounded-[2rem] bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-8 md:p-10 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>

                    <div className="relative max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 mb-4">
                            <Sparkles size={16} className="text-yellow-300" />
                            <span className="text-sm font-medium">Featured Category Collection</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                            Explore the most popular categories with trending campaigns
                        </h2>

                        <p className="mt-4 text-indigo-100 leading-7">
                            Stay updated with exciting promotions across multiple categories and
                            discover new brands, products, and offers every day.
                        </p>

                        <button className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-slate-100 transition">
                            Explore Top Categories
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-indigo-600 text-sm font-medium">Categories</p>
                        <h2 className="text-3xl font-bold text-slate-900 mt-1">
                            Discover by Interest
                        </h2>
                    </div>

                    <p className="text-sm text-slate-500">
                        Showing{" "}
                        <span className="font-semibold text-slate-800">
                            {filteredCategories.length}
                        </span>{" "}
                        categories
                    </p>
                </div>

                {filteredCategories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredCategories.map((category) => (
                            <div
                                key={category.id}
                                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300"
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />

                                    <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/90 backdrop-blur-sm text-slate-800 text-sm font-medium">
                                        <span className="text-indigo-600">{category.icon}</span>
                                        {category.name}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center justify-between gap-3">
                                        <h3 className="text-2xl font-semibold text-slate-900">
                                            {category.name}
                                        </h3>

                                        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold">
                                            {category.adsCount} Ads
                                        </span>
                                    </div>

                                    <p className="text-slate-600 text-sm leading-6 mt-4">
                                        {category.desc}
                                    </p>

                                    <button className="mt-6 inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition">
                                        View Category
                                        <ArrowRight size={16} />
                                    </button>
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
                            No categories found
                        </h3>
                        <p className="text-slate-500 mt-2">
                            Try another search term to explore available categories.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Categories;