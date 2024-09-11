"use client";
import React, { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "../../firebase"; // Import db for Firestore
import { collection, getDocs, query, where } from "firebase/firestore"; // For querying Firestore
import { FirebaseError } from "firebase/app"; // Import FirebaseError

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const q = query(collection(db, 'consumers'), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const docSnap = querySnapshot.docs[0];

      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log('role', userData.role);
        // Check role and redirect accordingly
        if (userData.role === "consumer") {
          router.push("/consumer/dashboard");
        } else if (userData.role === "staff") {
          router.push("/staff/dashboard");
        } else {
          router.push("/admin/dashboard");
        }
      } else {
        // No document found, redirect to admin
        router.push("/admin/dashboard");
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
      setLoading(false); // Stop loading
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
        <div className="card bg-slate-800 w-[22rem] shrink-0 shadow-2xl">
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
                  className="dark-input"
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
              <button
                className={`btn btn-primary text-white`}
                type="submit"
                disabled={loading} // Disable button while loading
              >
                {loading ? "Logging in..." : "Login"} {/* Show loading text */}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
