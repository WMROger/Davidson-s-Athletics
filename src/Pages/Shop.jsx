import React from 'react';

const Shop = () => {
  return (
    <>
    
      {/* Main Content */}
      <main className="container mx-auto p-4 bg-emerald-100">
        {/* Hero Section */}
        <section 
          className="hero bg-cover bg-center h-64 flex items-center justify-center text-white rounded-lg shadow-lg"
          style={{ backgroundImage: "url('Home Assets/ Hero1.svg')" }}
        >

          <h2 className="text-4xl font-bold bg-orange bg-opacity-50 p-4 rounded-lg">
            Welcome to Davidson Athletics Shop
          </h2>
        </section>

        {/* Featured Products */}
        <section className="mt-8">
          <h3 className="text-2xl font-bold mb-4"> Categories</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Example Product Card */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="border rounded-lg p-4 shadow-lg bg-white">
                <img 
                  src="/path-to-product-image.jpg" 
                  alt="Product" 
                  className="w-full h-48 object-cover rounded-lg mb-4" 
                />
                <h4 className="text-xl font-bold">Sleeves</h4>
                <p className="text-gray-700">$99.99</p>
                <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default Shop;
