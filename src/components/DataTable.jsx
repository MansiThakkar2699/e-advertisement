import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ArrowUpDown, SearchX } from 'lucide-react';

const DataTable = ({ columns, data, currentPage, itemsPerPage, totalItems, onPageChange, paginationInfo, initialSortKey = '' }) => {
    const [sortConfig, setSortConfig] = useState({ key: initialSortKey, direction: 'asc' });

    // Generic Sorting Logic
    const sortedData = useMemo(() => {
        let sortableItems = [...data];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-900 text-white">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-6 py-4 text-sm font-semibold uppercase tracking-wider ${col.sortable ? 'cursor-pointer hover:bg-slate-800 transition-colors' : ''
                                        } ${col.align === 'right' ? 'text-right' : ''}`}
                                    onClick={() => col.sortable && requestSort(col.key)}
                                >
                                    <div className={`flex items-center gap-2 ${col.align === 'right' ? 'justify-end' : ''}`}>
                                        {col.label}
                                        {col.sortable && (
                                            sortConfig.key === col.key
                                                ? (sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)
                                                : <ArrowUpDown className="w-3 h-3 opacity-50" />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {
                            sortedData.length > 0 ? (
                                sortedData.map((item, idx) => (
                                    <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                                        {columns.map((col) => (
                                            <td key={col.key} className={`px-6 py-4 ${col.align === 'right' ? 'text-right' : ''}`}>
                                                {/* If a custom render function exists, use it; otherwise show raw text */}
                                                {col.render ? col.render(item[col.key], item) : item[col.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="py-20 text-center bg-white">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="p-4 bg-slate-50 rounded-full">
                                                <SearchX className="w-10 h-10 text-slate-300" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-semibold text-slate-900">No results found</p>
                                                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                                                    Try clearing your filters or checking your spelling.
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>

            {/* Pagination UI Section */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                    {paginationInfo}
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-slate-900 rounded text-xs bg-slate-900 text-white hover:bg-slate-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    {pageNumbers.map((number) => (
                        <button
                            key={number}
                            onClick={() => onPageChange(number)}
                            className={`px-3 py-1 border rounded transition-colors ${currentPage === number
                                ? 'bg-slate-900 text-white border-slate-900' // Active style
                                : 'bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {number}
                        </button>
                    ))}
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="px-3 py-1 border border-slate-900 rounded text-xs bg-slate-900 text-white hover:bg-slate-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataTable;