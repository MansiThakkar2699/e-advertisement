import React from "react";
import {
    X,
    Image as ImageIcon,
    Video,
    Megaphone,
    User,
    FolderOpen,
    Target,
    Wallet,
    CalendarDays,
    MonitorPlay,
    CircleCheck,
    Clock3,
    CirclePause,
    CheckCheck,
    CircleX,
    Ban
} from "lucide-react";

function AdvertisementModal({ advertisementData, closeModal }) {
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
        },
        blocked: {
            label: "Blocked",
            icon: Ban,
            className: "bg-rose-50 text-rose-600 border border-rose-200"
        }
    };

    // 1. Get the specific status configuration (fallback to pending if missing)
    const currentStatus = statusMap[advertisementData.status] || statusMap.pending;

    // 2. Extract the Icon component
    const StatusIcon = currentStatus.icon;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 rounded-t-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white border-b border-slate-700">
                    <div>
                        <h2 className="text-xl font-semibold">Advertisement Details</h2>
                        <p className="text-sm text-slate-300 mt-1">
                            View advertisement, campaign, category, and targeting information
                        </p>
                    </div>

                    <button
                        onClick={closeModal}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 bg-slate-50 space-y-5">
                    {/* Top Summary */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl uppercase">
                                    {advertisementData.ad_title?.slice(0, 3) || "AD"}
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800">
                                        {advertisementData.ad_title || "Untitled Advertisement"}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Campaign: {advertisementData.campaign_id?.name || "N/A"}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Advertiser: {advertisementData.campaign_id?.advertiser_id?.fullName || "Unknown"}
                                    </p>
                                </div>
                            </div>

                            <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium h-fit ${statusMap.className}`}
                            >
                                <StatusIcon size={14} />
                                {statusMap.label}
                            </span>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Left */}
                        <div className="space-y-5">
                            {/* Ad Information */}
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                                    <Megaphone size={18} className="text-indigo-600" />
                                    Advertisement Information
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Ad Title
                                        </p>
                                        <p className="mt-1 text-base font-semibold text-slate-800">
                                            {advertisementData.ad_title || "N/A"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Advertisement Type
                                        </p>
                                        <div className="mt-1 inline-flex items-center gap-2 text-base font-semibold text-slate-800">
                                            {advertisementData.ad_type == "Image" ? (
                                                <ImageIcon size={16} className="text-violet-600" />
                                            ) : (
                                                <Video size={16} className="text-violet-600" />
                                            )}
                                            {advertisementData.ad_type || "N/A"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Advertiser */}
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                                    <User size={18} className="text-emerald-600" />
                                    Advertiser Information
                                </h3>

                                <div className="flex items-center gap-4">
                                    <img
                                        src={
                                            advertisementData.campaign_id?.advertiser_id?.profilePic ||
                                            "https://via.placeholder.com/60"
                                        }
                                        alt="advertiser"
                                        className="w-14 h-14 rounded-full object-cover border border-slate-200"
                                    />

                                    <div>
                                        <p className="text-base font-semibold text-slate-800">
                                            {advertisementData.campaign_id?.advertiser_id?.fullName || "Unknown"}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {advertisementData.campaign_id?.advertiser_id?.email || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Category */}
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                                    <FolderOpen size={18} className="text-amber-600" />
                                    Category Information
                                </h3>

                                <div className="flex items-center gap-4">
                                    <img
                                        src={
                                            advertisementData.category_id?.image ||
                                            "https://via.placeholder.com/60"
                                        }
                                        alt="category"
                                        className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                                    />

                                    <div>
                                        <p className="text-base font-semibold text-slate-800">
                                            {advertisementData.category_id?.name || "N/A"}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {advertisementData.category_id?.description || "No description"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Platforms */}
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                                    <MonitorPlay size={18} className="text-pink-600" />
                                    Platforms
                                </h3>

                                <div className="flex flex-wrap gap-2">
                                    {advertisementData.campaign_id?.platforms?.length > 0 ? (
                                        advertisementData.campaign_id.platforms.map((platform, index) => (
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
                        </div>

                        {/* Right */}
                        <div className="space-y-5">
                            {/* Content Preview */}
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                                    {advertisementData.ad_type == "Image" ? (
                                        <ImageIcon size={18} className="text-violet-600" />
                                    ) : (
                                        <Video size={18} className="text-violet-600" />
                                    )}
                                    Content Preview
                                </h3>

                                <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 flex items-center justify-center min-h-[340px]">
                                    {advertisementData.ad_type == "Image" ? (
                                        <img
                                            src={advertisementData.content}
                                            alt={advertisementData.ad_title}
                                            className="max-h-[420px] w-auto rounded-xl object-contain shadow-sm"
                                        />
                                    ) : (
                                        <video
                                            src={advertisementData.content}
                                            controls
                                            className="w-full max-h-[420px] rounded-xl"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Campaign Target Audience */}
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                                    <Target size={18} className="text-rose-600" />
                                    Target Audience
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Age Range
                                        </p>
                                        <p className="mt-1 text-base font-semibold text-slate-800">
                                            {advertisementData.campaign_id?.targetAudience?.ageMin ?? "N/A"} -{" "}
                                            {advertisementData.campaign_id?.targetAudience?.ageMax ?? "N/A"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Gender
                                        </p>
                                        <p className="mt-1 text-base font-semibold text-slate-800 capitalize">
                                            {advertisementData.campaign_id?.targetAudience?.gender || "N/A"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Location
                                        </p>
                                        <p className="mt-1 text-base font-semibold text-slate-800">
                                            {advertisementData.campaign_id?.targetAudience?.location || "N/A"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Interests
                                        </p>
                                        <p className="mt-1 text-base font-semibold text-slate-800">
                                            {advertisementData.campaign_id?.targetAudience?.interests?.length > 0
                                                ? advertisementData.campaign_id.targetAudience.interests.join(", ")
                                                : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Campaign Budget & Timeline */}
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                                    <Wallet size={18} className="text-emerald-600" />
                                    Campaign Budget & Timeline
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Total Budget
                                        </p>
                                        <p className="mt-1 text-base font-semibold text-slate-800">
                                            ₹{advertisementData.campaign_id?.totalBudget ?? 0}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Daily Budget
                                        </p>
                                        <p className="mt-1 text-base font-semibold text-slate-800">
                                            ₹{advertisementData.campaign_id?.dailyBudget ?? 0}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Start Date
                                        </p>
                                        <p className="mt-1 text-base font-semibold text-slate-800">
                                            {advertisementData.campaign_id?.start_date
                                                ? new Date(advertisementData.campaign_id.start_date).toLocaleDateString()
                                                : "N/A"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            End Date
                                        </p>
                                        <p className="mt-1 text-base font-semibold text-slate-800">
                                            {advertisementData.campaign_id?.end_date
                                                ? new Date(advertisementData.campaign_id.end_date).toLocaleDateString()
                                                : "N/A"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Campaign Status
                                        </p>
                                        <p className="mt-1 text-base font-semibold text-slate-800 capitalize">
                                            {advertisementData.campaign_id?.status || "N/A"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Created Date
                                        </p>
                                        <p className="mt-1 text-base font-semibold text-slate-800">
                                            {advertisementData.campaign_id?.createdAt
                                                ? new Date(advertisementData.campaign_id.createdAt).toLocaleDateString()
                                                : "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default AdvertisementModal;