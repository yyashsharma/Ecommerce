import { Badge } from "flowbite-react";
import { set } from "mongoose";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DashMyOrders = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [orders, setOrders] = useState([]);
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `/api/v1/order/getOrders/${currentUser._id}`
        );
        const data = await response.json();
        setOrders(data.orders);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchOrders();
  }, [currentUser._id]);

  // if (loading) {
  //   return <div className="text-center text-gray-600">Loading orders...</div>;
  // }

  // if (error) {
  //   return <div className="text-center text-red-600">{error}</div>;
  // }
  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Order history
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          {/* Check the status of recent orders, manage returns, and download
          invoices. */}
          Check the status of recent orders, manage orders and delivery status.
        </p>

        {orders.map((order) => (
          <div key={order._id} className="border border-gray-300 p-4 mb-6 rounded-lg">
            {/* Order Summary */}
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <p className="text-sm text-gray-600">Date placed</p>
                  <p className="font-medium text-gray-800">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order number</p>
                  <p className="font-medium text-gray-800">{order._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total amount</p>
                  <p className="font-medium text-gray-800">
                    ${order.totalPrice}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Status</p>
                  <p className="font-medium text-gray-800">
                    <Badge color="info" className="text-gray-800">
                      {order.orderStatus || "Status Unknown"}
                    </Badge>
                  </p>
                </div>
                {/* <button className="text-blue-600 border border-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50">
                  View Invoice
                </button> */}
              </div>
            </div>

            {/* Product List */}
            <div>
              {order.products.map((product, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center border-b last:border-b-0 py-4"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.image || "https://via.placeholder.com/60"}
                      alt={product.name || "Product Image"}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {product.name || "Unknown Product"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="text-black">Price: </span> $
                        {product.price || "N/A"}
                        <span className="text-black ml-3">Qty: </span>{" "}
                        {product.quantity || 1}
                      </p>
                      <p className="text-sm text-gray-600">
                        <Badge color="success" className="mb-1">
                          <span className="text-black">Payment Status: </span>
                          {order.paymentStatus === "cashOnDelivery"
                            ? "Cash On Delivery"
                            : "Paid" || "Status Unknown"}
                        </Badge>
                        <Badge color="info">
                          <span className="text-black">Delivery Status: </span>
                          {"delivery will be in 6 days"}
                        </Badge>
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/product-details/${product.productId}`}
                    className="text-blue-600 text-sm font-medium hover:underline mt-4 sm:mt-0 sm:ml-auto"
                  >
                    View Product
                  </Link>
                </div>
              ))}
              {/* Address Section */}
              <div className="mt-6 bg-gray-100 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">
                  Delivery Address
                </h3>
           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
           <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-800">Name: </span>
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-800">Street: </span>
                  {order.address.street}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-800">City,State: </span>
                  {order.address.city}, {order.address.state}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-800">Postal Code: </span>
                  {order.address.postalCode}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-800">Mob: </span>
                  {order.address.phone}
                </p>
           </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashMyOrders;
