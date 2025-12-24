import React from "react";
import Navbar from "../layouts/Navbar";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLoginUser } from '../hooks/useLoginUser';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const { mutate, isLoading } = useLoginUser();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            stakeholder: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Email is required"),
            password: Yup.string().required("Password is required"),
            stakeholder: Yup.string().required("Please select who you are"),
        }),
        onSubmit: (values) => {
            mutate(values, {
                onSuccess: (data) => {
                    // Auth state and localStorage are handled by useLoginUser hook
                    navigate("/");
                },
                onError: (error) => {
                    // Error toast handled by useLoginUser hook mostly, but keeping this as backup or specific UI logic
                    console.error("Login Error from page:", error);
                },
            });
        },
    });

    return (
        <div className="min-h-screen bg-background font-body">
            <Navbar />
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-primary font-heading mb-2">Welcome Back</h1>
                        <p className="text-gray-500">Sign in to manage your rentals</p>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="space-y-5">

                        {/* Role Selection */}
                        <div className="flex gap-4 p-1 bg-gray-50 rounded-xl border border-gray-200">
                            <label className={`flex-1 text-center py-2.5 rounded-lg cursor-pointer transition-all font-medium text-sm ${formik.values.stakeholder === "Tenant" ? "bg-white text-primary shadow-sm border border-gray-100" : "text-gray-500 hover:text-gray-700"}`}>
                                <input
                                    type="radio"
                                    name="stakeholder"
                                    value="Tenant"
                                    className="hidden"
                                    onChange={formik.handleChange}
                                />
                                Tenant
                            </label>
                            <label className={`flex-1 text-center py-2.5 rounded-lg cursor-pointer transition-all font-medium text-sm ${formik.values.stakeholder === "Landlord" ? "bg-white text-primary shadow-sm border border-gray-100" : "text-gray-500 hover:text-gray-700"}`}>
                                <input
                                    type="radio"
                                    name="stakeholder"
                                    value="Landlord"
                                    className="hidden"
                                    onChange={formik.handleChange}
                                />
                                Landlord
                            </label>
                        </div>
                        {formik.touched.stakeholder && formik.errors.stakeholder && (
                            <p className="text-xs text-red-500 text-center">{formik.errors.stakeholder}</p>
                        )}


                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                {...formik.getFieldProps('email')}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all"
                            />
                            {formik.touched.email && formik.errors.email && <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-semibold text-gray-700">Password</label>
                                <Link to="/request-password" className="text-xs text-primary hover:text-secondary font-medium">Forgot password?</Link>
                            </div>
                            <input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                {...formik.getFieldProps('password')}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all"
                            />
                            {formik.touched.password && formik.errors.password && <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-70 mt-2"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-8">
                        Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Create free account</Link>
                    </p>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default Login;