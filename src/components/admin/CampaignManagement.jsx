import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { Search, UserPlus, Edit2, Trash2, CheckCircle, Loader2, Ban, AlertCircle, ShieldCheck } from 'lucide-react';
import DataTable from '../DataTable'; // Your reusable component
import { toast } from 'react-toastify';

const CampaignManagement = () => {
    // 1. API Data and Loading States
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // 2. Pagination/Filter States
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');

    // 3. Fetch Data from Node.js API
    const fetchUsers = async () => {
        try {
            console.log("Attempting to fetch users...");
            setLoading(true);
            // Replace with your actual Node.js endpoint
            const response = await axios.get('/user/users');
            console.log(response.data.data)
            const data = Array.isArray(response.data)
                ? response.data
                : (response.data.data || []);
            setUsers(data);
            setError(null);
        } catch (error) {
            setError("Failed to fetch users. Please try again later.");
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 4. Logic to filter data (Client-side filtering)
    const filteredUsers = useMemo(() => {
        if (!Array.isArray(users)) return [];
        return users.filter((user) => {
            const matchesSearch =
                user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [searchTerm, roleFilter, users]);

    // 5. Slice data for pagination
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredUsers, currentPage, itemsPerPage]);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, roleFilter]);

    const handleStatusChange = async (userId, newStatus) => {
        try {
            // Replace with your actual endpoint, e.g., /user/update-status/:id
            const response = await axios.put(`/user/user/status/${userId}`, {
                status: newStatus
            });

            if (response.status === 200) {
                // Refresh the list to show the updated status and new action buttons
                toast.success("User Status Changed Successfully!...")
                fetchUsers();
                // Optional: Add a toast notification here
                console.log(`User status updated to ${newStatus}`);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update user status.");
        }
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            const response = await axios.delete(`/user/user/${userToDelete._id}`);


            if (response.status === 200) {
                toast.success("User Deleted Successfully!...")
                // Remove user from the local list
                setUsers(prev => prev.filter(u => u._id !== userToDelete._id));
                setIsDeleteModalOpen(false);
                setUserToDelete(null);
                // Optional: Show success toast
            }
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Could not delete user. Please try again.");
        } finally {
            setIsDeleting(false); // Stop loading regardless of outcome
        }
    };

    // Define Columns (Same as before)
    const columns = [
        {
            key: 'fullName', label: 'User Details', sortable: true, render: (_, user) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                        {user.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 text-sm">{user.fullName}</p>
                        <p className="text-slate-500 text-xs">{user.email}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'role', label: 'Role', sortable: true, render: (role) => {
                const roleStyles = {
                    advertiser: "bg-purple-100 text-purple-700",
                    viewer: "bg-blue-100 text-blue-700"
                };

                return (
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${roleStyles[role] || "bg-gray-100 text-gray-600"}`} >
                        {role}
                    </span >
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
                    case 'deleted':
                        return (
                            <div className="flex items-center gap-1.5 text-red-500">
                                <Trash2 className="w-4 h-4" />
                                <span className="text-sm font-medium">Deleted</span>
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
            key: 'actions', label: 'Actions', align: 'right', render: (_, user) => (
                <div className="flex justify-end gap-2">
                    {user.status === 'active' && (
                        <>
                            <button title="Mark Inactive" onClick={() => handleStatusChange(user._id, 'inactive')}
                                className="p-2 text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-lg transition-all shadow-sm">
                                <AlertCircle className="w-4 h-4" />
                            </button>
                            <button title="Block User" onClick={() => handleStatusChange(user._id, 'blocked')}
                                className="p-2 text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-100 rounded-lg transition-all shadow-sm">
                                <Ban className="w-4 h-4" />
                            </button>
                            <button title="Delete User" onClick={() => {
                                setUserToDelete(user);
                                setIsDeleteModalOpen(true);
                            }}
                                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-all shadow-sm">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </>
                    )}

                    {/* 2. Actions for INACTIVE users */}
                    {user.status === 'inactive' && (
                        <button title="Activate User" onClick={() => handleStatusChange(user._id, 'active')}
                            className="flex items-center gap-1 px-3 py-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-lg transition-all shadow-sm text-xs font-medium">
                            <CheckCircle className="w-4 h-4" /> Activate
                        </button>
                    )}

                    {/* 3. Actions for BLOCKED users */}
                    {user.status === 'blocked' && (
                        <button title="Unblock User" onClick={() => handleStatusChange(user._id, 'active')}
                            className="flex items-center gap-1 px-3 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg transition-all shadow-sm text-xs font-medium">
                            <ShieldCheck className="w-4 h-4" /> Unblock
                        </button>
                    )}
                </div >
            )
        }
    ];

    const totalEntries = filteredUsers.length;
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
                                    Are you sure you want to delete <span className="font-semibold text-slate-700">{userToDelete?.fullName}</span>?
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
                                    onClick={handleDeleteUser}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm shadow-red-200"
                                >
                                    Delete User
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
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}>
                    <select className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>All Roles</option>
                        <option value="advertiser">Advertiser</option>
                        <option value="viewer">Viewer</option>
                    </select>
                </div>
            </div>

            {/* Loading & Error States */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                    <p className="text-slate-500 font-medium">Loading platform users...</p>
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
                        totalItems={filteredUsers.length}
                        onPageChange={setCurrentPage}
                        paginationInfo={`Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`}
                        initialSortKey="name"
                    />
                </>
            )}
        </div>
    );
};

export default CampaignManagement;