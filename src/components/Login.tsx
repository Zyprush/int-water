"use client";
import React from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";
const Login = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex flex-col">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-bold dark:text-white mx-auto text-center">
              Login now!
            </h1>
            <p className="mb-4 dark:text-zinc-400 text-xs max-w-80 text-center">
              Please sign in to access your account.
            </p>
          </div>
          <div className="card bg-base-100 dark:bg-slate-800 w-[20rem] shrink-0 shadow-2xl">
            <form className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text dark:text-zinc-300">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  className="bg-gray-700 bg-opacity-50 text-gray-200 border-0 rounded-md p-2 w-full focus:bg-gray-600 focus:bg-opacity-70 focus:outline-none focus:ring-1 focus:ring-secondary transition ease-in-out duration-150 text-sm"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text dark:text-zinc-300">
                    Password
                  </span>
                </label>
                <div className="relative mb-4">
                  <input
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    placeholder="Password"
                    className="bg-gray-700 bg-opacity-50 text-gray-200 border-0 rounded-md p-2 w-full focus:bg-gray-600 focus:bg-opacity-70 focus:outline-none focus:ring-1 focus:ring-secondary transition ease-in-out duration-150 text-sm"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <label className="label">
                  <Link
                    href="#"
                    className="label-text-alt link link-hover dark:text-zinc-400 dark:hover:text-secondary"
                  >
                    Forgot password?
                  </Link>
                </label>
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default Login;
