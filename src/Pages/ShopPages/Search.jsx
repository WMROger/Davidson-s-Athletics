import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Search, Filter, X, ArrowLeft } from "lucide-react";
import { db } from "../../Database/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    priceRange: { min: 0, max: 10000 },
    sizes: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  
  // Search function
  const performSearch = async () => {
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
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
          route: `/ShopPages/CustomizeShirt/${doc.id}`
        }))
        .filter(item => 
          item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.color?.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Search in custom products collection (if exists)
      const customQuery = query(collection(db, "customProducts"));
      const customSnapshot = await getDocs(customQuery);
      const customResults = customSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: 'custom',
          route: `/ShopPages/CustomProduct/${doc.id}`
        }))
        .filter(item => 
          item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Combine results
      let combinedResults = [...shirtsResults, ...customResults];
      
      // Apply filters
      combinedResults = applyFilters(combinedResults);
      
      // Apply sorting
      combinedResults = sortResults(combinedResults);
      
      setResults(combinedResults);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Filter results based on activeFilters
  const applyFilters = (items) => {
    return items.filter(item => {
      // Price filter
      const price = item.price || 0;
      if (price < activeFilters.priceRange.min || price > activeFilters.priceRange.max) {
        return false;
      }
      
      // Size filter
      if (activeFilters.sizes.length > 0) {
        if (!item.sizes || !item.sizes.some(size => activeFilters.sizes.includes(size))) {
          return false;
        }
      }
      
      // Category filter (if applicable)
      if (activeFilters.categories.length > 0) {
        if (!item.category || !activeFilters.categories.includes(item.category)) {
          return false;
        }
      }
      
      return true;
    });
  };
  
  // Sort results based on sortBy
  const sortResults = (items) => {
    switch (sortBy) {
      case "price-asc":
        return [...items].sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-desc":
        return [...items].sort((a, b) => (b.price || 0) - (a.price || 0));
      case "newest":
        return [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
      case "relevance":
      default:
        // For relevance, prioritize items where the search term is in the name
        return [...items].sort((a, b) => {
          const aNameMatch = a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0;
          const bNameMatch = b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0;
          return bNameMatch - aNameMatch;
        });
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      
      if (filterType === "priceRange") {
        newFilters.priceRange = value;
      } else if (filterType === "size") {
        if (newFilters.sizes.includes(value)) {
          newFilters.sizes = newFilters.sizes.filter(size => size !== value);
        } else {
          newFilters.sizes.push(value);
        }
      } else if (filterType === "category") {
        if (newFilters.categories.includes(value)) {
          newFilters.categories = newFilters.categories.filter(cat => cat !== value);
        } else {
          newFilters.categories.push(value);
        }
      }
      
      return newFilters;
    });
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  // Run search when query or filters change
  useEffect(() => {
    performSearch();
  }, [searchQuery, activeFilters, sortBy]);
  
  return (
    <div className="min-h-screen pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Back button and search title */}
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold">
          {searchQuery ? `Search results for "${searchQuery}"` : "Search Products"}
        </h1>
      </div>
      
      {/* Search bar for refining search */}
      <div className="mb-8">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const newQuery = formData.get("searchInput");
            navigate(`/ShopPages/search?q=${encodeURIComponent(newQuery)}`);
          }}
          className="flex items-center w-full max-w-2xl"
        >
          <div className="relative flex-grow">
            <input
              type="text"
              name="searchInput"
              defaultValue={searchQuery}
              placeholder="Refine your search..."
              className="w-full pl-4 pr-10 py-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => navigate("/ShopPages/search")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-r-lg hover:bg-gray-800"
          >
            <Search size={20} />
          </button>
        </form>
      </div>
      
      {/* Filters and sort controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50 mr-4"
          >
            <Filter size={18} className="mr-2" />
            Filters
          </button>
          
          {activeFilters.sizes.length > 0 && (
            <div className="flex items-center text-sm">
              <span className="mr-2">Sizes:</span>
              {activeFilters.sizes.map(size => (
                <span key={size} className="bg-gray-200 px-2 py-1 rounded mr-1">
                  {size}
                  <button 
                    onClick={() => handleFilterChange("size", size)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center">
          <span className="mr-2 text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="relevance">Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>
      
      {/* Filter sidebar (mobile-friendly) */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white h-full w-full max-w-md overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button 
                onClick={() => setShowFilters(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Price Range</h3>
              <div className="flex items-center">
                <input
                  type="number"
                  value={activeFilters.priceRange.min}
                  onChange={(e) => handleFilterChange("priceRange", {
                    ...activeFilters.priceRange,
                    min: parseInt(e.target.value) || 0
                  })}
                  className="border rounded w-24 px-2 py-1"
                  min="0"
                />
                <span className="mx-2">to</span>
                <input
                  type="number"
                  value={activeFilters.priceRange.max}
                  onChange={(e) => handleFilterChange("priceRange", {
                    ...activeFilters.priceRange,
                    max: parseInt(e.target.value) || 0
                  })}
                  className="border rounded w-24 px-2 py-1"
                  min="0"
                />
              </div>
            </div>
            
            {/* Size Filters */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Sizes</h3>
              <div className="flex flex-wrap gap-2">
                {["S", "M", "L", "XL"].map(size => (
                  <button
                    key={size}
                    onClick={() => handleFilterChange("size", size)}
                    className={`px-3 py-1 rounded-full border ${
                      activeFilters.sizes.includes(size)
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-300 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Apply Filters Button */}
            <button
              onClick={() => setShowFilters(false)}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      
      {/* Results count */}
      <div className="mb-4">
        <p className="text-gray-600">
          {loading ? "Searching..." : `${results.length} ${results.length === 1 ? "result" : "results"} found`}
        </p>
      </div>
      
      {/* Results grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((result) => (
            <Link
              key={`${result.type}-${result.id}`}
              to={result.route}
              className="group"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  {result.image ? (
                    <img
                      src={result.image}
                      alt={result.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-1 truncate">{result.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">
                    {result.type === 'shirt' ? 'T-Shirt' : 'Custom Product'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">₱{result.price}</span>
                    {result.sizes && (
                      <div className="text-sm text-gray-500">
                        {result.sizes.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-gray-400 mb-4">
            <Search size={48} />
          </div>
          <h2 className="text-xl font-medium mb-2">No products found</h2>
          <p className="text-gray-500 mb-6 max-w-md">
            We couldn't find any products matching "{searchQuery}". Try using different keywords or browse our categories.
          </p>
          <Link 
            to="/shop" 
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Browse All Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default SearchResults;