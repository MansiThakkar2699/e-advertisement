import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { Search, Eye, Edit2, Trash2, CheckCircle, Loader2, Ban, AlertCircle, ShieldCheck, PlusCircle } from 'lucide-react';
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
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
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
            // Replace with your actual Node.js endpoint
            const response = await axios.get('/campaign/campaigns');
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
            // Replace with your actual endpoint, e.g., /user/update-status/:id
            const response = await axios.put(`/campaign/campaign/${campaignId}`, {
                status: newStatus
            });

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
            const response = await axios.delete(`/campaign/campaign/${campaignToDelete._id}`);


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
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                        {campaign.advertiser_id.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 text-sm">{campaign.name}</p>
                        <p className="text-slate-500 text-xs">{campaign.advertiser_id.fullName}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'budget', label: 'Budget', sortable: true, render: (budget) => {
                return (
                    <p className="text-slate-500 text-xs">{budget}</p>
                );
            }
        },
        {
            key: 'status', label: 'Status', sortable: true, render: (status) => {
                switch (status) {
                    case 'active':
                        return (
                            <div className="flex items-center gap-1.5 text-emerald-600">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Active</span>
                            </div>
                        );
                    case 'inactive':
                        return (
                            <div className="flex items-center gap-1.5 text-slate-400">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Inactive</span>
                            </div>
                        );
                    case 'blocked':
                        return (
                            <div className="flex items-center gap-1.5 text-orange-500">
                                <Ban className="w-4 h-4" />
                                <span className="text-sm font-medium">Blocked</span>
                            </div>
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
                                className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg">
                                <Eye className="w-4 h-4" />
                            </button>

                            <button title="Edit Campaign" onClick={() => {
                                setSelectedCampaign(campaign);
                                setOpenEditModal(true);
                            }}
                                className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg transition-all shadow-sm">
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button title="Delete Campaign" onClick={() => {
                                setCampaignToDelete(campaign);
                                setIsDeleteModalOpen(true);
                            }}
                                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-all shadow-sm">
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button title="Mark Inactive" onClick={() => handleStatusChange(campaign._id, 'inactive')}
                                className="p-2 text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-lg transition-all shadow-sm">
                                <AlertCircle className="w-4 h-4" />
                            </button>
                            <button title="Block Campaign" onClick={() => handleStatusChange(campaign._id, 'blocked')}
                                className="p-2 text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-100 rounded-lg transition-all shadow-sm">
                                <Ban className="w-4 h-4" />
                            </button>
                        </>
                    )}

                    {/* 2. Actions for INACTIVE campaigns */}
                    {campaign.status === 'inactive' && (
                        <>
                            <button title="View Campaign" className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg">
                                <Eye className="w-4 h-4" />
                            </button>
                            <button title="Activate Campaign" onClick={() => handleStatusChange(campaign._id, 'active')}
                                className="flex items-center gap-1 px-3 py-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-lg transition-all shadow-sm text-xs font-medium">
                                <CheckCircle className="w-4 h-4" /> Activate
                            </button>
                        </>
                    )}

                    {/* 3. Actions for BLOCKED campaigns */}
                    {campaign.status === 'blocked' && (
                        <>
                            <button title="View Campaign" className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg">
                                <Eye className="w-4 h-4" />
                            </button>
                            <button title="Unblock Campaign" onClick={() => handleStatusChange(campaign._id, 'active')}
                                className="flex items-center gap-1 px-3 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg transition-all shadow-sm text-xs font-medium">
                                <ShieldCheck className="w-4 h-4" /> Unblock
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
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Campaign Management</h1>
                    <p className="text-slate-500 text-sm">Oversee campaigns and manage campaigns.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setOpenAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 font-medium text-sm">
                        <PlusCircle className="w-4 h-4" /> Add New Campaign
                    </button>
                </div>
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

            {/* Add Campaign Modal */}
            {openAddModal && (
                <CampaignModal
                    mode="add"
                    closeModal={() => setOpenAddModal(false)}
                    refreshCampaigns={fetchCompaigns}
                />
            )}

            {/* Edit Campaign Modal */}
            {openEditModal && (
                <CampaignModal
                    mode="edit"
                    campaignData={selectedCampaign}
                    closeModal={() => setOpenEditModal(false)}
                    refreshCampaigns={fetchCompaigns}
                />
            )}

            {/* View Campaign Modal */}
            {openViewModal && (
                <CampaignModal
                    mode="view"
                    campaignData={selectedCampaign}
                    closeModal={() => setOpenViewModal(false)}
                    refreshCampaigns={fetchCompaigns}
                />
            )}
        </div>
    );
};

export default CampaignManagement;