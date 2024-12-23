import React from "react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { useLocation } from "react-router-dom";
import { Button } from "flowbite-react";

const PaymentSuccess = () => {
  const location = useLocation();

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("order_id");

  return (
    <div className="min-h-screen  flex flex-col justify-center items-center bg-gradient-to-br from-green-200 to-green-500">
      <div className="bg-white p-6 rounded-lg shadow-lg transform transition-all scale-105">
        <div className="text-center">
          <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto animate-bounce" />
          <h1 className="text-3xl font-bold text-gray-800 mt-4">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mt-2">
            Thank you for your purchase. Your order has been placed
            successfully.
          </p>
          {orderId && (
            <p className="text-lg font-medium text-gray-700 mt-4">
              <span className="font-bold">Order ID:</span> {orderId}
            </p>
          )}

          <div className="mt-6 text-center flex justify-center">
            <Button
              onClick={() => (window.location.href = "/")}
              gradientMonochrome="success"
              className="px-6 py-3  text-white rounded-lg shadow-lg transform hover:scale-105 transition-all"
            >
              Go to Homepage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
