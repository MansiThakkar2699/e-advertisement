import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    ClipboardList,
    Search,
    Eye,
    X,
    CheckCircle2,
    BarChart3,
    Layers3,
    FolderOpen
} from "lucide-react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import SurveyPieChart from "../charts/SurveyPieChart";
import SurveyBarChart from "../charts/SurveyBarChart";

const statusStyles = {
    active: "bg-green-50 text-green-600 border border-green-200",
    inactive: "bg-yellow-50 text-yellow-600 border border-yellow-200",
    deleted: "bg-red-50 text-red-600 border border-red-200"
};

const AdvertiserSurveyPage = () => {
    const [surveys, setSurveys] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedSurvey, setSelectedSurvey] = useState(null);
    const [surveyResponses, setSurveyResponses] = useState([]);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const advertiserId = decoded.id;

    const fetchAdvertiserSurveys = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/survey/survey/advertiser/${advertiserId}`);
            console.log("response", response);
            setSurveys(response.data.data || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch surveys");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (advertiserId) {
            fetchAdvertiserSurveys();
        }
    }, [advertiserId]);

    const filteredSurveys = useMemo(() => {
        return surveys.filter(
            (item) =>
                item.title?.toLowerCase().includes(search.toLowerCase()) ||
                item.campaign_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
                item.category_id?.name?.toLowerCase().includes(search.toLowerCase())
        );
    }, [surveys, search]);

    const handleViewSurvey = async (survey) => {
        try {
            setSelectedSurvey(survey);
            setOpenViewModal(true);

            const response = await axios.get(`/survey/survey-responses/${survey._id}`);
            setSurveyResponses(response.data.data || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch survey responses");
            setSurveyResponses([]);
        }
    };

    const getQuestionAnalytics = (survey, responses) => {
        if (!survey?.questions) return [];

        return survey.questions.map((questionItem) => {
            const optionStats = questionItem.options.map((option) => {
                const count = responses.filter((response) =>
                    response.answers?.some(
                        (answer) =>
                            answer.question === questionItem.question &&
                            answer.selectedOption === option
                    )
                ).length;

                return {
                    option,
                    count
                };
            });

            const totalAnswers = optionStats.reduce((sum, item) => sum + item.count, 0);

            const optionStatsWithPercentage = optionStats.map((item) => ({
                ...item,
                percentage:
                    totalAnswers > 0 ? ((item.count / totalAnswers) * 100).toFixed(1) : "0.0"
            }));

            return {
                question: questionItem.question,
                options: optionStatsWithPercentage,
                totalAnswers
            };
        });
    };

    const surveyAnalytics = useMemo(() => {
        if (!selectedSurvey) return [];
        return getQuestionAnalytics(selectedSurvey, surveyResponses);
    }, [selectedSurvey, surveyResponses]);

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Survey Insights</h1>
                <p className="text-sm text-slate-500 mt-1">
                    View surveys linked to your campaigns and analyze viewer responses
                </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <p className="text-sm text-slate-500">Total Surveys</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">{surveys.length}</h3>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <p className="text-sm text-slate-500">Active Surveys</p>
                    <h3 className="text-2xl font-bold text-green-600 mt-1">
                        {surveys.filter((item) => item.status === "active").length}
                    </h3>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <p className="text-sm text-slate-500">Total Responses</p>
                    <h3 className="text-2xl font-bold text-indigo-600 mt-1">
                        {surveys.reduce((sum, item) => sum + (item.responseCount || 0), 0)}
                    </h3>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search survey, campaign, or category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                </div>
            </div>

            {/* Survey table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Survey</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Campaign</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Category</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Responses</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
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
                                            {survey.campaign_id?.name || "N/A"}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {survey.category_id?.name || "N/A"}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {survey.responseCount || 0}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[survey.status] || "bg-slate-50 text-slate-600 border border-slate-200"
                                                    }`}
                                            >
                                                {survey.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() => handleViewSurvey(survey)}
                                                    className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                                                    title="View"
                                                >
                                                    <Eye size={16} />
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

            {/* View modal */}
            {openViewModal && selectedSurvey && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 rounded-t-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                            <div>
                                <h2 className="text-xl font-semibold">Survey Insights</h2>
                                <p className="text-sm text-slate-300 mt-1">
                                    View complete survey details and response analytics
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setOpenViewModal(false);
                                    setSelectedSurvey(null);
                                    setSurveyResponses([]);
                                }}
                                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 bg-slate-50 space-y-5">
                            {/* Survey info */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-800">{selectedSurvey.title}</h3>
                                        <p className="text-slate-500 mt-2">{selectedSurvey.description || "No description"}</p>
                                    </div>

                                    <span
                                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[selectedSurvey.status] || "bg-slate-50 text-slate-600 border border-slate-200"
                                            }`}
                                    >
                                        {selectedSurvey.status}
                                    </span>
                                </div>
                            </div>

                            {/* Linked info */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                    <div className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                                        <Layers3 size={18} className="text-indigo-600" />
                                        Campaign
                                    </div>
                                    <p className="text-slate-600">{selectedSurvey.campaign_id?.name || "N/A"}</p>
                                </div>

                                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                    <div className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                                        <FolderOpen size={18} className="text-amber-600" />
                                        Category
                                    </div>
                                    <p className="text-slate-600">{selectedSurvey.category_id?.name || "N/A"}</p>
                                </div>

                                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                    <div className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                                        <CheckCircle2 size={18} className="text-green-600" />
                                        Total Responses
                                    </div>
                                    <p className="text-slate-600">{surveyResponses.length}</p>
                                </div>
                            </div>

                            {/* Question analytics */}
                            <div className="space-y-5">
                                {surveyAnalytics.length > 0 ? (
                                    surveyAnalytics.map((questionItem, index) => (
                                        <div
                                            key={index}
                                            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
                                        >
                                            <div className="flex items-center gap-2 mb-4">
                                                <BarChart3 size={18} className="text-indigo-600" />
                                                <h3 className="text-lg font-semibold text-slate-800">
                                                    Q{index + 1}. {questionItem.question}
                                                </h3>
                                            </div>

                                            <div className="space-y-4">
                                                {questionItem.options.map((optionItem, optionIndex) => (
                                                    <div key={optionIndex}>
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-sm font-medium text-slate-700">
                                                                {optionItem.option}
                                                            </span>
                                                            <span className="text-sm text-slate-500">
                                                                {optionItem.count} responses ({optionItem.percentage}%)
                                                            </span>
                                                        </div>

                                                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-indigo-600 rounded-full"
                                                                style={{ width: `${optionItem.percentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white rounded-2xl border border-slate-200 p-10 shadow-sm text-center">
                                        <p className="text-slate-500">No responses found for this survey</p>
                                    </div>
                                )}
                            </div>

                            {/* Raw responses */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Responses</h3>

                                {surveyResponses.length > 0 ? (
                                    <div className="space-y-4">
                                        {surveyResponses.slice(0, 5).map((response) => (
                                            <div
                                                key={response._id}
                                                className="border border-slate-200 rounded-2xl p-4 bg-slate-50"
                                            >
                                                <p className="font-medium text-slate-800 mb-3">
                                                    {response.user_id?.fullName || "User"}
                                                </p>

                                                <div className="space-y-2">
                                                    {response.answers?.map((answer, index) => (
                                                        <div key={index} className="text-sm text-slate-600">
                                                            <span className="font-medium text-slate-700">{answer.question}:</span>{" "}
                                                            {answer.selectedOption}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-500">No responses available</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {surveyAnalytics.map((item, index) => (
                                    <SurveyPieChart
                                        key={index}
                                        title={`Q${index + 1}. ${item.question}`}
                                        data={item.options}
                                    />
                                ))}
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {surveyAnalytics.map((item, index) => (
                                    <SurveyBarChart
                                        key={index}
                                        title={`Q${index + 1}. ${item.question}`}
                                        data={item.options}
                                    />
                                ))}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={() => {
                                        setOpenViewModal(false);
                                        setSelectedSurvey(null);
                                        setSurveyResponses([]);
                                    }}
                                    className="px-5 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2 rounded-xl shadow-lg text-sm">
                    Loading surveys...
                </div>
            )}
        </div>
    );
};

export default AdvertiserSurveyPage;