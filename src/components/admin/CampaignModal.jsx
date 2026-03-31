import React from "react";
import {
    X,
    Megaphone,
    Wallet,
    MonitorPlay,
    Target,
    CalendarDays,
    CircleCheck,
    Clock3,
    CirclePause,
    CheckCheck,
    CircleX
} from "lucide-react";


function CampaignModal({ campaignData, closeModal }) {

    const getStatusConfig = (status) => {
        const normalizedStatus = status?.toLowerCase();

        const statusMap = {
            active: {
                label: "Active",
                icon: CircleCheck,
                className: "bg-green-50 text-green-600 border border-green-200"
            },
            pending: {
                label: "Pending",
                icon: Clock3,
                className: "bg-yellow-50 text-yellow-600 border border-yellow-200"
            },
            paused: {
                label: "Paused",
                icon: CirclePause,
                className: "bg-orange-50 text-orange-600 border border-orange-200"
            },
            completed: {
                label: "Completed",
                icon: CheckCheck,
                className: "bg-blue-50 text-blue-600 border border-blue-200"
            },
            rejected: {
                label: "Rejected",
                icon: CircleX,
                className: "bg-red-50 text-red-600 border border-red-200"
            }
        };

        return (
            statusMap[normalizedStatus] || {
                label: status || "Unknown",
                icon: Clock3,
                className: "bg-gray-50 text-gray-600 border border-gray-200"
            }
        );
    };

    const statusConfig = getStatusConfig(campaignData.status);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 rounded-t-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white border-b border-slate-700">
                    <div>
                        <h2 className="text-xl font-semibold">Campaign Details</h2>
                        <p className="text-sm text-slate-300 mt-1">
                            View campaign information and targeting details
                        </p>
                    </div>

                    <button
                        onClick={closeModal}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5 bg-slate-50">
                    {/* Campaign Information */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                            <Megaphone size={18} className="text-indigo-600" />
                            Campaign Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Campaign Name
                                </p>
                                <p className="mt-1 text-base font-semibold text-slate-800">
                                    {campaignData.name || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Advertiser Name
                                </p>
                                <p className="mt-1 text-base font-semibold text-slate-800">
                                    {campaignData.advertiser_id?.fullName || "Unknown Advertiser"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Budget */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                            <Wallet size={18} className="text-emerald-600" />
                            Budget
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Total Budget
                                </p>
                                <p className="mt-1 text-base font-semibold text-slate-800">
                                    ₹{campaignData.totalBudget ?? 0}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Daily Budget
                                </p>
                                <p className="mt-1 text-base font-semibold text-slate-800">
                                    ₹{campaignData.dailyBudget ?? 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Platforms */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                            <MonitorPlay size={18} className="text-violet-600" />
                            Platforms
                        </h3>

                        <div className="flex gap-2 flex-wrap">
                            {campaignData.platforms?.length > 0 ? (
                                campaignData.platforms.map((platform, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-50 text-indigo-600 border border-indigo-100 capitalize"
                                    >
                                        {platform}
                                    </span>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500">No platforms selected</p>
                            )}
                        </div>
                    </div>

                    {/* Target Audience */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                            <Target size={18} className="text-rose-600" />
                            Target Audience
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Age Range
                                </p>
                                <p className="mt-1 text-base font-semibold text-slate-800">
                                    {campaignData.targetAudience?.ageMin ?? "N/A"} -{" "}
                                    {campaignData.targetAudience?.ageMax ?? "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Gender
                                </p>
                                <p className="mt-1 text-base font-semibold text-slate-800 capitalize">
                                    {campaignData.targetAudience?.gender || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Location
                                </p>
                                <p className="mt-1 text-base font-semibold text-slate-800">
                                    {campaignData.targetAudience?.location || "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Interests
                                </p>
                                <p className="mt-1 text-base font-semibold text-slate-800">
                                    {campaignData.targetAudience?.interests?.length > 0
                                        ? campaignData.targetAudience.interests.join(", ")
                                        : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Campaign Timeline */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                            <CalendarDays size={18} className="text-amber-600" />
                            Campaign Timeline
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Start Date
                                </p>
                                <p className="mt-1 text-base font-semibold text-slate-800">
                                    {campaignData.start_date
                                        ? new Date(campaignData.start_date).toLocaleDateString()
                                        : "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    End Date
                                </p>
                                <p className="mt-1 text-base font-semibold text-slate-800">
                                    {campaignData.end_date
                                        ? new Date(campaignData.end_date).toLocaleDateString()
                                        : "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Status
                                </p>

                                <span
                                    className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.className}`}
                                >
                                    <StatusIcon size={14} />
                                    {statusConfig.label}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CampaignModal;