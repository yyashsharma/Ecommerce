import {
  Badge,
  Button,
  Dropdown,
  Select,
  Table,
  TextInput,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { CiShoppingCart } from "react-icons/ci";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const DashOrderManagement = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [ordersDetails, setOrdersDetails] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [orderId, setOrderId] = useState("");
  const [inputValue, setInputValue] = useState(""); // State to track input value

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const res = await fetch(`/api/v1/order/getAllOrders`);
        const data = await res.json();
        if (data.success === false) {
          return toast.error(data.message);
        }
        setOrdersDetails(data.orders);
        if (data.orders.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        toast.error(error);
      }
    };

    if (currentUser.isAdmin) {
      fetchAllOrders();
    }
  }, [currentUser._id]);

  const handleStatusChange = async (userId, orderId, field, value) => {
    console.log(userId, orderId, field, value);
    const confirmChange = window.confirm(
      `Are you sure you want to update ${field} to "${value}"?`
    );

    if (!confirmChange) return; // Exit if the user cancels

    try {
      const response = await fetch(
        `/api/v1/order/updateOrder/${orderId}/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ [field]: value }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update the state to trigger re-render
        setOrdersDetails((prevDetails) =>
          prevDetails.map(
            (order) =>
              order.orderId === orderId // Match the order using `orderId`
                ? { ...order, [field]: value } // Update the specific field (e.g., `orderStatus` or `paymentStatus`)
                : order // Leave other orders unchanged
          )
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("An error occurred");
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
      const res = await fetch(`/api/v1/order/getAllOrders${searchTerm}`);
      const data = await res.json();
      if (data.success === false) {
        return toast.error(data.message);
      }
      setOrdersDetails(data.orders);
      setShowMore(data.orders.length === 9);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleShowMore = async () => {
    const startIndex = ordersDetails.length;
    try {
      const res = await fetch(
        `/api/v1/order/getAllOrders?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (data.success === false) {
        return toast.error(data.message);
      }
      setOrdersDetails((prev) => [...prev, ...data.orders]);
      if (data.orders.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="w-[80%] table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {/* {currentUser.isAdmin && products.length > 0 ? ( */}
      <>
        <form
          onSubmit={handleSubmit}
          className=" lg:flex justify-between items-center mt-2 mb-10 gap-5 border-b py-2"
        >
          <div className="flex justify-center items-center">
            <h1 className="mx-2">Search Order : </h1>
            <TextInput
              id="search"
              type="text"
              placeholder="Search order by any details"
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
              icon={CiShoppingCart}
            >
              <span className="">Total Orders : </span>
              {ordersDetails.length}
            </Badge>
          </div>
        </form>

        <Table hoverable className="shadow-lg">
          <Table.Head className="border-b dark:border-gray-700">
            <Table.HeadCell>Order Created</Table.HeadCell>
            <Table.HeadCell>Order ID</Table.HeadCell>
            <Table.HeadCell>User ID</Table.HeadCell>
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Products</Table.HeadCell>
            <Table.HeadCell>Order Amount</Table.HeadCell>
            <Table.HeadCell>Order Status</Table.HeadCell>
            <Table.HeadCell>Payment Status</Table.HeadCell>
            <Table.HeadCell>Delivery Address</Table.HeadCell>
          </Table.Head>
          {ordersDetails.map((order) => (
            <Table.Body className="divide-y" key={order.orderId}>
              <Table.Row className="bg-white border-b dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {new Date(order.orderDate).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>{order.orderId}</Table.Cell>
                <Table.Cell>{order.userId}</Table.Cell>
                <Table.Cell>{order.username}</Table.Cell>
                <Table.Cell>{order.email}</Table.Cell>
                <Table.Cell>
                  {order.products.map((product, index) => (
                    <div key={index} className=" border-b border-gray-300 pb-2">
                      <p className="font-medium">
                        {product.name} (Qty: {product.quantity})
                      </p>
                      <p className="text-sm">${product.price.toFixed(2)}</p>
                    </div>
                  ))}
                </Table.Cell>
                <Table.Cell>${order.totalPrice.toFixed(2)}</Table.Cell>
                <Table.Cell className="text-white">
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(
                        order.userId,
                        order.orderId,
                        "orderStatus",
                        e.target.value
                      )
                    }
                    className="border border-gray-700 rounded p-1 bg-teal-600 text-white dark:bg-gray-800"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </Table.Cell>
                <Table.Cell>
                  <select
                    value={order.paymentStatus}
                    onChange={(e) =>
                      handleStatusChange(
                        order.userId,
                        order.orderId,
                        "paymentStatus",
                        e.target.value
                      )
                    }
                    className="border border-gray-700 bg-teal-600 text-white rounded p-1 dark:bg-gray-800"
                  >
                    <option value="cashOnDelivery">Cash On Delivery</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </Table.Cell>
                <Table.Cell>
                  <div>
                    <p className="font-medium">
                      {order.address.firstName} {order.address.lastName}
                    </p>
                    <p className="text-sm">
                      {order.address.street} {order.address.city}{" "}
                      {order.address.state},{order.address.postalCode}
                    </p>
                  </div>
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
      {/* ) : (
      <h1>You have no products yet!</h1>
    )} */}
      {/* <Modal
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
    </Modal> */}
    </div>
  );
};

export default DashOrderManagement;
