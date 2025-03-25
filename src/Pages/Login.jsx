import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../Database/firebase";
import { useFacebookSDK } from "../Database/useFacebookSDK";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

export default function Login() {
  useFacebookSDK(); // Load Facebook SDK

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
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

      // Check if email is verified
      if (!user.emailVerified) {
        alert("Please verify your email before logging in.");
        return;
      }

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
  
  // Handle password reset request
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!email) {
      alert("Please enter your email address");
      return;
    }
    
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      console.log("Password reset email sent");
    } catch (error) {
      console.error("Error sending password reset email:", error.message);
      alert("Failed to send password reset email: " + error.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[url('/background.svg')] bg-cover bg-center">
      <div className="bg-[#222A2D] p-8 border border-[#676767] rounded-2xl shadow-xl w-full max-w-md mx-4 mt-30">
        <img src="/Logo.svg" alt="Logo" className="w-28 h-28 mx-auto" />
        <h2 className="text-3xl font-bold text-center mb-8 mt-4 text-white">
          {isResetMode ? "Reset Password" : "Sign In"}
        </h2>
        
        {isResetMode ? (
          <div className="space-y-6">
            {resetEmailSent ? (
              <div className="bg-green-500/20 p-4 rounded-lg border border-green-500 mb-6">
                <p className="text-green-400 text-lg">Password reset link sent to your email address.</p>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label className="block text-neutral-300 text-lg font-medium mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="user@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full p-3 border border-neutral-600 bg-neutral-700 text-white rounded-lg text-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <p className="text-neutral-400 text-base">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                <button 
                  type="submit" 
                  className="w-full bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg text-lg font-bold transition-colors"
                >
                  Send Reset Link
                </button>
              </form>
            )}
            
            <div className="text-center mt-6">
              <button 
                onClick={() => {
                  setIsResetMode(false);
                  setResetEmailSent(false);
                }}
                className="text-red-400 hover:text-red-300 text-lg font-medium underline transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleLogin("email"); }} className="space-y-6">
            <div>
              <label className="block text-neutral-300 text-lg font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="user@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full p-3 border border-neutral-600 bg-neutral-700 text-white rounded-lg text-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-neutral-300 text-lg font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full p-3 border border-neutral-600 bg-neutral-700 text-white rounded-lg text-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                required
              />
              <div className="flex justify-start underline mt-2">
                <button
                  type="button"
                  onClick={() => setIsResetMode(true)}
                  className="text-red-400 hover:text-red-300 text-base transition-colors underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg text-lg font-bold transition-colors"
            >
              Sign In
            </button>

            <div className="py-4 flex items-center text-neutral-400 text-base before:flex-1 before:border-t before:border-neutral-600 before:me-6 after:flex-1 after:border-t after:border-neutral-600 after:ms-6">
              or sign in with
            </div>

            {/* Social Sign-in Buttons */}
            <div className="flex items-center justify-center space-x-6">
              <div
                className="bg-blue-600 cursor-pointer rounded-xl p-3 flex items-center justify-center h-14 w-14 hover:bg-blue-700 transition-colors"
                onClick={() => handleLogin("facebook")}
              >
                <img src="/fb.svg" alt="Facebook" className="w-10 h-10" />
              </div>
              <div
                className="bg-white cursor-pointer rounded-xl p-3 flex items-center justify-center h-14 w-14 hover:bg-gray-200 transition-colors"
                onClick={() => handleLogin("google")}
              >
                <img src="/google.svg" alt="Google" className="w-8 h-8" />
              </div>
            </div>

            <div className="flex items-center justify-center mt-6">
              <Link to="/register" className="text-lg text-red-400 hover:text-red-300 font-medium underline transition-colors">
                Create Account
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}