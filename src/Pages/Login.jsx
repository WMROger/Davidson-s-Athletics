import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../Database/firebase"; // Import providers
import { useFacebookSDK } from "../Database/useFacebookSDK"; // Adjust the path to where the hook is located
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

export default function Login() {
  useFacebookSDK(); // Load the Facebook SDK on component mount

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const db = getFirestore();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Logged in:", userCredential.user);
        // Add user data to Firestore
        const user = userCredential.user;
        setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: user.displayName || "Unnamed User",
          photoURL: user.photoURL || "default.jpg",
          lastLogin: new Date(),
          role: "user",
        })
          .then(() => {
            console.log("User data saved to Firestore");
            navigate("/admin");
          })
          .catch((error) => {
            console.error("Error saving user data:", error.message);
          });
      })
      .catch((error) => {
        console.error("Login error:", error.message);
        alert("Invalid credentials or account does not exist");
      });
  };

  // Google Login
  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        console.log("Google Login Success:", result.user);
        const user = result.user;
        // Add user data to Firestore
        setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: user.displayName || "Unnamed User",
          photoURL: user.photoURL || "default.jpg",
          lastLogin: new Date(),
          role: "user",
        })
          .then(() => {
            console.log("User data saved to Firestore");
            navigate("/admin");
          })
          .catch((error) => {
            console.error("Error saving user data:", error.message);
          });
      })
      .catch((error) => {
        console.error("Google Login Error:", error.message);
      });
  };

  // Facebook Login
  const handleFacebookLogin = () => {
    signInWithPopup(auth, facebookProvider)
      .then((result) => {
        console.log("Facebook Login Success:", result.user);
        const user = result.user;
        // Add user data to Firestore
        setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: user.displayName || "Unnamed User",
          photoURL: user.photoURL || "default.jpg",
          lastLogin: new Date(),
          role: "user",
        })
          .then(() => {
            console.log("User data saved to Firestore");
            navigate("/admin");
          })
          .catch((error) => {
            console.error("Error saving user data:", error.message);
          });
      })
      .catch((error) => {
        console.error("Facebook Login Error:", error.message);
      });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[url('/background.svg')] bg-cover bg-center">
      <div className="bg-neutral-800 p-20 border-1 border-white rounded-2xl shadow-lg w-[450px] mt-22 pb-16">
        <img src="/Logo.svg" alt="Logo" className="w-24 h-24 mx-auto" />
        <h2 className="text-2xl font-bold text-center mb-6 mt-6 text-neutral-300">
          Sign In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-neutral-400 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 text-white rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label className="block text-neutral-400 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 text-white rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-stone-300 text-black p-2 rounded-lg hover:bg-blue-700 transition"
          >
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
                onClick={handleFacebookLogin}
              >
                <img src="/fb.svg" alt="Facebook" className="w-8 h-8" />
              </div>
              <div
                className="bg-white cursor-pointer rounded-xl w-35 p-3 flex items-center justify-center h-12"
                onClick={handleGoogleLogin}
              >
                <img src="/google.svg" alt="Google" className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <Link
              to="/register"
              className="text-sm text-red-400 underline items-center"
            >
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
