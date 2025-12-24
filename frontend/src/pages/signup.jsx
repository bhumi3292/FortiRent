import React from "react";
import Navbar from "../layouts/Navbar";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRegisterUserTan } from '../hooks/userRegisterUserTan';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Phone, Shield, Check } from 'lucide-react';

function Signup() {
    const { mutate, isLoading } = useRegisterUserTan();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
            stakeholder: 'Tenant', // Default
        },
        validationSchema: Yup.object({
            fullName: Yup.string().required("Full Name is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
            phoneNumber: Yup.string().required("Phone Number is required"),
            password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required("Confirm Password is required"),
            stakeholder: Yup.string().required("Role is required"),
        }),
        onSubmit: (values) => {
            mutate(values, {
                onSuccess: () => {
                    toast.success("Account created! Please login.");
                    navigate("/login");
                },
                onError: (error) => {
                    toast.error(error.response?.data?.message || "Registration failed");
                },
            });
        },
    });

    // Password Strength Logic
    const getPasswordStrength = (password) => {
        let score = 0;
        if (!password) return 0;
        if (password.length > 5) score += 1;
        if (password.length > 8) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        return score; // Max 5
    };

    const strength = getPasswordStrength(formik.values.password);
    const strengthColor = strength < 2 ? 'bg-red-500' : strength < 4 ? 'bg-yellow-500' : 'bg-green-500';
    const strengthText = strength < 2 ? 'Weak' : strength < 4 ? 'Medium' : 'Strong';

    return (
        <div className="min-h-screen bg-background font-body">
            <Navbar />
            <div className="container mx-auto px-4 py-12 flex justify-center">
                <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-primary p-8 text-center text-white">
                        <h1 className="text-3xl font-bold font-heading mb-2">Create Account</h1>
                        <p className="opacity-90">Join FortiRent to find or list secure properties.</p>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="p-8 space-y-8">

                        {/* Group 1: Account Type */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="bg-secondary/20 text-secondary p-1.5 rounded-lg"><User size={20} /></span>
                                Account Type
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${formik.values.stakeholder === "Tenant" ? "border-secondary bg-secondary/5" : "border-gray-100 hover:border-gray-200"}`}>
                                    <input type="radio" name="stakeholder" value="Tenant" className="hidden" onChange={formik.handleChange} />
                                    <div className="font-bold text-gray-800">I want to Rent</div>
                                    <div className="text-xs text-gray-500 mt-1">Find a secure home</div>
                                </label>
                                <label className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${formik.values.stakeholder === "Landlord" ? "border-secondary bg-secondary/5" : "border-gray-100 hover:border-gray-200"}`}>
                                    <input type="radio" name="stakeholder" value="Landlord" className="hidden" onChange={formik.handleChange} />
                                    <div className="font-bold text-gray-800">I want to List</div>
                                    <div className="text-xs text-gray-500 mt-1">Rent out property</div>
                                </label>
                            </div>
                        </div>

                        {/* Group 2: Personal Details */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="bg-secondary/20 text-secondary p-1.5 rounded-lg"><Mail size={20} /></span>
                                Personal Details
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input type="text" name="fullName" placeholder="e.g. John Doe" {...formik.getFieldProps('fullName')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none" />
                                    {formik.touched.fullName && formik.errors.fullName && <p className="text-red-500 text-xs mt-1">{formik.errors.fullName}</p>}
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input type="email" name="email" placeholder="john@example.com" {...formik.getFieldProps('email')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none" />
                                        {formik.touched.email && formik.errors.email && <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input type="text" name="phoneNumber" placeholder="+977..." {...formik.getFieldProps('phoneNumber')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none" />
                                        {formik.touched.phoneNumber && formik.errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{formik.errors.phoneNumber}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Group 3: Security */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="bg-secondary/20 text-secondary p-1.5 rounded-lg"><Lock size={20} /></span>
                                Security
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input type="password" name="password" placeholder="Min. 6 characters" {...formik.getFieldProps('password')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none" />
                                    {/* Password Strength Indicator */}
                                    {formik.values.password && (
                                        <div className="mt-2">
                                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${strengthColor} transition-all duration-300`}
                                                    style={{ width: `${(strength / 5) * 100}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1 text-right">{strengthText}</p>
                                        </div>
                                    )}
                                    {formik.touched.password && formik.errors.password && <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                    <input type="password" name="confirmPassword" placeholder="Repeat password" {...formik.getFieldProps('confirmPassword')} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none" />
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-primary/20 transition-all disabled:opacity-70">
                                {isLoading ? "Creating Account..." : "Create Account"}
                            </button>
                            <p className="text-center text-gray-500 text-sm mt-6">
                                Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log In</Link>
                            </p>
                        </div>

                    </form>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default Signup;