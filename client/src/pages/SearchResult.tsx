import { useEffect, useState } from "react";
import type { Product } from "../types";
import { useSearchParams } from "react-router-dom";
import { dummyProducts } from "../assets/assets";

const SearchResult = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  useEffect(()=> {
    if(!query) return;
    setLoading(true);
    setProducts(dummyProducts.filter((p: any) => p.name.toLowerCase().includes(query.toLowerCase())));
    setLoading(false);
  },[query])

  return (
    <div className="min-h-screen bg-app-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"></div>
    </div>
  )
}

export default SearchResult
