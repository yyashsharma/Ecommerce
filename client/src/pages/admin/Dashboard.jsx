import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../../components/admin/DashSidebar";
import DashProfile from "../../components/admin/DashProfile";
import DashMyOrders from "../../components/admin/DashMyOrders";
import DashCreateProduct from "../../components/admin/DashCreateProduct";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  // console.log(location);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56 ">
        {/* sidebar */}
        <DashSidebar />
      </div>

      {/* profile */}
      {tab === "profile" && <DashProfile />}

      {/* orders*/}
      {tab === "my-orders" && <DashMyOrders />}

      {/* create  product */}
      {tab === "create-product" && <DashCreateProduct />}

      {/* all  products */}
      {/* {tab === "products" && <DashProducts />} */}

      {/* users */}
      {/* {tab === "users" && <DashUsers />} */}

      {/* comments */}
      {/* {tab === "comments" && <DashComments />} */}

      {/* dashboard comp */}
      {/* {tab === "dash" && <DashboardComp />} */}
    </div>
  );
};

export default Dashboard;