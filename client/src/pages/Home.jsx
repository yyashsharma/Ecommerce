import { Carousel } from "flowbite-react";
import { useEffect, useState } from "react";
import { ProductGrid } from "../components/product-list/ProductList";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Grocery",
    img: "https://rukminim2.flixcart.com/flap/96/96/image/29327f40e9c4d26b.png?q=100",
    link: "#",
  },
  {
    name: "Mobiles",
    img: "https://rukminim2.flixcart.com/flap/96/96/image/22fddf3c7da4c4f4.png?q=100",
    link: "#",
  },
  {
    name: "Fashion",
    img: "https://rukminim2.flixcart.com/fk-p-flap/96/96/image/0d75b34f7d8fbcb3.png?q=100",
    link: "#",
  },
  {
    name: "Electronics",
    img: "https://rukminim2.flixcart.com/flap/96/96/image/69c6589653afdb9a.png?q=100",
    link: "#",
  },
  {
    name: "Home & Furniture",
    img: "	https://rukminim2.flixcart.com/flap/96/96/image/ab7e2b022a4587dd.jpg?q=100",
    link: "#",
  },
  {
    name: "Appliances",
    img: "https://rukminim2.flixcart.com/fk-p-flap/96/96/image/0139228b2f7eb413.jpg?q=100",
    link: "#",
  },
  {
    name: "Beauty, Toys & More",
    img: "	https://rukminim2.flixcart.com/flap/96/96/image/dff3f7adcf3a90c6.png?q=100",
    link: "#",
  },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      setLoading(true);

      // Build query to fetch the latest 4 products
      const queryParts = [];
      queryParts.push("limit=6");
      queryParts.push("order=asc");
      const query = `?${queryParts.join("&")}`;

      try {
        const res = await fetch(`/api/v1/product/getProducts${query}`);
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <div>
      <div className="mx-auto max-w-6xl py-2">
        {/* slider */}
        <div className="h-56 sm:h-64 xl:h-96">
          <Carousel pauseOnHover slideInterval={2000}>
            <img
              src="https://images-eu.ssl-images-amazon.com/images/G/31/IN-Events/Arundhati/CS24_GW_PC_Hero-gifting_1x._CB537980724_.jpg"
              alt="..."
              className="object-fill h-full "
            />
            <img
              src="https://images-eu.ssl-images-amazon.com/images/G/31/img23/GW/P42/Boult_3000x1200-PC._CB543542644_.jpg"
              alt="..."
              className="object-fill h-full "
            />
            <img
              src="https://images-eu.ssl-images-amazon.com/images/G/31/img22/Wireless/devjyoti/GW/Uber/Nov/Nov_New_3000x1200._CB542180708_.jpg"
              alt="..."
              className="object-fill h-full"
            />
            <img
              src="https://images-eu.ssl-images-amazon.com/images/G/31/img24/Beauty/SVD/Dec/Skincare_PCn._CB540861816_.jpg"
              alt="..."
              className="object-fill h-full"
            />
            <img
              src="https://images-eu.ssl-images-amazon.com/images/G/31/2024/Gateway/December/Christmas/GW_PC_Riding-gears-and-more-3000x1200._CB538316642_.jpg"
              alt="..."
              className="object-cover"
            />
          </Carousel>
        </div>
        {/* category section */}
        <div>
          <div className="flex flex-wrap gap-8 lg:gap-0 justify-around bg-white p-4 shadow-lg">
            {categories.map((category, index) => (
              <a
                key={index}
                // href={category.link}
                className="flex flex-col items-center text-center group"
              >
                <img
                  src={category.img}
                  alt={category.name}
                  className="w-16 h-16 mb-2 transition-transform duration-200 group-hover:scale-110"
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  {category.name}
                </span>
              </a>
            ))}
          </div>
        </div>
        <div className="py-10">
          <div className="px-3 lg:px-1 flex justify-between items-center">
            <h1 className="text-3xl">Latest Products</h1>
            <Link
              to={"/product-list"}
              className="text-blue-600 font-semibold hover:underline"
            >
              Explore All Products
            </Link>
          </div>
          <ProductGrid products={products} />
        </div>
        <div className="text-center my-5 font-semibold">
        <Link
              to={"/product-list"}
              className="text-blue-600 font-semibold hover:underline"
            >
              View All Products
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
