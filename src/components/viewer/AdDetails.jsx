import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    Tag,
    Eye,
    CalendarDays,
    Building2,
    Layers3,
    BadgePercent,
    PlayCircle,
    Loader2
} from "lucide-react";
import axios from "axios";
import { format, parseISO } from 'date-fns';

const AdDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // States for data
    const [ad, setAd] = useState(null);
    const [relatedAds, setRelatedAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdDetails = async () => {
            try {
                setLoading(true);
                // 1. Fetch the specific advertisement
                const response = await axios.get(`/ads/advertisement/${id}`);
                const adData = response.data.data;
                console.log(adData);
                setAd(adData);

                // 2. Fetch related ads (based on category ID)
                if (adData?.category_id?._id || adData?.category_id) {
                    const catId = adData.category_id._id || adData.category_id;
                    const relatedRes = await axios.get(`/ads/active-ads?category=${catId}`);
                    // Filter out the current ad from related ads
                    const filtered = relatedRes.data.data.filter(item => item._id !== id);
                    console.log("filtered:", filtered.slice(0, 3))
                    setRelatedAds(filtered.slice(0, 3)); // Show top 3
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching ad:", err);
                setError("Failed to load advertisement details.");
                setLoading(false);
            }
        };

        fetchAdDetails();
        // Scroll to top when ID changes
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        const recordAdDetailImpression = async () => {
            try {
                if (ad?._id) {
                    await axios.post(`/analytics/analytics/impression/${ad._id}`);
                }
            } catch (error) {
                console.log("Error recording ad detail impression:", error);
            }
        };

        recordAdDetailImpression();
    }, [ad]);

    const handleExploreOffer = async () => {
        try {
            await axios.post(`/analytics/analytics/click/${ad._id}`);

            if (ad.redirect_url) {
                window.open(ad.redirect_url, "_blank");
            }
        } catch (error) {
            console.log("Error recording explore offer click:", error);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
            <p className="text-slate-500 font-medium">Loading details...</p>
        </div>
    );

    if (error || !ad) {
        return (
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center">
                    <h2 className="text-2xl font-bold text-slate-900">{error || "Advertisement not found"}</h2>
                    <p className="text-slate-500 mt-3">
                        The advertisement you are looking for does not exist.
                    </p>
                    <button
                        onClick={() => navigate("/ads")}
                        className="mt-6 px-5 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
                    >
                        Back to Ads
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Top Banner */}
            <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition mb-6"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        {/* Media */}
                        <div className="rounded-[2rem] overflow-hidden border border-white/10 shadow-xl relative">
                            <img
                                src={ad.content}
                                alt={ad.ad_title}
                                className="w-full h-[420px] object-cover"
                            />

                            {ad.ad_type === "Video" && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/30 transition">
                                        <PlayCircle size={40} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm font-medium">
                                    {ad.category_id.name}
                                </span>
                                {/* <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/20 text-sm font-medium">
                                    {ad.badge}
                                </span> */}
                                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm font-medium">
                                    {ad.ad_type}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                                {ad.ad_title}
                            </h1>

                            <p className="mt-5 text-slate-300 text-base md:text-lg leading-8">
                                {ad.description ? ad.description : "No Description"}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                {/* <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                                    <p className="text-sm text-slate-400">Brand</p>
                                    <p className="text-lg font-semibold mt-1">{ad.brand}</p>
                                </div> */}

                                {/* <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                                    <p className="text-sm text-slate-400">Views</p>
                                    <p className="text-lg font-semibold mt-1">{ad.views}</p>
                                </div> */}

                                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                                    <p className="text-sm text-slate-400">Offer</p>
                                    <p className="text-lg font-semibold mt-1">{ad.offer.value}</p>
                                </div>

                                <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                                    <p className="text-sm text-slate-400">Validity</p>
                                    <p className="text-lg font-semibold mt-1">
                                        {ad.offer.expiry ? format(parseISO(ad.offer.expiry), 'PPPP') : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <button
                                    onClick={handleExploreOffer}
                                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition font-semibold shadow-lg"
                                >
                                    Explore Offer
                                </button>

                                <button className="px-6 py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition font-semibold">
                                    Save for Later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Info Cards */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <Layers3 size={20} />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mt-5">
                            Campaign
                        </h3>
                        <p className="text-slate-500 mt-3 leading-7">{ad.campaign_id.name}</p>
                    </div>

                    <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                            <BadgePercent size={20} />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mt-5">
                            Promotion
                        </h3>
                        <p className="text-slate-500 mt-3 leading-7">
                            {ad.offer.value}
                        </p>
                    </div>

                    <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <CalendarDays size={20} />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mt-5">
                            Valid Until
                        </h3>
                        <p className="text-slate-500 mt-3 leading-7">
                            {ad.offer.expiry ? format(parseISO(ad.offer.expiry), 'PPPP') : 'N/A'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Brand + Category */}
            <section className="bg-white border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                <Building2 size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mt-5">
                                Brand Information
                            </h3>
                            <p className="text-slate-500 mt-4 leading-7">
                                This promotion is presented by <span className="font-semibold text-slate-800">{ad.campaign_id.advertiser_id.fullName}</span>, a featured advertiser offering high-value campaigns and seasonal promotions.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <Tag size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mt-5">
                                Category Information
                            </h3>
                            <p className="text-slate-500 mt-4 leading-7">
                                This advertisement belongs to the <span className="font-semibold text-slate-800">{ad.category_id.name}</span> category, helping viewers discover offers and products that match their interests.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Ads */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-indigo-600 text-sm font-medium">Related Ads</p>
                        <h2 className="text-3xl font-bold text-slate-900 mt-1">
                            Similar Promotions You May Like
                        </h2>
                    </div>
                </div>

                {relatedAds.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {relatedAds.map((item) => (
                            <div
                                key={item._id}
                                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300"
                            >
                                <div className="h-56 overflow-hidden">
                                    <img
                                        src={item.content}
                                        alt={item.ad_title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                </div>

                                <div className="p-6">
                                    <span className="inline-flex px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium">
                                        {item.category_id.name}
                                    </span>

                                    <h3 className="text-xl font-semibold text-slate-900 mt-4">
                                        {item.ad_title}
                                    </h3>

                                    <p className="text-slate-500 text-sm leading-6 mt-3">
                                        {item.description ? item.description : "No Description"}
                                    </p>

                                    <button
                                        onClick={() => navigate(`/ads/${item._id}`)}
                                        className="mt-5 inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition"
                                    >
                                        Explore Now
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
                        <h3 className="text-xl font-semibold text-slate-900">
                            No related advertisements found
                        </h3>
                    </div>
                )}
            </section>
        </div>
    );
};

export default AdDetails;