import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../../Database/firebase"; // Ensure correct path
import {
  collection,
  addDoc,
  runTransaction,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore"; // Import necessary Firestore functions
import { v4 as uuidv4 } from "uuid"; // Import the uuid library
import { getAuth } from "firebase/auth";
import { getFirestore, getDoc } from "firebase/firestore"; // Add this import

const RequestForm = () => {
  const location = useLocation();
  const selectedProduct = location.state?.selectedProduct || "";
  const [uploadedImages, setUploadedImages] = useState(
    location.state?.uploadedImages || []
  );
  const [imagePreviews, setImagePreviews] = useState(
    location.state?.imagePreviews || []
  );
  
  // Add validation errors state
  const [validationErrors, setValidationErrors] = useState({
    phone: ""
  });
  
  // Available sizes for the products
  const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
  
  const getCutTypeOptions = () => {
    return [
      { value: "v-neck", label: "V-Neck" },
      { value: "crew-neck", label: "Crew Neck" },
      { value: "scoop-neck", label: "Scoop Neck" },
    ];
  };

  // Initialize state with size quantities structure
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
      cutType: "",
      quantity: 1,
      specialInstructions: "",
      hasName: false,
      names: Array(1).fill(""),
      sizes: Array(1).fill(""),
      // New property for size quantities when bundling
      sizeQuantities: AVAILABLE_SIZES.reduce((acc, size) => {
        return acc;
      }, {})
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
    
    // Validate phone when field loses focus
    if (fieldId === "phone" && value) {
      validatePhone(value);
    }
  };

  // Format phone number as user types
  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const digitsOnly = value.replace(/\D/g, '');
    
    // Format based on digit count (for an 11-digit number)
    if (digitsOnly.length <= 4) {
      return digitsOnly;
    } else if (digitsOnly.length <= 7) {
      return `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4)}`;
    } else {
      return `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7, 11)}`;
    }
  };

  const handleInputChange = (e, field, section = "customerInfo") => {
    let value = e.target.value;
    
    // Apply formatting only for phone fields
    if (field === "phone") {
      // Preserve cursor position
      const cursorPosition = e.target.selectionStart;
      const prevValue = formData.customerInfo.phone;
      
      // Format the phone number
      const formattedValue = formatPhoneNumber(value);
      
      // Update value
      value = formattedValue;
      
      // Set the state
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
      
      // Clear any error when typing
      setValidationErrors(prev => ({
        ...prev,
        phone: ""
      }));
      
      // After React updates the input value, restore cursor position properly
      setTimeout(() => {
        // Calculate new cursor position
        let newPosition = cursorPosition;
        const prevNonDigits = (prevValue.substring(0, cursorPosition).match(/\D/g) || []).length;
        const newNonDigits = (value.substring(0, cursorPosition).match(/\D/g) || []).length;
        newPosition += (newNonDigits - prevNonDigits);
        
        // Set the cursor position
        e.target.setSelectionRange(newPosition, newPosition);
      }, 0);
      
      return;
    }
    
    // For non-phone fields, use original logic
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  // Validate phone number
  const validatePhone = (phoneNumber) => {
    // Remove any non-digit characters for validation
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    
    if (digitsOnly.length !== 11) {
      setValidationErrors(prev => ({
        ...prev,
        phone: "Phone number must be 11 digits"
      }));
      return false;
    }
    
    // Clear error if valid
    setValidationErrors(prev => ({
      ...prev,
      phone: ""
    }));
    return true;
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

  // Handle quantity change for the overall order
  const handleQuantityChange = (e) => {
    const newQuantity = Math.max(1, parseInt(e.target.value, 10) || 1);
    setFormData((prev) => ({
      ...prev,
      designDetails: {
        ...prev.designDetails,
        quantity: newQuantity,
        names: Array(newQuantity).fill("").map((_, i) => 
          prev.designDetails.names[i] || ""
        ),
        sizes: Array(newQuantity).fill("").map((_, i) => 
          prev.designDetails.sizes[i] || ""
        ),
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

  // Handle size quantity change for bundled orders
  const handleSizeQuantityChange = (size, value) => {
    const quantity = parseInt(value) || 0;
    
    setFormData((prev) => {
      const newSizeQuantities = {
        ...prev.designDetails.sizeQuantities,
        [size]: quantity
      };
      
      // Calculate total quantity based on all size quantities
      const newTotalQuantity = Object.values(newSizeQuantities).reduce((sum, qty) => sum + qty, 0);
      
      return {
        ...prev,
        designDetails: {
          ...prev.designDetails,
          sizeQuantities: newSizeQuantities,
          quantity: newTotalQuantity || 1 // Ensure quantity is at least 1
        }
      };
    });
  };

  // Calculate total quantity from size quantities
  const getTotalQuantity = () => {
    if (!formData.designDetails.hasName) {
      return Object.values(formData.designDetails.sizeQuantities).reduce((sum, qty) => sum + qty, 0) || 0;
    }
    return formData.designDetails.quantity;
  };

  const handleSubmit = async () => {
    // Validate phone number before submission
    const isPhoneValid = validatePhone(formData.customerInfo.phone);
    
    // If validation fails, return early and don't submit
    if (!isPhoneValid) {
      // Focus on the phone field to draw attention to the error
      document.getElementById("phone").focus();
      return;
    }
    
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("No user is currently logged in.");
        return;
      }

      const userId = user.uid; // Get the current user's ID
      const uploadedUrls = [];

      // Fetch the image URL from Firestore
      const db = getFirestore(); // Ensure getFirestore is imported and used here
      const requestRef = doc(
        db,
        "users",
        userId,
        "requests",
        `request-${Date.now()}`
      );
      const requestDoc = await getDoc(requestRef);
      if (requestDoc.exists()) {
        const requestData = requestDoc.data();
        if (requestData.imageUrl) {
          uploadedUrls.push(requestData.imageUrl);
        }
      }

      // Include uploadedImages from state
      uploadedImages.forEach((image) => {
        if (typeof image === "string") {
          uploadedUrls.push(image);
        }
      });

      // Run a transaction to get the current order number and increment it
      const newOrderNumber = await runTransaction(db, async (transaction) => {
        const orderCounterRef = doc(db, "counters", "orderCounter");
        const orderCounterDoc = await transaction.get(orderCounterRef);

        if (!orderCounterDoc.exists()) {
          // Create the orderCounter document if it does not exist
          transaction.set(orderCounterRef, { currentOrderNumber: 0 });
          return 1; // Start with order number 1
        }

        const currentOrderNumber = orderCounterDoc.data().currentOrderNumber;
        const newOrderNumber = currentOrderNumber + 1;

        transaction.update(orderCounterRef, {
          currentOrderNumber: newOrderNumber,
        });

        return newOrderNumber;
      });

      // Check for undefined values in formData before sending to Firestore
      const requestData = {
        id: newOrderNumber, // Use the new order number as the unique ID
        customerInfo: formData.customerInfo || "",
        productType: formData.productType || "",
        designDetails: formData.designDetails || "",
        imageUrls: uploadedUrls.length > 0 ? uploadedUrls : [], // Ensure imageUrls is always an array
        timestamp: new Date(),
        status: "Pending Approval", // Add status field
      };

      // Add the request data to Firestore under the user's collection with the newOrderNumber as the document ID
      await setDoc(
        doc(db, "users", userId, "requests", String(newOrderNumber)),
        requestData
      );

      // Delete the temporary database entry
      await deleteDoc(requestRef);

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
    { value: "XS", label: "XS" },
    { value: "S", label: "Small" },
    { value: "M", label: "Medium" },
    { value: "L", label: "Large" },
    { value: "XL", label: "X-Large" },
    { value: "2XL", label: "2X-Large" },
    { value: "3XL", label: "3X-Large" },
  ];

  return (
    <div className="w-full">
      <div className="w-full mt-30 h-30 bg-black"></div>
      <div className="max-w-4xl mx-auto my-20 p-8 bg-white shadow-md rounded-lg">
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
                    ? "text-xs text-gray-500 -top-2 left-2 bg-white px-1 z-20"
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
                    ? "text-xs text-gray-500 -top-2 left-2 bg-white px-1 z-20"
                    : "text-gray-500 top-2 left-2 z-0"
                }`}
              >
                Email
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Phone Field - Modified with validation */}
              <div className="w-full sm:w-1/2 relative mb-4">
                <input
                  id="phone"
                  type="tel"
                  value={formData.customerInfo.phone}
                  onChange={(e) => handleInputChange(e, "phone")}
                  onFocus={() => handleFocus("phone")}
                  onBlur={(e) => handleBlur("phone", e.target.value)}
                  className={`border p-2 rounded w-full z-10 relative bg-transparent ${
                    validationErrors.phone ? "border-red-500" : ""
                  }`}
                  placeholder=" "
                />
                <label
                  htmlFor="phone"
                  className={`absolute transition-all duration-200 pointer-events-none ${
                    focusedFields["phone"] || formData.customerInfo.phone
                      ? `text-xs ${validationErrors.phone ? "text-red-500" : "text-gray-500"} -top-2 left-2 bg-white px-1 z-20`
                      : `${validationErrors.phone ? "text-red-500" : "text-gray-500"} top-2 left-2 z-0`
                  }`}
                >
                  Phone Number
                </label>
                {validationErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
                )}
                <p className="text-gray-400 text-xs mt-1">Format: 09XX-XXX-XXXX (11 digits)</p>
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
                      ? "text-xs text-gray-500 -top-2 left-2 bg-white px-1 z-20"
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
              <span className="text-2xl">
                <img src="/upload_ic.svg" alt="Upload" />{" "}
              </span>
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

            {/* Show uploaded images from CustomProduct */}
            {uploadedImages.length > 0 && (
              <div className="mt-4">
                <p className="text-gray-600">Uploaded Images:</p>
                <div className="flex flex-wrap gap-2">
                  {uploadedImages.map((image, index) => (
                    <img
                      key={index}
                      src={image} // Display the uploaded image
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
            {/* Conditionally render Product Type */}
            {!selectedProduct && (
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
                      ? "text-xs text-gray-500 -top-2 left-2 bg-white px-1 z-20"
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
            )}

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
                      ? "text-xs text-gray-500 -top-2 left-2 bg-white px-1 z-20"
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
                    ? "text-xs text-gray-500 -top-2 left-2 bg-white px-1 z-20"
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
                    ? "text-xs text-gray-500 -top-2 left-2 bg-white px-1 z-20"
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
                onChange={(e) =>
                  handleInputChange(e, "pattern", "designDetails")
                }
                onFocus={() => handleFocus("pattern")}
                onBlur={(e) => handleBlur("pattern", e.target.value)}
                className="border p-2 rounded w-full z-10 relative bg-transparent"
                placeholder=" "
              />
              <label
                htmlFor="pattern"
                className={`absolute transition-all duration-200 pointer-events-none ${
                  focusedFields["pattern"] || formData.designDetails.pattern
                    ? "text-xs text-gray-500 -top-2 left-2 bg-white px-1 z-20"
                    : "text-gray-500 top-2 left-2 z-0"
                }`}
              >
                Pattern Preference
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

            {formData.designDetails.hasName ? (
              <>
                {/* Quantity Field - only visible when "Add Name" is checked */}
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
                      focusedFields["quantity"] ||
                      formData.designDetails.quantity > 0
                        ? "text-xs text-gray-500 -top-2 left-2 bg-white px-1 z-20"
                        : "text-gray-500 top-2 left-2 z-0"
                    }`}
                  >
                    Quantity
                  </label>
                </div>

                {/* Name & Size Fields */}
                {Array.from({ length: formData.designDetails.quantity }).map(
                  (_, i) => (
                    <div key={i} className="flex space-x-2 mb-2">
                      <div className="relative w-1/2">
                        <input
                          type="text"
                          value={formData.designDetails.names[i] || ""}
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
                              ? "text-xs text-gray-500 -top-2 left-2 bg-white px-1 z-20"
                              : "text-gray-500 top-2 left-2 z-0"
                          }`}
                        >
                          Name {i + 1}
                        </label>
                      </div>

                      <div className="relative w-1/2">
                        <select
                          value={formData.designDetails.sizes[i] || ""}
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
                              ? "text-xs text-gray-500 -top-2 left-2 bg-white px-1 z-20"
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
              </>
            ) : (
              /* Bundle Order - Size Quantities (when "Add Name" is not checked) */
              <>
                <div className="mb-4">
                  <h4 className="text-lg font-medium mb-2">Select Quantities by Size</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Please specify the quantity for each size you need.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {AVAILABLE_SIZES.map((size) => (
                      <div key={size} className="relative">
                        <input
                          type="number"
                          min="0"
                          value={formData.designDetails.sizeQuantities[size]}
                          onChange={(e) => handleSizeQuantityChange(size, e.target.value)}
                          onFocus={() => handleFocus(`size-qty-${size}`)}
                          onBlur={(e) => handleBlur(`size-qty-${size}`, e.target.value)}
                          className="border p-2 rounded w-full z-10 relative bg-transparent"
                          placeholder=""
                        />
                        <label
                          className={`absolute transition-all duration-200 pointer-events-none ${
                            focusedFields[`size-qty-${size}`] ||
                            formData.designDetails.sizeQuantities[size] > 0
                              ? "text-xs text-gray-500 -top-2 left-2 bg-white px-1 z-20"
                              : "text-gray-500 top-2 left-2 z-0"
                          }`}
                        >
                          Size {size}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-3 bg-gray-100 rounded-lg mb-4">
                  <p className="font-medium">
                    Total Quantity: {getTotalQuantity()}
                  </p>
                </div>
              </>
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
                onBlur={(e) =>
                  handleBlur("specialInstructions", e.target.value)
                }
                className="border p-2 rounded w-full h-24 z-10 relative bg-transparent"
                placeholder=" "
              ></textarea>
              <label
                htmlFor="specialInstructions"
                className={`absolute transition-all duration-200 pointer-events-none ${
                  focusedFields["specialInstructions"] ||
                  formData.designDetails.specialInstructions
                    ? "text-xs text-gray-500 -top-2 left-2 bg-white px-1 z-20"
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
    </div>
  );
};

export default RequestForm;