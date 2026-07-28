import { useEffect, useState } from "react";
import type { Product } from "../types";
import { dummyProducts } from "../assets/assets";


const PopularProducts = () => {

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() =>{
        setProducts(dummyProducts.slice(0, 10))
    })

  return (
    <section className="pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <div className="">
                <h2 className="text-2xl font-semibold">Popular Products</h2>
                <p className="text-sm text-app-text-light mt-1">Top-rated products this season</p>
            </div>
        </div>
      </div>
    </section>
  )
}

export default PopularProducts
