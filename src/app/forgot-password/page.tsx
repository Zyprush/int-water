"use client";
import React, { useState } from "react";
import { sendPasswordResetEmail, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "../../../firebase";
import Link from "next/link";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import ToastProvider from "@/components/ToastProvider";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      // Check if email is registered
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      
      if (signInMethods.length === 0) {
        toast.error("No account found with this email address.");
        setLoading(false);
        return;
      }

      // Send password reset email
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox.");
      setEmail(""); // Clear email input after successful send
    } catch (error) {
      const firebaseError = error as FirebaseError;
      
      switch (firebaseError.code) {
        case "auth/invalid-email":
          toast.error("Invalid email address format.");
          break;
        case "auth/user-not-found":
          toast.error("No user found with this email address.");
          break;
        case "auth/too-many-requests":
          toast.error("Too many reset attempts. Please try again later.");
          break;
        case "auth/network-request-failed":
          toast.error("Network error. Please check your connection.");
          break;
        default:
          toast.error("Failed to send password reset email. Please try again.");
          console.error("Password reset error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="relative flex h-screen w-full items-center justify-center bg-gradient-to-r from-blue-900 to-teal-500 p-1">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/img/bg-water.jpg')" }}
        ></div>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-8 w-full max-w-md mx-auto mt-12">
          <h2 className="text-2xl font-bold text-center text-white mb-5">
            Forgot Password
          </h2>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="p-2">
              <label className="block text-gray-200 mb-2 text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="dark-input w-full p-2 rounded-lg bg-zinc-800 text-white focus:ring-2 focus:ring-teal-500"
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="flex justify-between gap-5">
              <Link
                className="btn btn-primary"
                href={"/"}
              >
                Back
              </Link>
              <button
                type="submit"
                className={`w-full py-3 font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Sending..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastProvider />
    </div>
  );
};

export default ForgotPassword;