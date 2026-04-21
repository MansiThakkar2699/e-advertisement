import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Layers3,
    Megaphone,
    MessageSquare,
    ClipboardList,
    Eye,
    MousePointerClick,
    Target,
    TrendingUp,
    Clock3,
    BarChart3,
    PlusCircle
} from "lucide-react";
import { toast } from "react-toastify";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    LineChart,
    Line
} from "recharts";
import { jwtDecode } from "jwt-decode";

import QuickActionCard from "../dashboard/QuickActionCard";

const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444", "#6366f1"];

const StatCard = ({ title, value, icon, colorClass }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-slate-500">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass}`}>
                {icon}
            </div>
        </div>
    </div>
);

const ChartCard = ({ title, children }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">{title}</h2>
        <div className="h-80">{children}</div>
    </div>
);

const AdvertiserDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        stats: {},
        charts: {
            campaignStatusChart: [],
            adStatusChart: [],
            analyticsLineChart: [],
            performanceBarChart: []
        },
        recentCampaigns: [],
        recentAdvertisements: [],
        recentFeedbacks: []
    });
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const advertiserId = decoded.id;

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/dashboard/dashboard/advertiser/${advertiserId}`);
            setDashboardData(response.data.data || {});
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (advertiserId) {
            fetchDashboard();
        }
    }, [advertiserId]);

    const {
        stats = {},
        charts = {},
        recentCampaigns = [],
        recentAdvertisements = [],
        recentFeedbacks = []
    } = dashboardData;

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Advertiser Dashboard</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Track your campaigns, ads, surveys, feedback, and performance
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <StatCard title="Total Campaigns" value={stats.totalCampaigns || 0} icon={<Layers3 size={22} className="text-indigo-600" />} colorClass="bg-indigo-50" />
                <StatCard title="Active Campaigns" value={stats.activeCampaigns || 0} icon={<Clock3 size={22} className="text-emerald-600" />} colorClass="bg-emerald-50" />
                <StatCard title="Total Advertisements" value={stats.totalAdvertisements || 0} icon={<Megaphone size={22} className="text-blue-600" />} colorClass="bg-blue-50" />
                <StatCard title="Pending Ads" value={stats.pendingAdvertisements || 0} icon={<Clock3 size={22} className="text-yellow-600" />} colorClass="bg-yellow-50" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <StatCard title="Feedbacks" value={stats.totalFeedbacks || 0} icon={<MessageSquare size={22} className="text-rose-600" />} colorClass="bg-rose-50" />
                <StatCard title="Surveys" value={stats.advertiserSurveys || 0} icon={<ClipboardList size={22} className="text-violet-600" />} colorClass="bg-violet-50" />
                <StatCard title="CTR" value={`${stats.ctr || 0}%`} icon={<TrendingUp size={22} className="text-amber-600" />} colorClass="bg-amber-50" />
                <StatCard title="Conversions" value={stats.conversions || 0} icon={<Target size={22} className="text-green-600" />} colorClass="bg-green-50" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StatCard title="Impressions" value={stats.impressions || 0} icon={<Eye size={22} className="text-sky-600" />} colorClass="bg-sky-50" />
                <StatCard title="Clicks" value={stats.clicks || 0} icon={<MousePointerClick size={22} className="text-cyan-600" />} colorClass="bg-cyan-50" />
                <StatCard title="Active Ads" value={stats.activeAdvertisements || 0} icon={<Megaphone size={22} className="text-emerald-600" />} colorClass="bg-emerald-50" />
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Quick Actions</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    <QuickActionCard
                        title="Create Campaign"
                        description="Launch a new campaign with budget, audience, and timeline settings."
                        icon={<PlusCircle size={22} className="text-indigo-600" />}
                        path="/advertiser/campaigns"
                        colorClass="bg-indigo-50"
                    />

                    <QuickActionCard
                        title="Manage Campaigns"
                        description="Update campaign status, budget, and targeting details."
                        icon={<Layers3 size={22} className="text-violet-600" />}
                        path="/advertiser/campaigns"
                        colorClass="bg-violet-50"
                    />

                    <QuickActionCard
                        title="Create Advertisement"
                        description="Design or upload a new advertisement for your active campaigns."
                        icon={<Megaphone size={22} className="text-emerald-600" />}
                        path="/advertiser/advertisements"
                        colorClass="bg-emerald-50"
                    />

                    <QuickActionCard
                        title="View Analytics"
                        description="Track impressions, clicks, conversions, and campaign performance."
                        icon={<BarChart3 size={22} className="text-blue-600" />}
                        path="/advertiser/analytics"
                        colorClass="bg-blue-50"
                    />

                    <QuickActionCard
                        title="Survey Insights"
                        description="Check survey responses linked to your campaigns for audience insights."
                        icon={<ClipboardList size={22} className="text-amber-600" />}
                        path="/advertiser/surveys"
                        colorClass="bg-amber-50"
                    />

                    <QuickActionCard
                        title="Viewer Feedback"
                        description="Read feedback and ratings submitted by viewers on your advertisements."
                        icon={<MessageSquare size={22} className="text-rose-600" />}
                        path="/advertiser/feedbacks"
                        colorClass="bg-rose-50"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <ChartCard title="Campaign Status Distribution">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={charts.campaignStatusChart || []}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={100}
                                label
                            >
                                {(charts.campaignStatusChart || []).map((entry, index) => (
                                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Advertisement Status Distribution">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={charts.adStatusChart || []}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={100}
                                label
                            >
                                {(charts.adStatusChart || []).map((entry, index) => (
                                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <ChartCard title="Business Overview">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={charts.performanceBarChart || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="active" fill="#10b981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Analytics Trend">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={charts.analyticsLineChart || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="impressions" stroke="#0ea5e9" strokeWidth={2} />
                            <Line type="monotone" dataKey="clicks" stroke="#6366f1" strokeWidth={2} />
                            <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-800">Recent Campaigns</h2>
                    </div>
                    <div className="p-5 space-y-4">
                        {recentCampaigns.length > 0 ? recentCampaigns.map((campaign) => (
                            <div key={campaign._id} className="border border-slate-200 rounded-xl p-4">
                                <p className="font-medium text-slate-800">{campaign.name}</p>
                                <p className="text-sm text-slate-500">Budget: ₹{campaign.totalBudget || 0}</p>
                                <p className="text-xs text-slate-400 capitalize mt-1">Status: {campaign.status}</p>
                            </div>
                        )) : <p className="text-slate-500">No recent campaigns</p>}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-800">Recent Advertisements</h2>
                    </div>
                    <div className="p-5 space-y-4">
                        {recentAdvertisements.length > 0 ? recentAdvertisements.map((ad) => (
                            <div key={ad._id} className="border border-slate-200 rounded-xl p-4">
                                <p className="font-medium text-slate-800">{ad.ad_title}</p>
                                <p className="text-sm text-slate-500">Campaign: {ad.campaign_id?.name || "N/A"}</p>
                                <p className="text-xs text-slate-400 capitalize mt-1">Status: {ad.status}</p>
                            </div>
                        )) : <p className="text-slate-500">No recent advertisements</p>}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-800">Recent Feedbacks</h2>
                    </div>
                    <div className="p-5 space-y-4">
                        {recentFeedbacks.length > 0 ? recentFeedbacks.map((feedback) => (
                            <div key={feedback._id} className="border border-slate-200 rounded-xl p-4">
                                <p className="font-medium text-slate-800">{feedback.viewer_id?.fullName || "Viewer"}</p>
                                <p className="text-sm text-slate-500">Ad: {feedback.ad_id?.ad_title || "N/A"}</p>
                                <p className="text-xs text-slate-400 mt-1">Rating: {feedback.rating || 0}/5</p>
                            </div>
                        )) : <p className="text-slate-500">No recent feedbacks</p>}
                    </div>
                </div>
            </div>

            {loading && (
                <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2 rounded-xl shadow-lg text-sm">
                    Loading dashboard...
                </div>
            )}
        </div>
    );
};

export default AdvertiserDashboard;