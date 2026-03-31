import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { Search, Eye, Trash2, CheckCircle, Loader2, Ban, ShieldCheck, PlusCircle, PauseCircle, Clock, XCircle, Check, X } from 'lucide-react';
import DataTable from '../DataTable'; // Your reusable component
import { toast } from 'react-toastify';
import AdvertisementModal from './AdvertisementModal';

const AdvertisementManagement = () => {
    // 1. API Data and Loading States
    const [advertisements, setAdvertisements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [advertisementToDelete, setAdvertisementToDelete] = useState(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedAdvertisement, setSelectedAdvertisement] = useState(null);

    // 2. Pagination/Filter States
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');

    // 3. Fetch Data from Node.js API
    const fetchAdvertisements = async () => {
        try {
            console.log("Attempting to fetch advertisements...");
            setLoading(true);
            const token = localStorage.getItem("token")
            const response = await axios.get('/ads/advertisements',
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            const data = Array.isArray(response.data)
                ? response.data
                : (response.data.data || []);
            setAdvertisements(data);
            setError(null);
        } catch (error) {
            setError("Failed to fetch advertisements. Please try again later.");
            console.error("Error fetching advertisements:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdvertisements();
    }, []);

    // 4. Logic to filter data (Client-side filtering)
    const filteredAdvertisements = useMemo(() => {
        if (!Array.isArray(advertisements)) return [];
        return advertisements.filter((advertisement) => {
            const matchesSearch = advertisement.ad_title.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = categoryFilter === 'All Categories' || advertisement.category_id._id === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, categoryFilter, advertisements]);

    // 5. Slice data for pagination
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredAdvertisements.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredAdvertisements, currentPage, itemsPerPage]);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, categoryFilter]);

    const handleStatusChange = async (advertisementId, newStatus) => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.put(`/ads/advertisement/${advertisementId}`,
                { status: newStatus },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                // Refresh the list to show the updated status and new action buttons
                toast.success("Advertisement Status Changed Successfully!...")
                fetchAdvertisements();
                // Optional: Add a toast notification here
                console.log(`Advertisement status updated to ${newStatus}`);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update advertisement status.");
        }
    };

    const handleDeleteAdvertisement = async () => {
        if (!advertisementToDelete) return;

        try {
            const token = localStorage.getItem("token")
            const response = await axios.delete(`/ads/advertisement/${advertisementToDelete._id}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );


            if (response.status === 200) {
                toast.success("Advertisement Deleted Successfully!...")
                // Remove advertisement from the local list
                setAdvertisements(prev => prev.filter(a => a._id !== advertisementToDelete._id));
                setIsDeleteModalOpen(false);
                setAdvertisementToDelete(null);
                // Optional: Show success toast
            }
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Could not delete advertisement. Please try again.");
        } finally {
            setIsDeleting(false); // Stop loading regardless of outcome
        }
    };

    const categories = useMemo(() => {
        const map = new Map();

        advertisements.forEach((advertisement) => {
            const category = advertisement.category_id;

            if (category && !map.has(category._id)) {
                map.set(category._id, category.name);
            }
        });

        return Array.from(map, ([id, name]) => ({ id, name }));
    }, [advertisements]);

    // Define Columns (Same as before)
    const columns = [
        {
            key: 'ad_title', label: 'Advertisement Details', sortable: true, render: (_, advertisement) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium text-sm">
                        {advertisement.campaign_id?.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 text-medium">{advertisement.ad_title}</p>
                        <p className="text-slate-500 text-sm">{advertisement.campaign_id?.name}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'description', label: 'Description', sortable: true, render: (description) => {
                return (
                    <div className="flex items-center gap-3">
                        {description ? (
                            <p className="text-slate-700">{description}</p>
                        ) : (
                            <span className="text-sm px-2 py-1 bg-gray-100 text-gray-500 rounded">
                                No description
                            </span>
                        )}
                    </div>
                );
            }
        },
        {
            key: 'status', label: 'Status', sortable: true, render: (status) => {
                switch (status) {
                    case 'active':
                        return (
                            <span className="text-sm font-medium inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 border border-green-200">
                                <CheckCircle className="w-4 h-4" />
                                Active
                            </span>
                        );
                    case 'paused':
                        return (
                            <span className="text-sm font-medium inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
                                <PauseCircle size={18} className="w-4 h-4" />
                                Paused
                            </span>
                        );
                    case 'rejected':
                        return (
                            <span className="text-sm font-medium inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">
                                <XCircle size={18} />
                                Rejected
                            </span>
                        );
                    case 'pending':
                        return (
                            <span className="text-sm font-medium inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-200">
                                <Clock size={18} />
                                Pending
                            </span>
                        );
                    case 'blocked':
                        return (

                            <span className="text-sm font-medium inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">
                                <Ban className="w-4 h-4" />
                                Blocked
                            </span>
                        );
                    default:
                        return (
                            <span className="text-sm text-slate-400 font-medium capitalize">
                                {status || 'Unknown'}
                            </span>
                        );
                }
            }
        },
        {
            key: 'actions', label: 'Actions', align: 'right', render: (_, advertisement) => (
                <div className="flex justify-end gap-2">
                    {advertisement.status === 'active' && (
                        <>
                            <button title="View Advertisement" onClick={() => {
                                setSelectedAdvertisement(advertisement);
                                setOpenViewModal(true);
                            }}
                                className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg">
                                <Eye className="w-4 h-4" />
                            </button>
                            <button title="Delete Advertisement" onClick={() => {
                                setAdvertisementToDelete(advertisement);
                                setIsDeleteModalOpen(true);
                            }}
                                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-all shadow-sm">
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button title="Block Ad" onClick={() => handleStatusChange(advertisement._id, 'blocked')}
                                className="p-2 text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-100 rounded-lg transition-all shadow-sm">
                                <Ban className="w-4 h-4" />
                            </button>
                            <button title="Pause Ad" onClick={() => handleStatusChange(advertisement._id, 'paused')}
                                className="p-2 text-orange-500 bg-orange-100 hover:bg-slate-100 border border-slate-100 rounded-lg transition-all shadow-sm">
                                <PauseCircle size={18} className="text-orange-500" />
                            </button>
                        </>
                    )}

                    {/* 2. Actions for PENDING advertisements */}
                    {advertisement.status === 'pending' && (
                        <>
                            <button title="View Advertisement" onClick={() => {
                                setSelectedAdvertisement(advertisement);
                                setOpenViewModal(true);
                            }}
                                className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg">
                                <Eye className="w-4 h-4" />
                            </button>
                            <button title="Approve Ad" onClick={() => handleStatusChange(advertisement._id, 'active')}
                                className="p-2 rounded-md bg-green-100 hover:bg-green-200">
                                <Check size={18} className="text-green-600" />
                            </button>
                            <button title="Reject Ad" onClick={() => handleStatusChange(advertisement._id, 'rejected')}
                                className="p-2 rounded-md bg-red-100 hover:bg-red-200">
                                <X size={18} className="text-red-600" />
                            </button>
                        </>
                    )}

                    {/* 3. Actions for BLOCKED advertisements */}
                    {advertisement.status === 'blocked' && (
                        <>
                            <button title="View Advertisement" onClick={() => {
                                setSelectedAdvertisement(advertisement);
                                setOpenViewModal(true);
                            }}
                                className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg">
                                <Eye className="w-4 h-4" />
                            </button>
                            <button title="Unblock Advertisement" onClick={() => handleStatusChange(advertisement._id, 'active')}
                                className="flex items-center gap-1 px-3 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg transition-all shadow-sm text-xs font-medium">
                                <ShieldCheck className="w-4 h-4" /> Unblock
                            </button>
                        </>
                    )}

                    {/* 4. Actions for REJECTED campaigns */}
                    {advertisement.status === 'rejected' && (
                        <>
                            <button title="View Advertisement" onClick={() => {
                                setSelectedAdvertisement(advertisement);
                                setOpenViewModal(true);
                            }}
                                className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg">
                                <Eye className="w-4 h-4" />
                            </button>
                            <button title="Delete Advertisement" onClick={() => {
                                setAdvertisementToDelete(advertisement);
                                setIsDeleteModalOpen(true);
                            }}
                                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-all shadow-sm">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </>
                    )}

                    {/* 5. Actions for PAUSED ads */}
                    {advertisement.status === 'paused' && (
                        <>
                            <button title="View Advertisement" onClick={() => {
                                setSelectedAdvertisement(advertisement);
                                setOpenViewModal(true);
                            }}
                                className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg">
                                <Eye className="w-4 h-4" />
                            </button>
                            <button title="Delete Advertisement" onClick={() => {
                                setAdvertisementToDelete(advertisement);
                                setIsDeleteModalOpen(true);
                            }}
                                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-all shadow-sm">
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button title="Activate Ad" onClick={() => handleStatusChange(advertisement._id, 'active')}
                                className="flex items-center gap-1 px-3 py-2 text-emerald-600 bg-emerald-100 hover:bg-emerald-100 border border-emerald-100 rounded-lg transition-all shadow-sm text-xs font-medium">
                                <CheckCircle className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div >
            )
        }
    ];

    const totalEntries = filteredAdvertisements.length;
    const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endEntry = Math.min(currentPage * itemsPerPage, totalEntries);


    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            {/* Custom Confirmation Modal */}
            {
                isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
                            <div className="p-6">
                                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                                    <Trash2 className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-bold text-center text-slate-900">Confirm Deletion</h3>
                                <p className="mt-2 text-sm text-center text-slate-500">
                                    Are you sure you want to delete <span className="font-semibold text-slate-700">{advertisementToDelete?.name}</span>?
                                    This action is permanent and cannot be undone.
                                </p>
                            </div>
                            <div className="flex gap-3 p-4 bg-slate-50">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAdvertisement}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm shadow-red-200"
                                >
                                    Delete Advertisement
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            {/* Header Section */}
            <div className="md:flex-row md:items-center justify-between mb-8 gap-4">
                <h1 className="text-2xl font-bold text-slate-900">Advertisement Management</h1>
                <p className="text-slate-500 text-sm">Oversee advertisements and manage advertisements.</p>
            </div>

            {/* --- Search & Filter Bar Section --- */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by advertisement name..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}>
                    <select className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Loading & Error States */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                    <p className="text-slate-500 font-medium">Loading platform advertisements...</p>
                </div>
            ) : error ? (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                </div>
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        data={paginatedData}
                        displayData={paginatedData}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={filteredAdvertisements.length}
                        onPageChange={setCurrentPage}
                        paginationInfo={`Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`}
                        initialSortKey="name"
                    />
                </>
            )}

            {/* View Campaign Modal */}
            {openViewModal && (
                <AdvertisementModal
                    advertisementData={selectedAdvertisement}
                    closeModal={() => setOpenViewModal(false)}
                />
            )}
        </div>
    );
};

export default AdvertisementManagement;