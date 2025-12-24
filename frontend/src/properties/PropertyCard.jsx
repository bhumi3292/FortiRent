// src/properties/PropertyCard.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, ChevronLeft, ChevronRight, Bed, Bath } from 'lucide-react';
import { addToCartApi, removeFromCartApi, getCartApi } from '../api/cartApi';
import { toast } from "react-toastify";
import { VITE_API_BASE_URL } from '../utils/env';

const API_BASE_URL = VITE_API_BASE_URL || "http://localhost:3001";

const HeartIconComponent = ({ propertyId }) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchCart = useCallback(async () => {
        try {
            const response = await getCartApi();
            if (response.data && Array.isArray(response.data.data)) {
                const wishlisted = response.data.data.some(item => item._id === propertyId);
                setIsWishlisted(wishlisted);
            }
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        } finally {
            setLoading(false);
        }
    }, [propertyId]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleHeartClick = async (e) => {
        e.stopPropagation();
        if (loading) return;

        try {
            if (isWishlisted) {
                await removeFromCartApi(propertyId);
                setIsWishlisted(false);
                toast.success("Removed from wishlist!");
            } else {
                await addToCartApi(propertyId);
                setIsWishlisted(true);
                toast.success("Added to wishlist!");
            }
        } catch (error) {
            console.error("Failed to update cart:", error);
            toast.error(error.response?.data?.message || "Failed to update wishlist.");
        }
    };

    return (
        <button
            onClick={handleHeartClick}
            disabled={loading}
            className={`p-2 rounded-full shadow-md transition-colors ${isWishlisted ? 'bg-state-error text-white' : 'bg-white text-gray-400 hover:text-state-error'
                }`}
        >
            <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
    );
};


const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center border border-gray-100">
                <h3 className="text-xl font-bold mb-6 text-text-main">{message}</h3>
                <div className="flex justify-center gap-4">
                    <button onClick={onConfirm} className="bg-state-error text-white font-bold py-2.5 px-6 rounded-xl hover:bg-red-600 transition shadow-lg shadow-red-200">Yes, Delete</button>
                    <button onClick={onCancel} className="bg-gray-200 text-text-main font-bold py-2.5 px-6 rounded-xl hover:bg-gray-300 transition">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default function PropertyCard({ property, currentUserId, onUpdate, onDelete, isDeleting }) {
    const navigate = useNavigate();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const mediaGalleryRef = useRef(null);

    if (!property) {
        return <div className="bg-red-50 text-state-error p-4 rounded-xl shadow border border-red-100">Invalid property data.</div>;
    }

    // The logic to determine if the current user owns this property
    const isOwner = currentUserId && property.landlord?._id === currentUserId;

    // --- COMBINE IMAGES AND VIDEOS FOR CAROUSEL ---
    const mediaUrls = property.images?.map(img => ({ type: 'image', url: `${API_BASE_URL}/${img}` }))
        .concat(property.videos?.map(vid => ({ type: 'video', url: `${API_BASE_URL}/${vid}` }))) || [{ type: 'image', url: 'https://placehold.co/300x200?text=No+Media' }];

    // --- MODIFIED handleCardClick ---
    const handleCardClick = () => {
        // Pass the current property and the currently visible media index to the detail page
        navigate(`/property/${property._id}`, {
            state: {
                property: property,
                initialMediaIndex: currentMediaIndex,
            },
        });
    };

    const handleUpdateClick = (e) => {
        e.stopPropagation();
        if (onUpdate) onUpdate(property);
    };
    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        setShowDeleteConfirm(false);
        if (onDelete) {
            onDelete(property._id);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    const nextMedia = (e) => {
        e.stopPropagation();
        setCurrentMediaIndex((prevIndex) => Math.min(prevIndex + 1, mediaUrls.length - 1));
        if (mediaGalleryRef.current) {
            mediaGalleryRef.current.scrollLeft += mediaGalleryRef.current.offsetWidth;
        }
    };

    const prevMedia = (e) => {
        e.stopPropagation();
        setCurrentMediaIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        if (mediaGalleryRef.current) {
            mediaGalleryRef.current.scrollLeft -= mediaGalleryRef.current.offsetWidth;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer relative group border border-gray-100 h-full flex flex-col" onClick={handleCardClick}>
            <div className="relative">
                <div ref={mediaGalleryRef} className="w-full h-64 overflow-x-auto scroll-smooth flex snap-x snap-mandatory scrollbar-hide">
                    {mediaUrls.map((media, index) => (
                        <div key={index} className="w-full h-64 flex-shrink-0 snap-center relative">
                            {media.type === 'video' ? (
                                <video src={media.url} controls className="w-full h-full object-cover" />
                            ) : (
                                <img src={media.url} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                        </div>
                    ))}
                </div>
                {mediaUrls.length > 1 && (
                    <>
                        <button onClick={prevMedia} className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/90 backdrop-blur-md rounded-full p-2 hover:bg-white text-primary z-20 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
                            <ChevronLeft size={18} />
                        </button>
                        <button onClick={nextMedia} className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/90 backdrop-blur-md rounded-full p-2 hover:bg-white text-primary z-20 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
                            <ChevronRight size={18} />
                        </button>
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold py-1 px-2.5 rounded-full z-20 tracking-wide border border-white/10">
                            {currentMediaIndex + 1} / {mediaUrls.length}
                        </div>
                    </>
                )}
                <div className="absolute top-3 right-3 z-30 transform transition-transform hover:scale-110 drop-shadow-md">
                    <HeartIconComponent propertyId={property._id} />
                </div>
                <div className="absolute top-3 left-3 z-30">
                    <div className="bg-white/90 backdrop-blur-sm text-secondary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-white/20">
                        For Rent
                    </div>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="mb-2">
                    <h3 className="text-xl font-bold text-text-main font-heading line-clamp-1 group-hover:text-primary transition-colors">{property.title}</h3>
                </div>

                <p className="text-sm text-text-muted mb-4 flex items-center font-body truncate">
                    <MapPin size={16} className="mr-1.5 text-primary flex-shrink-0" />{property.location}
                </p>

                <div className="flex items-baseline mb-5 text-gray-900">
                    <span className="text-2xl font-bold text-primary font-heading">Rs. {property.price.toLocaleString()}</span>
                    <span className="text-sm text-text-muted font-medium ml-1">/ month</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex items-center text-sm text-text-main bg-gray-50 p-2 rounded-lg justify-center">
                        <Bed size={18} className="mr-2 text-primary" />
                        <span className="font-bold mr-1">{property.bedrooms}</span> <span className="text-text-muted">Beds</span>
                    </div>
                    <div className="flex items-center text-sm text-text-main bg-gray-50 p-2 rounded-lg justify-center">
                        <Bath size={18} className="mr-2 text-primary" />
                        <span className="font-bold mr-1">{property.bathrooms}</span> <span className="text-text-muted">Baths</span>
                    </div>
                </div>

                {/* Description snippet could go here if space permits, but card looks cleaner without it for now given the flex-grow structure */}
            </div>

            {/* CRITICAL: The buttons below will only render if 'isOwner' is true. */}
            {isOwner && (
                <div className="grid grid-cols-2 gap-3 p-4 border-t bg-gray-50/50">
                    <button onClick={handleUpdateClick} className="bg-white border border-gray-200 text-primary rounded-xl py-2.5 hover:bg-primary hover:text-white font-bold transition-all shadow-sm text-sm">Update</button>
                    <button
                        onClick={handleDeleteClick}
                        disabled={isDeleting}
                        className="bg-white border border-gray-200 text-state-error rounded-xl py-2.5 hover:bg-state-error hover:text-white font-bold transition-all shadow-sm text-sm disabled:opacity-50"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            )}

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                message="Are you sure you want to delete this property?"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </div>
    );
}