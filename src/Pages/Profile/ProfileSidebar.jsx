import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ProfileSidebar = () => {
  const location = useLocation();
  
  return (
    <div className="w-48 p-4 border-r border-gray-200">
      {/* Profile icon and name */}
      <div className="flex items-center mb-6">
        <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
          <img src="/api/placeholder/32/32" alt="Profile" />
        </div>
        <span className="ml-2 text-sm font-medium">Ari Jacob Necesario</span>
      </div>
      
      {/* Navigation items */}
      <nav className="space-y-2">
        <Link 
          to="/profile" 
          className={`flex items-center py-2 text-sm ${location.pathname === '/profile' ? 'font-medium' : ''}`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <span>My Account</span>
        </Link>
        <Link 
          to="/purchases" 
          className={`flex items-center py-2 text-sm ${location.pathname === '/purchases' ? 'font-medium' : ''}`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          <span>My Purchase</span>
        </Link>
      </nav>
    </div>
  );
};

export default ProfileSidebar;