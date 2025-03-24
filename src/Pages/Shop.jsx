import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Database/firebase"; // Ensure correct path
import { collection, getDocs } from "firebase/firestore";

const sizes = ["S", "M", "L", "XL"];
const productTypes = ["Hoodie", "Jersey", "Shirt", "Longsleeve", "Polo"];
const ITEMS_PER_PAGE = 11; // Show 11 products + upload box per page (3 rows of 4)

const Shop = () => {
  const navigate = useNavigate();
  const [showDesignOptions, setShowDesignOptions] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchShirts = async () => {
      try {
        const shirtsCollection = collection(db, "shirts");
        const snapshot = await getDocs(shirtsCollection);
        const shirtsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Assign a temporary product type based on the product name
          // This is just for demo purposes until you add productType to your database
          tempProductType: assignTempProductType(doc.data().name || "")
        }));
        setProducts(shirtsData);
      } catch (error) {
        console.error("Error fetching shirts:", error);
      }
    };

    fetchShirts();
  }, []);

  // Temporary function to assign product types based on product names
  // Replace this with actual data from your database when available
  const assignTempProductType = (name) => {
    name = name.toLowerCase();
    if (name.includes("hoodie")) return "Hoodie";
    if (name.includes("jersey")) return "Jersey";
    if (name.includes("polo")) return "Polo";
    if (name.includes("longsleeve") || name.includes("long sleeve")) return "Longsleeve";
    return "Shirt"; // Default
  };

  const handleImageClick = (product) => {
    navigate(`/ShopPages/CustomizeShirt`, {
      state: {
        selectedImage: product.image,
        selectedColor: product.color,
        selectedName: product.name,
        selectedPrice: product.price,
        selectedSizes: product.sizes,
        availableStock: product.stock,
      },
    });
  };

  const handleRequestDesign = () => {
    setShowDesignOptions(!showDesignOptions);
  };

  const handleDesignSelection = (designType) => {
    navigate(`/ShopPages/RequestForm`);
    setShowDesignOptions(false);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));

    setSelectedFile(imageUrls);

    navigate("/ShopPages/RequestForm", {
      state: { uploadedImages: files, imagePreviews: imageUrls },
    });
  };

  const triggerFileInput = () => {
    document.getElementById("fileUpload").click();
  };

  const handleSizeFilterChange = (size) => {
    setSelectedSizes((prevSelectedSizes) =>
      prevSelectedSizes.includes(size)
        ? prevSelectedSizes.filter((s) => s !== size)
        : [...prevSelectedSizes, size]
    );
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  const handleProductTypeFilterChange = (type) => {
    setSelectedProductTypes((prevSelectedTypes) =>
      prevSelectedTypes.includes(type)
        ? prevSelectedTypes.filter((t) => t !== type)
        : [...prevSelectedTypes, type]
    );
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter((product) => {
    // Size filter
    const sizeMatch = selectedSizes.length === 0 || 
      selectedSizes.some((size) => product.sizes?.includes(size));
    
    // Product type filter (using tempProductType until you add actual product types)
    const typeMatch = selectedProductTypes.length === 0 || 
      selectedProductTypes.includes(product.tempProductType);
    
    // Search filter
    const searchMatch = searchQuery === "" || 
      (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return sizeMatch && typeMatch && searchMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const indexOfLastProduct = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-full">
      <div className="w-full mt-30 h-20 bg-black"></div>
      <div className="container mx-auto p-4 flex bg-white">
        <aside className="w-1/4 mt-5 p-4 border-r">
          <h2 className="text-2xl font-bold">Shirts</h2>
          <input
            type="text"
            placeholder="Search within this category"
            className="w-full p-2 border rounded-lg mt-2"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          
          {/* Product Type Filter */}
          <div className="mt-6">
            <label className="block mb-3 font-medium text-lg">Product Type</label>
            <div className="flex flex-col gap-2">
              {productTypes.map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    checked={selectedProductTypes.includes(type)}
                    onChange={() => handleProductTypeFilterChange(type)}
                  />
                  <span className="text-base">{type}</span>
                </label>
              ))}
            </div>
          </div>
         
          {/* Size Filter */}
          <div className="mt-6">
            <label className="block mb-3 font-medium text-lg">Size</label>
            <div className="flex flex-col gap-2">
              {sizes.map((size) => (
                <label key={size} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    checked={selectedSizes.includes(size)}
                    onChange={() => handleSizeFilterChange(size)}
                  />
                  <span className="text-base">{size}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Section */}
        <div className="w-3/4 p-4">
          {/* Request Design Section */}
          <div className="flex items-center ">
            <button
              onClick={handleRequestDesign}
              className="bg-black text-white px-15 py-1 rounded-md duration-300 hover:scale-105 "
            >
              Request Design {showDesignOptions ? " < " : " > "}
            </button>

            {showDesignOptions && (
              <div className="flex px-10 space-x-13 transition-all duration-300 ease-in-out">
                {["Jerseys", "Uniforms", "T-shirts"].map((designType) => (
                  <button
                    key={designType}
                    onClick={() =>
                      handleDesignSelection(designType.toLowerCase())
                    }
                    className="border px-20 py-1 rounded-md hover:bg-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    {designType}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-6 mt-6">
            {/* First cell is the Upload a Design Section */}
            <div className="border p-4 shadow-lg rounded-lg bg-orange-100">
              <div
                className="border-dashed bg-white border-2 p-4 rounded-lg cursor-pointer h-48 flex items-center justify-center"
                onClick={triggerFileInput}
              >
                <p className="text-gray-500">Select or drop a file</p>
              </div>
              <input
                type="file"
                id="fileUpload"
                className="hidden"
                accept="image/jpeg, image/jpg, image/png"
                onChange={handleFileChange}
              />

              <button
                onClick={triggerFileInput}
                className="mt-4 bg-black text-white px-4 py-2 rounded-md cursor-pointer w-full"
              >
                Upload
              </button>

              {selectedFile && (
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {selectedFile.name}
                </p>
              )}

              <p className="text-xs text-gray-500 mt-2">
                Only one file per design (JPG or PNG)
              </p>
            </div>

            {/* The remaining 11 cells are for products */}
            {currentProducts.map((product) => (
              <div 
                key={product.id} 
                className="border p-4 shadow-lg rounded-lg transform transition-all duration-300 ease-in-out
                hover:scale-105 hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg cursor-pointer transition-transform duration-500 ease-in-out
                  hover:scale-110"
                  onClick={() => handleImageClick(product)}
                />
                <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                <div className="mt-1 text-base">
                  <p className="text-gray-700 leading-tight">PHP {product.price}.00</p>
                  <p className="text-green-500 leading-tight">In stock: {product.stock}</p>
                  <p className="text-gray-500 leading-tight">
                    Sizes: {product.sizes?.join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* No products found message */}
          {currentProducts.length === 0 && (
            <div className="text-center py-10">
              <p className="text-lg text-gray-600">No products found matching your filters.</p>
              <button 
                onClick={() => {
                  setSelectedSizes([]);
                  setSelectedProductTypes([]);
                  setSearchQuery("");
                }}
                className="mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > ITEMS_PER_PAGE && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex mx-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`mx-1 px-3 py-1 rounded ${
                        currentPage === number
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}

          {/* Results counter */}
          <div className="mt-4 text-gray-600 text-sm">
            Showing {filteredProducts.length > 0 ? indexOfFirstProduct + 1 : 0}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="w-full  pb-20 pt-10 px-10 bg-gray-800 mt-10">
        <div className="container mx-auto text-white">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-bold">Davidson Athletics</h3>
              <p className="text-sm mt-2">© 2025 Davidson Athletics. All rights reserved.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Contact Us</h3>
              <p className="text-sm mt-2">Email: </p>
              <p className="text-sm">Phone: </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { db } from "../Database/firebase"; // Ensure correct path
// import { collection, getDocs } from "firebase/firestore";

// const sizes = ["S", "M", "L", "XL"];
// const ITEMS_PER_PAGE = 11; // Show 11 products + upload box per page (3 rows of 4)

// const Shop = () => {
//   const navigate = useNavigate();
//   const [showDesignOptions, setShowDesignOptions] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [selectedSizes, setSelectedSizes] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     const fetchShirts = async () => {
//       try {
//         const shirtsCollection = collection(db, "shirts");
//         const snapshot = await getDocs(shirtsCollection);
//         const shirtsData = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setProducts(shirtsData);
//       } catch (error) {
//         console.error("Error fetching shirts:", error);
//       }
//     };

//     fetchShirts();
//   }, []);

//   const handleImageClick = (product) => {
//     navigate(`/ShopPages/CustomizeShirt`, {
//       state: {
//         selectedImage: product.image,
//         selectedColor: product.color,
//         selectedName: product.name,
//         selectedPrice: product.price,
//         selectedSizes: product.sizes,
//         availableStock: product.stock,
//       },
//     });
//   };

//   const handleRequestDesign = () => {
//     setShowDesignOptions(!showDesignOptions);
//   };

//   const handleDesignSelection = (designType) => {
//     navigate(`/ShopPages/RequestForm`);
//     setShowDesignOptions(false);
//   };

//   const handleFileChange = (event) => {
//     const files = Array.from(event.target.files);
//     const imageUrls = files.map((file) => URL.createObjectURL(file));

//     setSelectedFile(imageUrls);

//     navigate("/ShopPages/RequestForm", {
//       state: { uploadedImages: files, imagePreviews: imageUrls },
//     });
//   };

//   const triggerFileInput = () => {
//     document.getElementById("fileUpload").click();
//   };

//   const handleSizeFilterChange = (size) => {
//     setSelectedSizes((prevSelectedSizes) =>
//       prevSelectedSizes.includes(size)
//         ? prevSelectedSizes.filter((s) => s !== size)
//         : [...prevSelectedSizes, size]
//     );
//     // Reset to first page when filters change
//     setCurrentPage(1);
//   };

//   const filteredProducts = products.filter(
//     (product) =>
//       selectedSizes.length === 0 ||
//       selectedSizes.some((size) => product.sizes?.includes(size))
//   );

//   // Pagination logic
//   const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
//   const indexOfLastProduct = currentPage * ITEMS_PER_PAGE;
//   const indexOfFirstProduct = indexOfLastProduct - ITEMS_PER_PAGE;
//   const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <div className="w-full">
//       <div className="w-full mt-30 h-20 bg-black"></div>
//       <div className="container mx-auto p-4 flex bg-white">
//         <aside className="w-1/4 mt-5 p-4 border-r">
//           <h2 className="text-2xl font-bold">Shirts</h2>
//           <input
//             type="text"
//             placeholder="Search within this category"
//             className="w-full p-2 border rounded-lg mt-2"
//           />
//           <div className="mt-4 flex justify-between items-center">
//             <span>No minimum amount</span>
//             <input type="checkbox" className="toggle-switch" />
//           </div>
//           <div className="mt-2 flex justify-between items-center">
//             <span>Backside Printing</span>
//             <input type="checkbox" className="toggle-switch" />
//           </div>
         
//           <div className="mt-4">
//             <label className="block mb-2 font-medium">Size</label>
//             <div className="flex flex-col gap-2">
//               {sizes.map((size) => (
//                 <label key={size} className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     className="form-checkbox"
//                     onChange={() => handleSizeFilterChange(size)}
//                   />
//                   {size}
//                 </label>
//               ))}
//             </div>
//           </div>
//         </aside>

//         {/* Main Content Section */}
//         <div className="w-3/4 p-4">
//           {/* Request Design Section */}
//           <div className="flex items-center ">
//             <button
//               onClick={handleRequestDesign}
//               className="bg-black text-white px-15 py-1 rounded-md duration-300 hover:scale-105 "
//             >
//               Request Design {showDesignOptions ? " < " : " > "}
//             </button>

//             {showDesignOptions && (
//               <div className="flex px-10 space-x-13 transition-all duration-300 ease-in-out">
//                 {["Jerseys", "Uniforms", "T-shirts"].map((designType) => (
//                   <button
//                     key={designType}
//                     onClick={() =>
//                       handleDesignSelection(designType.toLowerCase())
//                     }
//                     className="border px-20 py-1 rounded-md hover:bg-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105"
//                   >
//                     {designType}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="grid grid-cols-4 gap-6 mt-6">
//             {/* First cell is the Upload a Design Section */}
//             <div className="border p-4 shadow-lg rounded-lg bg-orange-100">
//               <div
//                 className="border-dashed bg-white border-2 p-4 rounded-lg cursor-pointer h-48 flex items-center justify-center"
//                 onClick={triggerFileInput}
//               >
//                 <p className="text-gray-500">Select or drop a file</p>
//               </div>
//               <input
//                 type="file"
//                 id="fileUpload"
//                 className="hidden"
//                 accept="image/jpeg, image/jpg, image/png"
//                 onChange={handleFileChange}
//               />

//               <button
//                 onClick={triggerFileInput}
//                 className="mt-4 bg-black text-white px-4 py-2 rounded-md cursor-pointer w-full"
//               >
//                 Upload
//               </button>

//               {selectedFile && (
//                 <p className="text-xs text-gray-500 mt-2">
//                   Selected: {selectedFile.name}
//                 </p>
//               )}

//               <p className="text-xs text-gray-500 mt-2">
//                 Only one file per design (JPG or PNG)
//               </p>
//             </div>

//             {/* The remaining 11 cells are for products */}
//             {currentProducts.map((product) => (
//               <div 
//                 key={product.id} 
//                 className="border p-4 shadow-lg rounded-lg transform transition-all duration-300 ease-in-out
//                 hover:scale-105 hover:-translate-y-1 hover:shadow-xl"
//               >
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="w-full h-48 object-cover rounded-lg cursor-pointer transition-transform duration-500 ease-in-out
//                   hover:scale-110"
//                   onClick={() => handleImageClick(product)}
//                 />
//                 <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
//                 <div className="mt-1 text-base">
//                   <p className="text-gray-700 leading-tight">PHP {product.price}.00</p>
//                   <p className="text-green-500 leading-tight">In stock: {product.stock}</p>
//                   <p className="text-gray-500 leading-tight">
//                     Sizes: {product.sizes?.join(", ")}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           {filteredProducts.length > ITEMS_PER_PAGE && (
//             <div className="flex justify-center mt-8">
//               <nav className="flex items-center">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className={`mx-1 px-3 py-1 rounded ${
//                     currentPage === 1
//                       ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                       : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                   }`}
//                 >
//                   Previous
//                 </button>
                
//                 <div className="flex mx-2">
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
//                     <button
//                       key={number}
//                       onClick={() => paginate(number)}
//                       className={`mx-1 px-3 py-1 rounded ${
//                         currentPage === number
//                           ? "bg-black text-white"
//                           : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                       }`}
//                     >
//                       {number}
//                     </button>
//                   ))}
//                 </div>
                
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className={`mx-1 px-3 py-1 rounded ${
//                     currentPage === totalPages
//                       ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                       : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                   }`}
//                 >
//                   Next
//                 </button>
//               </nav>
//             </div>
//           )}

//           {/* Results counter */}
//           <div className="mt-4 text-gray-600 text-sm">
//             Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
//           </div>
//         </div>
//       </div>
//       {/* Footer */}
//       <div className="w-full py-20 px-10 bg-gray-800 mt-12">
//         <div className="container mx-auto text-white">
//           <div className="flex justify-between">
//             <div>
//               <h3 className="text-lg font-bold">Davidson Athletics</h3>
//               <p className="text-sm mt-2">© 2025 Davidson Athletics. All rights reserved.</p>
//             </div>
//             <div>
//               <h3 className="text-lg font-bold">Contact Us</h3>
//               <p className="text-sm mt-2">Email: support@davidsonathletics.com</p>
//               <p className="text-sm">Phone: +1 234 567 890</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Shop;



