import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, Home } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 text-gray-600 w-full font-body">
            <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row justify-between gap-12">

                {/* Brand & Description */}
                <div className="md:w-1/3">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-primary rounded-lg p-1.5 text-white">
                            <Home size={20} strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-bold text-primary font-heading tracking-tight">FortiRent</span>
                    </div>
                    <p className="text-gray-500 mb-6 text-sm leading-relaxed max-w-sm">
                        Finding a home shouldn't be stressful. We verify every listing so you can rent with confidence.
                    </p>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
                            <Facebook size={18} />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
                            <Twitter size={18} />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
                            <Instagram size={18} />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
                            <Linkedin size={18} />
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="md:w-1/6">
                    <h3 className="text-gray-900 font-bold mb-6 font-heading">Explore</h3>
                    <ul className="space-y-4 text-sm">
                        <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
                        <li><a href="/property" className="hover:text-primary transition-colors">Properties</a></li>
                        <li><a href="/about" className="hover:text-primary transition-colors">About Us</a></li>
                        <li><a href="/blog" className="hover:text-primary transition-colors">Community</a></li>
                    </ul>
                </div>

                {/* Support */}
                <div className="md:w-1/6">
                    <h3 className="text-gray-900 font-bold mb-6 font-heading">Support</h3>
                    <ul className="space-y-4 text-sm">
                        <li><a href="/help" className="hover:text-primary transition-colors">Help Center</a></li>
                        <li><a href="/safety" className="hover:text-primary transition-colors">Trust & Safety</a></li>
                        <li><a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
                        <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="md:w-1/4">
                    <h3 className="text-gray-900 font-bold mb-6 font-heading">Get in Touch</h3>
                    <div className="space-y-4 text-sm">
                        <p className="flex items-center gap-3">
                            <Mail className="text-secondary w-5 h-5" />
                            <span>hello@fortirent.com</span>
                        </p>
                        <p className="flex items-center gap-3">
                            <Phone className="text-secondary w-5 h-5" />
                            <span>+1 (555) 123-4567</span>
                        </p>
                        <p className="text-gray-400 text-xs mt-4">
                            123 Innovation Drive,<br /> Tech City, TC 90210
                        </p>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
                    <p>&copy; {new Date().getFullYear()} FortiRent Platform. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-gray-600">Sitemap</a>
                        <a href="#" className="hover:text-gray-600">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
