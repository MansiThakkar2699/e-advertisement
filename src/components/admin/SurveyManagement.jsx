import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    Plus,
    Search,
    Eye,
    Pencil,
    Trash2,
    ClipboardList,
    X,
    CheckCircle2,
    Clock3,
    Ban,
    Filter
} from "lucide-react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const statusStyles = {
    active: "bg-green-50 text-green-600 border border-green-200",
    inactive: "bg-yellow-50 text-yellow-600 border border-yellow-200",
    deleted: "bg-red-50 text-red-600 border border-red-200"
};

const getEmptyQuestion = () => ({
    question: "",
    options: ["", ""]
});

const SurveyManagement = () => {
    const [surveys, setSurveys] = useState([]);
    const [categories, setCategories] = useState([]);
    const [campaigns, setCampaigns] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [openFormModal, setOpenFormModal] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const [mode, setMode] = useState("add"); // add | edit
    const [selectedSurvey, setSelectedSurvey] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [btnLoading, setBtnLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category_id: "",
        campaign_id: "",
        status: "active",
        questions: [getEmptyQuestion()]
    });

    const token = localStorage.getItem("token");

    const fetchSurveys = async () => {
        try {
            const response = await axios.get("/survey/admin/surveys");
            setSurveys(response.data.data || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch surveys");
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get("/category/categories",
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            setCategories(response.data.data || []);
        } catch (error) {
            setCategories([]);
        }
    };

    const fetchCampaigns = async () => {
        try {
            const response = await axios.get("/campaign/campaigns",
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            setCampaigns(response.data.data || []);
        } catch (error) {
            setCampaigns([]);
        }
    };

    useEffect(() => {
        fetchSurveys();
        fetchCategories();
        fetchCampaigns();
    }, []);

    const filteredSurveys = useMemo(() => {
        let filtered = [...surveys];

        if (search.trim()) {
            filtered = filtered.filter(
                (item) =>
                    item.title?.toLowerCase().includes(search.toLowerCase()) ||
                    item.description?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (statusFilter) {
            filtered = filtered.filter((item) => item.status === statusFilter);
        }

        return filtered;
    }, [surveys, search, statusFilter]);

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            category_id: "",
            campaign_id: "",
            status: "active",
            questions: [getEmptyQuestion()]
        });
    };

    const handleOpenAdd = () => {
        setMode("add");
        setSelectedSurvey(null);
        resetForm();
        setOpenFormModal(true);
    };

    const handleOpenEdit = (survey) => {
        setMode("edit");
        setSelectedSurvey(survey);
        setFormData({
            title: survey.title || "",
            description: survey.description || "",
            category_id: survey.category_id?._id || survey.category_id || "",
            campaign_id: survey.campaign_id?._id || survey.campaign_id || "",
            status: survey.status || "active",
            questions:
                survey.questions?.length > 0
                    ? survey.questions.map((q) => ({
                        question: q.question || "",
                        options: q.options?.length > 0 ? q.options : ["", ""]
                    }))
                    : [{ ...emptyQuestion }]
        });
        setOpenFormModal(true);
    };

    const handleOpenView = (survey) => {
        setSelectedSurvey(survey);
        setOpenViewModal(true);
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[index][field] = value;
        setFormData((prev) => ({
            ...prev,
            questions: updatedQuestions
        }));
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        setFormData((prev) => {
            const updatedQuestions = prev.questions.map((q, qIndex) => {
                if (qIndex !== questionIndex) return q;

                return {
                    ...q,
                    options: q.options.map((opt, optIndex) =>
                        optIndex === optionIndex ? value : opt
                    )
                };
            });

            return {
                ...prev,
                questions: updatedQuestions
            };
        });
    };

    // const handleOptionChange = (questionIndex, optionIndex, value) => {
    //     const updatedQuestions = [...formData.questions];
    //     updatedQuestions[questionIndex].options[optionIndex] = value;

    //     setFormData((prev) => ({
    //         ...prev,
    //         questions: updatedQuestions
    //     }));
    // };

    const addQuestion = () => {
        setFormData((prev) => ({
            ...prev,
            questions: [...prev.questions, getEmptyQuestion()]
        }));
    };

    const removeQuestion = (index) => {
        const updatedQuestions = formData.questions.filter((_, i) => i !== index);
        setFormData((prev) => ({
            ...prev,
            questions: updatedQuestions.length > 0 ? updatedQuestions : [getEmptyQuestion()]
        }));
    };

    // const addOption = (questionIndex) => {
    //     const updatedQuestions = [...formData.questions];
    //     updatedQuestions[questionIndex].options.push("");

    //     setFormData((prev) => ({
    //         ...prev,
    //         questions: updatedQuestions
    //     }));
    // };

    const addOption = (questionIndex) => {
        setFormData((prev) => {
            const updatedQuestions = prev.questions.map((q, qIndex) => {
                if (qIndex !== questionIndex) return q;

                return {
                    ...q,
                    options: [...q.options, ""]
                };
            });

            return {
                ...prev,
                questions: updatedQuestions
            };
        });
    };

    const removeOption = (questionIndex, optionIndex) => {
        setFormData((prev) => {
            const selectedQuestion = prev.questions[questionIndex];

            if (selectedQuestion.options.length <= 2) {
                toast.error("At least 2 options are required");
                return prev;
            }

            const updatedQuestions = prev.questions.map((q, qIndex) => {
                if (qIndex !== questionIndex) return q;

                return {
                    ...q,
                    options: q.options.filter((_, optIndex) => optIndex !== optionIndex)
                };
            });

            return {
                ...prev,
                questions: updatedQuestions
            };
        });
    };

    // const removeOption = (questionIndex, optionIndex) => {
    //     const updatedQuestions = [...formData.questions];

    //     if (updatedQuestions[questionIndex].options.length <= 2) {
    //         toast.error("At least 2 options are required");
    //         return;
    //     }

    //     updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter(
    //         (_, i) => i !== optionIndex
    //     );

    //     setFormData((prev) => ({
    //         ...prev,
    //         questions: updatedQuestions
    //     }));
    // };

    const validateForm = () => {
        if (!formData.title.trim()) {
            toast.error("Survey title is required");
            return false;
        }

        if (formData.questions.length === 0) {
            toast.error("At least one question is required");
            return false;
        }

        for (let i = 0; i < formData.questions.length; i++) {
            const q = formData.questions[i];

            if (!q.question.trim()) {
                toast.error(`Question ${i + 1} is required`);
                return false;
            }

            const validOptions = q.options.filter((opt) => opt.trim() !== "");
            if (validOptions.length < 2) {
                toast.error(`Question ${i + 1} must have at least 2 options`);
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async () => {
        try {
            if (!validateForm()) return;

            setBtnLoading(true);

            const payload = {
                title: formData.title,
                description: formData.description,
                category_id: formData.category_id || null,
                campaign_id: formData.campaign_id || null,
                status: formData.status,
                questions: formData.questions.map((q) => ({
                    question: q.question,
                    options: q.options.filter((opt) => opt.trim() !== "")
                }))
            };

            let response;

            if (mode === "add") {
                response = await axios.post("/survey/survey", payload);
            } else {
                response = await axios.put(`/survey/survey/${selectedSurvey._id}`, payload);
            }

            if (response.status === 200 || response.status === 201) {
                toast.success(
                    mode === "add"
                        ? "Survey created successfully"
                        : "Survey updated successfully"
                );

                setOpenFormModal(false);
                resetForm();
                fetchSurveys();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save survey");
        } finally {
            setBtnLoading(false);
        }
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/survey/survey/${deleteId}`);
            toast.success("Survey deleted successfully");
            setOpenDeleteModal(false);
            setDeleteId(null);
            fetchSurveys();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete survey");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">
            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Survey Management</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Create and manage viewer surveys
                    </p>
                </div>

                <button
                    onClick={handleOpenAdd}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
                >
                    <Plus size={16} />
                    Add Survey
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6">
                <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search survey by title or description..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                    </div>

                    <div className="relative min-w-[220px]">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Survey Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Survey</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Questions</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Linked To</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Created</th>
                                <th className="text-center px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredSurveys.length > 0 ? (
                                filteredSurveys.map((survey) => (
                                    <tr key={survey._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                                    <ClipboardList size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800">{survey.title}</p>
                                                    <p className="text-sm text-slate-500 line-clamp-1">
                                                        {survey.description || "No description"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {survey.questions?.length || 0}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="space-y-1 text-sm text-slate-600">
                                                <p>Category: {survey.category_id?.name || "N/A"}</p>
                                                <p>Campaign: {survey.campaign_id?.name || "N/A"}</p>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[survey.status] || "bg-slate-50 text-slate-600 border border-slate-200"}`}>
                                                {survey.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {survey.createdAt ? new Date(survey.createdAt).toLocaleDateString() : "N/A"}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenView(survey)}
                                                    className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                                                    title="View"
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                <button
                                                    onClick={() => handleOpenEdit(survey)}
                                                    className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition"
                                                    title="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setDeleteId(survey._id);
                                                        setOpenDeleteModal(true);
                                                    }}
                                                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center">
                                            <ClipboardList className="text-slate-300 mb-3" size={28} />
                                            <p className="text-slate-500 font-medium">No surveys found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {openFormModal && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 rounded-t-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {mode === "add" ? "Create Survey" : "Update Survey"}
                                </h2>
                                <p className="text-sm text-slate-300 mt-1">
                                    Add survey details and questions
                                </p>
                            </div>

                            <button
                                onClick={() => setOpenFormModal(false)}
                                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 bg-slate-50 space-y-6">
                            {/* Basic Info */}
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Survey Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Survey Title
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, title: e.target.value }))
                                            }
                                            placeholder="Enter survey title"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            rows="3"
                                            value={formData.description}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, description: e.target.value }))
                                            }
                                            placeholder="Enter survey description"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Category
                                        </label>
                                        <select
                                            value={formData.category_id}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, category_id: e.target.value }))
                                            }
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((item) => (
                                                <option key={item._id} value={item._id}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Campaign
                                        </label>
                                        <select
                                            value={formData.campaign_id}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, campaign_id: e.target.value }))
                                            }
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                                        >
                                            <option value="">Select Campaign</option>
                                            {campaigns.map((item) => (
                                                <option key={item._id} value={item._id}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {mode === "edit" && (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Status
                                            </label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, status: e.target.value }))
                                                }
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Questions */}
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-slate-800">Survey Questions</h3>

                                    <button
                                        type="button"
                                        onClick={addQuestion}
                                        className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
                                    >
                                        Add Question
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {formData.questions.map((q, questionIndex) => (
                                        <div
                                            key={questionIndex}
                                            className="border border-slate-200 rounded-2xl p-4 bg-slate-50"
                                        >
                                            <div className="flex items-center justify-between gap-3 mb-4">
                                                <h4 className="font-semibold text-slate-800">
                                                    Question {questionIndex + 1}
                                                </h4>

                                                <button
                                                    type="button"
                                                    onClick={() => removeQuestion(questionIndex)}
                                                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                                    Question Text
                                                </label>
                                                <input
                                                    type="text"
                                                    value={q.question}
                                                    onChange={(e) =>
                                                        handleQuestionChange(questionIndex, "question", e.target.value)
                                                    }
                                                    placeholder="Enter question"
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <label className="block text-sm font-medium text-slate-700">
                                                    Options
                                                </label>

                                                {q.options.map((option, optionIndex) => (
                                                    <div key={optionIndex} className="flex items-center gap-3">
                                                        <input
                                                            type="text"
                                                            value={option}
                                                            onChange={(e) =>
                                                                handleOptionChange(questionIndex, optionIndex, e.target.value)
                                                            }
                                                            placeholder={`Option ${optionIndex + 1}`}
                                                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none"
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() => removeOption(questionIndex, optionIndex)}
                                                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ))}

                                                <button
                                                    type="button"
                                                    onClick={() => addOption(questionIndex)}
                                                    className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
                                                >
                                                    Add Option
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setOpenFormModal(false)}
                                    className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    disabled={btnLoading}
                                    className="px-5 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
                                >
                                    {btnLoading
                                        ? mode === "add"
                                            ? "Creating..."
                                            : "Updating..."
                                        : mode === "add"
                                            ? "Create Survey"
                                            : "Update Survey"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {openViewModal && selectedSurvey && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 rounded-t-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                            <div>
                                <h2 className="text-xl font-semibold">Survey Details</h2>
                                <p className="text-sm text-slate-300 mt-1">
                                    View complete survey information
                                </p>
                            </div>

                            <button
                                onClick={() => setOpenViewModal(false)}
                                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 bg-slate-50 space-y-5">
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-800">{selectedSurvey.title}</h3>
                                        <p className="text-slate-500 mt-2">
                                            {selectedSurvey.description || "No description"}
                                        </p>
                                    </div>

                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[selectedSurvey.status] || "bg-slate-50 text-slate-600 border border-slate-200"}`}>
                                        {selectedSurvey.status}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Category</p>
                                        <p className="mt-2 text-slate-800 font-medium">{selectedSurvey.category_id?.name || "N/A"}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Campaign</p>
                                        <p className="mt-2 text-slate-800 font-medium">{selectedSurvey.campaign_id?.name || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Questions</h3>

                                <div className="space-y-5">
                                    {selectedSurvey.questions?.map((q, index) => (
                                        <div key={index} className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                                            <p className="font-semibold text-slate-800 mb-3">
                                                Q{index + 1}. {q.question}
                                            </p>

                                            <div className="space-y-2">
                                                {q.options?.map((option, optionIndex) => (
                                                    <div
                                                        key={optionIndex}
                                                        className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700"
                                                    >
                                                        {option}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={() => setOpenViewModal(false)}
                                    className="px-5 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {openDeleteModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl">
                        <div className="p-5 border-b">
                            <h3 className="text-lg font-semibold text-slate-800">Delete Survey</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Are you sure you want to delete this survey? This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 p-5">
                            <button
                                onClick={() => {
                                    setOpenDeleteModal(false);
                                    setDeleteId(null);
                                }}
                                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SurveyManagement;