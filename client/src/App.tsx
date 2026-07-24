import { Toaster } from "react-hot-toast"
import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import AppLayout from "./pages/AppLayout"
import Home from "./pages/Home"
import Products from "./pages/Products"
import ProductPage from "./pages/ProductPage"
import SearchResult from "./pages/SearchResult"
import FlashDeals from "./pages/FlashDeals"
import Checkout from "./pages/Checkout"
import MyOrders from "./pages/MyOrders"
import OrderTracking from "./pages/OrderTracking"
import Address from "./pages/Address"
import ProtectedRoute from "./components/ProtectedRoute"


const App = () => {
  return (
    <>
    <Toaster position="top-right" toastOptions={{duration: 3000, style: {background: '#1B3022', color: '#fff', borderRadius: '12px', fontSize: '14px'}}} />

    <Routes>
      {/* Login page */}
      <Route path="/login" element={<Login />} />

      {/* Main pages */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductPage />} />
        <Route path="search" element={<SearchResult />} />
        <Route path="deals" element={<FlashDeals />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute/>}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="orders/:id" element={<OrderTracking />} />
          <Route path="address" element={<Address />} />
        </Route>
      </Route>
    </Routes>
     
    </>
  )
}

export default App
