import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, MoreHorizontal, Check, X, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

const OrdersManagement = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Dropdown state management
  const [openDropdown, setOpenDropdown] = useState(null);
  
  // Refs for dropdown elements
  const typeDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);
  const dateDropdownRef = useRef(null);
  
  const itemsPerPage = 7;
  
  // Handle outside click to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdown === 'type' && 
        typeDropdownRef.current && 
        !typeDropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      } else if (
        openDropdown === 'status' && 
        statusDropdownRef.current && 
        !statusDropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      } else if (
        openDropdown === 'date' && 
        dateDropdownRef.current && 
        !dateDropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);
  
  // Toggle dropdown function
  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };
  
  // Expanded orders array with more items for pagination
  const allOrders = [
    { id: '#102328', customer: 'Ari Necesario', type: 'Delivery', status: 'Paid', products: ['yellow', 'black'], total: '₱850.00', date: 'Feb 11', dateValue: '2025-02-11' },
    { id: '#102329', customer: 'Ari Necesario', type: 'Pickup', status: 'Paid', products: ['yellow', 'black'], total: '₱850.00', date: 'Feb 11', dateValue: '2025-02-11' },
    { id: '#102330', customer: 'Ari Necesario', type: 'Delivery', status: 'Paid', products: ['yellow', 'black'], total: '₱850.00', date: 'Feb 12', dateValue: '2025-02-12' },
    { id: '#102331', customer: 'Ari Necesario', type: 'Pickup', status: 'Paid', products: ['yellow', 'black'], total: '₱850.00', date: 'Feb 12', dateValue: '2025-02-12' },
    { id: '#102332', customer: 'Ari Necesario', type: 'Pickup', status: 'Paid', products: ['yellow', 'black'], total: '₱850.00', date: 'Feb 13', dateValue: '2025-02-13' },
    { id: '#102333', customer: 'Ari Necesario', type: 'Delivery', status: 'Cancelled', products: ['yellow', 'black'], total: '₱850.00', date: 'Feb 13', dateValue: '2025-02-13' },
    { id: '#102334', customer: 'Ari Necesario', type: 'Pickup', status: 'Paid', products: ['yellow', 'black'], total: '₱850.00', date: 'Feb 14', dateValue: '2025-02-14' },
    { id: '#102335', customer: 'Ari Necesario', type: 'Delivery', status: 'Returned', products: ['yellow', 'black'], total: '₱850.00', date: 'Feb 14', dateValue: '2025-02-14' },
    { id: '#102336', customer: 'Ari Necesario', type: 'Delivery', status: 'Paid', products: ['yellow', 'black'], total: '₱850.00', date: 'Feb 15', dateValue: '2025-02-15' },
    { id: '#102337', customer: 'Ari Necesario', type: 'Delivery', status: 'Paid', products: ['yellow', 'black'], total: '₱850.00', date: 'Feb 15', dateValue: '2025-02-15' },
    { id: '#102338', customer: 'Ari Necesario', type: 'Delivery', status: 'Paid', products: ['yellow', 'black'], total: '₱850.00', date: 'Feb 16', dateValue: '2025-02-16' },
    { id: '#102339', customer: 'Ari Necesario', type: 'Pickup', status: 'Cancelled', products: ['yellow', 'black'], total: '₱850.00', date: 'Feb 16', dateValue: '2025-02-16' },
    { id: '#102340', customer: 'Ari Necesario', type: 'Delivery', status: 'Returned', products: ['yellow', 'black'], total: '₱850.00', date: 'Feb 17', dateValue: '2025-02-17' },
    { id: '#102341', customer: 'Ari Necesario', type: 'Pickup', status: 'Paid', products: ['yellow', 'black'], total: '₱850.00', date: 'Feb 17', dateValue: '2025-02-17' },
    { id: '#102342', customer: 'Ari Necesario', type: 'Delivery', status: 'Paid', products: ['yellow', 'black'], total: '₱850.00', date: 'Feb 18', dateValue: '2025-02-18' },
    { id: '#102343', customer: 'Ari Necesario', type: 'Pickup', status: 'Paid', products: ['yellow', 'black'], total: '₱850.00', date: 'Feb 18', dateValue: '2025-02-18' },
    { id: '#102344', customer: 'Ari Necesario', type: 'Delivery', status: 'Cancelled', products: ['yellow', 'black'], total: '₱850.00', date: 'Feb 19', dateValue: '2025-02-19' },
    { id: '#102345', customer: 'Ari Necesario', type: 'Pickup', status: 'Returned', products: ['yellow', 'black'], total: '₱850.00', date: 'Feb 19', dateValue: '2025-02-19' },
    { id: '#102346', customer: 'Ari Necesario', type: 'Delivery', status: 'Paid', products: ['yellow', 'black'], total: '₱850.00', date: 'Feb 20', dateValue: '2025-02-20' },
    { id: '#102347', customer: 'Ari Necesario', type: 'Pickup', status: 'Paid', products: ['yellow', 'black'], total: '₱850.00', date: 'Feb 20', dateValue: '2025-02-20' },
    { id: '#102348', customer: 'Ari Necesario', type: 'Delivery', status: 'Paid', products: ['yellow', 'black'], total: '₱850.00', date: 'Feb 21', dateValue: '2025-02-21' },
    { id: '#102349', customer: 'Ari Necesario', type: 'Pickup', status: 'Cancelled', products: ['yellow', 'black'], total: '₱850.00', date: 'Feb 21', dateValue: '2025-02-21' },
    { id: '#102350', customer: 'Ari Necesario', type: 'Delivery', status: 'Returned', products: ['yellow', 'black'], total: '₱850.00', date: 'Feb 22', dateValue: '2025-02-22' },
    { id: '#102351', customer: 'Ari Necesario', type: 'Pickup', status: 'Paid', products: ['yellow', 'black'], total: '₱850.00', date: 'Feb 22', dateValue: '2025-02-22' },
  ];

  // Get unique dates for the date filter
  const uniqueDates = [...new Set(allOrders.map(order => order.date))];

  // Filter orders based on selected filters
  const filteredOrders = allOrders.filter(order => {
    return (
      (typeFilter === '' || order.type === typeFilter) &&
      (statusFilter === '' || order.status === statusFilter) &&
      (dateFilter === '' || order.date === dateFilter) &&
      (searchQuery === '' || 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const orders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Handle filter changes
  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1); // Reset to first page when filter changes
    setOpenDropdown(null); // Close dropdown after selection
  };

  // Handle page changes
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate pagination links with truncation
  const getPaginationLinks = () => {
    const maxVisiblePages = 5; // Maximum number of page links to show
    const links = [];
    
    if (totalPages <= maxVisiblePages) {
      // If we have fewer pages than our maximum, show all pages
      for (let i = 1; i <= totalPages; i++) {
        links.push(i);
      }
    } else {
      // Always show first page
      links.push(1);
      
      // Calculate the range around the current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust the range to show at most maxVisiblePages - 2 pages (excluding first and last)
      if (endPage - startPage + 1 < maxVisiblePages - 2) {
        if (startPage === 2) {
          endPage = Math.min(totalPages - 1, startPage + (maxVisiblePages - 3));
        } else if (endPage === totalPages - 1) {
          startPage = Math.max(2, endPage - (maxVisiblePages - 3));
        }
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        links.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        links.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        links.push('...');
      }
      
      // Always show last page
      links.push(totalPages);
    }
    
    return links;
  };

  const toggleOrderSelection = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const StatusIcon = ({ status }) => {
    if (status === 'Paid') {
      return <Check className="w-4 h-4 text-green-500 mr-1" />;
    } else if (status === 'Cancelled') {
      return <X className="w-4 h-4 text-red-500 mr-1" />;
    } else if (status === 'Returned') {
      return <RotateCcw className="w-4 h-4 text-gray-500 mr-1" />;
    }
    return null;
  };

  const getStatusColor = (status) => {
    if (status === 'Paid') return 'text-green-500';
    if (status === 'Cancelled') return 'text-red-500';
    if (status === 'Returned') return 'text-gray-500';
    return '';
  };

  // Handle keyboard navigation for dropdowns
  const handleDropdownKeyDown = (e, dropdownName, dropdownItems, currentIndex, handleSelect) => {
    if (e.key === 'Escape') {
      setOpenDropdown(null);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentIndex < dropdownItems.length - 1) {
        const nextItem = dropdownItems[currentIndex + 1];
        handleSelect(nextItem);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentIndex > 0) {
        const prevItem = dropdownItems[currentIndex - 1];
        handleSelect(prevItem);
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpenDropdown(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-6xl font-bold mb-6">Orders</h1>
        
        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
          <div className="flex flex-wrap gap-2">
            {/* Type Filter Dropdown */}
            <div className="relative" ref={typeDropdownRef}>
              <div className="inline-block">
                <button 
                  className="px-4 py-2 bg-black text-white rounded-full flex items-center"
                  onClick={() => toggleDropdown('type')}
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'type'}
                  aria-label="Filter by type"
                >
                  {typeFilter || 'Type'} <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {openDropdown === 'type' && (
                  <div className="absolute mt-1 w-40 bg-white rounded-lg shadow-lg z-10">
                    <ul className="py-1" role="menu">
                      <li 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
                        onClick={() => handleFilterChange(setTypeFilter, '')}
                        role="menuitem"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleFilterChange(setTypeFilter, '');
                          }
                        }}
                      >
                        All
                      </li>
                      <li 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
                        onClick={() => handleFilterChange(setTypeFilter, 'Delivery')}
                        role="menuitem"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleFilterChange(setTypeFilter, 'Delivery');
                          }
                        }}
                      >
                        Delivery
                      </li>
                      <li 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
                        onClick={() => handleFilterChange(setTypeFilter, 'Pickup')}
                        role="menuitem"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleFilterChange(setTypeFilter, 'Pickup');
                          }
                        }}
                      >
                        Pickup
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {/* Status Filter Dropdown */}
            <div className="relative" ref={statusDropdownRef}>
              <div className="inline-block">
                <button 
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full flex items-center"
                  onClick={() => toggleDropdown('status')}
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'status'}
                  aria-label="Filter by status"
                >
                  {statusFilter || 'Status'} <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {openDropdown === 'status' && (
                  <div className="absolute mt-1 w-40 bg-white rounded-lg shadow-lg z-10">
                    <ul className="py-1" role="menu">
                      <li 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
                        onClick={() => handleFilterChange(setStatusFilter, '')}
                        role="menuitem"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleFilterChange(setStatusFilter, '');
                          }
                        }}
                      >
                        All
                      </li>
                      <li 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
                        onClick={() => handleFilterChange(setStatusFilter, 'Paid')}
                        role="menuitem"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleFilterChange(setStatusFilter, 'Paid');
                          }
                        }}
                      >
                        Paid
                      </li>
                      <li 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
                        onClick={() => handleFilterChange(setStatusFilter, 'Cancelled')}
                        role="menuitem"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleFilterChange(setStatusFilter, 'Cancelled');
                          }
                        }}
                      >
                        Cancelled
                      </li>
                      <li 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
                        onClick={() => handleFilterChange(setStatusFilter, 'Returned')}
                        role="menuitem"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleFilterChange(setStatusFilter, 'Returned');
                          }
                        }}
                      >
                        Returned
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {/* Date Filter Dropdown */}
            <div className="relative" ref={dateDropdownRef}>
              <div className="inline-block">
                <button 
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full flex items-center"
                  onClick={() => toggleDropdown('date')}
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'date'}
                  aria-label="Filter by date"
                >
                  {dateFilter || 'Date'} <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {openDropdown === 'date' && (
                  <div className="absolute mt-1 w-40 bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    <ul className="py-1" role="menu">
                      <li 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
                        onClick={() => handleFilterChange(setDateFilter, '')}
                        role="menuitem"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleFilterChange(setDateFilter, '');
                          }
                        }}
                      >
                        All
                      </li>
                      {uniqueDates.map((date, index) => (
                        <li 
                          key={index} 
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
                          onClick={() => handleFilterChange(setDateFilter, date)}
                          role="menuitem"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleFilterChange(setDateFilter, date);
                            }
                          }}
                        >
                          {date}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
              className="px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-full w-64"
              aria-label="Search orders"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>
        
        {/* Order Count Display */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
          {(typeFilter || statusFilter || dateFilter || searchQuery) && (
            <span> (filtered from {allOrders.length} total orders)</span>
          )}
        </div>
        
        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-wrap">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300"
                      aria-label="Select all orders" 
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Order</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Product</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                          aria-label={`Select order ${order.id}`}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{order.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mr-2">
                            <img src="/api/placeholder/32/32" alt="User" className="h-8 w-8 object-cover" />
                          </div>
                          <span className="text-sm">{order.customer}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{order.type}</td>
                      <td className="px-4 py-3">
                        <div className={`flex items-center ${getStatusColor(order.status)}`}>
                          <StatusIcon status={order.status} />
                          <span className="text-sm">{order.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex">
                          {order.products.map((color, i) => (
                            <div 
                              key={i} 
                              className={`w-6 h-6 border ${color === 'yellow' ? 'bg-yellow-400' : 'bg-black'} rounded ${i > 0 ? '-ml-2' : ''}`}
                              aria-label={`Product color: ${color}`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{order.total}</td>
                      <td className="px-4 py-3 text-sm">{order.date}</td>
                      <td className="px-4 py-3">
                        <button 
                          className="text-gray-400 hover:text-gray-600"
                          aria-label={`More options for order ${order.id}`}
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-4 py-6 text-center text-gray-500">
                      No orders found matching your filters. Try adjusting your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing page {currentPage} of {totalPages || 1}
          </div>
          <div className="flex items-center space-x-1">
            <button 
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`rounded-full px-3 py-2 flex items-center ${currentPage === 1 ? ' text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {/* Page Number Links with Truncation */}
            {getPaginationLinks().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-500" aria-hidden="true">...</span>
              ) : (
                <button 
                  key={`page-${page}`}
                  onClick={() => goToPage(page)}
                  className={`rounded-full w-8 h-8 flex items-center justify-center ${
                    currentPage === page 
                      ? 'bg-black text-white' 
                      : ' hover:bg-gray-300 text-gray-600'
                  }`}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              )
            ))}
            
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`rounded-full px-3 py-2 flex items-center ${currentPage === totalPages || totalPages === 0 ? ' text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersManagement;