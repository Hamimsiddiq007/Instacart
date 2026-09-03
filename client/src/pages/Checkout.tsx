import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext";
import { dummyAddressData } from "../assets/assets";
import type { Address } from "../types";

const Checkout = () => {

  const navigate = useNavigate()
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";

  const {items, cartTotal} = useCart();
  const {user} = {user: {addresses: dummyAddressData}}

  const [step, setStep] = useState("address");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<Address>({
    _id: "",
    label: "Home",
    address: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
    lat: 0,
    lng: 0
  })

  const [paymentMethod, setPaymentMethod] = useState("card");

  const deliveryFee = cartTotal > 20 ? 0 : 1.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + deliveryFee + tax;

  return (
    <div>
      Checkout
    </div>
  )
}

export default Checkout
