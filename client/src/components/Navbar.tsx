import { BikeIcon } from "lucide-react";
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
      </div>
    </nav>
  );
};

export default Navbar;
