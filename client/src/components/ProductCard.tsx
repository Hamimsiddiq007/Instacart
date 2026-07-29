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
    <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-md transition-all duration-300 group animate-fade-in cursor-pointer" onClick={() => navigate(`/products/${product._id}`)}>
      {/* Image */}
      <div className="">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover p-4 group-hover:p-2 transition-all duration-300" />
      </div>
      
    </div>
  )
}

export default ProductCard
