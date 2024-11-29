import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { toast } from "react-toastify";
import { signoutSuccess } from "../redux/user/userSlice";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

const Header = () => {
  const path = useLocation().pathname;
  const location = useLocation();

  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermForUrl = urlParams.get("searchTerm");
    if (searchTermForUrl) {
      setSearchTerm(searchTermForUrl);
    }
  }, [location.search]);

  const dispatch = useDispatch();

  const handleSignout = async () => {
    // try {
    //   // dispatch(deleteUserStart());
    //   const res = await fetch(`/api/v1/user/signout`, {
    //     method: "POST",
    //   });
    //   const data = await res.json();
    //   if (data.success === false) {
    //     // dispatch(deleteUserFailure());
    //     return toast.error(data.message);
    //   }
    //   dispatch(signoutSuccess());
    //   toast.success(data.message);
    // } catch (error) {
    //   toast.error(error.message);
    //   // dispatch(deleteUserFailure());
    // }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // const urlParams = new URLSearchParams(location.search);
    // urlParams.set("searchTerm", searchTerm);
    // const searchQuery = urlParams.toString();
    // navigate(`/search?${searchQuery}`);
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
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          // value={searchTerm}
          // onChange={(e) => setSearchTerm(e.target.value)}
        ></TextInput>
      </form>

      <Button gradientDuoTone="tealToLime" className="w-12 h-10 lg:hidden" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button
          gradientDuoTone="purpleToBlue"
          className="w-12 h-10 hidden sm:inline"
          pill
          // onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        <Link to={"/cart"}>
          <Button gradientDuoTone="purpleToBlue" className="h-10 w-10 items-center">
            <ShoppingCartIcon className="h-6 w-6 mt-2 mx-4" />
            <span className="inline-flex items-center mb-5 -ml-7 rounded-md bg-red-50 px-2  text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
              7
            </span>
          </Button>
        </Link>

        {/* {currentUser ? ( */}
        <Dropdown
          arrowIcon={false}
          inline
          label={<Avatar alt="user" img={""} rounded />}
        >
          <Dropdown.Header>
            <span className="block text-sm">{"yash"}</span>
            <span className="block truncate text-sm font-medium">
              {"ys6845008@gmail.com"}
            </span>
          </Dropdown.Header>

          <Link to={"/dashboard?tab=profile"}>
            <Dropdown.Item>Profile</Dropdown.Item>
          </Link>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
        </Dropdown>
        {/* ) : ( */}

        <Link to={"/sign-in"}>
          <Button gradientDuoTone="tealToLime" outline>
            Sign In
          </Button>
        </Link>
        {/* )} */}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to={"/"}>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to={"/about"}>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to={"/projects"}>Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
