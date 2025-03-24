import React, { useState, useRef, useEffect } from "react";
import { db } from "../../Database/firebase"; // Ensure correct path
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedItems = [], formData = {}, subtotal = 0, deliveryFee = 0, total = 0 } = location.state || {};
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  
  // Auto-fill fields with data from checkout when component mounts
  useEffect(() => {
    if (total) {
      setAmount(total.toFixed(2));
    }
    if (formData && formData.email && !email) {
      setEmail(formData.email);
    }
    if (formData && formData.fullName && !name) {
      setName(formData.fullName);
    }
  }, [total, formData, email, name]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const qrCodeRef = useRef(null);

  const colors = {
    primary: "#2C3639",
    darkBackground: "#1A2224",
    cardBackground: "#222A2D",
    inputBackground: "#2C3639",
    accent: "#A5C9CA",
    lightText: "#E7F6F2",
    secondaryText: "#A5C9CA",
    borderColor: "#395B64",
    errorText: "#FF6B6B",
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  // Removed handleAmountChange function since it's no longer needed

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setReceiptFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setReceiptPreview(null);
    }
  };

  const downloadQRCode = () => {
    const qrImage = qrCodeRef.current;
    if (!qrImage) return;
    
    // Create a canvas element
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    
    // Set the canvas dimensions to the image dimensions
    canvas.width = qrImage.naturalWidth;
    canvas.height = qrImage.naturalHeight;
    
    // Draw the image onto the canvas
    context.drawImage(qrImage, 0, 0);
    
    // Convert the canvas to a data URL
    const dataURL = canvas.toDataURL("image/png");
    
    // Create a temporary link and trigger download
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "GCash_QR_Code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getNextOrderId = async () => {
    const counterDocRef = doc(db, "counters", "orderCounter");
    const counterDoc = await getDoc(counterDocRef);

    if (counterDoc.exists()) {
      const currentOrderNumber = counterDoc.data().currentOrderNumber;
      const nextOrderNumber = currentOrderNumber + 1;

      if (nextOrderNumber > 100000) {
        throw new Error("Order ID limit reached");
      }

      await updateDoc(counterDocRef, { currentOrderNumber: nextOrderNumber });
      return nextOrderNumber;
    } else {
      throw new Error("Counter document does not exist");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Payment amount is invalid.");
      return;
    }
    
    // Since amount is now read-only, we don't need to validate it matches the total
    // The validation is kept for system integrity

    if (phoneNumber.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!receiptFile) {
      setErrorMessage("Please upload your GCash receipt.");
      return;
    }

    try {
      setIsProcessing(true);
      console.log("Processing started");

      const orderId = await getNextOrderId();
      console.log("Order ID:", orderId);

      const orderData = {
        orderId,
        ...formData,
        selectedItems,
        subtotal,
        deliveryFee,
        total,
        phoneNumber,
        amount: parsedAmount.toFixed(2),
        receiptFile: receiptFile.name,
        createdAt: new Date(),
      };

      // Retrieve the current highest subcollection ID
      const ordersCollectionRef = collection(db, "orders");
      const ordersSnapshot = await getDocs(ordersCollectionRef);
      const subcollectionId = ordersSnapshot.size + 1;
      console.log("Subcollection ID:", subcollectionId);

      // Add the order with the new subcollection ID
      await setDoc(doc(db, "orders", subcollectionId.toString()), orderData);
      console.log("Order added to Firestore");

      setSuccessMessage("Order successfully uploaded!");
      setTimeout(() => {
        navigate("/Home", { state: { orderId } });
      }, 3000); // Redirect to order confirmation after 3 seconds

      setStep(2);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message);
    } finally {
      setIsProcessing(false);
      console.log("Processing ended");
    }
  };

  return (
    <>
      {/* Top Bar Placeholder */}
      <div className="w-full h-24 bg-black mt-30"></div>
      <div
        className="min-h-screen flex items-center justify-center mt-0 p-4"
        style={{ backgroundColor: colors.darkBackground }}
      >
        <div
          className="w-full max-w-5xl rounded-xl shadow-xl overflow-hidden border"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.borderColor,
          }}
        >
          {/* Header */}
          <div
            className="px-8 py-6"
            style={{ backgroundColor: colors.primary }}
          >
            <div className="flex items-center justify-between">
              <h1
                className="text-2xl font-bold"
                style={{ color: colors.lightText }}
              >
                Secure Payment
              </h1>
              <div className="flex items-center space-x-2">
                <span
                  className="text-base"
                  style={{ color: colors.secondaryText }}
                >
                  Powered by
                </span>
                <div className="rounded-lg px-3 py-1 bg-white">
                  <span className="font-bold text-lg text-gray-900">GCash</span>
                </div>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div
              className="mx-8 mt-5 p-4 rounded-lg"
              style={{
                backgroundColor: "rgba(255, 107, 107, 0.15)",
                borderLeft: `5px solid ${colors.errorText}`,
              }}
            >
              <p style={{ color: colors.errorText, fontSize: "1.05rem" }}>{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div
              className="mx-8 mt-5 p-4 rounded-lg"
              style={{
                backgroundColor: "rgba(107, 255, 107, 0.15)",
                borderLeft: `5px solid ${colors.accent}`,
              }}
            >
              <p style={{ color: colors.accent, fontSize: "1.05rem" }}>{successMessage}</p>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSubmit} className="p-8">
              {/* Two column layout with divider */}
              <div className="flex flex-col md:flex-row">
                {/* Left Column */}
                <div className="w-full md:w-1/2 md:pr-6">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h2
                        className="text-2xl font-semibold"
                        style={{ color: colors.lightText }}
                      >
                        Payment Details
                      </h2>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          style={{ color: colors.accent }}
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span
                          className="text-base"
                          style={{ color: colors.secondaryText }}
                        >
                          Secure
                        </span>
                      </div>
                    </div>
                    <p className="text-base" style={{ color: colors.secondaryText }}>
                      Complete your payment using GCash
                    </p>
                  </div>
                  
                  {/* Order Summary Box */}
                  <div 
                    className="mb-6 p-5 rounded-lg border"
                    style={{ 
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.borderColor
                    }}
                  >
                    <h3 
                      className="text-xl font-medium mb-4"
                      style={{ color: colors.lightText }}
                    >
                      Order Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-base">
                        <span style={{ color: colors.secondaryText }}>Subtotal</span>
                        <span style={{ color: colors.lightText }}>₱{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-base">
                        <span style={{ color: colors.secondaryText }}>Delivery Fee</span>
                        <span style={{ color: colors.lightText }}>₱{deliveryFee.toFixed(2)}</span>
                      </div>
                      <div 
                        className="flex justify-between pt-3 mt-3 border-t"
                        style={{ borderColor: colors.borderColor }}
                      >
                        <span 
                          className="font-medium text-lg"
                          style={{ color: colors.accent }}
                        >
                          Total Amount
                        </span>
                        <span 
                          className="font-bold text-xl"
                          style={{ color: colors.accent }}
                        >
                          ₱{total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-base font-medium mb-2"
                        style={{ color: colors.secondaryText }}
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-5 py-4 text-base rounded-lg border focus:ring-2 transition-colors"
                        style={{
                          backgroundColor: colors.inputBackground,
                          color: colors.lightText,
                          borderColor: colors.borderColor,
                        }}
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-base font-medium mb-2"
                        style={{ color: colors.secondaryText }}
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-5 py-4 text-base rounded-lg border focus:ring-2 transition-colors"
                        style={{
                          backgroundColor: colors.inputBackground,
                          color: colors.lightText,
                          borderColor: colors.borderColor,
                        }}
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phoneNumber"
                        className="block text-base font-medium mb-2"
                        style={{ color: colors.secondaryText }}
                      >
                        GCash Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                          <span className="text-lg flex items-center h-full" style={{ color: colors.secondaryText }}>+63</span>
                        </div>
                        <input
                          type="tel"
                          id="phoneNumber"
                          className="w-full pl-14 pr-5 py-4 text-base rounded-lg border focus:ring-2 transition-colors"
                          style={{
                            backgroundColor: colors.inputBackground,
                            color: colors.lightText,
                            borderColor: colors.borderColor,
                          }}
                          placeholder="9XX XXX XXXX"
                          value={phoneNumber}
                          onChange={handlePhoneNumberChange}
                          maxLength={10}
                          required
                        />
                      </div>
                      <p
                        className="mt-2 text-sm"
                        style={{ color: colors.secondaryText }}
                      >
                        Enter the GCash-registered phone number
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="amount"
                        className="block text-base font-medium mb-2"
                        style={{ color: colors.secondaryText }}
                      >
                        Payment Amount
                      </label>
                      <div className="relative">
                        <div className="absolute top-3.5 left-0 flex items-center pl-6 pointer-events-none">
                          <span className="text-lg flex items-center h-full" style={{ color: colors.secondaryText }}>₱</span>
                        </div>
                        <input
                          type="text"
                          id="amount"
                          className="w-full pl-10 pr-5 py-4 text-base rounded-lg border focus:ring-2 transition-colors font-medium cursor-not-allowed"
                          style={{
                            backgroundColor: colors.inputBackground,
                            color: colors.lightText,
                            borderColor: colors.borderColor,
                            opacity: 0.9
                          }}
                          placeholder={total ? total.toFixed(2) : "0.00"}
                          value={amount}
                          readOnly
                          required
                        />
                        <div className="mt-2 text-sm" style={{ color: colors.secondaryText }}>
                          Fixed amount based on your order total
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Vertical Divider */}
                <div className="hidden md:block w-px bg-opacity-30 mx-4" style={{ backgroundColor: colors.borderColor }}></div>

                {/* Right Column */}
                <div className="w-full md:w-1/2 mt-8 md:mt-0 md:pl-6">
                  <div>
                    <label
                      htmlFor="gcashQRCode"
                      className="block text-base font-medium mb-4"
                      style={{ color: colors.secondaryText }}
                    >
                      GCash QR Code
                    </label>
                    <div className="relative flex flex-col items-center mb-6">
                      <img
                        ref={qrCodeRef}
                        src="../../../public/Gcash/GcashQR.jpg"
                        alt="GCash QR Code"
                        className="w-full max-w-xs mb-4 rounded-lg shadow-md mx-auto"
                      />
                      <button
                        type="button"
                        onClick={downloadQRCode}
                        className="w-full max-w-xs mt-3 text-center py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 shadow-md"
                        style={{
                          backgroundColor: colors.accent,
                          color: colors.primary,
                          fontWeight: "600",
                          fontSize: "1.1rem"
                        }}
                      >
                        <div className="flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Download QR Code
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="receipt"
                      className="block text-base font-medium mb-2"
                      style={{ color: colors.secondaryText }}
                    >
                      Upload GCash Receipt
                    </label>
                    <input
                      type="file"
                      id="receipt"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-5 py-4 text-base rounded-lg border focus:ring-2 transition-colors"
                      style={{
                        backgroundColor: colors.inputBackground,
                        color: colors.lightText,
                        borderColor: colors.borderColor,
                      }}
                      required
                    />
                    {receiptPreview && (
                      <div className="mt-4">
                        <p
                          className="text-sm"
                          style={{ color: colors.secondaryText }}
                        >
                          Receipt Preview:
                        </p>
                        <img
                          src={receiptPreview}
                          alt="Receipt Preview"
                          className="w-full h-auto mt-2 rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className={`w-full font-medium py-4 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 shadow-lg mb-4 ${
                      isProcessing ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.lightText,
                      borderColor: colors.borderColor,
                      fontSize: "1.1rem"
                    }}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          style={{ color: colors.lightText }}
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Continue"
                    )}
                  </button>

                  <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        style={{ color: colors.secondaryText }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span
                        className="text-xs"
                        style={{ color: colors.secondaryText }}
                      >
                        Secure 256-bit SSL encrypted payment
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentPage;