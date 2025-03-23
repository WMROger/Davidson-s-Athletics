import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const TermsConditionsPopup = ({ isOpen, onClose, isChecked, onCheckChange }) => {
  const modalRef = useRef(null);

  // Close when clicking outside or pressing Escape key
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.addEventListener('mousedown', handleOutsideClick);
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Function to handle checkbox and close popup
  const handleAcceptAndClose = () => {
    // Check the box if it's not already checked
    if (!isChecked) {
      onCheckChange({ target: { checked: true } });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto mx-4"
      >
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">Terms and Conditions</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
            aria-label="Close"
          >
            <X size={30} />
          </button>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-3">1. Introduction</h3>
          <p className="mb-4">
            Welcome to our website. These terms and conditions outline the rules and regulations for 
            the use of our Company's website. By accessing this website, we assume you accept these 
            terms and conditions in full. Do not continue to use our website if you do not accept all 
            of the terms and conditions stated on this page.
          </p>
          
          <h3 className="text-lg font-semibold mb-3">2. Intellectual Property Rights</h3>
          <p className="mb-4">
            Unless otherwise stated, we or our licensors own the intellectual property rights for
            all material on our website. All intellectual property rights are reserved. You may view
            and/or print pages from the website for your own personal use subject to restrictions set in
            these terms and conditions.
          </p>
          
          <h3 className="text-lg font-semibold mb-3">3. Restrictions</h3>
          <p className="mb-4">
            You are specifically restricted from:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Publishing any website material in any media;</li>
            <li>Selling, sublicensing and/or otherwise commercializing any website material;</li>
            <li>Publicly performing and/or showing any website material;</li>
            <li>Using this website in any way that is, or may be, damaging to this website;</li>
            <li>Using this website in any way that impacts user access to this website;</li>
          </ul>
          
          <h3 className="text-lg font-semibold mb-3">4. Your Privacy</h3>
          <p className="mb-4">
            Please read our Privacy Policy, which also governs your visit to our website, to 
            understand our practices.
          </p>
          
          <h3 className="text-lg font-semibold mb-3">5. Delivery Policy</h3>
          <p className="mb-4">
            Our delivery policy outlines the delivery methods, timeframes, and charges that apply
            to orders placed through our website. Standard delivery typically takes 3-5 business days.
          </p>
          
          <h3 className="text-lg font-semibold mb-3">6. Return Policy</h3>
          <p className="mb-4">
            We accept returns within 14 days of delivery for items that are in their original condition.
            Please contact our customer service team to initiate a return.
          </p>
          
          <h3 className="text-lg font-semibold mb-3">7. Governing Law</h3>
          <p className="mb-6">
            These terms and conditions are governed by and construed in accordance with the laws of 
            our country and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 border-t pt-4">
            <label className="flex items-center mb-4 sm:mb-0">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={onCheckChange}
                className="w-4 h-4 mr-2"
              />
              <span className="text-sm">I have read and agree to the Terms and Conditions</span>
            </label>
            
            <button 
              onClick={handleAcceptAndClose}
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionsPopup;