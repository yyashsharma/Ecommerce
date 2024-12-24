import React from "react";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center h-96 ">
      <img
        src="https://cdn-icons-png.flaticon.com/512/1170/1170576.png"
        alt="Empty Cart"
        className="w-40 mb-6"
      />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Your Cart is Empty
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        Looks like you haven't added anything to your cart yet.
      </p>
      <Link to="/product-list">
        <Button
          gradientMonochrome="info"
          className="px-6 py-3 text-white text-lg font-medium rounded-md "
        >
          Start Shopping
        </Button>
      </Link>
    </div>
  );
};

export default EmptyCart;
