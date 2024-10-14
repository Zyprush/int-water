// src/components/Login.tsx
"use client";
import React, { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Check for user in 'users' collection first
      const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
      const userQuerySnapshot = await getDocs(userQuery);
      const userDocSnap = userQuerySnapshot.docs[0];
  
      if (userDocSnap?.exists()) {
        const userData = userDocSnap.data();
        console.log('role', userData.role);
  
        // Check user role and route accordingly
        if (userData.role === "admin") {
          router.push("/admin/dashboard");
        } else if (userData.role === "Technical Staff") {
          router.push("/maintenance/technical");
        } else if (userData.role === "Office Staff") {
          if (userData.scanner === true) {
            router.push("/scanner/dashboard");
          } else {
            router.push("/staff/dashboard");
          }
        } else if (userData.role === "Meter Reader") {
          router.push("/scanner/dashboard");
        }
        else {
          router.push("/admin/dashboard");
        }
      } else {
        // If user not found in 'users', check 'consumers' collection
        const consumerQuery = query(collection(db, 'consumers'), where('uid', '==', user.uid));
        const consumerQuerySnapshot = await getDocs(consumerQuery);
      
        if (!consumerQuerySnapshot.empty) {
          const consumerDocSnap = consumerQuerySnapshot.docs[0];
          console.log("Consumer document found:", consumerDocSnap.data());
      
          // If user found in 'consumers', route to consumer dashboard
          router.push("/consumer/dashboard");
        } else {
          // If user is not found in either 'users' or 'consumers'
          console.log("User not found in 'users' or 'consumers' collections");
          router.push("/");
        }
      }
      
    } catch (error) {
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === "auth/wrong-password") {
        alert("Incorrect password. Please try again.");
      } else if (firebaseError.code === "auth/user-not-found") {
        alert("No user found with this email.");
      } else {
        alert("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-8 w-full max-w-md mx-auto mt-12 ">
      <h1 className="text-2xl font-bold text-white text-center mb-4 drop-shadow-md">Welcome Back!</h1>
      <p className="text-center text-zinc-200 mb-8 text-sm">Please sign in to access your account.</p>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-zinc-300 mb-2 text-sm">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="dark-input w-full p-2 rounded-lg bg-zinc-800 text-white focus:ring-2 focus:ring-teal-500"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-zinc-300 mb-2 text-sm">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="dark-input w-full p-2 rounded-lg bg-zinc-800 text-white focus:ring-2 focus:ring-teal-500"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-2 text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center mb-6">
          <Link href="#" className="text-sm text-zinc-400 hover:underline">
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          className={`w-full bg-teal-500 text-white py-2 rounded-lg font-semibold shadow-md transition duration-300 ease-in-out transform hover:bg-teal-600 hover:scale-105 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
