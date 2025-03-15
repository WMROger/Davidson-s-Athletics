import ProfileSidebar from "./ProfileSidebar";

const Purchase = () => {
  const orders = [
    {
      id: 1,
      status: "To Receive",
      product: "Long sleeve t-shirt",
      price: 500,
      shipping: 50,
      total: 550,
    },
  ];

  return (
    <div className="flex">
      <ProfileSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">My Purchases</h1>

        <div className="mt-4">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded-md shadow-md">
              <div className="flex justify-between">
                <h2 className="font-semibold">{order.product}</h2>
                <span className="text-blue-500">{order.status}</span>
              </div>
              <p className="text-gray-500">₱{order.price}</p>
              <p className="text-gray-500">Shipping: ₱{order.shipping}</p>
              <div className="mt-2 flex justify-between">
                <span className="font-bold">Order Total:</span>
                <span className="font-bold">₱{order.total}</span>
              </div>
              <button className="mt-2 bg-black text-white px-4 py-2 rounded">
                Contact Seller
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Purchase;
