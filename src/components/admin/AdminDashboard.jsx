import React from 'react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// Mock data representing real-time platform performance 
const performanceData = [
    { name: 'Mon', impressions: 4000, clicks: 2400, conversions: 400 },
    { name: 'Tue', impressions: 3000, clicks: 1398, conversions: 210 },
    { name: 'Wed', impressions: 2000, clicks: 9800, conversions: 2290 },
    { name: 'Thu', impressions: 2780, clicks: 3908, conversions: 2000 },
    { name: 'Fri', impressions: 1890, clicks: 4800, conversions: 181 },
    { name: 'Sat', impressions: 2390, clicks: 3800, conversions: 2500 },
    { name: 'Sun', impressions: 3490, clicks: 4300, conversions: 2100 },
];

const AdminDashboard = () => {
    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Platform Overview</h1>
                <p className="text-gray-600">Real-time insights for platform optimization </p>
            </div>

            {/* KPI Cards: Quick Stats [cite: 36] */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Impressions', value: '1.2M', color: 'text-blue-600' },
                    { label: 'Active Campaigns', value: '452', color: 'text-green-600' },
                    { label: 'Avg. Conversion', value: '12.5%', color: 'text-purple-600' },
                    { label: 'Platform Revenue', value: '$12,400', color: 'text-orange-600' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-sm font-medium text-gray-500 uppercase">{stat.label}</p>
                        <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Main Charts Section  */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Line Chart: Engagement Trends */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-6 text-gray-700">Engagement Trends (Real-time)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="clicks" stroke="#2563eb" strokeWidth={3} dot={{ r: 6 }} />
                                <Line type="monotone" dataKey="impressions" stroke="#94a3b8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bar Chart: Conversion Analysis */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-6 text-gray-700">Conversion Performance</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="conversions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Compliance & Ad Content [cite: 7, 8] */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-700">Pending Ad Approvals</h3>
                    <button className="text-blue-600 text-sm font-medium hover:underline">View All Accounts [cite: 7]</button>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4 font-medium">Advertiser</th>
                            <th className="px-6 py-4 font-medium">Campaign Name</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {[
                            { user: 'Tech Corp', campaign: 'Summer Sale 2026', status: 'Under Review' },
                            { user: 'Beauty Gems', campaign: 'New Arrival Promo', status: 'Pending Policy Check' },
                        ].map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-800">{row.user}</td>
                                <td className="px-6 py-4 text-gray-600">{row.campaign}</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                        {row.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 font-bold hover:text-blue-800">Review</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;