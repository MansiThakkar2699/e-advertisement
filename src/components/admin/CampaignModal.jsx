import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

function CampaignModal({ mode, campaignData, closeModal, refreshCampaigns }) {

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        // This ensures the output is exactly YYYY-MM-DD
        return date.toISOString().split("T")[0];
    };

    // Prefill form in edit mode
    useEffect(() => {
        if (mode === "edit" && campaignData) {
            setValue("advertiser_id", campaignData.advertiser_id._id)
            setValue("name", campaignData.name);
            setValue("budget", campaignData.budget);
            setValue("start_date", formatDate(campaignData.start_date));
            setValue("end_date", formatDate(campaignData.end_date));
            setValue("target_location", campaignData.target_location);
            setValue("target_age", campaignData.target_age);
        }
    }, [mode, campaignData]);

    const submitHandler = async (data) => {
        try {
            let res;

            if (mode === "add") {
                res = await axios.post("/campaign/campaign", data);
                console.log("add campaign", res)
            } else {
                res = await axios.put(
                    `/campaign/campaign/${campaignData._id}`,
                    data
                );
            }
            if (res.status == 200 || res.status === 201) {
                toast.success(
                    mode === "add"
                        ? "Campaign Created Successfully!"
                        : "Campaign Updated Successfully!"
                );
                refreshCampaigns();
                closeModal();
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

            <div className="bg-white w-[520px] rounded-xl shadow-xl p-6 relative animate-fadeIn">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {mode === "add"
                            ? "Add New Campaign"
                            : mode === "edit"
                                ? "Edit Campaign"
                                : "Campaign Details"
                        }
                    </h2>

                    <button
                        onClick={closeModal}
                        className="text-gray-500 hover:text-red-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {mode === "view" ? (
                    <div className="space-y-6">

                        {/* Campaign Header */}
                        <div className="flex items-center gap-4 border-b pb-4">

                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-600">
                                {campaignData?.advertiser_id?.fullName
                                    ?.split(" ")
                                    .map(n => n[0])
                                    .join("")}
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">
                                    {campaignData?.name}
                                </h3>

                                <p className="text-sm text-slate-500">
                                    Advertiser: {campaignData?.advertiser_id?.fullName}
                                </p>
                            </div>

                            {/* Status */}
                            <span className={`ml-auto px-3 py-1 text-xs rounded-full font-medium
                                    ${campaignData?.status === "active"
                                    ? "bg-emerald-100 text-emerald-600"
                                    : campaignData?.status === "inactive"
                                        ? "bg-slate-100 text-slate-500"
                                        : "bg-orange-100 text-orange-600"}
                                `}>
                                {campaignData?.status}
                            </span>

                        </div>

                        {/* Campaign Info Grid */}
                        <div className="grid grid-cols-2 gap-4">

                            {/* Budget */}
                            <div className="bg-slate-50 border rounded-lg p-4">
                                <p className="text-xs text-slate-500 mb-1">Budget</p>
                                <p className="text-lg font-semibold text-indigo-600">
                                    ₹ {campaignData?.budget}
                                </p>
                            </div>

                            {/* Target Age */}
                            <div className="bg-slate-50 border rounded-lg p-4">
                                <p className="text-xs text-slate-500 mb-1">Target Age</p>
                                <p className="font-medium text-slate-700">
                                    {campaignData?.target_age}
                                </p>
                            </div>

                            {/* Start Date */}
                            <div className="bg-slate-50 border rounded-lg p-4">
                                <p className="text-xs text-slate-500 mb-1">Start Date</p>
                                <p className="font-medium text-slate-700">
                                    {campaignData?.start_date}
                                </p>
                            </div>

                            {/* End Date */}
                            <div className="bg-slate-50 border rounded-lg p-4">
                                <p className="text-xs text-slate-500 mb-1">End Date</p>
                                <p className="font-medium text-slate-700">
                                    {campaignData?.end_date}
                                </p>
                            </div>

                        </div>

                        {/* Target Location */}
                        <div className="bg-slate-50 border rounded-lg p-4">
                            <p className="text-xs text-slate-500 mb-1">Target Location</p>
                            <p className="font-medium text-slate-700">
                                {campaignData?.target_location}
                            </p>
                        </div>

                    </div>
                ) : (
                    < form onSubmit={handleSubmit(submitHandler)} className="flex flex-col max-h-[80vh]">
                        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                            {/* Advertiser ID */}
                            <div>
                                <input
                                    type="hidden"
                                    {...register("advertiser_id")}
                                    value={"69aeeb82fa966e4dbda93ca9"}
                                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            {/* Campaign Name */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Campaign Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter Campaign name"
                                    {...register("name", { required: "Campaign name is required" })}
                                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />

                                {errors.name && (
                                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Budget */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Budget
                                </label>

                                <input
                                    type="number"
                                    {...register("budget", { required: "budget is required" })}
                                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />

                                {errors.budget && (
                                    <p className="text-red-500 text-sm">{errors.budget.message}</p>
                                )}
                            </div>

                            {/* Start Date */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Start Date
                                </label>

                                <input
                                    type="date"
                                    {...register("start_date", { required: "start_date is required" })}
                                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />

                                {errors.start_date && (
                                    <p className="text-red-500 text-sm">{errors.start_date.message}</p>
                                )}
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    End Date
                                </label>

                                <input
                                    type="date"
                                    {...register("end_date", { required: "end_date is required" })}
                                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />

                                {errors.end_date && (
                                    <p className="text-red-500 text-sm">{errors.end_date.message}</p>
                                )}
                            </div>

                            {/* Target Location */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Target Location
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter Target Location"
                                    {...register("target_location", { required: "Target location is required" })}
                                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />

                                {errors.name && (
                                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Target Age */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Target Age
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter Target Age"
                                    {...register("target_age", { required: "Target Age is required" })}
                                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />

                                {errors.target_age && (
                                    <p className="text-red-500 text-sm">{errors.target_age.message}</p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 pt-4">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                    {mode === "add" ? "Save Campaign" : "Update Campaign"}
                                </button>

                            </div>
                        </div>
                    </form>
                )
                }
            </div>
        </div >
    );
}

export default CampaignModal;