import React from 'react';
import { ShoppingCart } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';

const ProfileSidebar = ({ name }) => {
  const location = useLocation();
  
  return (
    <div className="w-1/6 p-4 border-gray-200 my-10">
      {/* Profile icon and name */}
      <div className="flex items-center mb-6">
        <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden">
          <img src="/api/placeholder/32/32" alt="Profile" />
        </div>
        <span className="ml-3 text-xl font-medium">{name}</span>
      </div>
      
      {/* Navigation items */}
      <nav className="space-y-1">
        <div className="flex items-center py-2 text-sm">
          <svg className="size-8 mr-2" fill="black" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <Link 
            to="/Profile/ProfilePage"
            className={`text-lg ${location.pathname === '/profile' ? 'font-medium' : ''}`}
          >
            My Account
          </Link>
        </div>
        <div className="flex items-center py-2 text-sm">
          <ShoppingCart className="size-8 mr-2" />
          <Link 
            to="/Profile/Purchase" 
            className={`text-lg ${location.pathname === '/purchases' ? 'font-medium' : ''}`}
          >
            My Purchase
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default ProfileSidebar;