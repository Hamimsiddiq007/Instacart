import { BikeIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Navbar = () => {
  const user: any = {
    name: "Avinash",
    email: "admin@example.com",
    isAdmin: true,
  };
  const { cartCount, setIsCartOpen } = {
    cartCount: 5,
    setIsCartOpen: (_data: any) => {},
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [userManuOpen, setUserManuOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-app-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-[22px] font-medium shrink-0"
        >
          <BikeIcon size={24} className="" />
          <span>Instacart</span>
        </Link>

        <div className="w-full flex items-center justify-end gap-4 lg:gap-10">
            {/* Navlink - Desktop */}
            <div className="hidden md:flex items-center gap-6 text-sm text-zinc-600">
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/deals" className="text-orange-500">Deals</Link>
            </div>
            {/* Search Bar */}
            <form className="hidden sm:flex flex-1 max-w-sm text-xs sm:text-sm">
                <div className="relative w-full">
                    <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                    <input type="text" placeholder="Search for groceries..."
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-8 p-2 bg-orange-50 rounded-full ring ring-app-orange/15 focus:ring-app-orange/30" />
                </div>
            </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
