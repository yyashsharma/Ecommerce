import { Badge, Button, Modal, Table, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CiShoppingTag } from "react-icons/ci";
import DashUpdateProduct from "./DashUpdateProduct";

const DashProducts = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [products, setProducts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [productId, setProductId] = useState("");
  const [inputValue, setInputValue] = useState(""); // State to track input value
  const [totalProducts, setTotalProducts] = useState(0);

  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/v1/product/getProducts?order=asc`);
        const data = await res.json();
        if (data.success === false) {
          return toast.error(data.message);
        }
        setProducts(data.products);
        setTotalProducts(data.totalProducts);
        if (data.products.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        toast.error(error);
      }
    };

    if (currentUser.isAdmin) {
      fetchProducts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = products.length;
    try {
      const res = await fetch(
        `/api/v1/product/getProducts?order=asc&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (data.success === false) {
        return toast.error(data.message);
      }
      setProducts((prev) => [...prev, ...data.products]);
      if (data.products.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      toast.error(error);
    }
  };
  const handleDeleteProduct = async () => {
    setOpenModal(false);
    try {
      const res = await fetch(
        `/api/v1/product/deleteProduct/${productId}/${currentUser._id}`,
        {
          method: `DELETE`,
        }
      );
      const data = await res.json();
      if (data.success === false) {
        return toast.error(data.message);
      }
      setProducts((prev) =>
        prev.filter((product) => product._id !== productId)
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error);
    }
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // If inputValue is empty, navigate to all products
    const searchTerm = inputValue.trim()
      ? `?searchTerm=${encodeURIComponent(inputValue)}`
      : "";

    try {
      const res = await fetch(`/api/v1/product/getProducts${searchTerm}`);
      const data = await res.json();
      if (data.success === false) {
        return toast.error(data.message);
      }
      setProducts(data.products);
      setShowMore(data.products.length === 9);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="w-[80%] table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && products.length > 0 ? (
        <>
          <form
            onSubmit={handleSubmit}
            className=" lg:flex justify-between items-center mt-2 mb-10 gap-5 border-b py-2"
          >
            <div className="flex justify-center items-center">
              <h1 className="mx-2">Search Product : </h1>
              <TextInput
                id="search"
                type="text"
                placeholder="Search product by name,category,description"
                className="w-80"
                value={inputValue} // Controlled input
                onChange={handleInputChange} // Update state on input change
              />
              <Button
                type="submit"
                gradientDuoTone="tealToLime"
                className="w-8 h-8 -ml-9  border-2 border-solid border-teal-500"
                pill
              >
                <AiOutlineSearch />
              </Button>
            </div>
            <div className="mt-5 lg:mt-0">
              <Badge
                className="px-5 py-3 text-black font-semibold text-base"
                icon={CiShoppingTag}
              >
                <span className="">Total Products : </span>
                {totalProducts}
              </Badge>
            </div>
          </form>

          <Table hoverable className="shadow-lg">
            <Table.Head className="border-b dark:border-gray-700">
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Product image</Table.HeadCell>
              <Table.HeadCell>Product name</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
              <Table.HeadCell>Stock</Table.HeadCell>
              <Table.HeadCell>Rating</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {products.map((product) => (
              <Table.Body className="divide-y" key={product._id}>
                <Table.Row className="bg-white border-b dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/product-details/${product._id}`}>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-20 h-14 object-cover bg-gray-300"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/product-details/${product._id}`}
                    >
                      {product.name}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{product.category}</Table.Cell>
                  <Table.Cell>{product.price}</Table.Cell>
                  <Table.Cell>{product.stock}</Table.Cell>
                  <Table.Cell>{product.averageRating}</Table.Cell>
                  <Table.Cell>
                    <Button
                      outline
                      gradientDuoTone="pinkToOrange"
                      onClick={() => {
                        setOpenModal(true);
                        setProductId(product._id);
                      }}
                      className="hover:underline"
                    >
                      Delete
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      outline
                      gradientDuoTone="purpleToBlue"
                      className="hover:underline"
                      onClick={() => {
                        setOpenModal2(true);
                        setProductId(product._id);
                      }}
                    >
                      Edit
                    </Button>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          <div className="flex justify-center py-7">
            {showMore && (
              <Button
                onClick={handleShowMore}
                type="button"
                gradientDuoTone="purpleToBlue"
                outline
              >
                Show More
              </Button>
            )}
          </div>
        </>
      ) : (
        <h1>You have no products yet!</h1>
      )}
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteProduct}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <DashUpdateProduct
        openModal2={openModal2}
        setOpenModal2={setOpenModal2}
        productId={productId}
      />
    </div>
  );
};

export default DashProducts;
