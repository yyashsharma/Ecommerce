import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { toast } from "react-toastify";
import {
  signoutSuccess,
  deleteUserStart,
  deleteUserFailure,
} from "../redux/user/userSlice";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

const Header = () => {
  const path = useLocation().pathname;
  const location = useLocation();

  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [loading, setLoading] = useState(false);

  const [inputValue, setInputValue] = useState(""); // State to track input value

  const [totalCartItems, setTotalCartItems] = useState(0);

  const navigate = useNavigate();

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(location.search);
  //   const searchTermForUrl = urlParams.get("searchTerm");
  //   if (searchTermForUrl) {
  //     setSearchTerm(searchTermForUrl);
  //   }
  // }, [location.search]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!currentUser || !currentUser._id) {
        // If currentUser is null or _id is not defined, return early
        totalCartItems(0); // Reset cart details
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/cart/getCartItems/${currentUser._id}`);

        const data = await res.json();
        if (data.success === false) {
          return toast.error(data.message);
        }
        setTotalCartItems(data.cart.totalCartItems);
        setLoading(false);
      } catch (error) {
        toast.error(error);
        setLoading(false);
      }
    };
    fetchCartItems();
  }, [currentUser]);

  const dispatch = useDispatch();

  const handleSignout = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/v1/auth/signout`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure());
        return toast.error(data.message);
      }
      dispatch(signoutSuccess());
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
      dispatch(deleteUserFailure());
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // If inputValue is empty, navigate to all products
    const searchQuery = inputValue.trim()
      ? `?search=${encodeURIComponent(inputValue)}`
      : "";
    navigate(`/product-list${searchQuery}`);
  };

  return (
    <Navbar className="border-b-2 ">
      <Link
        to={"/"}
        className="self-center whitespace-nowrap text-md sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-l-full text-white">
          E
        </span>
        Buy
      </Link>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center items-center">
          <TextInput
            id="search"
            type="text"
            placeholder="Search..."
            // className="hidden lg:inline"
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
      </form>

      <div className="flex gap-4 mt-4 lg:mt-0 md:order-2 ">
        <Button
          gradientDuoTone="purpleToBlue"
          className="w-12 h-10 "
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        <Link to={"/cart"}>
          <Button
            gradientDuoTone="purpleToBlue"
            className="h-10 w-10 items-center"
          >
            <ShoppingCartIcon className="h-6 w-6 mt-2 mx-4" />
            <span className="inline-flex items-center mb-5 -ml-7 rounded-md bg-red-50 px-2  text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
              {totalCartItems}
            </span>
          </Button>
        </Link>

        {currentUser ? (
          <Dropdown
            arrowIcon={true}
            inline
            label={
              currentUser.profilePicture ? (
                <Avatar img={currentUser.profilePicture} alt="user" rounded />
              ) : (
                <Avatar rounded/>
              )
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{currentUser.username}</span>
              <span className="block truncate text-sm font-medium">
                {currentUser.email}
              </span>
            </Dropdown.Header>

            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to={"/sign-in"}>
            <Button gradientDuoTone="tealToLime" outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle className="ml-44" />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to={"/"}>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to={"/about"}>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/product-list"} as={"div"}>
          <Link to={"/product-list"}>All Products</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
