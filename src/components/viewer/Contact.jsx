import React, { useState } from "react";
import {
    Mail,
    Phone,
    MapPin,
    Send,
    MessageCircleMore,
    Clock3,
    Sparkles
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const Contact = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("/contact/contact", formData);
            console.log("response", response);

            if (response.status === 201) {
                toast.success("Message sent successfully");

                setFormData({
                    fullName: "",
                    email: "",
                    subject: "",
                    message: ""
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message");
        }
    };

    return (
        <div className="w-full">
            {/* Hero */}
            <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 text-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-5">
                            <Sparkles size={16} className="text-rose-300" />
                            <span className="text-sm font-medium">We’d love to hear from you</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Contact Us for Support, Queries, or Feedback
                        </h1>

                        <p className="mt-5 text-slate-300 text-base md:text-lg leading-8 max-w-2xl">
                            Have questions about our platform, surveys, offers, or ads? Reach out
                            to us anytime and our team will be happy to help.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main */}
            <section className="relative -mt-8 z-10 pb-16">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Contact Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6">
                                <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                                    <MessageCircleMore size={22} />
                                </div>

                                <h2 className="text-2xl font-bold text-slate-900 mt-5">
                                    Get in Touch
                                </h2>

                                <p className="text-slate-500 leading-7 mt-3">
                                    Contact our team for any support, questions, or suggestions related
                                    to advertisements, offers, surveys, and viewer experience.
                                </p>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Email</h3>
                                        <p className="text-slate-500 text-sm mt-1">support@advista.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Phone</h3>
                                        <p className="text-slate-500 text-sm mt-1">+91 98765 43210</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Address</h3>
                                        <p className="text-slate-500 text-sm mt-1">
                                            Ahmedabad, Gujarat, India
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                                        <Clock3 size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Working Hours</h3>
                                        <p className="text-slate-500 text-sm mt-1">
                                            Mon - Sat, 9:00 AM - 6:00 PM
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-lg p-6 md:p-8">
                            <div className="mb-6">
                                <p className="text-rose-600 text-sm font-medium">Contact Form</p>
                                <h2 className="text-3xl font-bold text-slate-900 mt-2">
                                    Send us a message
                                </h2>
                                <p className="text-slate-500 mt-3">
                                    Fill out the form below and our team will get back to you soon.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="Enter subject"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        rows="6"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Write your message here..."
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
                                >
                                    <Send size={16} />
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;