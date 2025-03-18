import React, { useState } from 'react';
import { Search, ChevronDown, Star } from 'lucide-react';

const Notification = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, source: 'System', message: 'Your product is on its way. Please ready the payment before receiving the product.', date: 'Feb 21', starred: false },
    { id: 2, source: 'System', message: 'Your product is on its way. Please ready the payment before receiving the product.', date: 'Feb 21', starred: false },
    { id: 3, source: 'System', message: 'Your product is on its way. Please ready the payment before receiving the product.', date: 'Feb 21', starred: false },
    { id: 4, source: 'System', message: 'Your product is on its way. Please ready the payment before receiving the product.', date: 'Feb 21', starred: false },
    { id: 5, source: 'System', message: 'Your product is on its way. Please ready the payment before receiving the product.', date: 'Feb 21', starred: false },
    { id: 6, source: 'System', message: 'Your product is on its way. Please ready the payment before receiving the product.', date: 'Feb 21', starred: false },
    { id: 7, source: 'System', message: 'Your product is on its way. Please ready the payment before receiving the product.', date: 'Feb 21', starred: false },
    { id: 8, source: 'System', message: 'Your product is on its way. Please ready the payment before receiving the product.', date: 'Feb 21', starred: false },
    { id: 9, source: 'System', message: 'Your product is on its way. Please ready the payment before receiving the product.', date: 'Feb 21', starred: false },
    { id: 10, source: 'System', message: 'Your product is on its way. Please ready the payment before receiving the product.', date: 'Feb 21', starred: false },
    { id: 11, source: 'System', message: 'Your product is on its way. Please ready the payment before receiving the product.', date: 'Feb 21', starred: false },
    { id: 12, source: 'System', message: 'Your product is on its way. Please ready the payment before receiving the product.', date: 'Feb 21', starred: false },
    { id: 13, source: 'System', message: 'Your product is on its way. Please ready the payment before receiving the product.', date: 'Feb 21', starred: false },
    { id: 14, source: 'System', message: 'Your product is on its way. Please ready the payment before receiving the product.', date: 'Feb 21', starred: false },
    { id: 15, source: 'System', message: 'Your product is on its way. Please ready the payment before receiving the product.', date: 'Feb 21', starred: false },
  ]);
  
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
  };
  
  const toggleStar = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, starred: !notification.starred } : notification
    ));
  };
  
  return (
    <div className="w-full min-h-screen bg-white">
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8">Notifications</h1>
        
        {/* Top filters and search */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                className="w-4 h-4 border border-gray-300 rounded" 
                checked={selectAll}
                onChange={toggleSelectAll}
              />
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Search size={18} />
              </div>
            </div>
            
            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md">
                <span>Date</span>
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Notifications List */}
        <div className="border border-gray-200 rounded-md overflow-hidden">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className="flex items-center gap-3 p-4 border-b border-gray-200 hover:bg-gray-50"
            >
              <input 
                type="checkbox" 
                className="w-4 h-4 border border-gray-300 rounded" 
                checked={selectAll}
              />
              
              <button 
                className="text-gray-400 hover:text-yellow-500"
                onClick={() => toggleStar(notification.id)}
              >
                <Star 
                  size={18} 
                  fill={notification.starred ? "yellow" : "none"} 
                />
              </button>
              
              <div className="text-sm text-gray-500 w-24">
                {notification.source}
              </div>
              
              <div className="flex-1 text-sm">
                {notification.message}
              </div>
              
              <div className="text-sm text-gray-500">
                {notification.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notification;