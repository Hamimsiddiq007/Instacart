import { createContext, use, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartItem, Product } from "../types";

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {

    const [items, setItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('app_cart');
        return saved ? JSON.parse(saved) : [];
    })

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('app_cart', JSON.stringify(items));
    }, [items]);

    return <CartContext.Provider value={{}}>
        {children}
    </CartContext.Provider>
}

export function useCart(){
    const context = useContext(CartContext);
    if(!context) throw new Error("useCart must be used within a CartProvider");
    return context
}

