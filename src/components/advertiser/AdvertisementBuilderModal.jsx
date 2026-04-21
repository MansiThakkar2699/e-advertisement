import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { Rnd } from "react-rnd";
import {
    X,
    Type,
    Image as ImageIcon,
    RectangleHorizontal,
    Trash2,
    Palette,
    Save,
    LayoutTemplate,
    Video,
    Megaphone,
    User,
    FolderOpen,
    Target,
    Wallet,
    MonitorPlay,
    CircleCheck,
    Clock3,
    CirclePause,
    CheckCheck,
    CircleX,
    Ban,
    BadgePercent,
    CalendarDays
} from "lucide-react";

const createId = () => Date.now().toString() + Math.random().toString(36).slice(2);

const defaultCanvas = {
    width: 800,
    height: 450,
    backgroundColor: "#ffffff"
};

const AdvertisementBuilderModal = ({
    mode,
    isOpen,
    closeModal,
    refreshAdvertisements,
    advertisementData,
    category = [],
    campaigns = [],
    loading = false
}) => {
    const fileInputRef = useRef(null);
    const builderCanvasRef = useRef(null);
    const categoryDropdownRef = useRef(null);
    const campaignDropdownRef = useRef(null);

    const [btnLoading, setBtnLoading] = useState(false);

    const [adTitle, setAdTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [campaignId, setCampaignId] = useState("");
    const [customCategory, setCustomCategory] = useState("");
    const [offerTitle, setOfferTitle] = useState("");
    const [offerValue, setOfferValue] = useState("");
    const [offerExpiry, setOfferExpiry] = useState("");

    const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false);
    const [openCampaignDropdown, setOpenCampaignDropdown] = useState(false);

    const [categorySearch, setCategorySearch] = useState("");
    const [campaignSearch, setCampaignSearch] = useState("");

    const [canvas, setCanvas] = useState(defaultCanvas);
    const [elements, setElements] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    const selectedElement = useMemo(
        () => elements.find((item) => item.id === selectedId),
        [elements, selectedId]
    );

    useEffect(() => {
        if (!isOpen) return;

        if (mode === "edit" && advertisementData) {
            let parsedDesignJson = advertisementData?.design_json;

            if (typeof parsedDesignJson === "string") {
                try {
                    parsedDesignJson = JSON.parse(parsedDesignJson);
                } catch (error) {
                    console.error("Failed to parse design_json:", error);
                    parsedDesignJson = null;
                }
            }
            setAdTitle(advertisementData?.ad_title || "");
            setDescription(advertisementData?.description || "");
            setCategoryId(
                advertisementData?.category_id?._id ||
                advertisementData?.category_id ||
                (advertisementData?.custom_category ? "other" : "")
            );
            setCampaignId(
                advertisementData?.campaign_details?._id ||
                advertisementData?.campaign_id?._id ||
                advertisementData?.campaign_id ||
                ""
            );
            setCustomCategory(advertisementData?.custom_category || "");
            setCanvas(advertisementData?.design_json?.canvas || defaultCanvas);
            setElements(advertisementData?.design_json?.elements || []);
            setOfferTitle(advertisementData?.offer?.title || "");
            setOfferValue(advertisementData?.offer?.value || "");
            setOfferExpiry(
                advertisementData?.offer?.expiry
                    ? new Date(advertisementData.offer.expiry).toISOString().split("T")[0]
                    : ""
            );
        } else if (mode === "add") {
            setAdTitle("");
            setDescription("");
            setCategoryId("");
            setCampaignId("");
            setCustomCategory("");
            setCanvas(defaultCanvas);
            setElements([]);
            setOfferTitle("");
            setOfferValue("");
            setOfferExpiry("");
        }

        setSelectedId(null);
        setCategorySearch("");
        setCampaignSearch("");
        setOpenCategoryDropdown(false);
        setOpenCampaignDropdown(false);
    }, [mode, advertisementData, isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                categoryDropdownRef.current &&
                !categoryDropdownRef.current.contains(event.target)
            ) {
                setOpenCategoryDropdown(false);
            }

            if (
                campaignDropdownRef.current &&
                !campaignDropdownRef.current.contains(event.target)
            ) {
                setOpenCampaignDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredCategories = useMemo(() => {
        const baseCategories = Array.isArray(category) ? category : [];

        const searched = baseCategories.filter((item) =>
            (item?.name || "").toLowerCase().includes(categorySearch.toLowerCase())
        );

        const hasOther = searched.some((item) => item._id === "other");

        return hasOther
            ? searched
            : [
                ...searched,
                {
                    _id: "other",
                    name: "Other"
                }
            ];
    }, [category, categorySearch]);

    const filteredCampaigns = useMemo(() => {
        const baseCampaigns = Array.isArray(campaigns) ? campaigns : [];

        return baseCampaigns.filter((item) =>
            (item?.name || "").toLowerCase().includes(campaignSearch.toLowerCase())
        );
    }, [campaigns, campaignSearch]);

    const selectedCategoryName =
        categoryId === "other"
            ? "Other"
            : category.find((item) => item._id === categoryId)?.name || "";

    const selectedCampaignName =
        campaigns.find((item) => item._id === campaignId)?.name || "";

    const addText = () => {
        const newElement = {
            id: createId(),
            type: "text",
            x: 40,
            y: 40,
            width: 220,
            height: 60,
            text: "Your headline here",
            style: {
                color: "#111827",
                fontSize: 28,
                fontWeight: "700",
                textAlign: "left",
                backgroundColor: "transparent"
            }
        };

        setElements((prev) => [...prev, newElement]);
        setSelectedId(newElement.id);
    };

    const addButton = () => {
        const newElement = {
            id: createId(),
            type: "button",
            x: 60,
            y: 140,
            width: 160,
            height: 50,
            text: "Shop Now",
            style: {
                color: "#ffffff",
                fontSize: 18,
                fontWeight: "600",
                textAlign: "center",
                backgroundColor: "#4f46e5",
                borderRadius: 12
            }
        };

        setElements((prev) => [...prev, newElement]);
        setSelectedId(newElement.id);
    };

    const addImage = () => {
        fileInputRef.current?.click();
    };

    const handleImageUpload = async (e) => {
        try {
            const file = e.target.files?.[0];
            if (!file) return;

            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login again");
                return;
            }

            const formData = new FormData();
            formData.append("image", file);

            const response = await axios.post(
                "/ads/upload-builder-image",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const imageUrl = response?.data?.data?.secure_url;

            if (!imageUrl) {
                toast.error("Failed to upload image");
                return;
            }

            const newElement = {
                id: createId(),
                type: "image",
                x: 300,
                y: 50,
                width: 220,
                height: 180,
                src: imageUrl,
                style: {
                    borderRadius: 16
                }
            };

            setElements((prev) => [...prev, newElement]);
            setSelectedId(newElement.id);

            // reset input so same file can be selected again
            e.target.value = "";
        } catch (error) {
            console.error("Builder image upload error:", error);
            toast.error(
                error?.response?.data?.message || "Failed to upload builder image"
            );
        }
    };

    const updateElement = (id, updates) => {
        setElements((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
        );
    };

    const updateElementStyle = (id, styleUpdates) => {
        setElements((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        style: {
                            ...item.style,
                            ...styleUpdates
                        }
                    }
                    : item
            )
        );
    };

    const deleteSelected = () => {
        if (!selectedId) return;
        setElements((prev) => prev.filter((item) => item.id !== selectedId));
        setSelectedId(null);
    };

    const applyTemplate = (templateType) => {
        if (templateType === "sale") {
            setCanvas({
                width: 800,
                height: 450,
                backgroundColor: "#eef2ff"
            });

            setElements([
                {
                    id: createId(),
                    type: "text",
                    x: 40,
                    y: 40,
                    width: 300,
                    height: 70,
                    text: "BIG SALE",
                    style: {
                        color: "#1e1b4b",
                        fontSize: 40,
                        fontWeight: "800",
                        textAlign: "left",
                        backgroundColor: "transparent"
                    }
                },
                {
                    id: createId(),
                    type: "text",
                    x: 40,
                    y: 115,
                    width: 260,
                    height: 50,
                    text: "Up to 50% Off",
                    style: {
                        color: "#4338ca",
                        fontSize: 24,
                        fontWeight: "600",
                        textAlign: "left",
                        backgroundColor: "transparent"
                    }
                },
                {
                    id: createId(),
                    type: "button",
                    x: 40,
                    y: 190,
                    width: 150,
                    height: 48,
                    text: "Shop Now",
                    style: {
                        color: "#ffffff",
                        fontSize: 16,
                        fontWeight: "600",
                        textAlign: "center",
                        backgroundColor: "#4f46e5",
                        borderRadius: 12
                    }
                }
            ]);
            setSelectedId(null);
        }

        if (templateType === "product") {
            setCanvas({
                width: 800,
                height: 450,
                backgroundColor: "#f8fafc"
            });

            setElements([
                {
                    id: createId(),
                    type: "text",
                    x: 40,
                    y: 35,
                    width: 320,
                    height: 60,
                    text: "New Collection",
                    style: {
                        color: "#0f172a",
                        fontSize: 34,
                        fontWeight: "800",
                        textAlign: "left",
                        backgroundColor: "transparent"
                    }
                },
                {
                    id: createId(),
                    type: "text",
                    x: 40,
                    y: 95,
                    width: 280,
                    height: 50,
                    text: "Premium launch offer",
                    style: {
                        color: "#475569",
                        fontSize: 20,
                        fontWeight: "500",
                        textAlign: "left",
                        backgroundColor: "transparent"
                    }
                },
                {
                    id: createId(),
                    type: "button",
                    x: 40,
                    y: 165,
                    width: 145,
                    height: 46,
                    text: "Buy Now",
                    style: {
                        color: "#ffffff",
                        fontSize: 16,
                        fontWeight: "600",
                        textAlign: "center",
                        backgroundColor: "#0f172a",
                        borderRadius: 12
                    }
                }
            ]);
            setSelectedId(null);
        }
    };

    const handleSave = async () => {
        try {
            if (!adTitle.trim()) {
                toast.error("Advertisement title is required");
                return;
            }

            if (categoryId === "other" && !customCategory.trim()) {
                toast.error("Please enter custom category");
                return;
            }

            if (!builderCanvasRef.current) {
                toast.error("Advertisement preview not found");
                return;
            }

            setBtnLoading(true);

            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Token not found. Please login again.");
                return;
            }

            const decoded = jwtDecode(token);

            setOpenCategoryDropdown(false);
            setOpenCampaignDropdown(false);
            setSelectedId(null);

            await new Promise((resolve) => setTimeout(resolve, 100));

            const capturedCanvas = await html2canvas(builderCanvasRef.current, {
                useCORS: true,
                scale: 1,
                backgroundColor: "#ffffff"
            });

            const imageBlob = await new Promise((resolve, reject) => {
                capturedCanvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error("Failed to create image blob"));
                            return;
                        }
                        resolve(blob);
                    },
                    "image/jpeg",
                    0.8
                );
            });

            const formData = new FormData();
            formData.append("advertiser_id", decoded.id);
            formData.append("ad_title", adTitle);
            formData.append("description", description || "");
            formData.append(
                "category_id",
                categoryId === "other" ? "" : categoryId || ""
            );
            formData.append(
                "custom_category",
                categoryId === "other" ? customCategory : ""
            );
            formData.append("campaign_id", campaignId || "");
            formData.append("ad_type", "Image");
            formData.append("design_json", JSON.stringify({ canvas, elements }));
            formData.append("content", imageBlob, `${adTitle || "advertisement"}.jpg`);
            formData.append("offer[title]", offerTitle || "");
            formData.append("offer[value]", offerValue || "");
            formData.append("offer[expiry]", offerExpiry || "");

            let response;

            if (mode === "add") {
                response = await axios.post("/ads/advertisement", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("res : ", response)
            } else if (mode === "edit" && advertisementData?._id) {
                response = await axios.put(
                    `/ads/advertisement/${advertisementData._id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                console.log("update-res : ", response)
            }

            if (response?.status === 200 || response?.status === 201) {
                toast.success(
                    mode === "add"
                        ? "Advertisement created successfully"
                        : "Advertisement updated successfully"
                );

                refreshAdvertisements?.();
                closeModal();
            }
        } catch (error) {
            console.error("Save advertisement error:", error);
            toast.error(error?.response?.data?.message || "Failed to save advertisement");
        } finally {
            setBtnLoading(false);
        }
    };

    if (!isOpen) return null;

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

    const currentStatus = statusMap[advertisementData?.status] || statusMap.pending;
    const StatusIcon = currentStatus.icon;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-7xl h-[92vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white border-b border-slate-700">
                    <div>
                        <h2 className="text-xl font-semibold">
                            {mode === "edit"
                                ? "Update Advertisement"
                                : mode === "view"
                                    ? "Advertisement Details"
                                    : "Drag & Drop Ad Builder"}
                        </h2>
                        <p className="text-sm text-slate-300 mt-1">
                            {mode === "edit"
                                ? "Edit banner-style advertisements with text, images, and buttons"
                                : mode === "view"
                                    ? "View advertisement information"
                                    : "Create banner-style advertisements with text, images, and buttons"}
                        </p>
                    </div>

                    <button
                        onClick={closeModal}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {mode === "view" ? (
                    <div className="flex-1 min-h-0 overflow-y-auto p-6 bg-slate-50 space-y-5">
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl uppercase">
                                        {advertisementData?.ad_title?.slice(0, 3) || "AD"}
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-800">
                                            {advertisementData?.ad_title || "Untitled Advertisement"}
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1">
                                            Campaign: {advertisementData?.campaign_details?.name || "N/A"}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            Advertiser: {advertisementData?.campaign_details?.advertiser_id?.fullName || "Unknown"}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium h-fit ${currentStatus.className}`}
                                >
                                    <StatusIcon size={14} />
                                    {currentStatus.label}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <div className="space-y-5">
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
                                                {advertisementData?.ad_title || "N/A"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                Advertisement Type
                                            </p>
                                            <div className="mt-1 inline-flex items-center gap-2 text-base font-semibold text-slate-800">
                                                {advertisementData?.ad_type === "Image" ? (
                                                    <ImageIcon size={16} className="text-violet-600" />
                                                ) : (
                                                    <Video size={16} className="text-violet-600" />
                                                )}
                                                {advertisementData?.ad_type || "N/A"}
                                            </div>
                                        </div>

                                        <div className="sm:col-span-2">
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                Description
                                            </p>
                                            <p className="mt-1 text-base font-semibold text-slate-800">
                                                {advertisementData?.description || "No description"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                                        <BadgePercent size={18} className="text-rose-600" />
                                        Offer Information
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                Offer Title
                                            </p>
                                            <p className="mt-1 text-base font-semibold text-slate-800">
                                                {advertisementData?.offer?.title || "N/A"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                Offer Value
                                            </p>
                                            <p className="mt-1 text-base font-semibold text-slate-800">
                                                {advertisementData?.offer?.value || "N/A"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                Offer Expiry
                                            </p>
                                            <p className="mt-1 text-base font-semibold text-slate-800">
                                                {advertisementData?.offer?.expiry
                                                    ? new Date(advertisementData.offer.expiry).toLocaleDateString()
                                                    : "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                                        <User size={18} className="text-emerald-600" />
                                        Advertiser Information
                                    </h3>

                                    <div className="flex items-center gap-4">
                                        <img
                                            src={
                                                advertisementData?.campaign_details?.advertiser_id?.profilePic ||
                                                "https://via.placeholder.com/60"
                                            }
                                            alt="advertiser"
                                            className="w-14 h-14 rounded-full object-cover border border-slate-200"
                                        />

                                        <div>
                                            <p className="text-base font-semibold text-slate-800">
                                                {advertisementData?.campaign_details?.advertiser_id?.fullName || "Unknown"}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {advertisementData?.campaign_details?.advertiser_id?.email || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                                        <FolderOpen size={18} className="text-amber-600" />
                                        Category Information
                                    </h3>

                                    <div className="flex items-center gap-4">
                                        <img
                                            src={
                                                advertisementData?.category_id?.image ||
                                                "https://via.placeholder.com/60"
                                            }
                                            alt="category"
                                            className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                                        />

                                        <div>
                                            <p className="text-base font-semibold text-slate-800">
                                                {advertisementData?.category_id?.name || advertisementData?.custom_category || "N/A"}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {advertisementData?.category_id?.description || "No description"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                                        <MonitorPlay size={18} className="text-pink-600" />
                                        Platforms
                                    </h3>

                                    <div className="flex flex-wrap gap-2">
                                        {advertisementData?.campaign_details?.platforms?.length > 0 ? (
                                            advertisementData.campaign_details.platforms.map((platform, index) => (
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
                                                {advertisementData?.campaign_details?.targetAudience?.ageMin ?? "N/A"} -{" "}
                                                {advertisementData?.campaign_details?.targetAudience?.ageMax ?? "N/A"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                Gender
                                            </p>
                                            <p className="mt-1 text-base font-semibold text-slate-800 capitalize">
                                                {advertisementData?.campaign_details?.targetAudience?.gender || "N/A"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                Location
                                            </p>
                                            <p className="mt-1 text-base font-semibold text-slate-800">
                                                {advertisementData?.campaign_details?.targetAudience?.location || "N/A"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                Interests
                                            </p>
                                            <p className="mt-1 text-base font-semibold text-slate-800">
                                                {advertisementData?.campaign_details?.targetAudience?.interests?.length > 0
                                                    ? advertisementData.campaign_details.targetAudience.interests.join(", ")
                                                    : "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                                        {advertisementData?.ad_type === "Image" ? (
                                            <ImageIcon size={18} className="text-violet-600" />
                                        ) : (
                                            <Video size={18} className="text-violet-600" />
                                        )}
                                        Content Preview
                                    </h3>

                                    <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 flex items-center justify-center min-h-[340px]">
                                        {advertisementData?.ad_type === "Image" ? (
                                            <img
                                                src={advertisementData?.content}
                                                alt={advertisementData?.ad_title}
                                                className="max-h-[420px] w-auto rounded-xl object-contain shadow-sm"
                                            />
                                        ) : (
                                            <video
                                                src={advertisementData?.content}
                                                controls
                                                className="w-full max-h-[420px] rounded-xl"
                                            />
                                        )}
                                    </div>
                                </div>

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
                                                ₹{advertisementData?.campaign_details?.totalBudget ?? 0}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                Daily Budget
                                            </p>
                                            <p className="mt-1 text-base font-semibold text-slate-800">
                                                ₹{advertisementData?.campaign_details?.dailyBudget ?? 0}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                Start Date
                                            </p>
                                            <p className="mt-1 text-base font-semibold text-slate-800">
                                                {advertisementData?.campaign_details?.start_date
                                                    ? new Date(advertisementData.campaign_details.start_date).toLocaleDateString()
                                                    : "N/A"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                End Date
                                            </p>
                                            <p className="mt-1 text-base font-semibold text-slate-800">
                                                {advertisementData?.campaign_details?.end_date
                                                    ? new Date(advertisementData.campaign_details.end_date).toLocaleDateString()
                                                    : "N/A"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                Campaign Status
                                            </p>
                                            <p className="mt-1 text-base font-semibold text-slate-800 capitalize">
                                                {advertisementData?.campaign_details?.status || "N/A"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                Created Date
                                            </p>
                                            <p className="mt-1 text-base font-semibold text-slate-800">
                                                {advertisementData?.campaign_details?.createdAt
                                                    ? new Date(advertisementData.campaign_details.createdAt).toLocaleDateString()
                                                    : "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 grid grid-cols-12 min-h-0">
                        <div className="col-span-12 lg:col-span-3 border-r border-slate-200 bg-slate-50 p-5 overflow-y-auto">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Advertisement Title
                                    </label>
                                    <input
                                        type="text"
                                        value={adTitle}
                                        onChange={(e) => setAdTitle(e.target.value)}
                                        placeholder="Enter ad title"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Enter advertisement description"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none resize-none"
                                    />
                                </div>

                                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                                    <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-4">
                                        <BadgePercent size={16} className="text-rose-600" />
                                        Offer Information
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Offer Title
                                            </label>
                                            <input
                                                type="text"
                                                value={offerTitle}
                                                onChange={(e) => setOfferTitle(e.target.value)}
                                                placeholder="e.g. Festive Deal"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Offer Value
                                            </label>
                                            <input
                                                type="text"
                                                value={offerValue}
                                                onChange={(e) => setOfferValue(e.target.value)}
                                                placeholder="e.g. Up to 25% Off"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Offer Expiry
                                            </label>
                                            <div className="relative">
                                                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                                <input
                                                    type="date"
                                                    value={offerExpiry}
                                                    onChange={(e) => setOfferExpiry(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative" ref={categoryDropdownRef}>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Category
                                    </label>

                                    <div
                                        onClick={() => setOpenCategoryDropdown((prev) => !prev)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white cursor-pointer flex items-center justify-between"
                                    >
                                        <span className={selectedCategoryName ? "text-slate-800" : "text-slate-400"}>
                                            {selectedCategoryName || "Select Category"}
                                        </span>
                                        <span className="text-slate-400 text-sm">▼</span>
                                    </div>

                                    {openCategoryDropdown && (
                                        <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                                            <div className="p-2 border-b border-slate-100">
                                                <input
                                                    type="text"
                                                    value={categorySearch}
                                                    onChange={(e) => setCategorySearch(e.target.value)}
                                                    placeholder="Search category..."
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none"
                                                />
                                            </div>

                                            <div className="max-h-60 overflow-y-auto">
                                                {filteredCategories.length > 0 ? (
                                                    filteredCategories.map((item) => (
                                                        <button
                                                            type="button"
                                                            key={item._id}
                                                            onClick={() => {
                                                                setCategoryId(item._id);
                                                                setOpenCategoryDropdown(false);
                                                                setCategorySearch("");

                                                                if (item._id !== "other") {
                                                                    setCustomCategory("");
                                                                }
                                                            }}
                                                            className={`w-full text-left px-4 py-3 hover:bg-indigo-50 transition ${categoryId === item._id
                                                                ? "bg-indigo-50 text-indigo-700 font-medium"
                                                                : "text-slate-700"
                                                                }`}
                                                        >
                                                            {item.name}
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-sm text-slate-500">
                                                        No category found
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {categoryId === "other" && (
                                        <div className="mt-3">
                                            <input
                                                type="text"
                                                value={customCategory}
                                                onChange={(e) => setCustomCategory(e.target.value)}
                                                placeholder="Enter custom category"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="relative" ref={campaignDropdownRef}>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Campaign
                                    </label>

                                    <div
                                        onClick={() => setOpenCampaignDropdown((prev) => !prev)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white cursor-pointer flex items-center justify-between"
                                    >
                                        <span className={selectedCampaignName ? "text-slate-800" : "text-slate-400"}>
                                            {selectedCampaignName || "Select Campaign"}
                                        </span>
                                        <span className="text-slate-400 text-sm">▼</span>
                                    </div>

                                    {openCampaignDropdown && (
                                        <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                                            <div className="p-2 border-b border-slate-100">
                                                <input
                                                    type="text"
                                                    value={campaignSearch}
                                                    onChange={(e) => setCampaignSearch(e.target.value)}
                                                    placeholder="Search campaign..."
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none"
                                                />
                                            </div>

                                            <div className="max-h-60 overflow-y-auto">
                                                {filteredCampaigns.length > 0 ? (
                                                    filteredCampaigns.map((item) => (
                                                        <button
                                                            type="button"
                                                            key={item._id}
                                                            onClick={() => {
                                                                setCampaignId(item._id);
                                                                setOpenCampaignDropdown(false);
                                                                setCampaignSearch("");
                                                            }}
                                                            className={`w-full text-left px-4 py-3 hover:bg-indigo-50 transition ${campaignId === item._id
                                                                ? "bg-indigo-50 text-indigo-700 font-medium"
                                                                : "text-slate-700"
                                                                }`}
                                                        >
                                                            {item.name}
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-sm text-slate-500">
                                                        No campaign found
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-3">
                                        <LayoutTemplate size={16} className="text-indigo-600" />
                                        Templates
                                    </h3>

                                    <div className="grid gap-3">
                                        <button
                                            type="button"
                                            onClick={() => applyTemplate("sale")}
                                            className="text-left px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 transition"
                                        >
                                            <p className="font-medium text-slate-800">Sale Banner</p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Headline + subtext + CTA
                                            </p>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => applyTemplate("product")}
                                            className="text-left px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 transition"
                                        >
                                            <p className="font-medium text-slate-800">Product Promo</p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Product-focused banner layout
                                            </p>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-slate-800 mb-3">
                                        Add Elements
                                    </h3>

                                    <div className="grid gap-3">
                                        <button
                                            type="button"
                                            onClick={addText}
                                            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition"
                                        >
                                            <Type size={16} className="text-indigo-600" />
                                            Add Text
                                        </button>

                                        <button
                                            type="button"
                                            onClick={addImage}
                                            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition"
                                        >
                                            <ImageIcon size={16} className="text-indigo-600" />
                                            Add Image
                                        </button>

                                        <button
                                            type="button"
                                            onClick={addButton}
                                            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition"
                                        >
                                            <RectangleHorizontal size={16} className="text-indigo-600" />
                                            Add Button
                                        </button>
                                    </div>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </div>

                                <div>
                                    <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-3">
                                        <Palette size={16} className="text-indigo-600" />
                                        Canvas
                                    </h3>

                                    <label className="block text-xs text-slate-500 mb-2">
                                        Background Color
                                    </label>
                                    <input
                                        type="color"
                                        value={canvas.backgroundColor}
                                        onChange={(e) =>
                                            setCanvas((prev) => ({
                                                ...prev,
                                                backgroundColor: e.target.value
                                            }))
                                        }
                                        className="w-full h-12 rounded-lg border border-slate-200 bg-white cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-12 lg:col-span-6 bg-slate-100 p-6 overflow-auto flex items-start justify-center">
                            <div
                                ref={builderCanvasRef}
                                data-ad-builder-canvas="true"
                                className="relative overflow-hidden"
                                style={{
                                    width: canvas.width,
                                    height: canvas.height,
                                    backgroundColor: canvas.backgroundColor,
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "16px",
                                    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.10)"
                                }}
                                onClick={() => setSelectedId(null)}
                            >
                                {elements.map((element) => (
                                    <Rnd
                                        key={element.id}
                                        size={{ width: element.width, height: element.height }}
                                        position={{ x: element.x, y: element.y }}
                                        bounds="parent"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedId(element.id);
                                        }}
                                        onDragStop={(e, d) => {
                                            updateElement(element.id, { x: d.x, y: d.y });
                                        }}
                                        onResizeStop={(e, direction, ref, delta, position) => {
                                            updateElement(element.id, {
                                                width: parseInt(ref.style.width, 10),
                                                height: parseInt(ref.style.height, 10),
                                                ...position
                                            });
                                        }}
                                        style={{
                                            border:
                                                selectedId === element.id
                                                    ? "2px solid #4f46e5"
                                                    : "1px dashed transparent",
                                            borderRadius: 8
                                        }}
                                    >
                                        {element.type === "text" && (
                                            <div
                                                className="w-full h-full break-words"
                                                style={{
                                                    color: element.style.color,
                                                    fontSize: `${element.style.fontSize}px`,
                                                    fontWeight: element.style.fontWeight,
                                                    textAlign: element.style.textAlign,
                                                    backgroundColor: element.style.backgroundColor,
                                                    padding: 4
                                                }}
                                            >
                                                {element.text}
                                            </div>
                                        )}

                                        {element.type === "button" && (
                                            <div
                                                className="w-full h-full flex items-center justify-center"
                                                style={{
                                                    color: element.style.color,
                                                    fontSize: `${element.style.fontSize}px`,
                                                    fontWeight: element.style.fontWeight,
                                                    textAlign: element.style.textAlign,
                                                    backgroundColor: element.style.backgroundColor,
                                                    borderRadius: `${element.style.borderRadius}px`
                                                }}
                                            >
                                                {element.text}
                                            </div>
                                        )}

                                        {element.type === "image" && (
                                            <img
                                                src={element.src}
                                                alt="element"
                                                className="w-full h-full object-cover"
                                                style={{
                                                    borderRadius: `${element.style.borderRadius || 0}px`
                                                }}
                                            />
                                        )}
                                    </Rnd>
                                ))}
                            </div>
                        </div>

                        <div className="col-span-12 lg:col-span-3 border-l border-slate-200 bg-white p-5 overflow-y-auto">
                            <h3 className="text-sm font-semibold text-slate-800 mb-4">
                                Properties
                            </h3>

                            {selectedElement ? (
                                <div className="space-y-4">
                                    {(selectedElement.type === "text" ||
                                        selectedElement.type === "button") && (
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                                    Text
                                                </label>
                                                <textarea
                                                    value={selectedElement.text}
                                                    onChange={(e) =>
                                                        updateElement(selectedElement.id, {
                                                            text: e.target.value
                                                        })
                                                    }
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                                                    rows={3}
                                                />
                                            </div>
                                        )}

                                    {(selectedElement.type === "text" ||
                                        selectedElement.type === "button") && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                                        Text Color
                                                    </label>
                                                    <input
                                                        type="color"
                                                        value={selectedElement.style.color}
                                                        onChange={(e) =>
                                                            updateElementStyle(selectedElement.id, {
                                                                color: e.target.value
                                                            })
                                                        }
                                                        className="w-full h-12 rounded-lg border border-slate-200"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                                        Font Size
                                                    </label>
                                                    <input
                                                        type="range"
                                                        min="12"
                                                        max="60"
                                                        value={selectedElement.style.fontSize}
                                                        onChange={(e) =>
                                                            updateElementStyle(selectedElement.id, {
                                                                fontSize: Number(e.target.value)
                                                            })
                                                        }
                                                        className="w-full"
                                                    />
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {selectedElement.style.fontSize}px
                                                    </p>
                                                </div>
                                            </>
                                        )}

                                    {selectedElement.type === "button" && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                                    Button Color
                                                </label>
                                                <input
                                                    type="color"
                                                    value={selectedElement.style.backgroundColor}
                                                    onChange={(e) =>
                                                        updateElementStyle(selectedElement.id, {
                                                            backgroundColor: e.target.value
                                                        })
                                                    }
                                                    className="w-full h-12 rounded-lg border border-slate-200"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                                    Border Radius
                                                </label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="40"
                                                    value={selectedElement.style.borderRadius}
                                                    onChange={(e) =>
                                                        updateElementStyle(selectedElement.id, {
                                                            borderRadius: Number(e.target.value)
                                                        })
                                                    }
                                                    className="w-full"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {selectedElement.type === "image" && (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Image Radius
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="40"
                                                value={selectedElement.style.borderRadius || 0}
                                                onChange={(e) =>
                                                    updateElementStyle(selectedElement.id, {
                                                        borderRadius: Number(e.target.value)
                                                    })
                                                }
                                                className="w-full"
                                            />
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={deleteSelected}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition"
                                    >
                                        <Trash2 size={16} />
                                        Delete Selected Element
                                    </button>
                                </div>
                            ) : (
                                <div className="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-4">
                                    Select an element on the canvas to edit its properties.
                                </div>
                            )}

                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={btnLoading || loading || !adTitle.trim()}
                                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                                >
                                    <Save size={16} />
                                    {btnLoading
                                        ? "Saving..."
                                        : mode === "edit"
                                            ? "Update Advertisement"
                                            : "Save Advertisement"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdvertisementBuilderModal;