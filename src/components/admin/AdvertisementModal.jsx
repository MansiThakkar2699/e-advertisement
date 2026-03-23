import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

function AdvertisementModal({ mode, advertisementData, closeModal, refreshAdvertisements }) {

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();

    const [campaigns, setCampaigns] = useState([]);
    const [categories, setCategories] = useState([]);
    const [preview, setPreview] = useState(null);
    const [fileType, setFileType] = useState(null);

    const imageFile = watch("content");

    // Prefill form in edit mode
    useEffect(() => {
        fetchCampaigns();
        fetchCategories();
    }, []);

    const handleImagePreview = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);

            if (file.type.startsWith("video")) {
                setFileType("video");
            } else if (file.type.startsWith("image")) {
                setFileType("image");
            }
        }
    };

    const fetchCampaigns = async () => {
        try {
            const res = await axios.get("/campaign/campaigns");
            setCampaigns(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get("/category/categories");
            setCategories(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (mode === "edit" && advertisementData && campaigns.length && categories.length) {
            setValue("campaign_id", advertisementData.campaign_id?._id)
            setValue("category_id", advertisementData.category_id?._id)
            setValue("ad_title", advertisementData.ad_title);
            setValue("ad_type", advertisementData.ad_type);
            setPreview(advertisementData.content);

            // Detect file type from ad_type
            if (advertisementData.ad_type === "Image") {
                setFileType("image");
            } else if (advertisementData.ad_type === "Video") {
                setFileType("video");
            }
        }
    }, [mode, advertisementData, campaigns, categories, setValue]);


    const submitHandler = async (data) => {
        try {
            const formData = new FormData();

            formData.append("campaign_id", data.campaign_id);
            formData.append("category_id", data.category_id)
            formData.append("ad_title", data.ad_title);
            formData.append("ad_type", data.ad_type);
            if (data.content?.[0]) {
                formData.append("content", data.content[0]);
            }
            let res;

            if (mode === "add") {
                res = await axios.post("/ads/advertisement", formData);
                console.log("add advertisement", res)
            } else {
                res = await axios.put(
                    `/ads/advertisement/${advertisementData._id}`,
                    formData
                );
            }
            if (res.status == 200 || res.status === 201) {
                toast.success(
                    mode === "add"
                        ? "Advertisement Created Successfully!"
                        : "Advertisement Updated Successfully!"
                );
                refreshAdvertisements();
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
                            ? "Add New Advertisement"
                            : mode === "edit"
                                ? "Edit Advertisement"
                                : "Advertisement Details"
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
                                {advertisementData?.campaign_id?.name
                                    ?.split(" ")
                                    .map(n => n[0])
                                    .join("")}
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">
                                    {advertisementData?.ad_title}
                                </h3>

                                <p className="text-sm text-slate-500">
                                    Advertiser: {advertisementData?.campaign_id?.name}
                                </p>
                            </div>

                            {/* Status */}
                            <span className={`ml-auto px-3 py-1 text-xs rounded-full font-medium
                                    ${advertisementData?.status === "active"
                                    ? "bg-emerald-100 text-emerald-600"
                                    : advertisementData?.status === "inactive"
                                        ? "bg-slate-100 text-slate-500"
                                        : "bg-orange-100 text-orange-600"}
                                `}>
                                {advertisementData?.status}
                            </span>

                        </div>

                        {/* Campaign Info Grid */}
                        <div className="grid grid-cols-2 gap-4">

                            {/* Budget */}
                            <div className="bg-slate-50 border rounded-lg p-4">
                                <p className="text-xs text-slate-500 mb-1">Advertisement Type</p>
                                <p className="text-lg font-semibold text-indigo-600">
                                    {advertisementData?.ad_type}
                                </p>
                            </div>

                            {/* Target Age */}
                            <div className="bg-slate-50 border rounded-lg p-4">
                                <p className="text-xs text-slate-500 mb-1">Content</p>
                                <p className="font-medium text-slate-700">
                                    {advertisementData?.ad_type === "Image" ? (
                                        <img
                                            src={advertisementData?.content}
                                            alt="preview"
                                            className="w-full h-50 object-cover border"
                                        />
                                    ) : (
                                        <video
                                            src={advertisementData?.content}
                                            controls
                                            className="w-full h-48 rounded-lg"
                                        />
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    < form onSubmit={handleSubmit(submitHandler)} className="flex flex-col max-h-[80vh]">
                        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                            {/* Campaign Name */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Advertisement Title
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter Advertisement Title"
                                    {...register("ad_title", { required: "Advertisement title is required" })}
                                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />

                                {errors.ad_title && (
                                    <p className="text-red-500 text-sm">{errors.ad_title.message}</p>
                                )}
                            </div>

                            {/* Budget */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Advertisement Type
                                </label>

                                <select
                                    {...register("ad_type", { required: "Advertisement type is required" })}
                                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="">Select Advertisement Type</option>
                                    <option value="Image">Image</option>
                                    <option value="Video">Video</option>
                                </select>

                                {errors.ad_type && (
                                    <p className="text-red-500 text-sm">{errors.ad_type.message}</p>
                                )}
                            </div>

                            {/* Campaign Dropdown */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Campaign
                                </label>

                                <select
                                    {...register("campaign_id", { required: "Campaign is required" })}
                                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="">Select Campaign</option>

                                    {campaigns.map((campaign) => (
                                        <option key={campaign._id} value={campaign._id}>
                                            {campaign.name}
                                        </option>
                                    ))}
                                </select>

                                {errors.campaign_id && (
                                    <p className="text-red-500 text-sm">{errors.campaign_id.message}</p>
                                )}
                            </div>

                            {/* Category Dropdown */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Category
                                </label>

                                <select
                                    {...register("category_id", { required: "Category is required" })}
                                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="">Select Category</option>

                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>

                                {errors.category_id && (
                                    <p className="text-red-500 text-sm">{errors.category_id.message}</p>
                                )}
                            </div>

                            {/* Image */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Advertisement Content
                                </label>

                                <div className="flex items-center gap-4 mt-2">

                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        {...register("content")}
                                        onChange={handleImagePreview}
                                    />

                                    {preview && (
                                        <div className="mt-4">

                                            {fileType === "image" && (
                                                <img
                                                    src={preview}
                                                    alt="preview"
                                                    className="w-full h-48 object-cover rounded-lg"
                                                />
                                            )}

                                            {fileType === "video" && (
                                                <video
                                                    src={preview}
                                                    controls
                                                    className="w-full h-48 rounded-lg"
                                                />
                                            )}

                                        </div>
                                    )}

                                </div>
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
                                    {mode === "add" ? "Save Advertisement" : "Update Advertisement"}
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

export default AdvertisementModal;