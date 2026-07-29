import { useNavigate } from "react-router-dom";
import type { Product } from "../types"

interface Props {
    product: Product;
}

const ProductCard = ({product}: Props) => {
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL;
    const {addToCart} = {addToCart: (_data: any) => {}}
    const navigate = useNavigate()
  return (
    <div>
      
    </div>
  )
}

export default ProductCard
