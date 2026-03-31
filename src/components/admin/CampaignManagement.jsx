import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { Search, Eye, Trash2, CheckCircle, Loader2, Ban, AlertCircle, Check, X, PauseCircle, XCircle, Clock, CheckCheck } from 'lucide-react';
import DataTable from '../DataTable'; // Your reusable component
import { toast } from 'react-toastify';
import CampaignModal from './CampaignModal';

const CampaignManagement = () => {
    // 1. API Data and Loading States
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [campaignToDelete, setCampaignToDelete] = useState(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);

    // 2. Pagination/Filter States
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [advertiserFilter, setAdvertiserFilter] = useState('All Advertisers');

    // 3. Fetch Data from Node.js API
    const fetchCompaigns = async () => {
        try {
            console.log("Attempting to fetch campaigns...");
            setLoading(true);
            const token = localStorage.getItem("token")
            const response = await axios.get('/campaign/campaigns', {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log(response.data.data)
            const data = Array.isArray(response.data)
                ? response.data
                : (response.data.data || []);
            setCampaigns(data);
            setError(null);
        } catch (error) {
            setError("Failed to fetch campaigns. Please try again later.");
            console.error("Error fetching campaigns:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompaigns();
    }, []);

    // 4. Logic to filter data (Client-side filtering)
    const filteredCompaigns = useMemo(() => {
        if (!Array.isArray(campaigns)) return [];
        return campaigns.filter((campaign) => {
            const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesAdvertiser = advertiserFilter === 'All Advertisers' || campaign.advertiser_id._id === advertiserFilter;
            return matchesSearch && matchesAdvertiser;
        });
    }, [searchTerm, advertiserFilter, campaigns]);

    // 5. Slice data for pagination
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredCompaigns.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredCompaigns, currentPage, itemsPerPage]);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, advertiserFilter]);

    const handleStatusChange = async (campaignId, newStatus) => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.put(`/campaign/campaign/${campaignId}`,
                { status: newStatus },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                // Refresh the list to show the updated status and new action buttons
                toast.success("Campaign Status Changed Successfully!...")
                fetchCompaigns();
                // Optional: Add a toast notification here
                console.log(`Campaign status updated to ${newStatus}`);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update campaign status.");
        }
    };

    const handleDeleteCampaign = async () => {
        if (!campaignToDelete) return;

        try {
            const token = localStorage.getItem("token")
            const response = await axios.delete(`/campaign/campaign/${campaignToDelete._id}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );


            if (response.status === 200) {
                toast.success("Campaign Deleted Successfully!...")
                // Remove campaign from the local list
                setCampaigns(prev => prev.filter(c => c._id !== campaignToDelete._id));
                setIsDeleteModalOpen(false);
                setCampaignToDelete(null);
                // Optional: Show success toast
            }
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Could not delete campaign. Please try again.");
        } finally {
            setIsDeleting(false); // Stop loading regardless of outcome
        }
    };

    const advertisers = useMemo(() => {
        const map = new Map();

        campaigns.forEach((campaign) => {
            const advertiser = campaign.advertiser_id;

            if (advertiser && !map.has(advertiser._id)) {
                map.set(advertiser._id, advertiser.fullName);
            }
        });

        return Array.from(map, ([id, name]) => ({ id, name }));
    }, [campaigns]);

    // Define Columns (Same as before)
    const columns = [
        {
            key: 'name', label: 'Campaign Details', sortable: true, render: (_, campaign) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium text-sm">
                        {campaign.advertiser_id?.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 text-medium">{campaign.name}</p>
                        <p className="text-slate-500 text-sm">{campaign.advertiser_id?.fullName}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'totalBudget', label: 'Budget', sortable: true, render: (totalBudget) => {
                return (
                    <p className="text-slate-500 text-sm">{totalBudget}</p>
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
                    case 'completed':
                        return (
                            <span className="text-sm font-medium inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                                <CheckCheck size={16} className="text-blue-600" />
                                Completed
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
            key: 'actions', label: 'Actions', align: 'right', render: (_, campaign) => (
                <div className="flex justify-end gap-2">
                    {campaign.status === 'active' && (
                        <>
                            <button title="View Campaign" onClick={() => {
                                setSelectedCampaign(campaign);
                                setOpenViewModal(true);
                            }}
                                className="p-2 text-blue-600 bg-blue-100 hover:bg-blue-100 border border-blue-100 rounded-lg">
                                <Eye className="w-4 h-4" />
                            </button>
                            <button title="Delete Campaign" onClick={() => {
                                setCampaignToDelete(campaign);
                                setIsDeleteModalOpen(true);
                            }}
                                className="p-2 text-red-600 bg-red-100 hover:bg-red-100 border border-red-100 rounded-lg transition-all shadow-sm">
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button title="Paused" onClick={() => handleStatusChange(campaign._id, 'paused')}
                                className="p-2 text-orange-500 bg-orange-100 hover:bg-slate-100 border border-slate-100 rounded-lg transition-all shadow-sm">
                                <PauseCircle size={18} className="text-orange-500" />
                            </button>
                        </>
                    )}

                    {/* 2. Actions for PAUSED campaigns */}
                    {campaign.status === 'paused' && (
                        <>
                            <button title="View Campaign" onClick={() => {
                                setSelectedCampaign(campaign);
                                setOpenViewModal(true);
                            }}
                                className="p-2 text-blue-600 bg-blue-100 hover:bg-blue-100 border border-blue-100 rounded-lg">
                                <Eye className="w-4 h-4" />
                            </button>
                            <button title="Delete Campaign" onClick={() => {
                                setCampaignToDelete(campaign);
                                setIsDeleteModalOpen(true);
                            }}
                                className="p-2 text-red-600 bg-red-100 hover:bg-red-100 border border-red-100 rounded-lg transition-all shadow-sm">
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button title="Activate Campaign" onClick={() => handleStatusChange(campaign._id, 'active')}
                                className="flex items-center gap-1 px-3 py-2 text-emerald-600 bg-emerald-100 hover:bg-emerald-100 border border-emerald-100 rounded-lg transition-all shadow-sm text-xs font-medium">
                                <CheckCircle className="w-4 h-4" />
                            </button>
                        </>
                    )}

                    {/* 3. Actions for COMPLETED campaigns */}
                    {campaign.status === 'completed' && (
                        <>
                            <button title="View Campaign" onClick={() => {
                                setSelectedCampaign(campaign);
                                setOpenViewModal(true);
                            }}
                                className="p-2 text-blue-600 bg-blue-100 hover:bg-blue-100 border border-blue-100 rounded-lg">
                                <Eye className="w-4 h-4" />
                            </button>
                            <button title="Delete Campaign" onClick={() => {
                                setCampaignToDelete(campaign);
                                setIsDeleteModalOpen(true);
                            }}
                                className="p-2 text-red-600 bg-red-100 hover:bg-red-100 border border-red-100 rounded-lg transition-all shadow-sm">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </>
                    )}
                    {/* 4. Actions for REJECTED campaigns */}
                    {campaign.status === 'rejected' && (
                        <>
                            <button title="View Campaign" onClick={() => {
                                setSelectedCampaign(campaign);
                                setOpenViewModal(true);
                            }}
                                className="p-2 text-blue-600 bg-blue-100 hover:bg-blue-100 border border-blue-100 rounded-lg">
                                <Eye className="w-4 h-4" />
                            </button>
                            <button title="Delete Campaign" onClick={() => {
                                setCampaignToDelete(campaign);
                                setIsDeleteModalOpen(true);
                            }}
                                className="p-2 text-red-600 bg-red-100 hover:bg-red-100 border border-red-100 rounded-lg transition-all shadow-sm">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </>
                    )}
                    {/* 5. Actions for PENDING campaigns */}
                    {campaign.status === 'pending' && (
                        <>
                            <button title="View Campaign" onClick={() => {
                                setSelectedCampaign(campaign);
                                setOpenViewModal(true);
                            }}
                                className="p-2 text-blue-600 bg-blue-100 hover:bg-blue-100 border border-blue-100 rounded-lg">
                                <Eye className="w-4 h-4" />
                            </button>
                            <button title="Approve Campaign" onClick={() => handleStatusChange(campaign._id, 'active')}
                                className="p-2 rounded-md bg-green-100 hover:bg-green-200">
                                <Check size={18} className="text-green-600" />
                            </button>
                            <button title="Reject Campaign" onClick={() => handleStatusChange(campaign._id, 'rejected')}
                                className="p-2 rounded-md bg-red-100 hover:bg-red-200">
                                <X size={18} className="text-red-600" />
                            </button>
                        </>
                    )}
                </div >
            )
        }
    ];

    const totalEntries = filteredCompaigns.length;
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
                                    Are you sure you want to delete <span className="font-semibold text-slate-700">{campaignToDelete?.fullName}</span>?
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
                                    onClick={handleDeleteCampaign}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm shadow-red-200"
                                >
                                    Delete Campaign
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            {/* Header Section */}
            <div className="md:flex-row md:items-center justify-between mb-8 gap-4">
                <h1 className="text-2xl font-bold text-slate-900">Campaign Management</h1>
                <p className="text-slate-500 text-sm">Oversee campaigns and manage campaigns.</p>
            </div>

            {/* --- Search & Filter Bar Section --- */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by campaign name..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto"
                    value={advertiserFilter}
                    onChange={(e) => setAdvertiserFilter(e.target.value)}>
                    <select className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>All Advertisers</option>
                        {advertisers.map((advertiser) => (
                            <option key={advertiser.id} value={advertiser.id}>
                                {advertiser.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Loading & Error States */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                    <p className="text-slate-500 font-medium">Loading platform campaigns...</p>
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
                        totalItems={filteredCompaigns.length}
                        onPageChange={setCurrentPage}
                        paginationInfo={`Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`}
                        initialSortKey="name"
                    />
                </>
            )}

            {/* View Campaign Modal */}
            {openViewModal && (
                <CampaignModal
                    campaignData={selectedCampaign}
                    closeModal={() => setOpenViewModal(false)}
                />
            )}
        </div>
    );
};

export default CampaignManagement;