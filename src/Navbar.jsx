import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search } from "lucide-react"; // npm install lucide-react

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent text-white px-7 py-4 z-50 backdrop-filter backdrop-blur-3xl">
      <div className="container mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
          <img className="h-20 w-auto" src="/Logo.svg" alt="Logo" />
        <span className="text-3xl leading-none">  <p>Davidson</p> <p className="text-orange-300">Athletics</p> </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8 text-xl">
          <li><Link to="/" className="hover:text-red-500 transition">Home</Link></li>
          <li><Link to="/shop" className="hover:text-red-500 transition">Shop</Link></li>
          <li><Link to="/orders" className="hover:text-red-500 transition">Orders</Link></li>
          <li><Link to="/cart" className="hover:text-red-500 transition">Cart</Link></li>
          <li><Link to="/services" className="hover:text-red-500 transition">Services</Link></li>
        </ul>

        {/* Search & Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white" size={24} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="pl-5 pr-4 p-2 border border-gray-300 rounded-full text-white focus:outline-none w-64"
            />

          
          </div>
          <Link to="/login" className="hover:text-red-500 transition">Login</Link>
          <Link to="/register" className="hover:text-red-500 transition">Register</Link>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden focus:outline-none">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md">
          <ul className="flex flex-col items-center space-y-4 p-4">
            <li><Link to="/shop" className="hover:text-red-500 transition">Shop</Link></li>
            <li><Link to="/orders" className="hover:text-red-500 transition">Orders</Link></li>
            <li><Link to="/cart" className="hover:text-red-500 transition">Cart</Link></li>
            <li><Link to="/services" className="hover:text-red-500 transition">Services</Link></li>
            <li className="border-t w-full pt-4 flex flex-col items-center space-y-2">
              <Link to="/login" className="hover:text-red-500 transition">Login</Link>
              <Link to="/register" className="hover:text-red-500 transition">Register</Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
