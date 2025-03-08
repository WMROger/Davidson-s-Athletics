import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./Database/firebase";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [isBlackBg, setIsBlackBg] = useState(false);
  const navigate = useNavigate();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Set scrolling state
      setScrolling(scrollPosition > 50);

      // Set background state for dark background
      if (scrollPosition > 200) {
        setIsBlackBg(true); // Change background to black
      } else {
        setIsBlackBg(false); // Keep background transparent or light
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Toggle profile dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Handle sign-out
  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate("/login");
    });
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full px-7 py-4 z-50 backdrop-filter backdrop-blur-3xl transition-colors duration-300 ${
        isBlackBg
          ? "bg-black/50 text-white" // When background is black, text should be white
          : "bg-white/10 text-black" // When background is not black, text should be black
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
          <img className="h-20 w-auto" src="/Logo.svg" alt="Logo" />
          <span className="text-3xl leading-none">
            <p>Davidson</p>
            <p className="text-orange-300">Athletics</p>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-24 text-xl">
          <li>
            <Link to="/" className="hover:text-red-500 transition">
              Home
            </Link>
          </li>
          <li>
            <Link to="/shop" className="hover:text-red-500 transition">
              Shop
            </Link>
          </li>
          {user && (
            <li>
              <Link
                to="/cart"
                className="hover:text-red-500 transition flex items-center"
              >
                Cart
              </Link>
            </li>
          )}
          <li>
            <Link to="/services" className="hover:text-red-500 transition">
              About Us
            </Link>
          </li>
        </ul>

        {/* Search & User Authentication */}
        <div className="flex items-center space-x-4 relative">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search
              className="absolute right-5 top-1/2 transform -translate-y-1/2"
              size={24}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className={`pl-5 pr-4 p-2 border rounded-full focus:outline-none w-64 ${
                scrolling || isBlackBg
                  ? "border-gray-600 text-black bg-white/80"
                  : "border-gray-300 text-white bg-black/30"
              }`}
            />
          </div>

          {/* Auth Links */}
          {user ? (
            <>
              {/* Cart Icon */}
              <Link to="/cart" className="hover:text-red-500 transition">
                <ShoppingCart size={24} />
              </Link>

              {/* Profile Picture with Dropdown */}
              <div className="relative">
                <button onClick={toggleDropdown} className="focus:outline-none">
                  <img
                    src={user.photoURL || "/default-profile.png"}
                    alt="Profile"
                    className="h-10 w-10 rounded-full border-2 border-gray-400 cursor-pointer"
                  />
                </button>

                {/* Profile Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-red-500 transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-red-500 transition">
                Register
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden focus:outline-none">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-neutral-600/80 shadow-md">
          <ul className="flex flex-col items-center space-y-4 p-4">
            <li>
              <Link to="/shop" className="hover:text-red-500 transition">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-red-500 transition">
                Orders
              </Link>
            </li>
            {user && (
              <li>
                <Link to="/cart" className="hover:text-red-500 transition">
                  Cart
                </Link>
              </li>
            )}
            <li>
              <Link to="/services" className="hover:text-red-500 transition">
                Services
              </Link>
            </li>
            <li className="border-t w-full pt-4 flex flex-col items-center space-y-2">
              {user ? (
                <>
                  <Link to="/profile">
                    <img
                      src={user.photoURL || "/default-profile.png"}
                      alt="Profile"
                      className="h-10 w-10 rounded-full border-2 border-gray-400"
                    />
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-red-400 underline"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-red-500 transition">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="hover:text-red-500 transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
