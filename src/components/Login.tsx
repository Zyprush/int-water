"use client";
import React, { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { useLogs } from "@/hooks/useLogs";
import { currentTime } from "@/helper/time";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addLog } = useLogs();

  // Enhanced email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email format before attempting login
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Consolidated user lookup across collections
      const collections = ['users', 'consumers'];
      let userFound = false;

      for (const collectionName of collections) {
        const userQuery = query(
          collection(db, collectionName), 
          where('uid', '==', user.uid)
        );
        const querySnapshot = await getDocs(userQuery);
        
        if (!querySnapshot.empty) {
          userFound = true;
          const docSnap = querySnapshot.docs[0];
          const userData = docSnap.data();

          // Routing logic
          const routingMap: { [key: string]: string } = {
            "admin": "/admin/dashboard",
            "Maintenance Staff": "/maintenance/technical",
            "Office Staff": userData.scanner ? "/scanner/dashboard" : "/staff/dashboard",
            "Meter Reader": "/scanner/dashboard",
            "Consumer": "/consumer/dashboard"
          };

          const route = routingMap[userData.role] || "/admin/dashboard";
          
          // Logging
          addLog({
            date: currentTime,
            name: `${userData.name || userData.applicantName || 'User'} logged into the system`,
          });

          router.push(route);
          toast.success("Login successful!");
          return;
        }
      }

      // If no user found in any collection
      if (!userFound) {
        toast.error("User account not found in the system.");
        router.push("/");
      }
      
    } catch (error) {
      const firebaseError = error as FirebaseError;
      
      const errorMap: { [key: string]: string } = {
        "auth/wrong-password": "Incorrect password. Please try again.",
        "auth/user-not-found": "No user found with this email address.",
        "auth/invalid-email": "Invalid email format. Please check your email.",
        "auth/too-many-requests": "Too many login attempts. Please try again later.",
      };

      const errorMessage = errorMap[firebaseError.code] || 
        "Login failed. Please check your credentials.";
      
      toast.error(errorMessage);
      console.error("Login error:", error);
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
          <Link href="/forgot-password" className="text-sm text-zinc-200 hover:text-blue-700 underline">
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