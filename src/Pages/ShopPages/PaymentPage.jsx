import React, { useState } from "react";
import axios from "axios"; // You'll need to install axios for API requests

const PaymentPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionId, setTransactionId] = useState("");

  // Color palette based on #2C3639
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
    // Only allow numbers and limit to 11 digits (Philippines format)
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      setPhoneNumber(value);
    }
  };

  const handleAmountChange = (e) => {
    // Only allow valid currency input
    const value = e.target.value.replace(/[^\d.]/g, "");
    setAmount(value);
  };

  const formatPhoneNumber = (value) => {
    if (!value) return "";

    const digits = value.replace(/\D/g, "");
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`;
  };

  // Initialize GCash payment
  const initializePayment = async (paymentData) => {
    setIsProcessing(true);
    setErrorMessage("");

    try {
      // Replace with your actual GCash API endpoint
      const response = await axios.post(
        "https://api.gcash.com/checkout/payment",
        paymentData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_GCASH_API_KEY}`, // Store API key in environment variables
          },
        }
      );

      // Handle successful response
      if (response.data && response.data.status === "success") {
        setTransactionId(response.data.transactionId);

        // For redirect flow (if GCash requires redirecting the customer)
        if (response.data.checkoutUrl) {
          setPaymentUrl(response.data.checkoutUrl);
        }

        setStep(2); // Move to confirmation step
      } else {
        throw new Error(
          response.data.message || "Failed to initialize payment"
        );
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      setErrorMessage(
        error.message ||
          "Failed to connect to payment service. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Check payment status with GCash
  const checkPaymentStatus = async (txnId) => {
    setIsProcessing(true);

    try {
      // Replace with your actual GCash API endpoint for status check
      const response = await axios.get(
        `https://api.gcash.com/checkout/status/${txnId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_GCASH_API_KEY}`,
          },
        }
      );

      if (response.data && response.data.status === "COMPLETED") {
        // Payment was successful
        setStep(3); // Show success screen
      } else if (response.data && response.data.status === "FAILED") {
        // Payment failed
        setErrorMessage("Payment was not successful. Please try again.");
        setStep(1); // Return to payment form
      } else {
        // Payment is still processing or in another state
        setErrorMessage(
          "Payment status is pending. Please check your GCash app for details."
        );
      }
    } catch (error) {
      console.error("Payment status check error:", error);
      setErrorMessage(
        "Failed to verify payment status. Please check your GCash app."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate amount is a number and greater than 0
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Please enter a valid payment amount.");
      return;
    }

    // Validate phone number
    if (phoneNumber.length !== 11) {
      setErrorMessage("Please enter a valid 11-digit phone number.");
      return;
    }

    // Prepare data for GCash API
    const paymentData = {
      amount: parsedAmount.toFixed(2),
      description: `Payment from ${name}`,
      customerId: phoneNumber,
      customerEmail: email,
      customerName: name,
      currency: "PHP",
      redirectUrl: window.location.origin + "/payment/callback", // URL where GCash will redirect after payment
      callbackUrl: process.env.REACT_APP_CALLBACK_URL, // Your server endpoint to receive webhook notifications
      metadata: {
        orderId: "ORD-" + Date.now(),
      },
    };

    // Call the GCash API
    initializePayment(paymentData);
  };

  const handleConfirmation = () => {
    // For direct API flow, process the payment directly
    if (transactionId) {
      checkPaymentStatus(transactionId);
    }
    // For redirect flow, redirect the user to GCash
    else if (paymentUrl) {
      window.location.href = paymentUrl;
    } else {
      setErrorMessage("Payment information missing. Please try again.");
      setStep(1); // Return to payment form
    }
  };

  // Component rendering (similar to your original code, with API-related UI changes)
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
                      "Pay with GCash"
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

          {step === 2 && (
            <div className="p-6">
              <div className="text-center mb-6">
                <div
                  className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: colors.primary }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: colors.accent }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2
                  className="text-xl font-semibold"
                  style={{ color: colors.lightText }}
                >
                  Payment Confirmation
                </h2>
                <p className="mt-1" style={{ color: colors.secondaryText }}>
                  Please confirm your payment details
                </p>
              </div>

              <div
                className="rounded-lg p-4 mb-6 border"
                style={{
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.borderColor,
                }}
              >
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span style={{ color: colors.secondaryText }}>
                      GCash Number:
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: colors.lightText }}
                    >
                      +63 {formatPhoneNumber(phoneNumber)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: colors.secondaryText }}>Amount:</span>
                    <span
                      className="font-medium"
                      style={{ color: colors.lightText }}
                    >
                      ₱{parseFloat(amount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: colors.secondaryText }}>Name:</span>
                    <span
                      className="font-medium"
                      style={{ color: colors.lightText }}
                    >
                      {name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: colors.secondaryText }}>Email:</span>
                    <span
                      className="font-medium"
                      style={{ color: colors.lightText }}
                    >
                      {email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: colors.secondaryText }}>Fee:</span>
                    <span
                      className="font-medium"
                      style={{ color: colors.lightText }}
                    >
                      ₱0.00
                    </span>
                  </div>
                  <div
                    className="pt-2 border-t flex justify-between"
                    style={{ borderColor: colors.borderColor }}
                  >
                    <span
                      className="font-medium"
                      style={{ color: colors.secondaryText }}
                    >
                      Total:
                    </span>
                    <span
                      className="font-bold"
                      style={{ color: colors.accent }}
                    >
                      ₱{parseFloat(amount).toFixed(2)}
                    </span>
                  </div>
                  <div className="pt-2">
                    <span
                      className="text-xs"
                      style={{ color: colors.secondaryText }}
                    >
                      Transaction ID: {transactionId || "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleConfirmation}
                  className={`w-full font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                    isProcessing ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.lightText,
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
                  ) : paymentUrl ? (
                    "Proceed to GCash Payment"
                  ) : (
                    "Confirm and Pay"
                  )}
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="w-full font-medium py-3 px-4 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "transparent",
                    color: colors.secondaryText,
                    borderColor: colors.borderColor,
                  }}
                  disabled={isProcessing}
                >
                  Back to Edit
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-6">
              <div className="text-center mb-6">
                <div
                  className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: colors.primary }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: "#4CAF50" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2
                  className="text-xl font-semibold"
                  style={{ color: colors.lightText }}
                >
                  Payment Successful!
                </h2>
                <p className="mt-1" style={{ color: colors.secondaryText }}>
                  Your transaction has been completed
                </p>
              </div>

              <div
                className="rounded-lg p-4 mb-6 border"
                style={{
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.borderColor,
                }}
              >
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span style={{ color: colors.secondaryText }}>
                      Transaction ID:
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: colors.lightText }}
                    >
                      {transactionId ||
                        `GC${Math.random()
                          .toString(36)
                          .substring(2, 10)
                          .toUpperCase()}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: colors.secondaryText }}>
                      Amount Paid:
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: colors.lightText }}
                    >
                      ₱{parseFloat(amount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: colors.secondaryText }}>
                      Payment Method:
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: colors.lightText }}
                    >
                      GCash
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: colors.secondaryText }}>Date:</span>
                    <span
                      className="font-medium"
                      style={{ color: colors.lightText }}
                    >
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => {
                    setStep(1);
                    setAmount("");
                    setPhoneNumber("");
                    setEmail("");
                    setName("");
                    setTransactionId("");
                    setPaymentUrl("");
                    setErrorMessage("");
                  }}
                  className="w-full font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.lightText,
                  }}
                >
                  Make Another Payment
                </button>
                <button
                  onClick={() => {
                    // Logic to download receipt or redirect to receipt page
                    alert(
                      "Receipt download functionality will be implemented with GCash API"
                    );
                  }}
                  className="w-full font-medium py-3 px-4 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "transparent",
                    color: colors.secondaryText,
                    borderColor: colors.borderColor,
                  }}
                >
                  Download Receipt
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div
            className="px-6 py-4 border-t"
            style={{
              backgroundColor: colors.darkBackground,
              borderColor: colors.borderColor,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
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
                  Secured by SSL
                </span>
              </div>
              <div className="text-xs" style={{ color: colors.secondaryText }}>
                © {new Date().getFullYear()} Payment Services
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
