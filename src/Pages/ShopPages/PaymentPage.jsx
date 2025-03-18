import React, { useState } from "react";
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
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedItems, formData, subtotal, deliveryFee, total } =
    location.state || {
      selectedItems: [],
      formData: {},
      subtotal: 0,
      deliveryFee: 0,
      total: 0,
    };
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

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

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^\d.]/g, "");
    setAmount(value);
  };

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
      setErrorMessage("Please enter a valid payment amount.");
      return;
    }

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
          className="w-full max-w-md rounded-xl shadow-lg overflow-hidden border"
          style={{
            backgroundColor: colors.cardBackground,
            borderColor: colors.borderColor,
          }}
        >
          {/* Header */}
          <div
            className="px-6 py-5"
            style={{ backgroundColor: colors.primary }}
          >
            <div className="flex items-center justify-between">
              <h1
                className="text-xl font-bold"
                style={{ color: colors.lightText }}
              >
                Secure Payment
              </h1>
              <div className="flex items-center space-x-1">
                <span
                  className="text-sm"
                  style={{ color: colors.secondaryText }}
                >
                  Powered by
                </span>
                <div className="rounded-lg px-2 py-1 bg-white">
                  <span className="font-bold text-gray-900">GCash</span>
                </div>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div
              className="mx-6 mt-4 p-3 rounded-lg"
              style={{
                backgroundColor: "rgba(255, 107, 107, 0.1)",
                borderLeft: `4px solid ${colors.errorText}`,
              }}
            >
              <p style={{ color: colors.errorText }}>{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div
              className="mx-6 mt-4 p-3 rounded-lg"
              style={{
                backgroundColor: "rgba(107, 255, 107, 0.1)",
                borderLeft: `4px solid ${colors.accent}`,
              }}
            >
              <p style={{ color: colors.accent }}>{successMessage}</p>
            </div>
          )}

          {step === 1 && (
            <div className="p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: colors.lightText }}
                  >
                    Payment Details
                  </h2>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
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
                      className="text-sm"
                      style={{ color: colors.secondaryText }}
                    >
                      Secure
                    </span>
                  </div>
                </div>
                <p className="text-sm" style={{ color: colors.secondaryText }}>
                  Complete your payment using GCash
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-1"
                      style={{ color: colors.secondaryText }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 transition-colors"
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
                      className="block text-sm font-medium mb-1"
                      style={{ color: colors.secondaryText }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 transition-colors"
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
                      className="block text-sm font-medium mb-1"
                      style={{ color: colors.secondaryText }}
                    >
                      GCash Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span style={{ color: colors.secondaryText }}>+63</span>
                      </div>
                      <input
                        type="tel"
                        id="phoneNumber"
                        className="w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 transition-colors"
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
                      className="mt-1 text-xs"
                      style={{ color: colors.secondaryText }}
                    >
                      Enter the GCash-registered phone number
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium mb-1"
                      style={{ color: colors.secondaryText }}
                    >
                      Payment Amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span style={{ color: colors.secondaryText }}>₱</span>
                      </div>
                      <input
                        type="text"
                        id="amount"
                        className="w-full pl-8 pr-4 py-3 rounded-lg border focus:ring-2 transition-colors"
                        style={{
                          backgroundColor: colors.inputBackground,
                          color: colors.lightText,
                          borderColor: colors.borderColor,
                        }}
                        placeholder="0.00"
                        value={amount}
                        onChange={handleAmountChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="gcashQRCode"
                      className="block text-sm font-medium mb-1"
                      style={{ color: colors.secondaryText }}
                    >
                      GCash QR Code
                    </label>
                    <img
                      src="../../../public/Gcash/GcashQR.jpg"
                      alt="GCash QR Code"
                      className="w-full mb-4"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="receipt"
                      className="block text-sm font-medium mb-1"
                      style={{ color: colors.secondaryText }}
                    >
                      Upload GCash Receipt
                    </label>
                    <input
                      type="file"
                      id="receipt"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 transition-colors"
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
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    className={`w-full font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                      isProcessing ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.lightText,
                      borderColor: colors.borderColor,
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
                </div>
              </form>

              <div className="mt-6 flex items-center justify-center">
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
          )}

          {/* Other steps... */}
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
