import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../Database/firebase"; // Firebase setup
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      // Store user in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        username,
        email,
        role: "user", // Default role
        createdAt: new Date(),
      });

      alert("Registration successful! Please check your email to verify your account.");
      navigate("/login"); // Redirect to login
    } catch (error) {
      console.error("Error registering:", error.message);
      alert("Registration failed: " + error.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[url('/background.svg')] bg-cover bg-center">
      <div className="bg-[#222A2D] p-8 border border-[#676767] rounded-2xl shadow-xl w-full max-w-md mx-4 mt-30">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-neutral-300 text-lg font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              placeholder="name@email.com"
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full p-3 border border-neutral-600 bg-neutral-700 text-white rounded-lg text-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full">
              <label className="block text-neutral-300 text-lg font-medium mb-2">First Name</label>
              <input
                type="text"
                placeholder="Juan"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="block w-full p-3 border border-neutral-600 bg-neutral-700 text-white rounded-lg text-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div className="w-full">
              <label className="block text-neutral-300 text-lg font-medium mb-2">Last Name</label>
              <input
                type="text"
                placeholder="Dela Cruz"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="block w-full p-3 border border-neutral-600 bg-neutral-700 text-white rounded-lg text-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 text-lg font-medium mb-2">Username</label>
            <input
              type="text"
              placeholder="juandelacruz"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full p-3 border border-neutral-600 bg-neutral-700 text-white rounded-lg text-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-300 text-lg font-medium mb-2">Password</label>
            <input
              type="password"
              placeholder="at least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full p-3 border border-neutral-600 bg-neutral-700 text-white rounded-lg text-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg text-lg font-bold mt-4 transition-colors"
          >
            Create Account
          </button>

          <p className="text-neutral-300 text-lg text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-red-400 hover:text-red-300 font-medium underline transition-colors">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}