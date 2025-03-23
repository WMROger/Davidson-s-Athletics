import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./Database/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searching, setSearching] = useState(false);
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

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".search-container")) {
        setShowSearchResults(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global search function that searches across multiple collections with direct navigation
  const handleSearch = async (e) => {
    e?.preventDefault();
    
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearching(true);
    setShowSearchResults(true);

    try {
      // Search in shirts collection
      const shirtsQuery = query(
        collection(db, "shirts"),
        where("status", "==", "Uploaded")
      );
      const shirtsSnapshot = await getDocs(shirtsQuery);
      const shirtsResults = shirtsSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: 'shirt',
          route: `/ShopPages/CustomizeShirt/${doc.id}`,
          // Include necessary data for CustomizeShirt page
          selectedImage: doc.data().image,
          selectedColor: doc.data().color,
          selectedName: doc.data().name,
          selectedPrice: doc.data().price,
          selectedSizes: doc.data().sizes,
          availableStock: doc.data().stock
        }))
        .filter(item => 
          item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.color?.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Combine results
      setSearchResults(shirtsResults);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setSearching(false);
    }
  };

  // Handle search input changes with enhanced direct navigation
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    
    // Auto-search after 500ms of typing
    if (e.target.value.length > 2) {
      // Clear any existing timers
      if (window.searchTimer) {
        clearTimeout(window.searchTimer);
      }
      
      // Set a new timer for delayed search
      window.searchTimer = setTimeout(() => {
        handleSearch();
      }, 500);
    } else if (e.target.value.length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };
  
  // Handle Enter key press in search box (no auto-navigation)
  const handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(e);
    }
  };

  // Handle search result click - now with direct navigation
  const handleResultClick = (result) => {
    // Close the search UI
    setShowSearchResults(false);
    setSearchQuery("");
    
    // Navigate to the specific route with state
    navigate(result.route, {
      state: {
        selectedImage: result.selectedImage,
        selectedColor: result.selectedColor,
        selectedName: result.selectedName,
        selectedPrice: result.selectedPrice,
        selectedSizes: result.selectedSizes,
        availableStock: result.availableStock
      }
    });
  };

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
        
          <li>
            <Link to="/services" className="hover:text-red-500 transition">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/ShopPages/CustomProduct" className="hover:text-red-500 transition">
              Custom Product
            </Link>
          </li>
        </ul>

        {/* Search & User Authentication */}
        <div className="flex items-center space-x-4 relative">
          {/* Search Bar with Dropdown Results */}
          <div className="relative hidden md:block search-container">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                  onKeyDown={handleEnterKeyPress}
                  placeholder="Search products..."
                  className={`pl-5 pr-12 p-2 border rounded-full focus:outline-none w-64 ${
                    scrolling || isBlackBg
                      ? "border-gray-600 text-black bg-white/80"
                      : "border-gray-300 text-white bg-black/30"
                  }`}
                />
                <button 
                  type="submit" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute right-0.100 mt-2 w-96 max-h-96 overflow-y-auto bg-white shadow-lg rounded-lg py-3 z-50">
                {searching ? (
                  <div className="px-6 py-4 text-gray-500 text-center text-lg">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <>
                    {searchResults.map((result) => (
                      <div 
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="flex items-center px-6 py-3 hover:bg-gray-100 cursor-pointer"
                      >
                        {result.image && (
                          <img 
                            src={result.image} 
                            alt={result.name} 
                            className="h-16 w-16 object-cover rounded mr-4"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate text-lg">{result.name}</p>
                          <p className="text-base text-gray-500 truncate">
                            ₱{result.price} • {result.type === 'shirt' ? 'Shirt' : 'Custom Product'}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="border-t mt-3 pt-3 px-6">
                      <button 
                        onClick={() => {
                          navigate(`/Shop?q=${encodeURIComponent(searchQuery)}`);
                          setShowSearchResults(false);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-base font-medium"
                      >
                        View all results
                      </button>
                    </div>
                  </>
                ) : (
                  searchQuery.trim() && (
                    <div className="px-6 py-4 text-gray-500 text-center text-lg">
                      No products found matching "{searchQuery}"
                    </div>
                  )
                )}
              </div>
            )}
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
                      to="/Profile/ProfilePage"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Profile
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
            {/* Mobile Search Bar */}
            <li className="w-full pb-4 border-b border-gray-500">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onKeyDown={handleEnterKeyPress}
                  placeholder="Search products..."
                  className="w-full pl-4 pr-10 py-2 rounded-full bg-white/80 text-black"
                />
                <button 
                  type="submit" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  <Search size={20} />
                </button>
              </form>
              {/* Mobile Search Results */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="mt-2 bg-white rounded-lg shadow-lg overflow-hidden">
                  {searchResults.slice(0, 3).map((result) => (
                    <div 
                      key={`mobile-${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className="flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b"
                    >
                      {result.image && (
                        <img 
                          src={result.image} 
                          alt={result.name} 
                          className="h-10 w-10 object-cover rounded mr-3"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{result.name}</p>
                        <p className="text-sm text-gray-500">₱{result.price}</p>
                      </div>
                    </div>
                  ))}
                  {searchResults.length > 3 && (
                    <div className="p-2 text-center">
                      <button 
                        onClick={() => {
                          navigate(`/shop?q=${encodeURIComponent(searchQuery)}`);
                          setShowSearchResults(false);
                          setMenuOpen(false);
                        }}
                        className="text-blue-600 text-sm font-medium"
                      >
                        View all {searchResults.length} results
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
            
            <li>
              <Link to="/" className="hover:text-red-500 transition" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-red-500 transition" onClick={() => setMenuOpen(false)}>
                Shop
              </Link>
            </li>
            {user && (
              <li>
                <Link to="/cart" className="hover:text-red-500 transition" onClick={() => setMenuOpen(false)}>
                  Cart
                </Link>
              </li>
            )}
            <li>
              <Link to="/services" className="hover:text-red-500 transition" onClick={() => setMenuOpen(false)}>
                About Us
              </Link>
            </li>
            <li>
              <Link to="/ShopPages/CustomProduct" className="hover:text-red-500 transition" onClick={() => setMenuOpen(false)}>
                Custom Product
              </Link>
            </li>
            <li className="border-t w-full pt-4 flex flex-col items-center space-y-2">
              {user ? (
                <>
                  <Link to="/Profile/ProfilePage" onClick={() => setMenuOpen(false)}>
                    <img
                      src={user.photoURL || "/default-profile.png"}
                      alt="Profile"
                      className="h-10 w-10 rounded-full border-2 border-gray-400"
                    />
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMenuOpen(false);
                    }}
                    className="text-red-400 underline"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-red-500 transition" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="hover:text-red-500 transition"
                    onClick={() => setMenuOpen(false)}
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