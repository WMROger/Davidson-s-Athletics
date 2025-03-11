import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../../Database/firebase"; // Ensure correct path
import { collection, addDoc } from "firebase/firestore";

const RequestForm = () => {
  const location = useLocation();
  const selectedProduct = location.state?.selectedProduct || "";
  const [uploadedImages, setUploadedImages] = useState(
    location.state?.uploadedImages || []
  );
  const [imagePreviews, setImagePreviews] = useState(
    location.state?.imagePreviews || []
  );
  const getCutTypeOptions = () => {
    return [
      { value: "v-neck", label: "V-Neck" },
      { value: "crew-neck", label: "Crew Neck" },
      { value: "scoop-neck", label: "Scoop Neck" },
    ];
  };
  const [formData, setFormData] = useState({
    customerInfo: {
      fullName: "",
      email: "",
      phone: "",
      teamName: "",
      logo: null,
    },
    productType: selectedProduct,
    designDetails: {
      primaryColor: "",
      secondaryColor: "",
      pattern: "",
      quantity: 1,
      specialInstructions: "",
      hasName: false,
      names: Array(1).fill(""),
      sizes: Array(1).fill(""),
    },
  });

  // Track focused input fields
  const [focusedFields, setFocusedFields] = useState({});

  const handleFocus = (fieldId) => {
    setFocusedFields((prev) => ({
      ...prev,
      [fieldId]: true,
    }));
  };

  const handleBlur = (fieldId, value) => {
    setFocusedFields((prev) => ({
      ...prev,
      [fieldId]: value ? true : false,
    }));
  };

  const handleInputChange = (e, field, section = "customerInfo") => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const previewUrls = [];
    const uploadedFiles = [];

    // Create an array of promises to handle async reading of all files
    const filePromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previewUrls.push(reader.result); // Push the preview URL
          uploadedFiles.push(file); // Store the file itself
          resolve(); // Resolve the promise once the file is read
        };
        reader.onerror = reject; // Reject the promise if there's an error
        reader.readAsDataURL(file);
      });
    });

    // After all files are read, update the state
    Promise.all(filePromises)
      .then(() => {
        setImagePreviews((prev) => [...prev, ...previewUrls]); // Update preview state
        setUploadedImages((prevImages) => [...prevImages, ...uploadedFiles]); // Update uploaded files state
      })
      .catch((error) => {
        console.error("Error reading files:", error);
      });
  };

  const handleQuantityChange = (e) => {
    const newQuantity = Math.max(1, parseInt(e.target.value, 10) || 1);
    setFormData((prev) => ({
      ...prev,
      designDetails: {
        ...prev.designDetails,
        quantity: newQuantity,
        names: Array(newQuantity).fill(""),
        sizes: Array(newQuantity).fill(""),
      },
    }));
  };

  const handleNameChange = (index, value) => {
    const updatedNames = [...formData.designDetails.names];
    updatedNames[index] = value;
    setFormData((prev) => ({
      ...prev,
      designDetails: { ...prev.designDetails, names: updatedNames },
    }));
  };

  const handleSizeChange = (index, value) => {
    const updatedSizes = [...formData.designDetails.sizes];
    updatedSizes[index] = value;
    setFormData((prev) => ({
      ...prev,
      designDetails: { ...prev.designDetails, sizes: updatedSizes },
    }));
  };

  const handleSubmit = async () => {
    try {
      const uploadedUrls = [];

      // Upload each image to the server
      for (const image of uploadedImages) {
        const formData = new FormData();
        formData.append("file", image);

        const response = await fetch(
          "https://davidsonathletics.scarlet2.io/api/upload_request_design.php",
          {
            method: "POST",
            body: formData,
          }
        );

        // Check if the upload was successful
        if (!response.ok) {
          throw new Error("Failed to upload image.");
        }

        const data = await response.json();
        if (data.imageUrl) {
          uploadedUrls.push(data.imageUrl); // Add the uploaded image URL to the list
        } else {
          throw new Error("Error uploading image: " + data.error);
        }
      }

      // Check for undefined values in formData before sending to Firestore
      const requestData = {
        customerInfo: formData.customerInfo || "",
        productType: formData.productType || "",
        designDetails: formData.designDetails || "",
        imageUrls: uploadedUrls.length > 0 ? uploadedUrls : [], // Ensure imageUrls is always an array
        timestamp: new Date(),
        status: "Pending Approval", // Add status field
      };

      // Add the request data to Firestore
      await addDoc(collection(db, "requests"), requestData);

      alert("Request submitted successfully!");
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request.");
    }
  };

  const productTypeOptions = [
    { value: "Jersey", label: "Jersey" },
    { value: "Polo", label: "Polo" },
    { value: "Sleeveless", label: "Sleeveless" },
    { value: "T-shirts", label: "T-shirts" },
  ];

  const sizeOptions = [
    { value: "S", label: "Small" },
    { value: "M", label: "Medium" },
    { value: "L", label: "Large" },
    { value: "XL", label: "X-Large" },
  ];

  return (
    <div className="max-w-4xl mx-auto my-30 p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-5xl font-bold text-start">Request Design</h2>
      <p className="text-start text-gray-500 mb-6">
        Fill out the information below
      </p>

      {/* Flexbox Layout */}
      <div className="flex flex-col md:flex-row justify-between">
        {/* Left Column - Personal Info */}
        <div className="flex flex-col w-full md:w-1/2 md:pr-4">
          {/* Full Name Field */}
          <div className="relative mb-4">
            <input
              id="fullName"
              type="text"
              value={formData.customerInfo.fullName}
              onChange={(e) => handleInputChange(e, "fullName")}
              onFocus={() => handleFocus("fullName")}
              onBlur={(e) => handleBlur("fullName", e.target.value)}
              className="border p-2 rounded w-full z-10 relative bg-transparent"
              placeholder=" "
            />
            <label
              htmlFor="fullName"
              className={`absolute transition-all duration-200 pointer-events-none ${
                focusedFields["fullName"] || formData.customerInfo.fullName
                  ? "text-xs text-blue-600 -top-2 left-2 bg-white px-1 z-20"
                  : "text-gray-500 top-2 left-2 z-0"
              }`}
            >
              Full Name
            </label>
          </div>

          {/* Email Field */}
          <div className="relative mb-4">
            <input
              id="email"
              type="email"
              value={formData.customerInfo.email}
              onChange={(e) => handleInputChange(e, "email")}
              onFocus={() => handleFocus("email")}
              onBlur={(e) => handleBlur("email", e.target.value)}
              className="border p-2 rounded w-full z-10 relative bg-transparent"
              placeholder=" "
            />
            <label
              htmlFor="email"
              className={`absolute transition-all duration-200 pointer-events-none ${
                focusedFields["email"] || formData.customerInfo.email
                  ? "text-xs text-blue-600 -top-2 left-2 bg-white px-1 z-20"
                  : "text-gray-500 top-2 left-2 z-0"
              }`}
            >
              Email
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Phone Field */}
            <div className="w-full sm:w-1/2 relative mb-4">
              <input
                id="phone"
                type="tel"
                value={formData.customerInfo.phone}
                onChange={(e) => handleInputChange(e, "phone")}
                onFocus={() => handleFocus("phone")}
                onBlur={(e) => handleBlur("phone", e.target.value)}
                className="border p-2 rounded w-full z-10 relative bg-transparent"
                placeholder=" "
              />
              <label
                htmlFor="phone"
                className={`absolute transition-all duration-200 pointer-events-none ${
                  focusedFields["phone"] || formData.customerInfo.phone
                    ? "text-xs text-blue-600 -top-2 left-2 bg-white px-1 z-20"
                    : "text-gray-500 top-2 left-2 z-0"
                }`}
              >
                Phone Number
              </label>
            </div>

            {/* Team Name Field */}
            <div className="w-full sm:w-1/2 relative mb-4">
              <input
                id="teamName"
                type="text"
                value={formData.customerInfo.teamName}
                onChange={(e) => handleInputChange(e, "teamName")}
                onFocus={() => handleFocus("teamName")}
                onBlur={(e) => handleBlur("teamName", e.target.value)}
                className="border p-2 rounded w-full z-10 relative bg-transparent"
                placeholder=" "
              />
              <label
                htmlFor="teamName"
                className={`absolute transition-all duration-200 pointer-events-none ${
                  focusedFields["teamName"] || formData.customerInfo.teamName
                    ? "text-xs text-blue-600 -top-2 left-2 bg-white px-1 z-20"
                    : "text-gray-500 top-2 left-2 z-0"
                }`}
              >
                Team Name
              </label>
            </div>
          </div>

          {/* File Upload */}
          <label className="border-dashed border-2 border-gray-400 rounded-lg p-6 flex flex-col items-center text-gray-500 cursor-pointer mt-4">
            <input
              type="file"
              multiple
              accept="image/*" // Allow only image files
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="text-2xl">📤</span>
            <p className="text-sm">Upload team logo</p>
          </label>

          {/* Show uploaded image previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-4">
              <p className="text-gray-600">Uploaded Image Previews:</p>
              <div className="flex flex-wrap gap-2">
                {imagePreviews.map((image, index) => (
                  <img
                    key={index}
                    src={image} // Display the preview image
                    alt={`Uploaded Design ${index + 1}`}
                    className="w-32 h-auto border rounded-lg shadow-md"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Middle Divider - Only visible on larger screens */}
        <div className="hidden md:block border-l border-gray-300 h-auto mx-4"></div>

        {/* Right Column - Design Details */}
        <div className="flex flex-col w-full md:w-1/2 mt-6 md:mt-0 md:pl-4">
          {/* Product Type */}
          <div className="relative mb-4">
            <select
              id="productType"
              value={formData.productType}
              onChange={(e) =>
                setFormData({ ...formData, productType: e.target.value })
              }
              onFocus={() => handleFocus("productType")}
              onBlur={(e) => handleBlur("productType", e.target.value)}
              className="border p-2 rounded w-full z-10 relative bg-transparent appearance-none"
            >
              <option value=""></option>
              {productTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <label
              htmlFor="productType"
              className={`absolute transition-all duration-200 pointer-events-none ${
                focusedFields["productType"] || formData.productType
                  ? "text-xs text-blue-600 -top-2 left-2 bg-white px-1 z-20"
                  : "text-gray-500 top-2 left-2 z-0"
              }`}
            >
              Product Type
            </label>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>

          {/* Cut Type - Only shows for Jersey */}
          {formData.productType === "Jersey" && (
            <div className="relative mb-4">
              <select
                id="cutType"
                value={formData.designDetails.cutType || ""}
                onChange={(e) =>
                  handleInputChange(e, "cutType", "designDetails")
                }
                onFocus={() => handleFocus("cutType")}
                onBlur={(e) => handleBlur("cutType", e.target.value)}
                className="border p-2 rounded w-full z-10 relative bg-transparent appearance-none"
              >
                <option value=""></option>
                {getCutTypeOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <label
                htmlFor="cutType"
                className={`absolute transition-all duration-200 pointer-events-none ${
                  focusedFields["cutType"] || formData.designDetails.cutType
                    ? "text-xs text-blue-600 -top-2 left-2 bg-white px-1 z-20"
                    : "text-gray-500 top-2 left-2 z-0"
                }`}
              >
                Cut Type
              </label>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          )}

          {/* Primary Color Field */}
          <div className="relative mb-4">
            <input
              id="primaryColor"
              type="text"
              value={formData.designDetails.primaryColor}
              onChange={(e) =>
                handleInputChange(e, "primaryColor", "designDetails")
              }
              onFocus={() => handleFocus("primaryColor")}
              onBlur={(e) => handleBlur("primaryColor", e.target.value)}
              className="border p-2 rounded w-full z-10 relative bg-transparent"
              placeholder=" "
            />
            <label
              htmlFor="primaryColor"
              className={`absolute transition-all duration-200 pointer-events-none ${
                focusedFields["primaryColor"] ||
                formData.designDetails.primaryColor
                  ? "text-xs text-blue-600 -top-2 left-2 bg-white px-1 z-20"
                  : "text-gray-500 top-2 left-2 z-0"
              }`}
            >
              Primary Color
            </label>
          </div>

          {/* Secondary Color Field */}
          <div className="relative mb-4">
            <input
              id="secondaryColor"
              type="text"
              value={formData.designDetails.secondaryColor}
              onChange={(e) =>
                handleInputChange(e, "secondaryColor", "designDetails")
              }
              onFocus={() => handleFocus("secondaryColor")}
              onBlur={(e) => handleBlur("secondaryColor", e.target.value)}
              className="border p-2 rounded w-full z-10 relative bg-transparent"
              placeholder=" "
            />
            <label
              htmlFor="secondaryColor"
              className={`absolute transition-all duration-200 pointer-events-none ${
                focusedFields["secondaryColor"] ||
                formData.designDetails.secondaryColor
                  ? "text-xs text-blue-600 -top-2 left-2 bg-white px-1 z-20"
                  : "text-gray-500 top-2 left-2 z-0"
              }`}
            >
              Secondary Color
            </label>
          </div>

          {/* Pattern Field */}
          <div className="relative mb-4">
            <input
              id="pattern"
              type="text"
              value={formData.designDetails.pattern}
              onChange={(e) => handleInputChange(e, "pattern", "designDetails")}
              onFocus={() => handleFocus("pattern")}
              onBlur={(e) => handleBlur("pattern", e.target.value)}
              className="border p-2 rounded w-full z-10 relative bg-transparent"
              placeholder=" "
            />
            <label
              htmlFor="pattern"
              className={`absolute transition-all duration-200 pointer-events-none ${
                focusedFields["pattern"] || formData.designDetails.pattern
                  ? "text-xs text-blue-600 -top-2 left-2 bg-white px-1 z-20"
                  : "text-gray-500 top-2 left-2 z-0"
              }`}
            >
              Pattern Preference
            </label>
          </div>

          {/* Quantity Field */}
          <div className="relative mb-4">
            <input
              id="quantity"
              type="number"
              min="1"
              value={formData.designDetails.quantity}
              onChange={handleQuantityChange}
              onFocus={() => handleFocus("quantity")}
              onBlur={(e) => handleBlur("quantity", e.target.value)}
              className="border p-2 rounded w-full z-10 relative bg-transparent"
              placeholder=" "
            />
            <label
              htmlFor="quantity"
              className={`absolute transition-all duration-200 pointer-events-none ${
                focusedFields["quantity"] || formData.designDetails.quantity > 0
                  ? "text-xs text-blue-600 -top-2 left-2 bg-white px-1 z-20"
                  : "text-gray-500 top-2 left-2 z-0"
              }`}
            >
              Quantity
            </label>
          </div>

          {/* Add Name Checkbox */}
          <label className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              checked={formData.designDetails.hasName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  designDetails: {
                    ...formData.designDetails,
                    hasName: e.target.checked,
                  },
                })
              }
              className="w-4 h-4"
            />
            <span>Add Name</span>
          </label>

          {/* Name & Size Fields */}
          {Array.from({ length: formData.designDetails.quantity }).map(
            (_, i) => (
              <div key={i} className="flex space-x-2 mb-2">
                {formData.designDetails.hasName && (
                  <div className="relative w-1/2">
                    <input
                      type="text"
                      value={formData.designDetails.names[i]}
                      onChange={(e) => handleNameChange(i, e.target.value)}
                      onFocus={() => handleFocus(`name-${i}`)}
                      onBlur={(e) => handleBlur(`name-${i}`, e.target.value)}
                      className="border p-2 rounded w-full z-10 relative bg-transparent"
                      placeholder=" "
                    />
                    <label
                      className={`absolute transition-all duration-200 pointer-events-none ${
                        focusedFields[`name-${i}`] ||
                        formData.designDetails.names[i]
                          ? "text-xs text-blue-600 -top-2 left-2 bg-white px-1 z-20"
                          : "text-gray-500 top-2 left-2 z-0"
                      }`}
                    >
                      Name {i + 1}
                    </label>
                  </div>
                )}

                <div className="relative w-1/2">
                  <select
                    value={formData.designDetails.sizes[i]}
                    onChange={(e) => handleSizeChange(i, e.target.value)}
                    onFocus={() => handleFocus(`size-${i}`)}
                    onBlur={(e) => handleBlur(`size-${i}`, e.target.value)}
                    className="border p-2 rounded w-full z-10 relative bg-transparent appearance-none"
                  >
                    <option value=""></option>
                    {sizeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <label
                    className={`absolute transition-all duration-200 pointer-events-none ${
                      focusedFields[`size-${i}`] ||
                      formData.designDetails.sizes[i]
                        ? "text-xs text-blue-600 -top-2 left-2 bg-white px-1 z-20"
                        : "text-gray-500 top-2 left-2 z-0"
                    }`}
                  >
                    Size {i + 1}
                  </label>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Special Instructions Field */}
          <div className="relative mb-4">
            <textarea
              id="specialInstructions"
              value={formData.designDetails.specialInstructions}
              onChange={(e) =>
                handleInputChange(e, "specialInstructions", "designDetails")
              }
              onFocus={() => handleFocus("specialInstructions")}
              onBlur={(e) => handleBlur("specialInstructions", e.target.value)}
              className="border p-2 rounded w-full h-24 z-10 relative bg-transparent"
              placeholder=" "
            ></textarea>
            <label
              htmlFor="specialInstructions"
              className={`absolute transition-all duration-200 pointer-events-none ${
                focusedFields["specialInstructions"] ||
                formData.designDetails.specialInstructions
                  ? "text-xs text-blue-600 -top-2 left-2 bg-white px-1 z-20"
                  : "text-gray-500 top-2 left-2 z-0"
              }`}
            >
              Special Instructions
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-6 mt-6">
        <button
          onClick={handleSubmit}
          className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          Submit
        </button>
        <button className="border border-black px-6 py-2 rounded-md hover:bg-gray-100 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RequestForm;
