import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    Mail,
    Search,
    Eye,
    Trash2,
    CheckCircle2,
    Reply,
    Clock3,
    MessageSquare,
    User,
    Filter
} from "lucide-react";
import { toast } from "react-toastify";

const statusStyles = {
    new: "bg-blue-50 text-blue-600 border border-blue-200",
    read: "bg-yellow-50 text-yellow-600 border border-yellow-200",
    replied: "bg-green-50 text-green-600 border border-green-200",
    deleted: "bg-red-50 text-red-600 border border-red-200"
};

const ContactMessagesPage = () => {
    const [messages, setMessages] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const token = localStorage.getItem("token")

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/contact/contacts",
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            setMessages(response.data.data || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch contact messages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleView = async (message) => {
        setSelectedMessage(message);
        setOpenViewModal(true);

        if (message.status === "new") {
            await handleStatusUpdate(message._id, "read", false);
        }
    };

    const handleStatusUpdate = async (id, status, showToast = true) => {
        try {
            const response = await axios.put(`/contact/contact/status/${id}`, { status }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            setMessages((prev) =>
                prev.map((item) =>
                    item._id === id ? response.data.data : item
                )
            );

            if (selectedMessage?._id === id) {
                setSelectedMessage(response.data.data);
            }

            if (showToast) {
                toast.success(`Message marked as ${status}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/contact/contact/${deleteId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            toast.success("Message deleted successfully");
            setOpenDeleteModal(false);
            setDeleteId(null);
            fetchMessages();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete message");
        }
    };

    // const handleDelete = async (id) => {
    //     try {
    //         await axios.delete(`/contact/contact/${id}`, {
    //             headers: {
    //                 "Authorization": `Bearer ${token}`
    //             }
    //         });
    //         toast.success("Message deleted successfully");
    //         fetchMessages();
    //         if (selectedMessage?._id === id) {
    //             setOpenViewModal(false);
    //             setSelectedMessage(null);
    //         }
    //     } catch (error) {
    //         console.log("error", error);
    //         toast.error(error.response?.data?.message || "Failed to delete message");
    //     }
    // };

    const filteredMessages = useMemo(() => {
        let filtered = [...messages];

        if (search.trim()) {
            filtered = filtered.filter(
                (item) =>
                    item.fullName?.toLowerCase().includes(search.toLowerCase()) ||
                    item.email?.toLowerCase().includes(search.toLowerCase()) ||
                    item.subject?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (statusFilter) {
            filtered = filtered.filter((item) => item.status === statusFilter);
        }

        return filtered;
    }, [messages, search, statusFilter]);

    const stats = useMemo(() => {
        return {
            total: messages.length,
            newCount: messages.filter((m) => m.status === "new").length,
            readCount: messages.filter((m) => m.status === "read").length,
            repliedCount: messages.filter((m) => m.status === "replied").length
        };
    }, [messages]);

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Contact Messages</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Manage inquiries and messages sent from the Contact Us page
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <p className="text-sm text-slate-500">Total Messages</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</h3>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <p className="text-sm text-slate-500">New</p>
                    <h3 className="text-2xl font-bold text-blue-600 mt-1">{stats.newCount}</h3>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <p className="text-sm text-slate-500">Read</p>
                    <h3 className="text-2xl font-bold text-yellow-600 mt-1">{stats.readCount}</h3>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <p className="text-sm text-slate-500">Replied</p>
                    <h3 className="text-2xl font-bold text-green-600 mt-1">{stats.repliedCount}</h3>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6">
                <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or subject..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        />
                    </div>

                    <div className="relative min-w-[200px]">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        >
                            <option value="">All Status</option>
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-900 text-white border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold">Sender</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold">Subject</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold">Status</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold">Date</th>
                                <th className="text-center px-6 py-4 text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredMessages.length > 0 ? (
                                filteredMessages.map((item) => (
                                    <tr key={item._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold">
                                                    {item.fullName?.charAt(0)?.toUpperCase() || "U"}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800">{item.fullName}</p>
                                                    <p className="text-sm text-slate-500">{item.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="text-slate-800 font-medium">{item.subject}</p>
                                            <p className="text-sm text-slate-500 line-clamp-1">{item.message}</p>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[item.status] || "bg-slate-50 text-slate-600 border border-slate-200"}`}>
                                                {item.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleView(item)}
                                                    className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                                                    title="View"
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                <button
                                                    onClick={() => handleStatusUpdate(item._id, "replied")}
                                                    className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition"
                                                    title="Mark as Replied"
                                                >
                                                    <Reply size={16} />
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setDeleteId(item._id);
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
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center">
                                            <Mail className="text-slate-300 mb-3" size={28} />
                                            <p className="text-slate-500 font-medium">No contact messages found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Modal */}
            {openViewModal && selectedMessage && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 rounded-t-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                            <div>
                                <h2 className="text-xl font-semibold">Contact Message Details</h2>
                                <p className="text-sm text-slate-300 mt-1">
                                    View full inquiry information
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setOpenViewModal(false);
                                    setSelectedMessage(null);
                                }}
                                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 bg-slate-50 space-y-5">
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                                            {selectedMessage.fullName?.charAt(0)?.toUpperCase() || "U"}
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-semibold text-slate-800">{selectedMessage.fullName}</h3>
                                            <p className="text-sm text-slate-500">{selectedMessage.email}</p>
                                        </div>
                                    </div>

                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[selectedMessage.status] || "bg-slate-50 text-slate-600 border border-slate-200"}`}>
                                        {selectedMessage.status}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Subject</p>
                                <p className="mt-2 text-lg font-semibold text-slate-800">{selectedMessage.subject}</p>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Message</p>
                                <p className="mt-3 text-slate-700 leading-7 whitespace-pre-line">
                                    {selectedMessage.message}
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Created Date</p>
                                        <p className="mt-2 text-slate-800 font-medium">
                                            {selectedMessage.createdAt
                                                ? new Date(selectedMessage.createdAt).toLocaleString()
                                                : "N/A"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Current Status</p>
                                        <p className="mt-2 text-slate-800 font-medium capitalize">{selectedMessage.status}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => handleStatusUpdate(selectedMessage._id, "read")}
                                    className="px-4 py-2 rounded-xl bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100 transition"
                                >
                                    Mark as Read
                                </button>

                                <button
                                    onClick={() => handleStatusUpdate(selectedMessage._id, "replied")}
                                    className="px-4 py-2 rounded-xl bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition"
                                >
                                    Mark as Replied
                                </button>

                                <button
                                    onClick={() => {
                                        setDeleteId(selectedMessage._id);
                                        setOpenDeleteModal(true);
                                    }}
                                    className="px-4 py-2 rounded-xl bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {openDeleteModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl">

                        {/* Header */}
                        <div className="p-5 border-b">
                            <h3 className="text-lg font-semibold text-slate-800">
                                Delete Message
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Are you sure you want to delete this message? This action cannot be undone.
                            </p>
                        </div>

                        {/* Actions */}
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

export default ContactMessagesPage;