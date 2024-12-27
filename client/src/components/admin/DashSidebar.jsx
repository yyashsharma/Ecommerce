import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiAnnotation,
  HiArrowSmRight,
  HiChartPie,
  HiDocumentText,
  HiOutlineUserGroup,
  HiUser,
} from "react-icons/hi";
import { GiShoppingBag, GiShoppingCart } from "react-icons/gi";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { signoutSuccess } from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaShoppingBag } from "react-icons/fa";

const DashSidebar = () => {
  const { currentUser } = useSelector((state) => state.user);

  const location = useLocation();
  const [tab, setTab] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      // dispatch(deleteUserStart());
      const res = await fetch(`/api/v1/auth/signout`, {
        method: "POST",
      });

      const data = await res.json();
      if (data.success === false) {
        // dispatch(deleteUserFailure());
        return toast.error(data.message);
      }
      dispatch(signoutSuccess());
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
      // dispatch(deleteUserFailure());
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser && currentUser.isAdmin && (
            <Link to={"/dashboard?tab=dash"}>
              <Sidebar.Item
                active={tab === "dash" || !tab}
                icon={HiChartPie}
                as="div"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Link to={"/dashboard?tab=my-orders"}>
            <Sidebar.Item
              active={tab === "my-orders"}
              icon={GiShoppingBag}
              labelColor="dark"
              as="div"
            >
              My Orders
            </Sidebar.Item>
          </Link>

          {currentUser && currentUser.isAdmin && (
            <Link to={"/dashboard?tab=manage-orders"}>
              <Sidebar.Item
                active={tab === "manage-orders"}
                icon={GiShoppingCart}
                as="div"
              >
                Manage Orders
              </Sidebar.Item>
            </Link>
          )}
          {currentUser && currentUser.isAdmin && (
            <Link to={"/dashboard?tab=create-product"}>
              <Sidebar.Item
                active={tab === "create-product"}
                icon={FaShoppingBag}
                as="div"
              >
                Create Product
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to={"/dashboard?tab=products"}>
              <Sidebar.Item
                active={tab === "products"}
                icon={HiDocumentText}
                as="div"
              >
                All Products
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <>
              <Link to={"/dashboard?tab=users"}>
                <Sidebar.Item
                  active={tab === "users"}
                  icon={HiOutlineUserGroup}
                  as="div"
                >
                  All Users
                </Sidebar.Item>
              </Link>
              {/* <Link to={"/dashboard?tab=comments"}>
                <Sidebar.Item
                  active={tab === "comments"}
                  icon={HiAnnotation}
                  as="div"
                >
                  Comments
                </Sidebar.Item>
              </Link> */}
            </>
          )}

          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
