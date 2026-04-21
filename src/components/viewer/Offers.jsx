import React, { useEffect, useMemo, useState } from "react";
import {
    Search,
    BadgePercent,
    Gift,
    Clock3,
    ArrowRight,
    TicketPercent,
    Sparkles
} from "lucide-react";
import axios from "axios";
import { formatDistanceToNowStrict, isAfter } from 'date-fns';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const offerTypes = ["All", "Discount", "Combo", "Cashback", "Gift"];

const Offers = () => {
    const [search, setSearch] = useState("");
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [selectedType, setSelectedType] = useState("All");
    const gridRef = React.useRef(null);
    const navigate = useNavigate();

    const scrollToOffers = () => {
        gridRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchAds();
    }, []);

    useEffect(() => {
        const recordOfferImpressions = async () => {
            try {
                for (const offer of ads) {
                    await axios.post(`/analytics/analytics/impression/${offer._id}`);
                }
            } catch (error) {
                console.log("Error recording offer impressions:", error);
            }
        };

        if (ads?.length > 0) {
            recordOfferImpressions();
        }
    }, [ads]);

    const filteredOffers = useMemo(() => {
        let filtered = [...ads];

        if (search.trim()) {
            filtered = filtered.filter(
                (offer) =>
                    offer.ad_title.toLowerCase().includes(search.toLowerCase())
                // offer.brand.toLowerCase().includes(search.toLowerCase()) ||
                // offer.type.toLowerCase().includes(search.toLowerCase())
            );
        }

        // if (selectedType !== "All") {
        //     filtered = filtered.filter((offer) => offer.type === selectedType);
        // }

        return filtered;
    }, [search, ads]);

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

    function formatExpiry(mongodbDate) {
        const expiryDate = new Date(mongodbDate);
        const now = new Date();

        if (!isAfter(expiryDate, now)) {
            return "Expired";
        }

        // formatDistanceToNowStrict returns "2 days"
        const distance = formatDistanceToNowStrict(expiryDate, { unit: 'day' });

        return `Ends in ${distance}`;
    }

    const handleViewOffer = async (offer) => {
        try {
            await axios.post(`/analytics/analytics/click/${offer._id}`);
            navigate(`/ads/${offer._id}`);
        } catch (error) {
            console.log("Error recording view offer click:", error);
        }
    };

    const handleClaim = async (offer) => {
        try {
            await axios.post(`/analytics/analytics/conversion/${offer._id}`);
            toast.success("Offer claimed successfully");

            if (offer.redirect_url) {
                window.open(offer.redirect_url, "_blank");
            }
        } catch (error) {
            console.log("Error recording claim conversion:", error);
        }
    };

    if (loading) return <p>Loading ads...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="w-full">
            {/* Hero */}
            <section className="bg-gradient-to-r from-slate-950 via-indigo-950 to-violet-950 text-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-14">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-5">
                            <BadgePercent size={16} className="text-rose-300" />
                            <span className="text-sm font-medium">Special promotional offers</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Discover Exclusive Offers & Limited-Time Deals
                        </h1>

                        <p className="mt-5 text-slate-300 text-base md:text-lg leading-8 max-w-2xl">
                            Explore discounts, cashback rewards, combo deals, and promotional offers
                            from your favorite brands and trending campaigns.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filter */}
            <section className="relative -mt-8 z-10">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                    <div className="bg-white border border-slate-200 shadow-lg rounded-3xl p-5 md:p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <Search size={18} className="text-indigo-600" />
                            <h2 className="text-lg font-semibold text-slate-900">Find Offers</h2>
                        </div>

                        <div className="relative grid grid-cols-1 gap-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search offers..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            />
                            {/* <div className="relative md:col-span-2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search offers, brands, or type..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                />
                            </div> */}

                            {/* <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            >
                                {offerTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type} Offers
                                    </option>
                                ))}
                            </select> */}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Banner */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
                <div className="rounded-[2rem] bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 text-white p-8 md:p-10 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>

                    <div className="relative max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 mb-4">
                            <Sparkles size={16} className="text-yellow-300" />
                            <span className="text-sm font-medium">Featured Offer</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                            Unlock amazing festive deals before they expire
                        </h2>

                        <p className="mt-4 text-rose-100 leading-7">
                            Enjoy exclusive discounts, cashback, and surprise gifts from premium
                            brands through our latest campaigns and promotions.
                        </p>

                        <button onClick={scrollToOffers}
                            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-rose-600 font-semibold hover:bg-slate-100 transition">
                            Explore Featured Deals
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Offers Grid */}
            <section ref={gridRef} className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-indigo-600 text-sm font-medium">Offers</p>
                        <h2 className="text-3xl font-bold text-slate-900 mt-1">
                            Available Promotions
                        </h2>
                    </div>

                    <p className="text-sm text-slate-500">
                        Showing{" "}
                        <span className="font-semibold text-slate-800">
                            {filteredOffers.length}
                        </span>{" "}
                        offers
                    </p>
                </div>

                {filteredOffers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredOffers.map((offer) => (
                            <div
                                key={offer._id}
                                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300"
                            >
                                <div className="relative h-60 overflow-hidden">
                                    <img
                                        src={offer.content}
                                        alt={offer.ad_title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />

                                    {/* <div className="absolute top-4 left-4 flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-slate-800">
                                            <TicketPercent size={12} className="text-rose-500" />
                                            {offer.type}
                                        </span>
                                    </div> */}
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="inline-flex px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-medium">
                                            {offer.offer.value}
                                        </span>

                                        <div className="flex items-center gap-1 text-sm text-slate-500">
                                            <Clock3 size={14} />
                                            {formatExpiry(offer.offer.expiry)}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-semibold text-slate-900 mt-4">
                                        {offer.ad_title}
                                    </h3>

                                    <p className="text-sm text-slate-500 mt-2">
                                        by <span className="font-medium text-slate-700">{offer.campaign_id.advertiser_id.fullName}</span>
                                    </p>

                                    <p className="text-slate-600 text-sm leading-6 mt-4">
                                        {offer.description ? offer.description : "No Description"}
                                    </p>

                                    <div className="mt-6 flex items-center justify-between">

                                        <button
                                            onClick={() => handleViewOffer(offer)}
                                            className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition"
                                        >
                                            View Offer
                                        </button>
                                        <button
                                            onClick={() => handleClaim(offer)}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition"
                                        >
                                            <Gift size={15} />
                                            Claim
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
                            No offers found
                        </h3>
                        <p className="text-slate-500 mt-2">
                            Try changing your search text or selected offer type.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Offers;