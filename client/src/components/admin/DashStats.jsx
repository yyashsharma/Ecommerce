import React, { useEffect, useState } from "react";
import { HiArrowNarrowUp, HiOutlineUserGroup } from "react-icons/hi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import BarChart from "./charts/BarChart";
import { GiShoppingBag, GiTakeMyMoney } from "react-icons/gi";
import { IoMdPricetag } from "react-icons/io";
import PieChart from "./charts/PieChart";

const DashStats = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthOrders, setLastMonthOrders] = useState(0);
  const [lastMonthProducts, setLastMonthProducts] = useState(0);
  const [lastMonthSales, setLastMonthSales] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/v1/user/getusers?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/v1/order/getAllOrders?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setOrders(data.orders);
          setTotalOrders(data.totalOrders);
          setLastMonthOrders(data.lastMonthOrders);
          setTotalSales(data.totalPaidSales);
          setLastMonthSales(data.lastMonthPaidSales);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/v1/product/getProducts?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setProducts(data.products);
          setTotalProducts(data.totalProducts);
          setLastMonthProducts(data.lastMonthProducts);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
      fetchOrders();
      fetchProducts();
    }
  }, [currentUser]);

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex-wrap flex gap-4 justify-center">
        <div className=" flex flex-col p-3 dark:bg-slate-800 md:w-72 w-full rounded-md shadow-md">
          <div className=" flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-500 text-white rounded-full text-5xl p-3 shadow-lg " />
          </div>
          <div className="flex gap-2 text-sm mt-3">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <span className="text-gray-500">Last Month</span>
          </div>
        </div>
        <div className=" flex flex-col p-3 dark:bg-slate-800 md:w-72 w-full rounded-md shadow-md">
          <div className=" flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Orders</h3>
              <p className="text-2xl">{totalOrders}</p>
            </div>
            <GiShoppingBag className="bg-indigo-500 text-white rounded-full text-5xl p-3 shadow-lg " />
          </div>
          <div className="flex gap-2 text-sm mt-3">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthOrders}
            </span>
            <span className="text-gray-500">Last Month</span>
          </div>
        </div>
        <div className=" flex flex-col p-3 dark:bg-slate-800 md:w-72 w-full rounded-md shadow-md">
          <div className=" flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Total Products
              </h3>
              <p className="text-2xl">{totalProducts}</p>
            </div>
            <IoMdPricetag className="bg-lime-500 text-white rounded-full text-5xl p-3 shadow-lg " />
          </div>
          <div className="flex gap-2 text-sm mt-3">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthProducts}
            </span>
            <span className="text-gray-500">Last Month</span>
          </div>
        </div>
        <div className=" flex flex-col p-3 dark:bg-slate-800 md:w-72 w-full rounded-md shadow-md">
          <div className=" flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Total Sales (USD)
              </h3>
              <p className="text-2xl">${totalSales}</p>
            </div>
            <GiTakeMyMoney className="bg-green-400 text-white rounded-full text-5xl p-3 shadow-lg " />
          </div>
          <div className="flex gap-2 text-sm mt-3">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />${lastMonthSales}
            </span>
            <span className="text-gray-500">Last Month</span>
          </div>
        </div>
      </div>

      <div className="my-10 ">
        <h1 className="text-3xl p-10">
          Analytical representation of charts representing total (users, orders,
          products and sales)
        </h1>
        <div>
          <h1 className="text-2xl text-center underline">Bar Chart</h1>
          <BarChart />
        </div>
        <div className="my-20">
          <h1 className="text-2xl text-center underline">Pie Chart</h1>
          <PieChart />
        </div>
      </div>
    </div>
  );
};

export default DashStats;
