import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    BarChart3,
    MousePointerClick,
    Eye,
    Target,
    TrendingUp,
    Search,
    Layers3
} from "lucide-react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const formatNumber = (value) => {
    if (value >= 1000) {
        return (value / 1000).toFixed(1) + "K";
    }
    return value;
};

const AdvertiserAnalytics = () => {
    const [summary, setSummary] = useState({
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0
    });

    const [campaignAnalytics, setCampaignAnalytics] = useState([]);
    const [adAnalytics, setAdAnalytics] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const advertiserId = decoded.id;

    const fetchSummary = async () => {
        try {
            const response = await axios.get(`/analytics/analytics/advertiser/${advertiserId}`);
            setSummary(response.data.data || {});
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch analytics summary");
        }
    };

    // sample endpoints you can create later if needed
    const fetchCampaignAnalytics = async () => {
        try {
            const response = await axios.get(`/analytics/analytics/advertiser-campaigns/${advertiserId}`);
            setCampaignAnalytics(response.data.data || []);
        } catch (error) {
            setCampaignAnalytics([]);
        }
    };

    const fetchAdAnalytics = async () => {
        try {
            const response = await axios.get(`/analytics/analytics/advertiser-ads/${advertiserId}`);
            setAdAnalytics(response.data.data || []);
        } catch (error) {
            setAdAnalytics([]);
        }
    };

    const fetchAllAnalytics = async () => {
        try {
            setLoading(true);
            await Promise.all([
                fetchSummary(),
                fetchCampaignAnalytics(),
                fetchAdAnalytics()
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (advertiserId) {
            fetchAllAnalytics();
        }
    }, [advertiserId]);

    const filteredCampaignAnalytics = useMemo(() => {
        return campaignAnalytics.filter((item) =>
            item.campaign_name?.toLowerCase().includes(search.toLowerCase())
        );
    }, [campaignAnalytics, search]);

    const filteredAdAnalytics = useMemo(() => {
        return adAnalytics.filter((item) =>
            item.ad_title?.toLowerCase().includes(search.toLowerCase())
        );
    }, [adAnalytics, search]);

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Track advertisement and campaign performance in one place
                </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Impressions</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">
                                {formatNumber(summary.impressions || 0)}
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Eye size={22} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Clicks</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">
                                {formatNumber(summary.clicks || 0)}
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <MousePointerClick size={22} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Conversions</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">
                                {formatNumber(summary.conversions || 0)}
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                            <Target size={22} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">CTR</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">
                                {summary.ctr || 0}%
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <TrendingUp size={22} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search campaign or ad..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                </div>
            </div>

            {/* Campaign Analytics */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                    <Layers3 className="text-indigo-600" size={18} />
                    <h2 className="text-lg font-semibold text-slate-800">Campaign Performance</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Campaign</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Impressions</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Clicks</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Conversions</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">CTR</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredCampaignAnalytics.length > 0 ? (
                                filteredCampaignAnalytics.map((item, index) => (
                                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            {item.campaign_name}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{item.impressions}</td>
                                        <td className="px-6 py-4 text-slate-600">{item.clicks}</td>
                                        <td className="px-6 py-4 text-slate-600">{item.conversions}</td>
                                        <td className="px-6 py-4 text-slate-600">{item.ctr}%</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                                        No campaign analytics found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Ad Analytics */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                    <BarChart3 className="text-emerald-600" size={18} />
                    <h2 className="text-lg font-semibold text-slate-800">Advertisement Performance</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Advertisement</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Impressions</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Clicks</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Conversions</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">CTR</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredAdAnalytics.length > 0 ? (
                                filteredAdAnalytics.map((item, index) => (
                                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            {item.ad_title}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{item.impressions}</td>
                                        <td className="px-6 py-4 text-slate-600">{item.clicks}</td>
                                        <td className="px-6 py-4 text-slate-600">{item.conversions}</td>
                                        <td className="px-6 py-4 text-slate-600">{item.ctr}%</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                                        No advertisement analytics found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {loading && (
                <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2 rounded-xl shadow-lg text-sm">
                    Loading analytics...
                </div>
            )}
        </div>
    );
};

export default AdvertiserAnalytics;