"use client";
import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase";
import Link from "next/link";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Failed to send reset email");
      } else {
        setError("Failed to send reset email");
      }
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
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-white text-sm">{message}</p>}
            <div className="flex justify-between gap-5">
              <Link
                className="btn btn-primary"
                href={"/"}
              >
                Back
              </Link>
              <button
                type="submit"
                className="w-full py-3 font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
