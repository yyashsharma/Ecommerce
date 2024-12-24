import React, { useEffect } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentCancel = () => {
  const location = useLocation();

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("order_id");
  console.log(orderId)

  useEffect(() => {
    const updatePaymentStatus = async () => {
      if (!orderId) {
        toast.error("Missing order details");
        return;
      }

      try { 
        const response = await fetch("/api/v1/payment/handlePaymentFailed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({orderId }),
        });

        const data = await response.json();
        if (response.ok) {
          toast.error("Payment canceled. Order updated.");
        } else {
          toast.error(data.message || "Failed to update payment status.");
        }
      } catch (error) {
        toast.error("An error occurred while updating payment status.");
      }
    };

    updatePaymentStatus();
  }, [orderId]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-red-200 to-red-500">
      <div className="bg-white p-6 rounded-lg shadow-lg transform transition-all scale-105">
        <div className="text-center">
          <ExclamationCircleIcon className="w-20 h-20 text-red-500 mx-auto animate-shake" />
          <h1 className="text-3xl font-bold text-gray-800 mt-4">
            Payment Canceled
          </h1>
          <p className="text-gray-600 mt-2">
            Your payment has been canceled. Please try again or contact support
            if you need assistance.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => (window.location.href = "/")}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg shadow-lg hover:bg-gray-700 transform hover:scale-105 transition-all"
            >
              Go to Homepage
            </button>
            {/* <button
            onClick={() => window.location.href = "/support"}
            className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transform hover:scale-105 transition-all"
          >
            Contact Support
          </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
