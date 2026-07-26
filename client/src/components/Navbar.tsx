import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const user: any = {name: "Avinash", email: "admin@example.com", isAdmin: true};
    const {cartCount, setIsCartOpen} = {
        cartCount: 5,
        setIsCartOpen: (_data: any) => {}
    }
    const [searchQuery, setSearchQuery] = useState("");
    const [userManuOpen, setUserManuOpen] = useState(false);

    const navigate = useNavigate();

  return (
    <div>
      Navbar component
    </div>
  )
}

export default Navbar
