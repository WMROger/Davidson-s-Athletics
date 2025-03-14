import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Database/firebase"; // Ensure correct path
import { collection, getDocs } from "firebase/firestore";

const colors = ["black", "green", "red", "blue", "purple", "yellow", "orange"];
const sizes = ["S", "M", "L", "XL"];

const Shop = () => {
  const navigate = useNavigate();
  const [showDesignOptions, setShowDesignOptions] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

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
  };

  const filteredProducts = products.filter(
    (product) =>
      selectedSizes.length === 0 ||
      selectedSizes.some((size) => product.sizes?.includes(size))
  );

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
              {sizes.map((size) => (
                <label key={size} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    onChange={() => handleSizeFilterChange(size)}
                  />
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
                    Selected: {selectedFile.name}
                  </p>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  Only one file per design (JPG or PNG)
                </p>
              </div>
            </div>

            {filteredProducts.map((product, index) => (
              <div key={product.id} className="border p-4 shadow-lg rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg cursor-pointer"
                  onClick={() => handleImageClick(product)}
                />
                <h3 className="text-sm font-semibold mt-2">{product.name}</h3>
                <p className="text-gray-700">PHP {product.price}.00</p>
                <p className="text-green-500">In stock: {product.stock}</p>
                <p className="text-gray-500">
                  Sizes: {product.sizes?.join(", ")}
                </p>
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
      {/* Footer Section */}
      <div className="w-full py-20 px-10 bg-gray-800"></div>
    </div>
  );
};

export default Shop;
