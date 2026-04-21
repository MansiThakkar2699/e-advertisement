import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Users,
    Megaphone,
    Layers3,
    Mail,
    ClipboardList,
    MessageSquare,
    Eye,
    MousePointerClick,
    Target,
    TrendingUp,
    Clock3,
    BarChart3,
    UserCheck
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
import QuickActionCard from "../dashboard/QuickActionCard";

const PIE_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];

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

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        stats: {},
        charts: {
            userRoleChart: [],
            overviewBarChart: [],
            analyticsLineChart: []
        },
        recentUsers: [],
        recentCampaigns: [],
        recentContacts: []
    });
    const [loading, setLoading] = useState(false);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/dashboard/dashboard/admin");
            setDashboardData(response.data.data || {});
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const {
        stats = {},
        charts = {},
        recentUsers = [],
        recentCampaigns = [],
        recentContacts = []
    } = dashboardData;

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Overview of users, campaigns, ads, surveys, messages, and analytics
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <StatCard title="Total Users" value={stats.totalUsers || 0} icon={<Users size={22} className="text-blue-600" />} colorClass="bg-blue-50" />
                <StatCard title="Pending Advertisers" value={stats.pendingAdvertisers || 0} icon={<Clock3 size={22} className="text-yellow-600" />} colorClass="bg-yellow-50" />
                <StatCard title="Total Campaigns" value={stats.totalCampaigns || 0} icon={<Layers3 size={22} className="text-indigo-600" />} colorClass="bg-indigo-50" />
                <StatCard title="Active Advertisements" value={stats.activeAdvertisements || 0} icon={<Megaphone size={22} className="text-emerald-600" />} colorClass="bg-emerald-50" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <StatCard title="Contact Messages" value={stats.totalContacts || 0} icon={<Mail size={22} className="text-pink-600" />} colorClass="bg-pink-50" />
                <StatCard title="Surveys" value={stats.totalSurveys || 0} icon={<ClipboardList size={22} className="text-violet-600" />} colorClass="bg-violet-50" />
                <StatCard title="Feedbacks" value={stats.totalFeedbacks || 0} icon={<MessageSquare size={22} className="text-rose-600" />} colorClass="bg-rose-50" />
                <StatCard title="CTR" value={`${stats.ctr || 0}%`} icon={<TrendingUp size={22} className="text-amber-600" />} colorClass="bg-amber-50" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StatCard title="Impressions" value={stats.impressions || 0} icon={<Eye size={22} className="text-sky-600" />} colorClass="bg-sky-50" />
                <StatCard title="Clicks" value={stats.clicks || 0} icon={<MousePointerClick size={22} className="text-cyan-600" />} colorClass="bg-cyan-50" />
                <StatCard title="Conversions" value={stats.conversions || 0} icon={<Target size={22} className="text-green-600" />} colorClass="bg-green-50" />
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Quick Actions</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    <QuickActionCard
                        title="Approve Advertisers"
                        description="Review pending advertiser registrations and approve or reject them."
                        icon={<UserCheck size={22} className="text-yellow-600" />}
                        path="/admin/users"
                        colorClass="bg-yellow-50"
                    />

                    <QuickActionCard
                        title="Manage Campaigns"
                        description="View and manage campaign statuses, budgets, and timelines."
                        icon={<Layers3 size={22} className="text-indigo-600" />}
                        path="/admin/campaigns"
                        colorClass="bg-indigo-50"
                    />

                    <QuickActionCard
                        title="Manage Advertisements"
                        description="Review active and pending advertisements created by advertisers."
                        icon={<Megaphone size={22} className="text-emerald-600" />}
                        path="/admin/advertisements"
                        colorClass="bg-emerald-50"
                    />

                    <QuickActionCard
                        title="Contact Messages"
                        description="Read new inquiries submitted by viewers from the contact page."
                        icon={<Mail size={22} className="text-pink-600" />}
                        path="/admin/contacts"
                        colorClass="bg-pink-50"
                    />

                    <QuickActionCard
                        title="Create Survey"
                        description="Create a new survey linked to a campaign or category."
                        icon={<ClipboardList size={22} className="text-violet-600" />}
                        path="/admin/surveys"
                        colorClass="bg-violet-50"
                    />

                    <QuickActionCard
                        title="View Analytics"
                        description="Track platform-wide impressions, clicks, conversions, and performance."
                        icon={<BarChart3 size={22} className="text-blue-600" />}
                        path="/admin/analytics"
                        colorClass="bg-blue-50"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <ChartCard title="User Role Distribution">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={charts.userRoleChart || []}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={100}
                                label
                            >
                                {(charts.userRoleChart || []).map((entry, index) => (
                                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Platform Overview">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={charts.overviewBarChart || []}>
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
            </div>

            <div className="mb-6">
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
                        <h2 className="text-lg font-semibold text-slate-800">Recent Users</h2>
                    </div>
                    <div className="p-5 space-y-4">
                        {recentUsers.length > 0 ? recentUsers.map((user) => (
                            <div key={user._id} className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold">
                                    {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-slate-800 truncate">{user.fullName}</p>
                                    <p className="text-sm text-slate-500 truncate">{user.email}</p>
                                    <p className="text-xs text-slate-400 capitalize">{user.role} • {user.status}</p>
                                </div>
                            </div>
                        )) : <p className="text-slate-500">No recent users</p>}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-800">Recent Campaigns</h2>
                    </div>
                    <div className="p-5 space-y-4">
                        {recentCampaigns.length > 0 ? recentCampaigns.map((campaign) => (
                            <div key={campaign._id} className="border border-slate-200 rounded-xl p-4">
                                <p className="font-medium text-slate-800">{campaign.name}</p>
                                <p className="text-sm text-slate-500">Advertiser: {campaign.advertiser_id?.fullName || "N/A"}</p>
                                <p className="text-xs text-slate-400 capitalize mt-1">Status: {campaign.status}</p>
                            </div>
                        )) : <p className="text-slate-500">No recent campaigns</p>}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-800">Recent Contact Messages</h2>
                    </div>
                    <div className="p-5 space-y-4">
                        {recentContacts.length > 0 ? recentContacts.map((contact) => (
                            <div key={contact._id} className="border border-slate-200 rounded-xl p-4">
                                <p className="font-medium text-slate-800">{contact.fullName}</p>
                                <p className="text-sm text-slate-500">{contact.subject}</p>
                                <p className="text-xs text-slate-400 capitalize mt-1">Status: {contact.status}</p>
                            </div>
                        )) : <p className="text-slate-500">No recent messages</p>}
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

export default AdminDashboard;