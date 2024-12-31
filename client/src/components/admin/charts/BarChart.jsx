import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { toast } from "react-toastify";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const [monthlyData, setMonthlyData] = useState({
    months: [],
    users: [],
    orders: [],
    sales: [],
    products: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        // Fetch users data
        const userRes = await fetch("/api/v1/user/getMonthlyUserData");
        const userData = await userRes.json();

        // Fetch orders data
        const orderAndSalesRes = await fetch(
          "/api/v1/order/getMonthlyOrderAndSalesData"
        );
        const orderAndSalesData = await orderAndSalesRes.json();

        // Fetch products data
        const productRes = await fetch("/api/v1/product/getMonthlyProductData");
        const productData = await productRes.json();

        if (userRes.ok && orderAndSalesRes.ok && productRes.ok) {
          setMonthlyData({
            months: userData.months, // Assume all APIs return data for the same months
            users: userData.monthlyUsers,
            orders: orderAndSalesData.monthlyOrders,
            sales: orderAndSalesData.monthlySales,
            products: productData.monthlyProducts,
          });
        } else {
          toast.error("Failed to fetch one or more datasets.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyData();
  }, []);

  const chartData = {
    labels: monthlyData.months,
    datasets: [
      {
        label: "Users",
        data: monthlyData.users,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Orders",
        data: monthlyData.orders,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Sales",
        data: monthlyData.sales,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
      {
        label: "Products",
        data: monthlyData.products,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Data (Users, Orders, Sales, Products)",
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-md max-w-4xl mx-auto">
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <>
          <Bar data={chartData} options={chartOptions} />
        </>
      )}
    </div>
  );
};

export default BarChart;
