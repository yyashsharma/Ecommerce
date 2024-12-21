import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link ,useNavigate} from "react-router-dom";
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

  return cartDetails.items.length > 0 ? (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
      <div className="mt-1">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-5 border-b-2 lg:mb-5">
            Cart
          </h1>
        </div>
        <div className="flow-root">
          <ul role="list" className="-my-6 divide-y divide-gray-200">
            {cartDetails.items.map((product) => (
              <li key={product._id} className="flex py-6">
                <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    alt={product.name}
                    src={product.image}
                    className="size-full object-cover"
                  />
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>
                        <a href={product.href}>{product.name}</a>
                      </h3>
                      <p className="ml-4">{product.price}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.color}
                    </p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <div className="text-gray-500">
                      Qty
                      <select className="mx-5">
                        <option value={product.quantity}>
                          {product.quantity}
                        </option>
                      </select>
                    </div>

                    <div className="flex">
                      <button
                        type="button"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* cart summary */}
      <div className="mt-6 border-t border-gray-200 px-0 py-6 sm:px-0">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Total</p>
          <p>${cartDetails.totalPrice}</p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">
          {/* Shipping and taxes calculated at checkout. */}
        </p>
        <div className="mt-6">
          <Button
            onClick={handleClick}
            className="flex items-center justify-center w-full rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
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
    "no items in cart"
  );
};

export default Cart;
