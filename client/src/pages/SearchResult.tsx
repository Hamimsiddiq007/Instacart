import { useEffect, useState } from "react";
import type { Product } from "../types";
import { Link, useSearchParams } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import { Home } from "lucide-react";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-app-text-light mb-6">
          <Link to="/" className="hover:text-app-green transition-colors">
            <Home className="size-4" />
          </Link>
          <span>/</span>
          <span className="text-app-green font-medium">
            Search Results
          </span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-app-green mb-1">Search results for "{query}"</h1>
          <p className="text-sm text-app-text-light">{loading ? "Searching..." : `${products.length} items found`}</p>
        </div>

      </div>
    </div>
  )
}

export default SearchResult
