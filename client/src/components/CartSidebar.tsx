import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartSidebar = () => {

    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$';

    const {items, updateQuantity, removeFromCart, cartTotal, isCartOpen, setIsCartOpen} = useCart();

    const navigate = useNavigate();

    if(!isCartOpen) return null;

    const delivaryFee = cartTotal > 20 ? 0 : 1.99;
    const  grandTotal = cartTotal + delivaryFee;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-50 transition-opacity" />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">

      </div>
    </>
  )
}

export default CartSidebar
