import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Database/firebase"; // Ensure correct path
import { collection, getDocs } from "firebase/firestore";

const colors = ["black", "green", "red", "blue", "purple", "yellow", "orange"];

const Shop = () => {
  const navigate = useNavigate();
  const [showDesignOptions, setShowDesignOptions] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchShirts = async () => {
      try {
        const shirtsCollection = collection(db, "shirts");
        const snapshot = await getDocs(shirtsCollection);
        const shirtsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(shirtsData);
      } catch (error) {
        console.error("Error fetching shirts:", error);
      }
    };

    fetchShirts();
  }, []);

  const handleImageClick = (product) => {
    navigate(`/ShopPages/CustomizeShirt`, {
      state: { selectedImage: product.image, selectedColor: product.color },
    });
  };

  const handleColorChange = (index, color) => {
    const updatedProducts = [...products];
    updatedProducts[index].color = color;
    updatedProducts[
      index
    ].image = `/Home Assets/home_img_longSleeve-${color}.svg`;
    setProducts(updatedProducts);
  };

  const handleRequestDesign = () => {
    setShowDesignOptions(!showDesignOptions);
  };

  const handleDesignSelection = (designType) => {
    navigate(`/ShopPages/RequestForm`);
    setShowDesignOptions(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && ["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setSelectedFile(file.name);
    } else {
      setSelectedFile(null);
      alert("Please upload a valid image file (JPG, JPEG, or PNG).");
    }
  };

  const triggerFileInput = () => {
    document.getElementById("fileUpload").click();
  };

  return (
    <div className="w-full">
      <div className="w-full mt-30 h-30 bg-black"></div>
      <div className="container mx-auto p-4 flex bg-white">
        <aside className="w-1/4 mt-5 p-4 border-r">
          <h2 className="text-2xl font-bold">Long Sleeve Shirts</h2>
          <input
            type="text"
            placeholder="Search within this category"
            className="w-full p-2 border rounded-lg mt-2"
          />
          <div className="mt-4 flex justify-between items-center">
            <span>No minimum amount</span>
            <input type="checkbox" className="toggle-switch" />
          </div>
          <div className="mt-2 flex justify-between items-center">
            <span>Backside Printing</span>
            <input type="checkbox" className="toggle-switch" />
          </div>
          <div className="mt-4">
            <label className="block mb-2 font-medium">Color</label>
            <div className="flex gap-2">
              {colors.map((color) => (
                <span
                  key={color}
                  className="w-6 h-6 rounded-full border border-gray-400 cursor-pointer"
                  style={{ backgroundColor: color }}
                ></span>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <label className="block mb-2 font-medium">Size</label>
            <div className="flex flex-col gap-2">
              {[
                "Small",
                "Medium",
                "Large",
                "Extra Large",
                "XX Large",
                "XXX Large",
              ].map((size) => (
                <label key={size} className="flex items-center gap-2">
                  <input type="checkbox" className="form-checkbox" />
                  {size}
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
              className="bg-black text-white px-16 py-2 rounded-md"
            >
              Request Design {">"}
            </button>

            {showDesignOptions && (
              <div className="flex px-10 space-x-13">
                {["Jerseys", "Uniforms", "T-shirts"].map((designType) => (
                  <button
                    key={designType}
                    onClick={() =>
                      handleDesignSelection(designType.toLowerCase())
                    }
                    className="border px-20 py-1 rounded-md hover:bg-gray-200"
                  >
                    {designType}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-6 mt-6">
            {/* Upload a Design Section */}
            <div className="container mx-auto flex justify-center items-center">
              <div className="border p-6 bg-orange-100 rounded-lg shadow-lg text-center w-96">
                <div
                  className="border-dashed bg-white border-2 p-15 rounded-lg cursor-pointer"
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
                  className="mt-4 bg-black text-white px-4 py-2 rounded-md"
                >
                  Upload
                </button>

                {selectedFile && (
                  <p className="text-xs text-gray-500 mt-2">
                    Selected: {selectedFile}
                  </p>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  Only one file per design (JPG or PNG)
                </p>
              </div>
            </div>

            {products.map((product, index) => (
              <div key={product.id} className="border p-4 shadow-lg rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg cursor-pointer"
                  onClick={() => handleImageClick(product)}
                />
                <h3 className="text-sm font-semibold mt-2">{product.name}</h3>
                <p className="text-gray-700">PHP {product.price}.00</p>
                <div className="flex gap-1 mt-2">
                  {colors.map((color) => (
                    <span
                      key={color}
                      className="w-5 h-5 rounded-full border cursor-pointer"
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(index, color)}
                    ></span>
                  ))}
                </div>
              </div>
            ))}
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

// const colors = ["black", "green", "red", "blue", "purple", "yellow", "orange"];

// const Shop = () => {
//   const navigate = useNavigate();
//   const [showDesignOptions, setShowDesignOptions] = useState(false);
//   const [showRequestForm, setShowRequestForm] = useState(false); // Controls the popup
//   const [selectedDesign, setSelectedDesign] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [products, setProducts] = useState([]);

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
//       state: { selectedImage: product.image, selectedColor: product.color },
//     });
//   };

//   const handleColorChange = (index, color) => {
//     const updatedProducts = [...products];
//     updatedProducts[index].color = color;
//     updatedProducts[
//       index
//     ].image = `/Home Assets/home_img_longSleeve-${color}.svg`;
//     setProducts(updatedProducts);
//   };

//   const handleRequestDesign = () => {
//     setShowDesignOptions(!showDesignOptions);
//   };

//   const handleDesignSelection = (designType) => {
//     setSelectedDesign(designType);
//     setShowRequestForm(true); // Open the popup instead of navigating
//     setShowDesignOptions(false);
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file && ["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
//       setSelectedFile(file.name);
//     } else {
//       setSelectedFile(null);
//       alert("Please upload a valid image file (JPG, JPEG, or PNG).");
//     }
//   };

//   const triggerFileInput = () => {
//     document.getElementById("fileUpload").click();
//   };

//   return (
//     <div className="w-full">
//       <div className="w-full mt-30 h-30 bg-black"></div>
//       <div className="container mx-auto p-4 flex bg-white">
//         <aside className="w-1/4 mt-5 p-4 border-r">
//           <h2 className="text-2xl font-bold">Long Sleeve Shirts</h2>
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
//             <label className="block mb-2 font-medium">Color</label>
//             <div className="flex gap-2">
//               {colors.map((color) => (
//                 <span
//                   key={color}
//                   className="w-6 h-6 rounded-full border border-gray-400 cursor-pointer"
//                   style={{ backgroundColor: color }}
//                 ></span>
//               ))}
//             </div>
//           </div>
//           <div className="mt-4">
//             <label className="block mb-2 font-medium">Size</label>
//             <div className="flex flex-col gap-2">
//               {[
//                 "Small",
//                 "Medium",
//                 "Large",
//                 "Extra Large",
//                 "XX Large",
//                 "XXX Large",
//               ].map((size) => (
//                 <label key={size} className="flex items-center gap-2">
//                   <input type="checkbox" className="form-checkbox" />
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
//               className="bg-black text-white px-16 py-2 rounded-md"
//             >
//               Request Design {">"}
//             </button>

//             {showDesignOptions && (
//               <div className="flex px-10 space-x-13">
//                 {["Jerseys", "Uniforms", "T-shirts"].map((designType) => (
//                   <button
//                     key={designType}
//                     onClick={() =>
//                       handleDesignSelection(designType.toLowerCase())
//                     }
//                     className="border px-20 py-1 rounded-md hover:bg-gray-200"
//                   >
//                     {designType}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="grid grid-cols-4 gap-6 mt-6">
//             {products.map((product, index) => (
//               <div key={product.id} className="border p-4 shadow-lg rounded-lg">
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="w-full h-48 object-cover rounded-lg cursor-pointer"
//                   onClick={() => handleImageClick(product)}
//                 />
//                 <h3 className="text-sm font-semibold mt-2">{product.name}</h3>
//                 <p className="text-gray-700">PHP {product.price}.00</p>
//                 <div className="flex gap-1 mt-2">
//                   {colors.map((color) => (
//                     <span
//                       key={color}
//                       className="w-5 h-5 rounded-full border cursor-pointer"
//                       style={{ backgroundColor: color }}
//                       onClick={() => handleColorChange(index, color)}
//                     ></span>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Request Form Popup Modal */}
//       {showRequestForm && (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-lg font-bold mb-4">
//               Request a {selectedDesign} Design
//             </h2>
//             <input
//               type="text"
//               placeholder="Enter your design details"
//               className="w-full p-2 border rounded-lg mb-4"
//             />
//             <input
//               type="file"
//               className="w-full mb-4"
//               accept="image/jpeg, image/jpg, image/png"
//               onChange={handleFileChange}
//             />
//             {selectedFile && (
//               <p className="text-xs text-gray-500">Selected: {selectedFile}</p>
//             )}
//             <div className="flex justify-end gap-2">
//               <button
//                 className="bg-gray-400 text-white px-4 py-2 rounded-md"
//                 onClick={() => setShowRequestForm(false)}
//               >
//                 Cancel
//               </button>
//               <button className="bg-black text-white px-4 py-2 rounded-md">
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Shop;
