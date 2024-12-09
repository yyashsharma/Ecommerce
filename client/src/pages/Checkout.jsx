
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

import { Link } from "react-router-dom";
import Cart from "./Cart";

const products = [
  {
    id: 1,
    name: "Throwback Hip Bag",
    href: "#",
    color: "Salmon",
    price: "$90.00",
    quantity: 1,
    imageSrc:
      "https://tailwindui.com/plus/img/ecommerce-images/shopping-cart-page-04-product-01.jpg",
    imageAlt:
      "Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt.",
  },
  {
    id: 2,
    name: "Medium Stuff Satchel",
    href: "#",
    color: "Blue",
    price: "$32.00",
    quantity: 1,
    imageSrc:
      "https://tailwindui.com/plus/img/ecommerce-images/shopping-cart-page-04-product-02.jpg",
    imageAlt:
      "Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.",
  },
  // More products...
];

const addresses = [
  {
    name: "kunnu",
    street: "no.2",
    city: "faridabad",
    pinCode: 100212,
    state: "haryana",
    phone: 999999999,
  },
  {
    name: "yash",
    street: "no.3",
    city: "Ramnagar",
    pinCode: 100212,
    state: "Uttarakhand",
    phone: 949922999999,
  },
];

const Checkout = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="mx-auto max-w-6xl px-1 py-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 px-5 lg:grid-cols-5 lg:gap-y-10">
        <div className="lg:col-span-3">
          <form>
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
                      id="first-name"
                      name="first-name"
                      type="text"
                      autoComplete="given-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
                      id="last-name"
                      name="last-name"
                      type="text"
                      autoComplete="family-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor="email"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
                      autoComplete="country-name"
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Mexico</option>
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
                      id="street-address"
                      name="street-address"
                      type="text"
                      autoComplete="street-address"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
                      autoComplete="address-level2"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
                      id="region"
                      name="region"
                      type="text"
                      autoComplete="address-level1"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="postal-code"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    ZIP / Postal code
                  </label>
                  <div className="mt-2">
                    <input
                      id="postal-code"
                      name="postal-code"
                      type="text"
                      autoComplete="postal-code"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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

            <div className="pb:4 lg:pb-12">
              <h2 className="text-base/7 font-semibold text-gray-900">
                Address
              </h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                Choose from existing addressess
              </p>

              

              <ul role="list" >
                {addresses.map((address) => (
                  <li
                    key={address.phone}
                    className="flex justify-between gap-x-6 py-5 border-solid border-2 border-slate-200 my-1 px-4"
                  >
                    
                    <div className="flex min-w-0 gap-x-4">
                    <input
                        name="address"
                        type="radio"
                        className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                      />
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm/6 font-semibold text-gray-900">
                          {address.name}
                        </p>
                        <p className="mt-1 truncate text-xs/5 text-gray-500">
                         Phone: {address.phone}
                        </p>
                      </div>
                    </div>
                    <div className="hidden text-gray-500 shrink-0 sm:flex sm:flex-col sm:items-end">
                      <p className="text-sm/6 text-gray-900">City,Pincode: {address.city}, {address.pinCode}</p>
                      <p className="text-sm/6 text-gray-900">state: {address.state}</p>

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
                        defaultChecked
                        id="card"
                        name="payments"
                        type="radio"
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

          </form>
        </div>
        <div className="lg:col-span-2">
         {/* cart code */}
     <Cart buttonLink={"/payment"} buttonText={"Pay Now"}/> 
        </div>
      </div>
    </div>
  );
};

export default Checkout;
