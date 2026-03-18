import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { Search, Edit2, Trash2, CheckCircle, Loader2, Ban, AlertCircle, ShieldCheck, FolderPlus } from 'lucide-react';
import DataTable from '../DataTable'; // Your reusable component
import { toast } from 'react-toastify';
import CategoryModal from './CategoryModal';

const CategoryManagement = () => {
    // 1. API Data and Loading States
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // 2. Pagination/Filter States
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    // 3. Fetch Data from Node.js API
    const fetchCategories = async () => {
        try {
            setLoading(true);
            // Replace with your actual Node.js endpoint
            const response = await axios.get('/category/categories');
            console.log(response.data.data)
            const data = Array.isArray(response.data)
                ? response.data
                : (response.data.data || []);
            setCategories(data);
            setError(null);
        } catch (error) {
            setError("Failed to fetch categories. Please try again later.");
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // 4. Logic to filter data (Client-side filtering)
    const filteredCategories = useMemo(() => {
        if (!Array.isArray(categories)) return [];
        return categories.filter((category) => {
            const matchesSearch =
                category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                category.slug.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
    }, [searchTerm, categories]);

    // 5. Slice data for pagination
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredCategories.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredCategories, currentPage, itemsPerPage]);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleStatusChange = async (categoryId, newStatus) => {
        try {
            // Replace with your actual endpoint, e.g., /user/update-status/:id
            const response = await axios.put(`/category/category/${categoryId}`, {
                status: newStatus
            });

            if (response.status === 200) {
                // Refresh the list to show the updated status and new action buttons
                toast.success("Category Status Changed Successfully!...")
                fetchCategories();
                // Optional: Add a toast notification here
                console.log(`Category status updated to ${newStatus}`);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update category status.");
        }
    };

    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return;

        try {
            const response = await axios.delete(`/category/category/${categoryToDelete._id}`);


            if (response.status === 200) {
                toast.success("Category Deleted Successfully!...")
                // Remove user from the local list
                setCategories(prev => prev.filter(c => c._id !== categoryToDelete._id));
                setIsDeleteModalOpen(false);
                setCategoryToDelete(null);
                // Optional: Show success toast
            }
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Could not delete category. Please try again.");
        } finally {
            setIsDeleting(false); // Stop loading regardless of outcome
        }
    };

    // Define Columns (Same as before)
    const columns = [
        {
            key: 'name', label: 'Category Details', sortable: true, render: (_, category) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                        {category.image ? (
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            category.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 text-sm">{category.name}</p>
                        <p className="text-slate-500 text-xs">{category.slug}</p>
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
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded">
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
            key: 'actions', label: 'Actions', align: 'right', render: (_, category) => (
                <div className="flex justify-end gap-2">
                    {category.status === 'active' && (
                        <>
                            <button title="Edit Category" onClick={() => {
                                setSelectedCategory(category);
                                setOpenEditModal(true);
                            }}
                                className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg transition-all shadow-sm">
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button title="Delete Category" onClick={() => {
                                setCategoryToDelete(category);
                                setIsDeleteModalOpen(true);
                            }}
                                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-all shadow-sm">
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button title="Mark Inactive" onClick={() => handleStatusChange(category._id, 'inactive')}
                                className="p-2 text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-lg transition-all shadow-sm">
                                <AlertCircle className="w-4 h-4" />
                            </button>
                        </>
                    )}

                    {/* 2. Actions for INACTIVE categories */}
                    {category.status === 'inactive' && (
                        <button title="Activate Category" onClick={() => handleStatusChange(category._id, 'active')}
                            className="flex items-center gap-1 px-3 py-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-lg transition-all shadow-sm text-xs font-medium">
                            <CheckCircle className="w-4 h-4" /> Activate
                        </button>
                    )}
                </div >
            )
        }
    ];

    const totalEntries = filteredCategories.length;
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
                                    Are you sure you want to delete <span className="font-semibold text-slate-700">{categoryToDelete?.name}</span>?
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
                                    onClick={handleDeleteCategory}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm shadow-red-200"
                                >
                                    Delete Category
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Category Management</h1>
                    <p className="text-slate-500 text-sm">Oversee categories and manage category.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setOpenAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 font-medium text-sm">
                        <FolderPlus className="w-4 h-4" /> Add New Category
                    </button>
                </div>
            </div>

            {/* --- Search & Filter Bar Section --- */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by category name or slug..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Loading & Error States */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                    <p className="text-slate-500 font-medium">Loading platform categories...</p>
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
                        totalItems={filteredCategories.length}
                        onPageChange={setCurrentPage}
                        paginationInfo={`Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`}
                        initialSortKey="name"
                    />
                </>
            )}

            {/* Add Category Modal */}
            {openAddModal && (
                <CategoryModal
                    mode="add"
                    closeModal={() => setOpenAddModal(false)}
                    refreshCategories={fetchCategories}
                />
            )}

            {/* Edit Category Modal */}
            {openEditModal && (
                <CategoryModal
                    mode="edit"
                    categoryData={selectedCategory}
                    closeModal={() => setOpenEditModal(false)}
                    refreshCategories={fetchCategories}
                />
            )}
        </div>
    );
};

export default CategoryManagement;