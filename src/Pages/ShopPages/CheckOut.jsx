import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { db } from '../../Database/firebase'; // Ensure correct path
import { collection, addDoc } from 'firebase/firestore';
import TermsConditionsPopup from './T&C'; // Import the Terms popup component

// Custom CSS for carousel buttons
const customCarouselStyles = `
  .carousel-container {
    position: relative;
  }
  
  .carousel-container .react-multiple-carousel__arrow {
    display: none;
  }
  
  .carousel-container:hover .react-multiple-carousel__arrow {
    display: block;
  }
  
  .react-multiple-carousel__arrow {
    min-width: 30px;
    min-height: 30px;
  }
  
  .react-multiple-carousel__arrow::before {
    font-size: 14px;
  }
`;

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] };

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    shippingMethod: 'delivery'
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [phoneError, setPhoneError] = useState("");
  // Add state for the Terms and Conditions popup
  const [isTermsPopupOpen, setIsTermsPopupOpen] = useState(false);

  useEffect(() => {
    const { fullName, email, phoneNumber, address, shippingMethod } = formData;
    const isPhoneValid = phoneNumber.trim().length === 11 && /^\d+$/.test(phoneNumber);
    
    if (phoneNumber.trim() !== '' && !isPhoneValid) {
      setPhoneError("Phone number must be exactly 11 digits");
    } else {
      setPhoneError("");
    }
    
    setIsFormValid(
      fullName.trim() !== '' &&
      email.trim() !== '' &&
      isPhoneValid &&
      address.trim() !== '' &&
      shippingMethod.trim() !== '' &&
      isTermsChecked
    );
  }, [formData, isTermsChecked]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For phone number, only allow digits and max 11 characters
    if (name === 'phoneNumber') {
      const digitsOnly = value.replace(/\D/g, '');
      setFormData((prevData) => ({ 
        ...prevData, 
        [name]: digitsOnly.slice(0, 11)
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleTermsChange = (e) => {
    setIsTermsChecked(e.target.checked);
  };

  // Function to open the Terms popup
  const handleOpenTermsPopup = (e) => {
    e.preventDefault(); // Prevent default link behavior
    setIsTermsPopupOpen(true);
  };

  // Function to close the Terms popup
  const handleCloseTermsPopup = () => {
    setIsTermsPopupOpen(false);
  };

  const handleProceed = () => {
    // Navigate to payment page with selectedItems and formData
    navigate('/ShopPages/PaymentPage', { state: { selectedItems, formData, subtotal, deliveryFee, total, shippingMethod: formData.shippingMethod } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage("");

    // Navigate to payment page with selectedItems and formData
    navigate('/ShopPages/PaymentPage', { state: { selectedItems, formData, subtotal, deliveryFee, total, shippingMethod: formData.shippingMethod } });
  };

  const deliveryFee = 50; // Example delivery fee
  const subtotal = selectedItems.reduce((acc, item) => acc + ((item.price || 380) * (item.quantity || 1)), 0);
  const total = subtotal + deliveryFee;

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 1
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 1
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  return (
    <div className="min-h-screen bg-white mt-30">
      {/* Inject custom carousel styles */}
      <style>{customCarouselStyles}</style>
      
      {/* Terms and Conditions Popup - Added isChecked and onCheckChange props */}
      <TermsConditionsPopup 
        isOpen={isTermsPopupOpen} 
        onClose={handleCloseTermsPopup}
        isChecked={isTermsChecked}
        onCheckChange={handleTermsChange}
      />
      
      {/* Header */}
      <header className="border-b border-gray-200 py-4 px-6">
        <div className="container flex justify-end items-center">
          {/* Progress indicator */}
          <div className="flex items-center mr-4 md:mr-40">
            <div className="flex items-center">
              <div className="w-12 h-12 md:w-10 md:h-10 bg-green-500 text-white rounded-full flex items-center justify-center">
                <Check size={30} />
              </div>
              <span className="ml-2 md:ml-4 text-base md:text-lg font-medium">Review</span>
            </div>
            <div className="w-8 md:w-16 h-px bg-gray-300 mx-2"></div>
            <div className="flex items-center">
              <div className="w-12 h-12 md:w-10 md:h-10 bg-gray-800 text-white rounded-full flex items-center justify-center">
                <span className="text-2xl font-medium">2</span>
              </div>
              <span className="ml-2 text-2xl font-medium">Checkout</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content - Two-column layout */}
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row">
          {/* Left column - Shipping Information */}
          <div className="w-full md:w-2/3 p-4 md:p-6 border-r border-gray-200">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">Checkout</h1>
            
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-medium mb-4">Shipping Information</h2>
              
              <div className="flex gap-4 mb-4 w-full md:w-3/4">
                <label className="border border-gray-300 rounded-md px-3 py-2 flex items-center gap-2 flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="delivery"
                    checked={formData.shippingMethod === 'delivery'}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-600 text-sm md:text-base flex items-center">
                    <img src="/Delivery_ic.svg" alt="Delivery Icon" className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                    Delivery
                  </span>
                </label>

                <label className="border border-gray-300 rounded-md px-3 py-2 flex items-center gap-2 flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="pickup"
                    checked={formData.shippingMethod === 'pickup'}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-600 text-sm md:text-base flex items-center">
                    <img src="/Pickup_ic.svg" alt="Pickup Icon" className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                    Pick Up
                  </span>
                </label>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm md:text-base font-medium mb-1">
                  Full name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder='Enter Full Name'
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full md:w-3/4 px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm md:text-base font-medium mb-1">
                  Email address<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder='Enter Email Address'
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full md:w-3/4 px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm md:text-base font-medium mb-1">
                  Phone Number<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full md:w-3/4 px-3 py-2 border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  placeholder="11-digit phone number"
                  maxLength="11"
                  required
                />
                {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm md:text-base font-medium mb-1">
                  Address<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder='Enter Address'
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full md:w-3/4 px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mr-2"
                    checked={isTermsChecked}
                    onChange={handleTermsChange}
                  />
                  <span className="text-sm md:text-base">
                    I have read the <a href="#" onClick={handleOpenTermsPopup} className="underline text-blue-600 hover:text-blue-800">Terms and Conditions</a>.
                  </span>
                </label>
              </div>

             
              {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
              {successMessage && <p className="text-green-500 text-center mt-4">{successMessage}</p>}
            </form>
          </div>
          
          {/* Right column - Review Cart */}
          <div className="w-full md:w-1/2 p-4 md:p-6 mt-2">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Review your cart</h2>
            
            <div className="max-w-full overflow-hidden">
              <Carousel 
                responsive={responsive}
                containerClass="carousel-container"
                itemClass="px-2"
                ssr={true}
              >
                {selectedItems.map((item, index) => (
                  <div key={index} className="bg-gray-100 rounded-lg p-4 mb-4">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      {/* Slightly bigger image container */}
                      <div className="w-full md:w-2/5 max-h-40 overflow-hidden flex items-center justify-center">
                        <img 
                          src={item.imageUrl || item.imageUrls?.[0] || '/placeholder.png'}
                          alt={item.productName}
                          className="object-contain h-40 max-w-full"
                        />
                      </div>
                      <div className="w-full md:w-3/5 space-y-2">
                        <p className="font-medium text-base">{item.productName}</p>
                        <div className="flex justify-between text-sm">
                          <span>Price:</span>
                          <span>₱{(item.price || 380).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Quantity:</span>
                          <span>{item.quantity || 1}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-300 mt-1">
                          <span>Subtotal:</span>
                          <span>₱{((item.price || 380) * (item.quantity || 1)).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
            
            <div className="space-y-2 mb-6 mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm md:text-base">
                <span>Subtotal</span>
                <span>₱{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm md:text-base">
                <span>Delivery Fee</span>
                <span>₱{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base md:text-lg pt-2 border-t border-gray-300 mt-2">
                <span>Total</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button 
                className={`w-full md:w-3/4 lg:w-4/5 py-2 md:py-3 rounded-xl font-medium text-base md:text-lg ${isFormValid ? 'bg-black text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                onClick={handleProceed}
                disabled={!isFormValid}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;