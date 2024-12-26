import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
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
import CreateProduct from "./pages/CreateProduct";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import OrderPlacedSuccess from "./pages/OrderPlacedSuccess";
import Dashboard from "./pages/Dashboard";

// import ScrollToTop from "./components/ScrollToTop";

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
        <Route
          path="/cart"
          element={<Cart buttonLink={"/checkout"} buttonText={"Checkout"} />}
        />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product-list" element={<ProductList />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />
        <Route path="/order-placed/success" element={<OrderPlacedSuccess />} />
        <Route
          path="/product-details/:productId"
          element={<ProductDetails />}
        />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-product" element={<CreateProduct />} />
          {/* <Route path="/update-product/:productId" element={<UpdatePost />} /> */}
        </Route>
      </Routes>
      <FooterComponent />
      <ToastContainer position="top-center" />
    </Router>
  );
}

export default App;
