import { useEffect, useState } from "react"
import type { Product } from "../types"
import { dummyProducts } from "../assets/assets"

const FlashDeals = () => {

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setProducts(dummyProducts.filter((p: any) => p.stock > 0))
    setLoading(false)
  }, [])

  return (
    <div>
      Flash Deals
    </div>
  )
}

export default FlashDeals
