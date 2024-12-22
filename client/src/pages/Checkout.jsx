import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import Cart from "./Cart";
import { useSelector } from "react-redux";

const Checkout = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [cartDetails, setCartDetails] = useState({
    items: [],
    totalPrice: 0,
  });

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Card");

  const fetchAddresses = async () => {
    try {
      const response = await fetch(
        `/api/v1/address/getAllAddress/${currentUser._id}`
      ); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }
      const data = await response.json();
      setAddresses(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addAddress = async (newAddress) => {
    try {
      const response = await fetch(
        `/api/v1/address/addNewAddress/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newAddress),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add address");
      }
      const addedAddress = await response.json();

      setAddresses((prevAddresses) => [...prevAddresses, addedAddress.address]);
      toast.success("new address added");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addAddress(formData);
    setFormData({
      firstName: "",
      lastName: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phone: "",
    });
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    const fetchCartProducts = async () => {
      if (!currentUser || !currentUser._id) {
        // If currentUser is null or _id is not defined, return early
        setCartDetails({ items: [], totalPrice: 0 }); // Reset cart details
        return;
      }
      try {
        const res = await fetch(`/api/v1/cart/getCartItems/${currentUser._id}`);

        const data = await res.json();
        if (data.success === false) {
          return toast.error(data.message);
        }
        setCartDetails(data.cart);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchCartProducts();
  }, [currentUser]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddressChange = (addressId) => {
    setSelectedAddress(addressId);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

 
  const handlePayment = async() => {
    if (!selectedAddress) {
      toast.error("Please select an address bro");
      return;
    }
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    // Save details to localStorage or pass via query params/state
    const checkoutDetails = {
      selectedAddress,
      paymentMethod,
    };
    localStorage.setItem("checkoutDetails", JSON.stringify(checkoutDetails));


    // Redirect to Razorpay payment page
    // window.location.href = "/payment";

    try {
      const response = await fetch('/api/v1/order/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser._id,
          products: cartDetails.items.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
          totalPrice: cartDetails.totalPrice,
          addressId: selectedAddress,
          paymentMethod
        }),
      });
  
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        window.location.href = data.url; // Redirect to Stripe Checkout
        toast.success("order created")
      } else {
        toast.error(data.message || 'Payment initiation failed');
      }
    } catch (error) {
      console.error('Error:', error.message);
      toast.error('An error occurred. Please try again.');
    }


  };

  return (
    <div className="mx-auto max-w-6xl px-1 py-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 px-5 lg:grid-cols-5 lg:gap-y-10">
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit}>
            <div className="border-b border-gray-900/10 pb-12">
              <h1 className="text-2xl font-semibold text-gray-900">
                Personal Information
              </h1>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="last-name"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="phone"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Phone number
                  </label>
                  <div className="mt-2">
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Country
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="Mexico">India</option>
                      <option value="Mexico">Australia</option>
                      <option value="Mexico">Mexico</option>
                    </select>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="street-address"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Street address
                  </label>
                  <div className="mt-2">
                    <input
                      id="street"
                      name="street"
                      type="text"
                      value={formData.street}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 sm:col-start-1">
                  <label
                    htmlFor="city"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    City
                  </label>
                  <div className="mt-2">
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="region"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    State / Province
                  </label>
                  <div className="mt-2">
                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="postalCode"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    ZIP / Postal code
                  </label>
                  <div className="mt-2">
                    <input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className="text-sm/6 font-semibold text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save Address
              </button>
            </div>
          </form>
          <div className="pb:4 lg:pb-12">
            <h2 className="text-base/7 font-semibold text-gray-900">Address</h2>
            <p className="mt-1 text-sm/6 text-gray-600">
              Choose from existing addressess
            </p>

            <ul role="list">
              {addresses.map((address) => (
                <li
                  key={address._id}
                  className="flex justify-between gap-x-6 py-5 border-solid border-2 border-slate-200 my-1 px-4"
                >
                  <div className="flex min-w-0 gap-x-4">
                    <input
                      name="address"
                      type="radio"
                      value={address._id}
                      onChange={() => handleAddressChange(address._id)}
                      className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                    />
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm/6 font-semibold text-gray-900">
                        {address.firstName + " " + address.lastName}
                      </p>
                      <p className="mt-1 truncate text-xs/5 text-gray-500">
                        Phone: {address.phone}
                      </p>
                    </div>
                  </div>
                  <div className="hidden text-gray-500 shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm/6 text-gray-900">
                      City,Pincode: {address.city}, {address.postalCode}
                    </p>
                    <p className="text-sm/6 text-gray-900">
                      state: {address.state}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 space-y-10">
              <fieldset>
                <legend className="text-sm/6 font-semibold text-gray-900">
                  Payment Methods
                </legend>
                <p className="mt-1 text-sm/6 text-gray-600">
                  Choose one from below methods
                </p>
                <div className="mt-6 space-y-6">
                  <div className="flex items-center gap-x-3">
                    <input
                      id="card"
                      name="payments"
                      type="radio"
                      value="Card"
                      checked={paymentMethod === "Card"}
                      onChange={handlePaymentMethodChange}
                      className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                    />
                    <label
                      htmlFor="card"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Card
                    </label>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <input
                      id="cash"
                      name="payments"
                      type="radio"
                      value="Cash"
                      checked={paymentMethod === "Cash"}
                      onChange={handlePaymentMethodChange}
                      className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                    />
                    <label
                      htmlFor="cash"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Cash
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          {/* cart code */}
          <Cart
            buttonLink={"/payment"}
            buttonText={"Pay Now"}
            buttonAction={handlePayment}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
