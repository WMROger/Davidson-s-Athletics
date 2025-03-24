import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, MoreHorizontal, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { db } from '../Database/firebase'; // Ensure correct path
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './carouselStyles.css'; // Import the custom CSS file

const OrdersManagement = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [allOrders, setAllOrders] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownOrderId, setDropdownOrderId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const typeDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);
  const dateDropdownRef = useRef(null);
  const uniqueDates = allOrders.length > 0 ? [...new Set(allOrders.map(order => order.date))] : [];
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const orders = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        status: doc.data().status || 'Pending' // Set default status to Pending if not present
      }));
      setAllOrders(orders);
    };

    fetchOrders();
  }, []);

  const toggleDropdown = (orderId) => {
    setDropdownOrderId(orderId);
    setOpenDropdown(openDropdown === orderId ? null : orderId);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const orderDoc = doc(db, "orders", orderId);
    await updateDoc(orderDoc, { status: newStatus });
    setAllOrders(allOrders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    setOpenDropdown(null);
  };

  const filteredOrders = Array.isArray(allOrders) ? allOrders.filter(order => {
    return (
      (typeFilter === '' || order.type === typeFilter) &&
      (statusFilter === '' || order.status === statusFilter) &&
      (dateFilter === '' || order.date === dateFilter) &&
      (searchQuery === '' || 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.fullName?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }) : [];

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const orders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1); // Reset to first page when filter changes
    setOpenDropdown(null); // Close dropdown after selection
  };

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

  const StatusIcon = ({ receiptFile }) => {
    if (receiptFile) {
      return <Check className="w-5 h-5 text-green-500 mr-1" />;
    } else {
      return <X className="w-5 h-5 text-red-500 mr-1" />;
    }
  };

  const getStatusColor = (receiptFile) => {
    return receiptFile ? 'text-green-500' : 'text-red-500';
  };

  const handleProductClick = (products, customerName) => {
    const updatedProducts = products.map(product => ({
      ...product,
      uploadedBy: customerName, // Set the uploadedBy field to the customer name
      description: product.description || "No description available" // Ensure description is present
    }));
    console.log("Selected Products:", updatedProducts); // Log the selected products
    updatedProducts.forEach((product, index) => {
      console.log(`Product ${index + 1}:`, product);
    });
    setSelectedProduct(updatedProducts);
    setShowProductModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-6">
        <h1 className="text-6xl font-bold mb-8">Orders</h1>
        
        <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
          <div className="flex flex-wrap gap-3">
            {/* Type Filter Dropdown */}
            <div className="relative" ref={typeDropdownRef}>
              <div className="inline-block">
                <button 
                  className="px-5 py-3 bg-black text-white rounded-full flex items-center text-base"
                  onClick={() => toggleDropdown('type')}
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'type'}
                  aria-label="Filter by type"
                >
                  {typeFilter || 'Type'} <ChevronDown className="w-5 h-5 ml-2" />
                </button>
                {openDropdown === 'type' && (
                  <div className="absolute mt-1 w-48 bg-white rounded-lg shadow-lg z-10">
                    <ul className="py-2" role="menu">
                      <li 
                        className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-base" 
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
                        className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-base" 
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
                        className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-base" 
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
            
            {/* Status Filter Dropdown - Updated with new status values */}
            <div className="relative" ref={statusDropdownRef}>
              <div className="inline-block">
                <button 
                  className="px-5 py-3 bg-white border border-gray-300 rounded-full flex items-center text-base"
                  onClick={() => toggleDropdown('status')}
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'status'}
                  aria-label="Filter by status"
                >
                  {statusFilter || 'Status'} <ChevronDown className="w-5 h-5 ml-2" />
                </button>
                {openDropdown === 'status' && (
                  <div className="absolute mt-1 w-48 bg-white rounded-lg shadow-lg z-10">
                    <ul className="py-2" role="menu">
                      <li 
                        className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-base" 
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
                        className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-base" 
                        onClick={() => handleFilterChange(setStatusFilter, 'Pending')}
                        role="menuitem"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleFilterChange(setStatusFilter, 'Pending');
                          }
                        }}
                      >
                        Pending
                      </li>
                      <li 
                        className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-base" 
                        onClick={() => handleFilterChange(setStatusFilter, 'To Ship')}
                        role="menuitem"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleFilterChange(setStatusFilter, 'To Ship');
                          }
                        }}
                      >
                        To Ship
                      </li>
                      <li 
                        className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-base" 
                        onClick={() => handleFilterChange(setStatusFilter, 'To Deliver')}
                        role="menuitem"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleFilterChange(setStatusFilter, 'To Deliver');
                          }
                        }}
                      >
                        To Deliver
                      </li>
                      <li 
                        className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-base" 
                        onClick={() => handleFilterChange(setStatusFilter, 'To Receive')}
                        role="menuitem"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleFilterChange(setStatusFilter, 'To Receive');
                          }
                        }}
                      >
                        To Receive
                      </li>
                      <li 
                        className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-base" 
                        onClick={() => handleFilterChange(setStatusFilter, 'Completed')}
                        role="menuitem"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleFilterChange(setStatusFilter, 'Completed');
                          }
                        }}
                      >
                        Completed
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
                  className="px-5 py-3 bg-white border border-gray-300 rounded-full flex items-center text-base"
                  onClick={() => toggleDropdown('date')}
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'date'}
                  aria-label="Filter by date"
                >
                  {dateFilter || 'Date'} <ChevronDown className="w-5 h-5 ml-2" />
                </button>
                {openDropdown === 'date' && (
                  <div className="absolute mt-1 w-48 bg-white rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                    <ul className="py-2" role="menu">
                      <li 
                        className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-base" 
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
                          className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-base" 
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
              className="px-5 py-3 pl-12 pr-5 border border-gray-300 rounded-full w-72 text-base"
              aria-label="Search orders"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        {/* Order Count Display */}
        <div className="mb-5 text-base text-gray-600">
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
                  <th className="px-5 py-4 text-left">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 w-5 h-5"
                      aria-label="Select all orders" 
                    />
                  </th>
                  <th className="px-5 py-4 text-left text-lg font-medium text-gray-500">Order</th>
                  <th className="px-5 py-4 text-left text-lg font-medium text-gray-500">Customer</th>
                  <th className="px-5 py-4 text-left text-lg font-medium text-gray-500">Type</th>
                  <th className="px-5 py-4 text-left text-lg font-medium text-gray-500">Status</th>
                  <th className="px-5 py-4 text-left text-lg font-medium text-gray-500">Payment Status</th>
                  <th className="px-5 py-4 text-left text-lg font-medium text-gray-500">Product</th>
                  <th className="px-5 py-4 text-left text-lg font-medium text-gray-500">Total</th>
                  <th className="px-5 py-4 text-left text-lg font-medium text-gray-500">Date</th>
                  <th className="px-5 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 w-5 h-5"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                          aria-label={`Select order ${order.id}`}
                        />
                      </td>
                      <td className="px-5 py-4 text-base font-medium">{order.id}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mr-3">
                            <img src="../public/Icons/calendar.svg" alt="User" className="h-10 w-10 object-cover" />
                          </div>
                          <span className="text-base">{order.fullName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-base">{order.shippingMethod}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-base ${
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          order.status === 'To Ship' ? 'bg-blue-100 text-blue-800' : 
                          order.status === 'To Deliver' ? 'bg-indigo-100 text-indigo-800' : 
                          order.status === 'To Receive' ? 'bg-purple-100 text-purple-800' : 
                          order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className={`flex items-center ${getStatusColor(order.receiptFile)}`}>
                          <StatusIcon receiptFile={order.receiptFile} />
                          <span className="text-base">{order.receiptFile ? 'Paid' : 'Unpaid'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex">
                          {order.selectedItems && order.selectedItems.length > 0 && (
                            <button 
                              className="text-blue-600 hover:underline"
                              onClick={() => handleProductClick(order.selectedItems, order.fullName)} // Pass the entire selectedItems array and customer name
                            >
                              View File
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-base font-medium">₱{order.total}</td>
                      <td className="px-5 py-4 text-base">{order.createdAt?.toDate().toLocaleDateString()}</td>
                      <td className="px-5 py-4 relative">
                        <button 
                          className="text-gray-400 hover:text-gray-600"
                          aria-label={`More options for order ${order.id}`}
                          onClick={() => toggleDropdown(order.id)}
                        >
                          <MoreHorizontal className="w-6 h-6" />
                        </button>
                        {openDropdown === order.id && (
                          <div className="fixed right-0 mt-2 w-52 bg-white border border-gray-200 rounded shadow-lg z-10">
                            <button 
                              className="block w-full text-left px-5 py-3 text-base text-gray-700 hover:bg-gray-100"
                              onClick={() => handleStatusChange(order.id, 'Pending')}
                            >
                              Pending
                            </button>
                            <button 
                              className="block w-full text-left px-5 py-3 text-base text-gray-700 hover:bg-gray-100"
                              onClick={() => handleStatusChange(order.id, 'To Ship')}
                            >
                              To Ship
                            </button>
                            <button 
                              className="block w-full text-left px-5 py-3 text-lg text-gray-700 hover:bg-gray-100"
                              onClick={() => handleStatusChange(order.id, 'To Deliver')}
                            >
                              To Deliver
                            </button>
                            <button 
                              className="block w-full text-left px-5 py-3 text-lg text-gray-700 hover:bg-gray-100"
                              onClick={() => handleStatusChange(order.id, 'To Receive')}
                            >
                              To Receive
                            </button>
                            <button 
                              className="block w-full text-left px-5 py-3 text-lg text-gray-700 hover:bg-gray-100"
                              onClick={() => handleStatusChange(order.id, 'Completed')}
                            >
                              Completed
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="px-5 py-8 text-center text-base text-gray-500">
                      No orders found matching your filters. Try adjusting your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-base text-gray-600">
            Showing page {currentPage} of {totalPages || 1}
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`rounded-full px-4 py-3 flex items-center ${currentPage === 1 ? ' text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Page Number Links with Truncation */}
            {getPaginationLinks().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500 text-base" aria-hidden="true">...</span>
              ) : (
                <button 
                  key={`page-${page}`}
                  onClick={() => goToPage(page)}
                  className={`rounded-full w-10 h-10 flex items-center justify-center text-base ${
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
              className={`rounded-full px-4 py-3 flex items-center ${currentPage === totalPages || totalPages === 0 ? ' text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/30">
          <div className="bg-white p-6 rounded-lg shadow-xl w-3/4 max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h2 className="text-2xl font-semibold">File Details</h2>
              <button
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                onClick={() => setShowProductModal(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="md:w-1/2 mb-6 md:mb-0">
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-[400px]">
                  <Carousel
                    showThumbs={false}
                    showStatus={false}
                    infiniteLoop
                    useKeyboardArrows
                    selectedItem={currentSlide}
                    onChange={(index) => setCurrentSlide(index)}
                  >
                    {selectedProduct.map((product, index) => (
                      <div key={index}>
                        <img src={product.imageUrl} alt={product.productName} />
                      </div>
                    ))}
                  </Carousel>
                </div>
              </div>
              <div className="md:w-1/2 space-y-4">
                <div className="border-b pb-2 mb-2">
                  <h3 className="font-bold text-2xl mb-3">File Information</h3>
                  <p className="text-lg">
                    <span className="font-semibold">File Name:</span> {selectedProduct[currentSlide].productName}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">Shirt Size:</span> {selectedProduct[currentSlide].size}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">Quantity:</span> {selectedProduct[currentSlide].quantity}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">Uploaded By:</span> {selectedProduct[currentSlide].uploadedBy}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-2xl mb-3">Total Shirts Ordered</h3>
                  <p className="text-lg">{selectedProduct.reduce((total, product) => total + product.quantity, 0)}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t flex justify-end space-x-4">
              <button
                className="px-6 py-3 bg-gray-200 cursor-pointer text-gray-800 rounded-lg hover:bg-gray-300 text-lg font-medium transition-colors"
                onClick={() => setShowProductModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;