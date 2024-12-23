import { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

const Cart = ({ buttonLink, buttonText, buttonAction }) => {
  const [open, setOpen] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const [cartDetails, setCartDetails] = useState({
    items: [],
    totalPrice: 0,
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartProducts = async () => {
      if (!currentUser || !currentUser._id) {
        // If currentUser is null or _id is not defined, return early
        setCartDetails({ items: [], totalPrice: 0 }); // Reset cart details
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/cart/getCartItems/${currentUser._id}`);

        const data = await res.json();
        if (data.success === false) {
          return toast.error(data.message);
        }
        setCartDetails(data.cart);
        setLoading(false);
      } catch (error) {
        toast.error(error);
        setLoading(false);
      }
    };
    fetchCartProducts();
  }, [currentUser]);

  const handleClick = () => {
    if (buttonAction) {
      buttonAction(); // Execute the passed action
    } else {
      navigate(buttonLink); // Default navigation
    }
  };

  // Update Quantity Logic
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      return toast.warning("Quantity must be at least 1.");
    }

    try {
      const response = await fetch(
        `/api/v1/cart/updateCartItem/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            quantity: newQuantity, // Set the new quantity
            action: "replace", // Specify the action as replace
          }),
        }
      );

      const data = await response.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }

      setCartDetails(data.cart);
      toast.success("Quantity updated successfully!");
    } catch (error) {
      toast.error("Failed to update quantity.");
    }
  };

  // Remove Item Logic
  const removeItem = async (productId) => {
    try {
      const response = await fetch(
        `/api/v1/cart/removeCartItem/${currentUser._id}/${productId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }

      setCartDetails(data.cart);
      toast.success("Item removed successfully!");
    } catch (error) {
      toast.error("Failed to remove item.");
    }
  };

  // Clear Cart Logic
  const clearCart = async () => {
    try {
      const response = await fetch(
        `/api/v1/cart/clearCartItems/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }

      setCartDetails(data.cart);
      toast.success("Cart cleared successfully!");
    } catch (error) {
      toast.error("Failed to clear cart.");
    }
  };

  return cartDetails.items.length > 0 ? (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center border-b-2">
        <h1 className="text-4xl font-bold mb-5 ">Cart</h1>
        <Button
          onClick={clearCart}
          gradientMonochrome="failure"
          className="rounded-md px-3 text-white"
        >
          Clear Cart
        </Button>
      </div>
      <ul role="list" className="-my-4f divide-y divide-gray-200">
        {cartDetails.items.map((product) => (
          <li key={product.productId} className="flex py-6">
            <div className="size-28 shrink-0 overflow-hidden rounded-md border border-gray-200">
              <img
                alt={product.name}
                src={product.image}
                className="size-full object-cover"
              />
            </div>

            <div className="ml-4 flex flex-1 flex-col gap-1">
              <div className="flex justify-between text-base font-medium">
                <h3>{product.name}</h3>
                <p>${(product.price * product.quantity).toFixed(2)}</p>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Color: {product.color}
              </p>
              <p className="text-sm text-gray-500">Size: {product.size}</p>

              <div className="flex flex-1 items-end justify-between text-sm mt-1">
                <div className="flex items-center space-x-2">
                  <button
                    className="px-2 py-1 bg-gray-300 rounded-md"
                    onClick={() =>
                      updateQuantity(product.productId, product.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span className="px-2 font-semibold">{product.quantity}</span>
                  <button
                    className="px-2 py-1 bg-gray-300 rounded-md"
                    onClick={() =>
                      updateQuantity(product.productId, product.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  className="font-medium text-red-600 hover:text-indigo-500"
                  onClick={() => removeItem(product.productId)}
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* cart summary */}
      <div className="mt-6 border-t border-gray-200 px-0 py-6 sm:px-0">
        <div className="flex gap-10 justify-end text-base font-bold text-gray-900">
          <p className="font-bold">Total:</p>
          <p>${cartDetails.totalPrice.toFixed(2)}</p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">
          {/* Shipping and taxes calculated at checkout. */}
        </p>
        <div className="mt-6">
          <Button
            onClick={handleClick}
            gradientMonochrome="purple"
            className="flex items-center justify-center w-full rounded-md border border-transparent px-6 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            {buttonText}
          </Button>
        </div>
        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
          <p>
            or{" "}
            <Link to={"/"}>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Continue Shopping
                <span aria-hidden="true"> &rarr;</span>
              </button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  ) : (
    <p>Your cart is empty.</p>
  );
};

export default Cart;
