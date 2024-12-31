import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
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

const PieChart = () => {
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
    labels: ["Users", "Orders", "Sales", "Products"],
    datasets: [
      {
        data: [
          monthlyData.users.reduce((acc, val) => acc + val, 0),
          monthlyData.orders.reduce((acc, val) => acc + val, 0),
          monthlyData.sales.reduce((acc, val) => acc + val, 0),
          monthlyData.products.reduce((acc, val) => acc + val, 0),
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
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
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-md max-w-4xl mx-auto">
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <>
          <div className="w-96 mx-auto">
            <Pie data={chartData} options={chartOptions} />
          </div>
        </>
      )}
    </div>
  );
};

export default PieChart;
