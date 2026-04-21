import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    ArrowLeft,
    CheckCircle2,
    ClipboardList,
    Layers3,
    FolderOpen
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const SurveyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [survey, setSurvey] = useState(null);
    const [answers, setAnswers] = useState({});
    const [btnLoading, setBtnLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const userId = decoded.id;

    const fetchSurvey = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/survey/survey/${id}`);
            setSurvey(response.data.data || null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch survey");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSurvey();
    }, [id]);

    const isFormValid = useMemo(() => {
        if (!survey?.questions?.length) return false;

        return survey.questions.every((questionItem) =>
            answers[questionItem.question]
        );
    }, [survey, answers]);

    const handleOptionSelect = (question, option) => {
        setAnswers((prev) => ({
            ...prev,
            [question]: option
        }));
    };

    const handleSubmitSurvey = async () => {
        try {
            if (!userId) {
                toast.error("Please login first");
                navigate("/login");
                return;
            }

            if (!isFormValid) {
                toast.error("Please answer all questions");
                return;
            }

            setBtnLoading(true);

            const payload = {
                survey_id: survey._id,
                user_id: userId,
                answers: survey.questions.map((item) => ({
                    question: item.question,
                    selectedOption: answers[item.question]
                }))
            };

            const response = await axios.post("/survey/survey-response", payload);

            if (response.status === 201) {
                toast.success("Survey submitted successfully");
                navigate("/surveys");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit survey");
        } finally {
            setBtnLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-20">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center">
                    <p className="text-slate-600">Loading survey...</p>
                </div>
            </div>
        );
    }

    if (!survey) {
        return (
            <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-20">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center">
                    <h2 className="text-2xl font-bold text-slate-900">Survey not found</h2>
                    <p className="text-slate-500 mt-3">
                        The survey you are looking for does not exist.
                    </p>
                    <button
                        onClick={() => navigate("/surveys")}
                        className="mt-6 px-5 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
                    >
                        Back to Surveys
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Hero */}
            <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white">
                <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition mb-6"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>

                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-5">
                            <ClipboardList size={16} className="text-emerald-300" />
                            <span className="text-sm font-medium">Survey participation</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            {survey.title}
                        </h1>

                        <p className="mt-5 text-slate-300 text-base md:text-lg leading-8 max-w-2xl">
                            {survey.description || "Please answer the following questions."}
                        </p>
                    </div>
                </div>
            </section>

            {/* Meta cards */}
            <section className="relative -mt-8 z-10">
                <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                            <div className="flex items-center gap-2 text-slate-800 font-semibold">
                                <ClipboardList size={18} className="text-emerald-600" />
                                Questions
                            </div>
                            <p className="text-slate-500 mt-2">{survey.questions?.length || 0}</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                            <div className="flex items-center gap-2 text-slate-800 font-semibold">
                                <FolderOpen size={18} className="text-amber-600" />
                                Category
                            </div>
                            <p className="text-slate-500 mt-2">{survey.category_id?.name || "General"}</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                            <div className="flex items-center gap-2 text-slate-800 font-semibold">
                                <Layers3 size={18} className="text-indigo-600" />
                                Campaign
                            </div>
                            <p className="text-slate-500 mt-2">{survey.campaign_id?.name || "General"}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Form */}
            <section className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-12">
                <div className="space-y-6">
                    {survey.questions?.map((questionItem, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6"
                        >
                            <h3 className="text-xl font-semibold text-slate-900">
                                Q{index + 1}. {questionItem.question}
                            </h3>

                            <div className="mt-5 space-y-3">
                                {questionItem.options?.map((option, optionIndex) => {
                                    const isSelected = answers[questionItem.question] === option;

                                    return (
                                        <button
                                            key={optionIndex}
                                            type="button"
                                            onClick={() => handleOptionSelect(questionItem.question, option)}
                                            className={`w-full text-left px-4 py-4 rounded-2xl border transition ${isSelected
                                                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                : "border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/40"
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-end">
                        <button
                            onClick={handleSubmitSurvey}
                            disabled={!isFormValid || btnLoading}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition disabled:opacity-50"
                        >
                            <CheckCircle2 size={16} />
                            {btnLoading ? "Submitting..." : "Submit Survey"}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SurveyDetails;