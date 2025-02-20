import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../Database/firebase"; // Firebase setup
import { createUserWithEmailAndPassword } from "firebase/auth";
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

      // Store user in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        username,
        email,
        role: "user", // Default role
        createdAt: new Date(),
      });

      alert("Registration successful!");
      navigate("/login"); // Redirect to login
    } catch (error) {
      console.error("Error registering:", error.message);
      alert("Registration failed: " + error.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[url('/background.svg')] bg-cover bg-center">
      <div className="bg-neutral-800 p-15 border-1 border-white rounded-2xl shadow-lg w-[450px] mt-22 pb-16">
        <h2 className="text-2xl font-bold text-center mb-6 text-neutral-300">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-neutral-400 text-sm font-medium">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 text-white rounded-lg"
              required
            />
          </div>

          <div className="flex gap-4">
            <div>
              <label className="text-neutral-400 text-sm font-medium">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border border-white text-white rounded-lg"
                required
              />
            </div>
            <div>
              <label className="text-neutral-400 text-sm font-medium">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border border-gray-300 text-white rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 text-sm font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 text-white rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-400 text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 text-white rounded-lg"
              required
            />
          </div>

          <button type="submit" className="w-full bg-stone-300 text-black p-2 rounded-lg">
            Register
          </button>

          <p className="text-neutral-200 text-sm text-center mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-red-500 underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
