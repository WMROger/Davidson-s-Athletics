import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../Database/firebase";
import { useFacebookSDK } from "../Database/useFacebookSDK";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

export default function Login() {
  useFacebookSDK(); // Load Facebook SDK

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const db = getFirestore();

  // Handles user login (email/password, Google, Facebook)
  const handleLogin = async (authMethod) => {
    try {
      let userCredential;
      if (authMethod === "email") {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else if (authMethod === "google") {
        userCredential = await signInWithPopup(auth, googleProvider);
      } else if (authMethod === "facebook") {
        userCredential = await signInWithPopup(auth, facebookProvider);
      }

      const user = userCredential.user;
      console.log(`${authMethod} login successful:`, user);

      // Check if user exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        // Save user to Firestore
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName || "Unnamed User",
          photoURL: user.photoURL || "default.jpg",
          lastLogin: new Date(),
          role: "user",
        });
        console.log("User data saved to Firestore");
      }

      navigateBasedOnRole(user.uid);
    } catch (error) {
      console.error(`${authMethod} login error:`, error.message);
      alert("Login failed. Please check your credentials or try another method.");
    }
  };

  // Navigate based on user role
  const navigateBasedOnRole = async (userId) => {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      navigate(docSnap.data().role === "admin" ? "/admin/dashboard" : "/home");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[url('/background.svg')] bg-cover bg-center">
      <div className="bg-neutral-800 p-20 border-1 border-white rounded-2xl shadow-lg w-[450px] mt-22 pb-16">
        <img src="/Logo.svg" alt="Logo" className="w-24 h-24 mx-auto" />
        <h2 className="text-2xl font-bold text-center mb-6 mt-6 text-neutral-300">
          Sign In
        </h2>
        <form onSubmit={(e) => { e.preventDefault(); handleLogin("email"); }} className="space-y-4">
          <div>
            <label className="block text-neutral-400 text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="user@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 text-white rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label className="block text-neutral-400 text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 text-white rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <button type="submit" className="w-full bg-stone-300 text-black p-2 rounded-lg hover:bg-blue-700 transition">
            Login
          </button>

          <div className="py-3 flex items-center text-xs text-gray-400 before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
            or sign in with
          </div>

          {/* Social Sign-in Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <div className="flex gap-4">
              <div
                className="bg-blue-600 cursor-pointer rounded-xl w-35 p-3 flex items-center justify-center h-12"
                onClick={() => handleLogin("facebook")}
              >
                <img src="/fb.svg" alt="Facebook" className="w-8 h-8" />
              </div>
              <div
                className="bg-white cursor-pointer rounded-xl w-35 p-3 flex items-center justify-center h-12"
                onClick={() => handleLogin("google")}
              >
                <img src="/google.svg" alt="Google" className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <Link to="/register" className="text-sm text-red-400 underline items-center">
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
