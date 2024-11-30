import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
// import Projects from "./pages/Projects";
// import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FooterComponent from "./components/Footer";
import ProductList from "./components/product-list/ProductList";
import About from "./pages/About";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductDetails from "./pages/ProductDetails";
// import PrivateRoute from "./components/PrivateRoute";
// import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
// import CreatePost from "./pages/CreatePost";
// import UpdatePost from "./pages/UpdatePost";
// import PostPage from "./pages/PostPage";
// import ScrollToTop from "./components/ScrollToTop";
// import Search from "./pages/Search";
// import UpdateApprovedPost from "./pages/UpdateApprovedPost";

function App() {


  return (
    <Router>
      {/* <ScrollToTop /> */}
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product-details" element={<ProductDetails />} />


        {/* <Route path="/search" element={<Search />} /> */}
        {/* <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route> */}
        {/* <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
          <Route path="/update-approved-post/:postId" element={<UpdateApprovedPost />} />
        </Route> */}
        {/* <Route path="/projects" element={<Projects />} />
        <Route path="/post/:postSlug" element={<PostPage />} /> */}
      </Routes>
      <FooterComponent />
      <ToastContainer position="top-center" />
    </Router>
  )
}

export default App
