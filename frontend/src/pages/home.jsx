import React, { useEffect, useState, useContext } from "react";
import Navbar from "../layouts/Navbar.jsx";
import Footer from "../layouts/Footer.jsx";
import { Link, useNavigate } from "react-router-dom";
import { fetchPropertiesService } from "../services/addPropertyService.jsx";
import PropertyCard from "../properties/PropertyCard.jsx";
import { AuthContext } from "../auth/AuthProvider";
import { toast } from "react-toastify";
import {
    Search,
    MapPin,
    ArrowRight,
    PlayCircle,
    UserPlus,
    LogIn
} from "lucide-react";
import heroImage from "../assets/2Q.png"; // Assuming you might have this still, or a placeholder

export default function Home() {
    const [properties, setProperties] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/property?search=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate('/property');
        }
    };

    useEffect(() => {
        const loadProperties = async () => {
            try {
                const data = await fetchPropertiesService();
                setProperties(data.slice(0, 3));
            } catch (error) {
                console.error("Error loading properties:", error);
            }
        };
        loadProperties();
    }, []);

    const handleSeeAll = () => {
        if (user) {
            navigate("/property");
        } else {
            toast.info("Please log in to browse all properties.");
            navigate("/login");
        }
    };

    return (
        <div className="w-full flex flex-col min-h-screen bg-background font-body text-text-main">
            <header className="fixed top-0 left-0 w-full z-50">
                <Navbar />
            </header>

            {/* Hero Section */}
            <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-background">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 -z-10 opacity-70"></div>
                <div className="absolute top-40 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] -translate-x-1/3 -z-10 opacity-60"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">

                    <div className="text-center lg:text-left animate-fade-in-up">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-white text-primary font-semibold text-sm mb-6 border border-gray-100 shadow-sm">
                            <span className="text-secondary font-bold tracking-wider uppercase text-xs">✨ #1 Trusted Rental Platform</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight font-heading">
                            Find your <span className="text-primary relative inline-block">perfect
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-secondary opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                                </svg>
                            </span> <br /> place to call home.
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                            Discover verified listings with transparent pricing and secure payments. Your next home is just a click away.
                        </p>

                        <form onSubmit={handleSearch} className="mb-8 max-w-md mx-auto lg:mx-0 relative flex items-center shadow-lg shadow-gray-200/50 rounded-2xl overflow-hidden border border-gray-100 bg-white p-1">
                            <Search className="absolute left-4 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by city, neighborhood..."
                                className="w-full pl-12 pr-4 py-3 outline-none text-gray-700 placeholder-gray-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold transition-all">
                                Search
                            </button>
                        </form>

                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start items-center">
                            <Link
                                to="/property"
                                className="text-primary font-bold hover:text-secondary flex items-center gap-2 transition-colors"
                            >
                                <PlayCircle size={20} /> Explore Properties
                            </Link>

                            {!user && (
                                <>
                                    <span className="text-gray-300">|</span>
                                    <Link
                                        to="/login"
                                        className="text-gray-600 font-medium hover:text-primary flex items-center gap-2 transition-colors"
                                    >
                                        <LogIn size={18} /> Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="text-gray-600 font-medium hover:text-primary flex items-center gap-2 transition-colors"
                                    >
                                        <UserPlus size={18} /> Register
                                    </Link>
                                </>
                            )}
                        </div>

                        <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-70 grayscale hover:grayscale-0 transition-all">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-secondary flex items-center justify-center text-xs text-white font-bold max-w-[40px]">+2k</div>
                            </div>
                            <span className="text-sm font-semibold text-gray-500">Happy Renters</span>
                        </div>
                    </div>

                    <div className="relative hidden lg:block animate-fade-in-up-delay-200">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 border-[6px] border-white z-10">
                            <img src={heroImage || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop"} alt="Modern Apartment" className="w-full h-full object-cover aspect-[4/3] transform hover:scale-105 transition-transform duration-700" />

                            <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-white/50 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <div className="text-gray-900 font-bold text-lg">Downtown, LA</div>
                                    <div className="text-gray-500 text-sm">Luxury Apartment</div>
                                </div>
                                <div className="ml-auto text-primary font-bold text-xl">$2,400<span className="text-xs text-gray-400 font-normal">/mo</span></div>
                            </div>
                        </div>

                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-bounce-slow"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-xl animate-pulse"></div>

                        <div className="absolute -top-6 -right-6 p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl animate-bounce-slow border border-white/40 z-20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status</p>
                                    <p className="font-bold text-gray-800">Verified Listing</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div className="max-w-xl">
                            <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">Premium Spaces</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading">Featured Properties</h2>
                            <p className="text-gray-500 mt-2">Explore our most exclusive and highly-rated listings.</p>
                        </div>
                        <button
                            onClick={handleSeeAll}
                            className="text-primary hover:text-secondary font-semibold flex items-center gap-2 group transition-colors"
                        >
                            View All Properties
                            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>

                    {properties.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                            {/* Featured Properties Grid */}
                            {properties[0] && (
                                <div className="lg:col-span-2 group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all h-[400px] md:h-[500px]">
                                    <div className="absolute inset-0">
                                        <img
                                            src={properties[0].images?.[0] || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"}
                                            alt={properties[0].title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 p-8 w-full text-white">
                                        <div className="inline-block px-3 py-1 bg-secondary text-white text-xs font-bold rounded-full mb-3 shadow-sm">FEATURED</div>
                                        <h3 className="text-3xl font-bold mb-2">{properties[0].title}</h3>
                                        <p className="text-gray-200 mb-4 line-clamp-2">{properties[0].description}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="font-bold text-2xl">${properties[0].price}<span className="text-sm font-normal opacity-80">/night</span></div>
                                            <Link to={`/property/${properties[0]._id}`} className="px-6 py-2 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-colors">
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Secondary Featured Items */}
                            <div className="flex flex-col gap-8 h-[400px] md:h-[500px]">
                                {properties.slice(1, 3).map((property) => (
                                    <div key={property._id} className="flex-1 relative rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-all group">
                                        <div className="absolute inset-0">
                                            <img
                                                src={property.images?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"}
                                                alt={property.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 p-5 text-white w-full">
                                            <h4 className="text-xl font-bold mb-1 truncate">{property.title}</h4>
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold">${property.price}</span>
                                                <Link to={`/property/${property._id}`} className="text-xs font-bold bg-white/20 hover:bg-white/40 backdrop-blur-sm px-3 py-1.5 rounded-lg transition-colors">
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {properties.length < 2 && (
                                    <div className="flex-1 bg-gray-50 rounded-3xl flex items-center justify-center border-2 border-dashed border-gray-200">
                                        <span className="text-gray-400 font-medium">Coming Soon</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <Search className="mx-auto text-gray-300 mb-4" size={48} />
                            <h3 className="text-xl font-bold text-gray-400">No properties found yet.</h3>
                            <p className="text-gray-400">Check back soon for new listings!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-primary text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-heading">Why rent with FortiRent?</h2>
                            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                                We are distinct because we prioritize your safety above all else. Our platform is built on a foundation of trust, verification, and transparency.
                            </p>

                            <ul className="space-y-6">
                                {[
                                    "Identity Verified Landlords & Tenants",
                                    "Physically Audited Properties",
                                    "Secure Escrow Payments",
                                    "24/7 Support & Mediation"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-4">
                                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-primary">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                        </div>
                                        <span className="font-medium text-lg">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4 translate-y-8">
                                    <div className="bg-white/10 backdrop-blur p-6 rounded-2xl border border-white/20">
                                        <h3 className="text-3xl font-bold text-secondary mb-1">10k+</h3>
                                        <p className="text-blue-100">Active Users</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur p-6 rounded-2xl border border-white/20">
                                        <h3 className="text-3xl font-bold text-secondary mb-1">98%</h3>
                                        <p className="text-blue-100">Satisfaction</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white/10 backdrop-blur p-6 rounded-2xl border border-white/20">
                                        <h3 className="text-3xl font-bold text-secondary mb-1">24h</h3>
                                        <p className="text-blue-100">Approval Time</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur p-6 rounded-2xl border border-white/20">
                                        <h3 className="text-3xl font-bold text-secondary mb-1">0%</h3>
                                        <p className="text-blue-100">Fraud Rate</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}