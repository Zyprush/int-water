"use client";

import React, { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth"; // Import the required auth method
import { useRouter } from "next/navigation"; // For navigation after login
import { auth } from "../../firebase";
import { FirebaseError } from "firebase/app"; // Import FirebaseError

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // Redirect to the dashboard or desired page after login
    } catch (error) {
      const firebaseError = error as FirebaseError; // Cast error to FirebaseError
      if (firebaseError.code === "auth/wrong-password") {
        alert("Incorrect password. Please try again.");
      } else if (firebaseError.code === "auth/user-not-found") {
        alert("No user found with this email.");
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="hero bg-base-200">
      <div className="hero-content flex flex-col">
        <div className="text-center lg:text-left">
          <h1 className="text-xl drop-shadow font-bold text-primary mx-auto text-center">
            Login now!
          </h1>
          <p className="mb-4 text-zinc-500 text-xs max-w-80 text-center">
            Please sign in to access your account.
          </p>
        </div>
        <div className="card bg-slate-800 w-[20rem] shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={handleLogin}>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-zinc-300">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="dark-input"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-zinc-300">Password</span>
              </label>
              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Password"
                  className="bg-gray-700 bg-opacity-50 text-gray-200 border-0 rounded-md p-2 w-full focus:bg-gray-600 focus:bg-opacity-70 focus:outline-none focus:ring-1 focus:ring-secondary transition ease-in-out duration-150 text-xs"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <label>
                <Link
                  href="#"
                  className="text-xs underline text-zinc-400 hover:text-gray-500"
                >
                  Forgot password?
                </Link>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
