// src/pages/PropertyPage.jsx
import React, { useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../properties/PropertyCard.jsx";
import { useFetchProperties, useDeleteProperty } from "../hooks/propertyHook/usePropertyActions.js";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesApi } from "../api/categoryApi.js";
import { Search, Filter, MapPin, SlidersHorizontal, ChevronDown } from 'lucide-react';
import debounce from "lodash.debounce";
import { toast } from "react-toastify";
import { AuthContext } from "../auth/AuthProvider.jsx";
import Navbar from "../layouts/Navbar.jsx";
import Footer from "../layouts/Footer.jsx";
import { useLocation } from "react-router-dom";

export default function PropertyPage() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const locationHook = useLocation();

    // Parse query params for initial search
    const queryParams = new URLSearchParams(locationHook.search);
    const initialSearch = queryParams.get("search") || "";

    const [filter, setFilter] = useState({ category: "all", price: "all", location: "" });
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 9;

    const { data: properties, isLoading: isLoadingProperties, isError, error } = useFetchProperties();
    const { mutate: deletePropertyMutation, isPending: isDeleting } = useDeleteProperty();

    const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await getCategoriesApi();
            return res.data.data;
        },
        onError: () => toast.error("Failed to load categories."),
    });

    const debouncedUpdate = useCallback(debounce(val => setDebouncedSearch(val), 300), []);
    const handleSearchChange = e => { setSearchTerm(e.target.value); debouncedUpdate(e.target.value); };

    const filteredProperties = React.useMemo(() => {
        if (!properties) return [];
        return properties.filter(p => {
            const matchSearch = p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                p.location.toLowerCase().includes(debouncedSearch.toLowerCase());
            const matchCat = filter.category === "all" || (p.categoryId?.category_name?.toLowerCase() === filter.category.toLowerCase());
            const matchPrice = filter.price === "all" || (filter.price === "low" && p.price <= 15000) || (filter.price === "medium" && p.price > 15000 && p.price <= 30000) || (filter.price === "high" && p.price > 30000);
            const matchLocation = filter.location.trim() === "" || p.location.toLowerCase().includes(filter.location.toLowerCase());
            return matchSearch && matchCat && matchPrice && matchLocation;
        });
    }, [properties, debouncedSearch, filter]);

    const start = (currentPage - 1) * rowsPerPage;
    const currentProps = filteredProperties.slice(start, start + rowsPerPage);
    const totalPages = Math.ceil(filteredProperties.length / rowsPerPage);

    const handleDeleteProperty = (propertyId) => {
        deletePropertyMutation(propertyId);
    };

    if (isLoadingProperties || isLoadingCategories) {
        return <div className="min-h-screen flex items-center justify-center text-primary font-bold text-xl animate-pulse">Loading secure listings...</div>;
    }

    if (isError) {
        return <div className="min-h-screen flex items-center justify-center text-primary font-bold text-red-500 text-lg">Error: {error.message}</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-background font-body">
            <Navbar />
            <div className="flex-grow pt-[80px]"> {/* Offset for fixed navbar */}

                {/* Top Filter Bar */}
                <div className="sticky top-[72px] z-30 bg-white shadow-sm border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8 transition-all">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 justify-between">

                        {/* Search Input (Primary) */}
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 focus:bg-white focus:border-primary rounded-full text-sm font-medium outline-none transition-all shadow-sm"
                                type="text"
                                placeholder="Search by city, title, neighborhood..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>

                        {/* Filter Toggles / Dropdowns */}
                        <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                            {/* Category Dropdown */}
                            <div className="relative min-w-[140px]">
                                <select
                                    className="appearance-none w-full pl-4 pr-8 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-full text-sm font-medium text-gray-700 cursor-pointer outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                    value={filter.category}
                                    onChange={e => setFilter(s => ({ ...s, category: e.target.value }))}
                                >
                                    <option value="all">Any Type</option>
                                    {categories.map(c => <option key={c._id} value={c.category_name}>{c.category_name}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>

                            {/* Price Dropdown */}
                            <div className="relative min-w-[150px]">
                                <select
                                    className="appearance-none w-full pl-4 pr-8 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-full text-sm font-medium text-gray-700 cursor-pointer outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                    value={filter.price}
                                    onChange={e => setFilter(s => ({ ...s, price: e.target.value }))}
                                >
                                    <option value="all">Any Price</option>
                                    <option value="low">Below Rs 15k</option>
                                    <option value="medium">Rs 15k - 30k</option>
                                    <option value="high">Above Rs 30k</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>

                            {/* Location Filter (Simple Input for now, could be dropdown) */}
                            <div className="relative min-w-[160px] hidden lg:block">
                                <input
                                    className="w-full pl-4 pr-8 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-full text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                    placeholder="Location..."
                                    value={filter.location}
                                    onChange={e => setFilter(s => ({ ...s, location: e.target.value }))}
                                />
                                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>

                            {/* Reset Button */}
                            {(filter.category !== "all" || filter.price !== "all" || filter.location !== "") && (
                                <button
                                    onClick={() => setFilter({ category: "all", price: "all", location: "" })}
                                    className="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-full transition-colors whitespace-nowrap"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-6 max-w-7xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 font-heading">
                            {filteredProperties.length} <span className="text-gray-500 font-medium text-lg">properties found</span>
                        </h2>
                    </div>

                    <div className="max-w-7xl mx-auto">
                        {currentProps.length ? (
                            // Masonry-ish Layout using columns
                            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                                {currentProps.map(p => (
                                    <div key={p._id} className="break-inside-avoid">
                                        <PropertyCard
                                            property={p}
                                            currentUserId={user?._id}
                                            onUpdate={() => navigate(`/update-property/${p._id}`)}
                                            onDelete={() => handleDeleteProperty(p._id)}
                                            isDeleting={isDeleting}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                <Search className="text-gray-300 mb-6" size={64} />
                                <h3 className="text-2xl font-bold text-gray-400">No matches found</h3>
                                <p className="text-gray-500 mt-2 text-lg">Try adjusting your filters or search terms.</p>
                                <button
                                    onClick={() => { setFilter({ category: "all", price: "all", location: "" }); setSearchTerm(""); debouncedUpdate(""); }}
                                    className="mt-8 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-3 mt-16 pb-12">
                                <button onClick={() => setCurrentPage(cp => Math.max(cp - 1, 1))} disabled={currentPage === 1} className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 text-font-bold text-text-main shadow-sm transition-all">Previous</button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-11 h-11 rounded-xl font-bold text-sm transition-all ${currentPage === i + 1 ? 'bg-primary text-white shadow-lg shadow-primary/30 transform scale-105' : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button onClick={() => setCurrentPage(cp => Math.min(cp + 1, totalPages))} disabled={currentPage === totalPages} className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 text-font-bold text-text-main shadow-sm transition-all">Next</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}