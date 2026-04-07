import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";

const platformOptions = ["facebook", "instagram", "linkedin", "website"];
const genderOptions = ["all", "male", "female"];

function CampaignModal({ mode, campaignData, closeModal, refreshCampaigns }) {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: "",
            ad_id: "",
            totalBudget: "",
            dailyBudget: "",
            start_date: "",
            end_date: "",
            platforms: [],
            targetAudience: {
                ageMin: "",
                ageMax: "",
                gender: "all",
                location: "",
                interests: ""
            }
        }
    });

    const [btnLoading, setBtnLoading] = useState(false);

    useEffect(() => {
        if (campaignData && mode === "edit") {
            reset({
                name: campaignData.name || "",
                ad_id: campaignData.ad_id?._id || campaignData.ad_id || "",
                totalBudget: campaignData.totalBudget || "",
                dailyBudget: campaignData.dailyBudget || "",
                start_date: campaignData.start_date
                    ? new Date(campaignData.start_date).toISOString().split("T")[0]
                    : "",
                end_date: campaignData.end_date
                    ? new Date(campaignData.end_date).toISOString().split("T")[0]
                    : "",
                platforms: campaignData.platforms || [],
                targetAudience: {
                    ageMin: campaignData.targetAudience?.ageMin || "",
                    ageMax: campaignData.targetAudience?.ageMax || "",
                    gender: campaignData.targetAudience?.gender || "all",
                    location: campaignData.targetAudience?.location || "",
                    interests: campaignData.targetAudience?.interests?.join(", ") || ""
                }
            });
        } else {
            reset({
                name: "",
                ad_id: "",
                totalBudget: "",
                dailyBudget: "",
                start_date: "",
                end_date: "",
                platforms: [],
                targetAudience: {
                    ageMin: "",
                    ageMax: "",
                    gender: "all",
                    location: "",
                    interests: ""
                }
            });
        }
    }, [campaignData, mode, reset]);


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

    const submitHandler = async (data) => {
        try {
            setBtnLoading(true);

            // ✅ Get token from localStorage
            const token = localStorage.getItem("token");

            let advertiserId = null;

            if (token) {
                const decoded = jwtDecode(token);
                advertiserId = decoded?.id; // 👈 because you stored { id: user._id }
            }

            const formattedData = {
                ...data,
                advertiser_id: advertiserId, // ✅ ADD THIS
                totalBudget: Number(data.totalBudget),
                dailyBudget: Number(data.dailyBudget),
                targetAudience: {
                    ...data.targetAudience,
                    ageMin: Number(data.targetAudience.ageMin),
                    ageMax: Number(data.targetAudience.ageMax),
                    interests: data.targetAudience.interests
                        ? data.targetAudience.interests
                            .split(",")
                            .map((item) => item.trim())
                            .filter(Boolean)
                        : []
                }
            };

            let response;

            if (mode === "add") {
                response = await axios.post("/campaign/campaign", formattedData,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );
            } else if (mode === "edit") {
                response = await axios.put(`/campaign/campaign/${campaignData?._id}`, formattedData,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );
            }
            if (response.status == 200 || response.status === 201) {
                toast.success(
                    mode === "add"
                        ? "Campaign Created Successfully!"
                        : "Campaign Updated Successfully!"
                );
                refreshCampaigns();
                closeModal();
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong while saving campaign");
        } finally {
            setBtnLoading(false);
        }
    };

    const statusConfig = getStatusConfig(campaignData?.status);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 rounded-t-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white border-b border-slate-700">
                    <div>
                        <h2 className="text-xl font-semibold">
                            {mode === "edit"
                                ? "Update Campaign"
                                : mode === "view"
                                    ? "Campaign Details"
                                    : "Create Campaign"}
                        </h2>
                        <p className="text-sm text-slate-300 mt-1">
                            {mode === "edit"
                                ? "Edit campaign details, targeting, and budget"
                                : mode === "view"
                                    ? "View campaign information and targeting details"
                                    : "Set up a new campaign with targeting and budget"}
                        </p>
                    </div>

                    <button
                        onClick={closeModal}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {mode === "view" ? (
                    < div className="p-6 space-y-5 bg-slate-50">
                        {/* Campaign Information */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                                <Megaphone size={18} className="text-indigo-600" />
                                Campaign Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Campaign Name
                                </p>
                                <p className="mt-1 text-base font-semibold text-slate-800">
                                    {campaignData.name || "N/A"}
                                </p>
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
                ) : (
                    < form
                        onSubmit={handleSubmit(submitHandler)}
                        className="p-6 bg-slate-50 space-y-6">
                        {/* Campaign Information */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                                <Megaphone size={18} className="text-indigo-600" />
                                Campaign Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Campaign Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter campaign name"
                                        {...register("name", {
                                            required: "Campaign name is required"
                                        })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                    )}
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
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Total Budget
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Enter total budget"
                                        {...register("totalBudget", {
                                            required: "Total budget is required",
                                            min: {
                                                value: 1,
                                                message: "Total budget must be greater than 0"
                                            }
                                        })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    {errors.totalBudget && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.totalBudget.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Daily Budget
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Enter daily budget"
                                        {...register("dailyBudget", {
                                            required: "Daily budget is required",
                                            min: {
                                                value: 1,
                                                message: "Daily budget must be greater than 0"
                                            }
                                        })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    {errors.dailyBudget && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.dailyBudget.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Timeline & Platforms */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                                <CalendarDays size={18} className="text-amber-600" />
                                Timeline & Platforms
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        {...register("start_date", {
                                            required: "Start date is required"
                                        })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    {errors.start_date && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.start_date.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        {...register("end_date", {
                                            required: "End date is required"
                                        })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    {errors.end_date && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.end_date.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
                                    <MonitorPlay size={16} className="text-violet-600" />
                                    Platforms
                                </label>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {platformOptions.map((platform) => (
                                        <label
                                            key={platform}
                                            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-indigo-400 transition"
                                        >
                                            <input
                                                type="checkbox"
                                                value={platform}
                                                {...register("platforms", {
                                                    required: "Select at least one platform"
                                                })}
                                                className="accent-indigo-600"
                                            />
                                            <span className="text-sm text-slate-700 capitalize">
                                                {platform}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {errors.platforms && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.platforms.message}
                                    </p>
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
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Minimum Age
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Enter minimum age"
                                        {...register("targetAudience.ageMin", {
                                            required: "Minimum age is required"
                                        })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    {errors.targetAudience?.ageMin && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.targetAudience.ageMin.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Maximum Age
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Enter maximum age"
                                        {...register("targetAudience.ageMax", {
                                            required: "Maximum age is required"
                                        })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    {errors.targetAudience?.ageMax && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.targetAudience.ageMax.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Gender
                                    </label>
                                    <select
                                        {...register("targetAudience.gender", {
                                            required: "Gender is required"
                                        })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    >
                                        {genderOptions.map((gender) => (
                                            <option key={gender} value={gender}>
                                                {gender.charAt(0).toUpperCase() + gender.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter target location"
                                        {...register("targetAudience.location", {
                                            required: "Location is required"
                                        })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    {errors.targetAudience?.location && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.targetAudience.location.message}
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Interests
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter interests separated by comma"
                                        {...register("targetAudience.interests")}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        Example: electronics, mobiles, gadgets
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={btnLoading}
                                className="px-5 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                {btnLoading
                                    ? mode === "edit"
                                        ? "Updating..."
                                        : "Creating..."
                                    : mode === "edit"
                                        ? "Update Campaign"
                                        : "Create Campaign"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div >
    );
}

export default CampaignModal;