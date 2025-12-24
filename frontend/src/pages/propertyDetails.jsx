import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { getOnePropertyApi } from '../api/propertyApi';
import { addToCartApi, removeFromCartApi, getCartApi } from '../api/cartApi';
import { FaHeart } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';
import { AuthContext } from '../auth/AuthProvider';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

import { MapPin, Maximize2, Phone, Mail, Home, DollarSign, User, ChevronLeft, ChevronRight, CreditCard, Calendar as CalendarIcon, MessageSquare } from 'lucide-react';

import { useBookingModal } from '../hooks/useBookingHook.js';
import { useKhaltiPayment } from '../hooks/payment/useKhaltiPayment.js';
import BookingModal from '../components/bookingComponents.jsx';
import LandlordManageAvailabilityModal from '../components/LandlordManageAvailabilityModal.jsx';

import { getFullMediaUrl } from '../utils/mediaUrlHelper.js';
import PaymentSelectionModal from "../components/payment/PaymentSelectionModal.jsx"; // Import the new media URL helper
import { createOrGetChat } from '../api/chatApi';


const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text).then(() => toast.success(message)).catch(() => toast.error('Failed to copy.'));
};

export default function PropertyDetail() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [paymentModel, setPaymentModel] = useState(false);

    const { isAuthenticated, user, loading: isLoadingAuth } = useContext(AuthContext);

    const [property, setProperty] = useState(location.state?.property || null);
    const [loading, setLoading] = useState(!property);
    const [error, setError] = useState(null);
    const [liked, setLiked] = useState(false);

    // Use the Khalti payment hook
    const { initiateKhaltiPayment, isProcessingPayment, paymentSuccess, paymentError } = useKhaltiPayment(
        property?._id,
        property?.title,
        property?.price
    );

    const [showManageAvailabilityModal, setShowManageAvailabilityModal] = useState(false);

    // Integrate the useBookingModal hook for tenant booking
    const {
        showBookingModal,
        handleOpenBookingModal,
        handleCloseBookingModal,
        selectedDate,
        handleDateChange,
        currentDaySlots,
        selectedTime,
        handleSlotSelect,
        handleConfirmBooking,
        loadingAvailability,
        isBookingLoading,
        bookingSuccess,
        availableSlots
    } = useBookingModal(id, property?.landlord?._id, isAuthenticated);

    const [currentMediaIndex, setCurrentMediaIndex] = useState(location.state?.initialMediaIndex || 0);

    // Use the getFullMediaUrl helper for media paths
    const allMedia = useMemo(() => {
        if (!property) return [];
        return [
            ...(property.images || []).map(img => getFullMediaUrl(img)),
            ...(property.videos || []).map(vid => getFullMediaUrl(vid))
        ];
    }, [property]);

    // Fetch property details if not already passed via location state
    useEffect(() => {
        if (!property && id) {
            getOnePropertyApi(id).then(res => {
                setProperty(res.data.data);
                setLoading(false);
                setCurrentMediaIndex(0); // Reset media index on new property load
            }).catch(() => {
                setError('Failed to load property.');
                setLoading(false);
            });
        }
    }, [id, property]);

    // Check if property is liked by the current user
    useEffect(() => {
        if (isAuthenticated && property?._id) {
            getCartApi().then(res => {
                const likedIds = res.data.data?.items?.map(i => i.property?._id);
                setLiked(likedIds?.includes(property._id));
            }).catch(err => {
                console.error("Failed to fetch cart for like check:", err);
                setLiked(false);
            });
        } else {
            setLiked(false);
        }
    }, [property, isAuthenticated]);

    // Toggle property like status (add/remove from cart)
    const handleToggleLike = () => {
        if (!isAuthenticated) return toast.warn('Login to save properties.');
        if (!property?._id) return toast.error('Invalid property ID.');

        const action = liked ? removeFromCartApi : addToCartApi;
        action(property._id).then(() => {
            setLiked(!liked);
            toast.success(liked ? 'Removed from cart.' : 'Added to cart.');
        }).catch(err => toast.error(err.response?.data?.message || 'Action failed.'));
    };

    // Open Gmail compose window
    const openGmailCompose = (email) => {
        if (email) {
            const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
            window.open(gmailComposeUrl, '_blank');
        } else {
            toast.error('No email address available to compose.');
        }
    };

    const handleEsewaPayment = () => {
        // setIsProcessing(true)

        const transaction_uuid = uuidv4(); // or use uuid v4 if required
        console.log(transaction_uuid)
        const product_code = "EPAYTEST"
        const total_amount = property?.price.toFixed(2) // You must match this exactly as in the string
        const signed_field_names = "total_amount,transaction_uuid,product_code"

        const signingString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`
        const secret = "8gBm/:&EnhH.1/q" // ← UAT secret key from eSewa. DO NOT USE IN PRODUCTION FRONTEND.

        const signature = CryptoJS.HmacSHA256(signingString, secret).toString(CryptoJS.enc.Base64)

        const fields = {
            amount: property?.price.toFixed(2),
            tax_amount: "0",
            total_amount: total_amount,
            transaction_uuid: transaction_uuid,
            product_code: product_code,
            product_service_charge: "0",
            product_delivery_charge: "0",
            success_url: "https://developer.esewa.com.np/success",
            failure_url: "https://developer.esewa.com.np/failure",
            signed_field_names: signed_field_names,
            signature: signature,
        }

        const form = document.createElement("form")
        form.setAttribute("method", "POST")
        form.setAttribute("action", "https://rc-epay.esewa.com.np/api/epay/main/v2/form")

        Object.entries(fields).forEach(([key, value]) => {
            const input = document.createElement("input")
            input.setAttribute("type", "hidden")
            input.setAttribute("name", key)
            input.setAttribute("value", value)
            form.appendChild(input)
        })

        document.body.appendChild(form)
        form.submit()
    }

    // Handle payment
    const handlePayment = () => {
        setPaymentModel(true);

    };

    const handleChatLandlord = async () => {
        if (!isAuthenticated) {
            toast.warn('Please log in to chat with the landlord.');
            return;
        }
        if (!property?.landlord?._id) {
            toast.error('Landlord information is missing. Cannot start chat.');
            return;
        }
        try {
            const chat = await createOrGetChat(property.landlord._id, property._id);
            navigate('/chat', { state: { preselectChatId: chat._id } });
        } catch (err) {
            toast.error(err.message || 'Failed to start chat.');
        }
    };

    // New handler for WhatsApp chat
    const handleWhatsAppChat = (phoneNumber) => {
        if (!phoneNumber) {
            toast.error('Landlord phone number not available for WhatsApp chat.');
            return;
        }

        const whatsappUrl = `https://web.whatsapp.com/send?phone=${cleanedPhoneNumber}`;
        window.open(whatsappUrl, '_blank');
    };

    // Check if a URL points to a video file
    const isVideo = url => /\.(mp4|webm|ogg|mov)$/i.test(url);

    // Navigation for media gallery
    const nextMedia = () => {
        setCurrentMediaIndex(prevIndex => Math.min(prevIndex + 1, allMedia.length - 1));
    };

    const prevMedia = () => {
        setCurrentMediaIndex(prevIndex => Math.max(prevIndex - 1, 0));
    };

    const mainMedia = allMedia[currentMediaIndex] || null;

    // ... (previous logic stays similar, just Layout changes below)

    // Simple Tab State
    const [activeTab, setActiveTab] = useState('description');

    if (loading || isLoadingAuth) return <div className="flex justify-center items-center h-screen bg-gray-50 text-primary">Loading FortiRent...</div>;
    if (error) return <div className="text-error text-xl p-4">{error}</div>;
    if (!property) return <div className="text-yellow-600">No property found.</div>;

    const isOwner = isAuthenticated && user?.role === 'Landlord' && user?._id === property.landlord?._id;

    const handleOpenManageAvailabilityModal = () => {
        if (!isAuthenticated) {
            toast.warn('Please log in to manage availability.');
            return;
        }
        if (user?.role !== 'Landlord') {
            toast.error('Access denied. Landlord role required to manage availability.');
            return;
        }
        if (user?._id !== property.landlord?._id) {
            toast.error('You do not own this property to manage its availability.');
            return;
        }
        setShowManageAvailabilityModal(true);
    };

    const handleCloseManageAvailabilityModal = () => {
        setShowManageAvailabilityModal(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            {/* Full Width Hero Slider */}
            <div className="w-full h-[60vh] relative bg-black group">
                {mainMedia && (isVideo(mainMedia) ?
                    <video src={mainMedia} controls className="w-full h-full object-cover opacity-90" /> :
                    <img src={mainMedia} alt={property.title} className="w-full h-full object-cover opacity-90" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>

                <div className="absolute bottom-10 left-4 md:left-10 text-white z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold font-heading mb-2 shadow-sm">{property.title}</h1>
                    <div className="flex items-center gap-2 text-lg font-body">
                        <MapPin size={20} className="text-secondary" /> {property.location}
                    </div>
                </div>

                <button onClick={handleToggleLike} className="absolute top-24 right-4 md:right-10 p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-all shadow-lg z-20">
                    {liked ? <FaHeart className="text-error text-3xl" /> : <FiHeart className="text-white text-3xl" />}
                </button>

                {allMedia.length > 1 && (
                    <>
                        <button onClick={prevMedia} disabled={currentMediaIndex === 0} className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/10 backdrop-blur-md rounded-full p-3 hover:bg-white/30 text-white transition disabled:opacity-50 disabled:cursor-not-allowed">
                            <ChevronLeft size={32} />
                        </button>
                        <button onClick={nextMedia} disabled={currentMediaIndex === allMedia.length - 1} className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/10 backdrop-blur-md rounded-full p-3 hover:bg-white/30 text-white transition disabled:opacity-50 disabled:cursor-not-allowed">
                            <ChevronRight size={32} />
                        </button>
                    </>
                )}
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Details & Tabs */}
                <div className="lg:col-span-2">
                    {/* Media Thumbnails */}
                    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar mb-8">
                        {allMedia.map((mediaUrl, i) => (
                            <div key={i} onClick={() => setCurrentMediaIndex(i)} className={`relative flex-shrink-0 w-32 h-20 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${currentMediaIndex === i ? 'border-primary ring-2 ring-primary/30' : 'border-transparent hover:border-gray-300'}`}>
                                {isVideo(mediaUrl) ? (
                                    <video src={mediaUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <img src={mediaUrl} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                        <div className="flex border-b border-gray-100">
                            {['description', 'amenities', 'reviews'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-4 font-bold text-center capitalize transition-colors font-heading ${activeTab === tab ? 'bg-primary text-white' : 'text-text-light hover:bg-gray-50'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="p-6 md:p-8 min-h-[300px]">
                            {activeTab === 'description' && (
                                <div className="animate-fade-in-up">
                                    <h2 className="text-2xl font-bold text-text-main mb-4 font-heading">About this property</h2>
                                    <p className="text-text-light leading-relaxed font-body whitespace-pre-line">{property.description || 'No description provided.'}</p>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                                        <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
                                            <div className="p-2 bg-white rounded-full text-primary shadow-sm"><Home size={20} /></div>
                                            <div>
                                                <div className="text-xs text-text-light uppercase font-bold">Category</div>
                                                <div className="text-text-main font-semibold">{property.categoryId?.category_name || 'N/A'}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
                                            <div className="p-2 bg-white rounded-full text-primary shadow-sm"><Maximize2 size={20} /></div>
                                            <div>
                                                <div className="text-xs text-text-light uppercase font-bold">Space</div>
                                                <div className="text-text-main font-semibold">{property.bedrooms} Bed, {property.bathrooms} Bath</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
                                            <div className="p-2 bg-white rounded-full text-primary shadow-sm"><DollarSign size={20} /></div>
                                            <div>
                                                <div className="text-xs text-text-light uppercase font-bold">Price</div>
                                                <div className="text-text-main font-semibold">Rs. {property.price.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'amenities' && (
                                <div className="animate-fade-in-up">
                                    <h2 className="text-2xl font-bold text-text-main mb-4 font-heading">Details & Amenities</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 text-text-light"><CalendarIcon size={18} className="text-secondary" /> Listed: {new Date(property.createdAt).toLocaleDateString()}</div>
                                        <div className="flex items-center gap-3 text-text-light"><MapPin size={18} className="text-secondary" /> {property.location}</div>
                                        {/* Add more derived amenities here depending on data structure */}
                                        <div className="flex items-center gap-3 text-text-light"><Maximize2 size={18} className="text-secondary" /> {property.bedrooms} Bedrooms</div>
                                        <div className="flex items-center gap-3 text-text-light"><Maximize2 size={18} className="text-secondary" /> {property.bathrooms} Bathrooms</div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'reviews' && (
                                <div className="animate-fade-in-up text-center py-10">
                                    <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-text-main mb-2">No Reviews Yet</h3>
                                    <p className="text-text-light">Be the first to book and review this property!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Landlord & Actions */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
                                {property.landlord?.fullName?.charAt(0) || <User />}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-text-main">{property.landlord?.fullName || 'Landlord'}</h2>
                                <p className="text-sm text-text-light">Property Owner</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <button
                                onClick={() => openGmailCompose(property.landlord?.email)}
                                className="w-full flex items-center justify-center gap-2 border border-gray-200 text-text-main py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                            >
                                <Mail size={18} /> {property.landlord?.email || 'N/A'}
                            </button>
                            {property.landlord?.phoneNumber ? (
                                <button
                                    onClick={() => handleWhatsAppChat(property.landlord.phoneNumber)}
                                    className="w-full flex items-center justify-center gap-2 border border-gray-200 text-text-main py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                                >
                                    <Phone size={18} /> WhatsApp Available
                                </button>
                            ) : (
                                <p className="text-gray-400 text-sm italic text-center">Contact number not available.</p>
                            )}
                            {property.landlord?._id && (
                                <button
                                    onClick={handleChatLandlord}
                                    className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary py-2.5 rounded-lg hover:bg-primary/20 transition-colors font-bold text-sm"
                                >
                                    <MessageSquare size={18} /> Chat with Landlord
                                </button>
                            )}
                        </div>

                        {/* Payment Button */}
                        <button
                            onClick={handlePayment}
                            disabled={isProcessingPayment}
                            className={`w-full py-4 bg-secondary text-primary rounded-xl hover:bg-secondary-hover flex items-center justify-center font-bold shadow-lg shadow-cyan-500/20 transform hover:-translate-y-1 transition-all duration-300 mb-3 ${isProcessingPayment ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <CreditCard size={20} className="mr-2" />
                            Make Payment
                        </button>

                        {/* Booking/Manage Button */}
                        {isOwner ? (
                            <button
                                onClick={handleOpenManageAvailabilityModal}
                                className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary-hover flex items-center justify-center font-bold shadow-md transition-all duration-300"
                            >
                                <CalendarIcon size={20} className="mr-2" /> Manage Availability
                            </button>
                        ) : (
                            <button
                                onClick={handleOpenBookingModal}
                                className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary-hover flex items-center justify-center font-bold shadow-md transition-all duration-300"
                            >
                                <CalendarIcon size={20} className="mr-2" /> Book a Visit
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <footer className="bg-primary text-white text-center py-8 mt-20">
                <p className="font-heading font-medium">&copy; {new Date().getFullYear()} FortiRent. All rights reserved.</p>
            </footer>
            <ToastContainer position="bottom-right" autoClose={3000} />

            {/* Booking Modal Component (for tenants) */}
            {property && (
                <BookingModal
                    show={showBookingModal}
                    onClose={handleCloseBookingModal}
                    propertyTitle={property.title}
                    propertyId={property._id}
                    landlordId={property.landlord?._id}
                    isAuthenticated={isAuthenticated}
                    selectedDate={selectedDate}
                    handleDateChange={handleDateChange}
                    currentDaySlots={currentDaySlots}
                    selectedTime={selectedTime}
                    handleSlotSelect={handleSlotSelect}
                    handleConfirmBooking={handleConfirmBooking}
                    loadingAvailability={loadingAvailability}
                    isBookingLoading={isBookingLoading}
                    bookingSuccess={bookingSuccess}
                    availableSlots={availableSlots}
                />
            )}

            {property && (
                <LandlordManageAvailabilityModal
                    show={showManageAvailabilityModal}
                    onClose={handleCloseManageAvailabilityModal}
                    propertyId={property._id}
                />
            )}
            {paymentModel && (
                <PaymentSelectionModal
                    show={paymentModel}
                    onClose={() => setPaymentModel(false)}
                    onSelectPaymentMethod={(method) => {
                        if (method === 'khalti') {

                            initiateKhaltiPayment(); // Start Khalti payment
                        } else if (method === 'esewa') {
                            handleEsewaPayment()
                        }
                    }}
                />
            )}

        </div>
    );
}