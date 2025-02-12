import { useState } from "react";
import { Link } from "react-router-dom";
export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with", { email, password });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[url('/background.svg')] bg-cover bg-center">
      <div className="bg-neutral-800 p-15 border-1 border-white rounded-2xl shadow-lg w-[450px] mt-22 pb-16">
        <div className="flex justify-center mb-6">
          <img
            src="/Logo.svg"
            alt="Logo"
            className="w-24 h-24 object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-neutral-300">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-neutral-400 text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 text-white rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <label className="text-neutral-400 text-sm font-medium whitespace-nowrap">
            First Name
          </label>
          <label className="text-neutral-400 text-sm ml-28 font-medium whitespace-nowrap">
            Last Name
          </label>
          <div className="flex flex-row items-center gap-4">
            {/* First Name Field */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="w-39 inline-block p-2 border border-white text-white rounded-lg focus:ring focus:ring-blue-300"
                required
              />
            </div>
            {/* Last Name Field */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="w-39 inline-block p-2 border border-gray-300 text-white rounded-lg focus:ring focus:ring-blue-300"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 text-sm font-medium">
              Username
            </label>
            <input
              type="text"
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
            Continue
          </button>
          <p className="block text-neutral-200 ml-12 text-sm font-medium">
            Already Have An Account?
            <Link
              to="/login"
              className="m-2 text-red-500 underline cursor-pointer"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
