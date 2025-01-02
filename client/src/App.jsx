import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "flowbite-react";

const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Header = lazy(() => import("./components/Header"));
const FooterComponent = lazy(() => import("./components/Footer"));
const ProductList = lazy(() => import("./components/product-list/ProductList"));
const About = lazy(() => import("./pages/About"));
const Home = lazy(() => import("./pages/Home"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const PrivateRoute = lazy(() => import("./components/PrivateRoute"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentCancel = lazy(() => import("./pages/PaymentCancel"));
const OrderPlacedSuccess = lazy(() => import("./pages/OrderPlacedSuccess"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ScrollToTop = lazy(() => import("./components/ScrollToTop"));

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <>
            <div className=" flex justify-center items-center h-screen">
              <Spinner size="xl" />
            </div>
          </>
        }
      >
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />

          <Route path="/product-list" element={<ProductList />} />

          <Route
            path="/product-details/:productId"
            element={<ProductDetails />}
          />
          <Route
            path="/cart"
            element={<Cart buttonLink={"/checkout"} buttonText={"Checkout"} />}
          />

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
            <Route
              path="/order-placed/success"
              element={<OrderPlacedSuccess />}
            />
          </Route>
          {/* <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/update-product/:productId" element={<UpdatePost />} />
        </Route> */}
        </Routes>
        <FooterComponent />
        <ToastContainer position="top-center" />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
