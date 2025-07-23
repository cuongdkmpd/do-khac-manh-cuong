// Context.tsx
import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "../Firebase/Firebase";

interface AuthContextType {
    cartProduct: productData[];
    setCartProduct: (cartItems: productData[]) => void;
    addToCart: (productItem: productData) => void;
    user: User | null;
    setUser: (user: User | null) => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

interface productData {
    id: number;
    title: string;
    price: string;
    image: string;
    category: string;
    description: string;
    quantity: number;
    rating: {
        rate: number;
        count: number;
    };
}

const AuthContext = createContext<AuthContextType>({
    cartProduct: [],
    setCartProduct: () => {},
    addToCart: () => {},
    user: null,
    setUser: () => {},
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [cartProduct, setCartProduct] = useState<productData[]>(() => {
        const cartItem = JSON.parse(localStorage.getItem("cartItem") || "[]");
        return cartItem;
    });

    const [user, setUserState] = useState<User | null>(null);
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser || null);
        });
        return () => unsubscribe();
    }, [auth]);

    // Đồng bộ user vào localStorage
    const setUser = (user: User | null) => {
        setUserState(user);
        if (user) {
            localStorage.setItem("user", JSON.stringify({ uid: user.uid, email: user.email }));
        } else {
            localStorage.removeItem("user");
        }
    };

    // Khôi phục user từ localStorage nếu cần (optionally)
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser && !user) {
            // Không set lại firebase User được, nhưng giữ lại trong local nếu cần xử lý riêng
            setUserState(JSON.parse(storedUser));
        }
    }, []);

    const addToCart = (productItem: productData) => {
        if (!user) {
            toast.error("You must be logged in to add items to the cart.");
            return;
        }
        const updatedCart = [...cartProduct, { ...productItem, quantity: 1 }];
        setCartProduct(updatedCart);
        localStorage.setItem("cartItem", JSON.stringify(updatedCart));
        toast.success("Product added successfully");
    };

    return (
        <AuthContext.Provider value={{ cartProduct, setCartProduct, addToCart, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
