import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

const PaymentCancel = () => {
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
