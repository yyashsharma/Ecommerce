import { useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { Radio, RadioGroup } from "@headlessui/react";
import { useParams } from "react-router-dom";
import { FaDollarSign } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "flowbite-react";

const reviews = { href: "#", average: 4, totalCount: 117 };

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ProductDetails = () => {
  const { productId } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    colors: [],
    sizes: [],
    images: [],
    reviews: [],
    averageRating: "",
  });

  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/v1/product/getproducts?productId=${productId}`
        );

        const data = await res.json();
        if (data.success === false) {
          return toast.error(data.message);
        }

        setProduct(data.products[0]);
        setLoading(false);
      } catch (error) {
        toast.error(error);
        setLoading(false);
      }
    };
    fetchPost();
  }, [productId]);

  const handleAddToCart = async () => {
    // if (!selectedColor || !selectedSize) {
    //   return toast.error("Please select color and size before adding to cart");
    // }

    try {
      const updatedCart = await updateCartItem(currentUser._id, {
        productId,
        name: product.name,
        price: product.price,
        quantity: 1,
        color: selectedColor,
        size: selectedSize ? selectedSize : "",
        image: product.images[0],
      });
    } catch (error) {
      toast.error("Sign in to add items to cart");
    }
  };

  return (
    <>
      <div className="pt-6">
        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <img
            alt={"sorry,there is no image"}
            src={
              product.images[0] ||
              "https://cdn.pixabay.com/photo/2015/10/31/12/29/shopping-1015559_1280.jpg"
            }
            className="hidden aspect-[3/4] size-full rounded-lg object-cover lg:block"
          />
          <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <img
              alt={"sorry,there is no image"}
              src={
                product.images[1] ||
                "https://cdn.pixabay.com/photo/2015/10/31/12/29/shopping-1015559_1280.jpg"
              }
              className="aspect-[3/2] size-full rounded-lg object-cover"
            />
            <img
              alt={"sorry,there is no image"}
              src={
                product.images[2] ||
                "https://cdn.pixabay.com/photo/2015/10/31/12/29/shopping-1015559_1280.jpg"
              }
              className="aspect-[3/2] size-full rounded-lg object-cover"
            />
          </div>
          <img
            alt={"sorry,there is no image"}
            src={
              product.images[3] ||
              "https://cdn.pixabay.com/photo/2015/10/31/12/29/shopping-1015559_1280.jpg"
            }
            className="aspect-[4/5] size-full object-cover sm:rounded-lg lg:aspect-[3/4]"
          />
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {product.name}
            </h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">
              <FaDollarSign className="inline" />
              {product.price}
            </p>

            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      aria-hidden="true"
                      className={classNames(
                        reviews.average > rating
                          ? "text-gray-900"
                          : "text-gray-200",
                        "size-5 shrink-0"
                      )}
                    />
                  ))}
                </div>
                <p className="sr-only">{reviews.average} out of 5 stars</p>
                <a
                  href={reviews.href}
                  className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {reviews.totalCount} reviews
                </a>
              </div>
            </div>

            <form className="mt-10">
              {/* Colors */}
              <div>
                <h3 className="text-sm font-medium text-gray-900">Color</h3>

                <fieldset aria-label="Choose a color" className="mt-4">
                  <RadioGroup
                    className="flex items-center space-x-3"
                    value={selectedColor}
                    onChange={setSelectedColor}
                  >
                    {product.colors.length > 0 ? (
                      product.colors.map((color, index) => (
                        <Radio
                          key={index} // You can use the index as the key
                          value={color}
                          aria-label={color}
                          className={classNames(
                            "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none data-[checked]:ring-2 data-[focus]:data-[checked]:ring data-[focus]:data-[checked]:ring-offset-1"
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={`size-8 rounded-full border border-black/10 `}
                            style={{ backgroundColor: color }}
                          />
                        </Radio>
                      ))
                    ):(
                      <p>no colors available</p>
                    )}
                  </RadioGroup>
                </fieldset>
              </div>

              {/* Sizes */}
              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Size</h3>
                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Size guide
                  </a>
                </div>

                <fieldset aria-label="Choose a size" className="mt-4">
                  <RadioGroup
                    className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4"
                    value={selectedSize}
                    onChange={setSelectedSize}
                  >
                    {product.sizes.length > 0 ? (
                      product.sizes.map((size) => (
                        <Radio
                          key={size} // Use size as the key if it's unique
                          value={size}
                          className={
                            "cursor-pointer bg-white text-gray-900 shadow-sm group relative flex items-center justify-center rounded-md border px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none data-[focus]:ring-2 data-[focus]:ring-indigo-500 sm:flex-1 sm:py-6"
                          }
                        >
                          <span>{size}</span> {/* Display the size name */}
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -inset-px rounded-md border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-indigo-500"
                          />
                        </Radio>
                      ))
                    ) : (
                      <p>no sizes available</p>
                    )}
                  </RadioGroup>
                </fieldset>
              </div>

              <Button
                type="button"
                gradientMonochrome="purple"
                onClick={handleAddToCart}
                className="mt-10 flex w-full items-center justify-center rounded-md  px-8 py-2 text-base font-medium text-white"
              >
                Add to cart
              </Button>
            </form>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p
                  className="text-base text-gray-900"
                  dangerouslySetInnerHTML={{
                    __html: product && product.description,
                  }}
                ></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const updateCartItem = async (userId, cartItem) => {
  try {
    const response = await fetch(`/api/v1/cart/updateCartItem/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: cartItem.productId,
        name: cartItem.name,
        price: cartItem.price,
        quantity: cartItem.quantity,
        color: cartItem.color || "black",
        size: cartItem.size || "M",
        image: cartItem.image,
      }),
    });

    const data = await response.json();
    if (response.ok && data.success) {
      toast.success("Added to cart successfully!");
    } else {
      throw new Error(data.message || "Failed to update cart");
    }
  } catch (error) {
    toast.error( "Out of stock");
  }
};

export default ProductDetails;
