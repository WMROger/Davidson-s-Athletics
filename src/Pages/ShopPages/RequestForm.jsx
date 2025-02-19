import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const steps = ["Customer Info", "Product Selection", "Design Details"];

const RequestForm = () => {
  const location = useLocation();
  const selectedProduct = location.state?.selectedProduct || "";

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    customerInfo: { fullName: "", email: "", phone: "", organization: "" },
    productType: selectedProduct, // Pre-fill productType
    designDetails: { hasName: false, quantity: 1, sizes: [], surnames: [] },
  });
  const [errors, setErrors] = useState({});

  // ✅ Handle Input Changes
  const handleInputChange = (e, field, section = "customerInfo") => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: e.target.value },
    }));
  };

  // ✅ Validate Steps
  const validateStep = () => {
    let newErrors = {};
    if (step === 0) {
      if (!formData.customerInfo.fullName) newErrors.fullName = "Full name is required";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.customerInfo.email))
        newErrors.email = "Invalid email";
      if (!/^\+?[0-9]{10,15}$/.test(formData.customerInfo.phone))
        newErrors.phone = "Invalid phone number";
    }
    if (step === 1 && !formData.productType) newErrors.productType = "Please select a product type";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Navigation Buttons
  const nextStep = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-30">
      {/* Breadcrumbs */}
      <nav className="text-gray-500 text-sm mb-4">
        <span className="">Home</span> / <span>Request Form</span> / <span className="cursor-pointer text-blue-500">{steps[step]}</span>
      </nav>
      
      <h2 className="text-xl font-bold mb-4">{steps[step]}</h2>

      {/* Step 1: Customer Info */}
      {step === 0 && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.customerInfo.fullName}
            onChange={(e) => handleInputChange(e, "fullName")}
            className="border p-2 rounded w-full"
          />
          {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}

          <input
            type="email"
            placeholder="Email"
            value={formData.customerInfo.email}
            onChange={(e) => handleInputChange(e, "email")}
            className="border p-2 rounded w-full"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

          <input
            type="tel"
            placeholder="Phone"
            value={formData.customerInfo.phone}
            onChange={(e) => handleInputChange(e, "phone")}
            className="border p-2 rounded w-full"
          />
          {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}

          <input
            type="text"
            placeholder="Organization (Optional)"
            value={formData.customerInfo.organization}
            onChange={(e) => handleInputChange(e, "organization")}
            className="border p-2 rounded w-full"
          />
        </div>
      )}

      {/* Step 2: Product Selection */}
      {step === 1 && (
        <div>
          <select
            value={formData.productType}
            onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Product Type</option>
            <option value="Jersey">Jersey</option>
            <option value="Uniform">Uniform</option>
            <option value="Sleeveless">Sleeveless</option>
            <option value="T-shirts">T-shirts</option>
          </select>
          {errors.productType && <p className="text-red-500 text-xs">{errors.productType}</p>}
        </div>
      )}

      {/* Step 3: Design Details */}
      {step === 2 && (
        <div className="space-y-3">

        <select className="border p-2 rounded w-full">
            <option value="">Select Sport Type</option>
            <option value="Basketball">Basketball</option>
            <option value="Soccer">Soccer</option>
            <option value="Soccer">Volletball</option>
            <option value="Other">Other</option>
         </select>

         <select className="border p-2 rounded w-full">
            <option value="Normal Cut">Normal Cut</option>
            <option value="Amboy Cut">Amboy Cut</option>
            <option value="Nba Cut">Nba Cut</option>
            <option value="V Neck">V Neck</option>
            <option value="Round Neck">Round Neck</option>
         </select>

         <label>Primary Color</label>
          <input type="text" className="border p-2 w-full h-10 rounded" />
          
          <label>Secondary Color</label>
          <input type="text" className="border p-2 w-full h-10 rounded" />
          
          <label>Accent Color</label>
          <input type="text" className="border p-2 w-full h-10 rounded" />


        
          <label>Quantity</label>

          <input
            type="number"
            value={formData.designDetails.quantity}
            onChange={(e) => handleInputChange(e, "quantity", "designDetails")}
            className="border p-2 w-full rounded"
          />

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.designDetails.hasName}
              onChange={(e) =>
                setFormData({ ...formData, designDetails: { ...formData.designDetails, hasName: e.target.checked } })
              }
            />
            <span>Name on Jersey</span>
          </label>

          {Array.from({ length: formData.designDetails.quantity }).map((_, i) => (
            <div key={i} className="flex space-x-2 mt-2">
              {formData.designDetails.hasName && (
                <input
                  type="text"
                  placeholder={`Surname for Jersey ${i + 1}`}
                  className="border p-2 w-1/2 rounded"
                />
              )}
              <select className="border p-2 w-1/2 rounded">
                <option value="">Select Size</option>
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
                <option value="XL">X-Large</option>
              </select>

            

            </div>

            
          ))}
          <label>Special Request</label>
          <input type="textarea" className="border p-2 w-full h-10 rounded" />

          
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        {step > 0 && (
          <button onClick={prevStep} className="bg-gray-400 text-white px-4 py-2 rounded-md">
            Previous
          </button>
        )}
        {step < steps.length - 1 && (
          <button onClick={nextStep} className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Next
          </button>
        )}
        {step === steps.length - 1 && (
          <button className="bg-green-500 text-white px-4 py-2 rounded-md">Submit</button>
        )}
      </div>
    </div>
  );
};

export default RequestForm;
