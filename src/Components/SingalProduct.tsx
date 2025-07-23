import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../Context/Context";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { getDatabase, ref, get, set } from "firebase/database";
import { app } from "../Firebase/Firebase";
import { toast } from "react-toastify";

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

const SingalProduct = () => {
  const auth = getAuth(app);
  const database = getDatabase(app);
  const { user } = useAuth();
  const [product, setProduct] = useState<productData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { id } = useParams<{ id: string }>();

  // Fetch all products and filter one
  const fetchProduct = async () => {
    try {
      const dbRef = ref(database, "products");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const productsArray = Object.values(data) as productData[];
        const found = productsArray.find((p) => p.id === parseInt(id || ""));
        if (found) setProduct(found);
      } else {
        toast.error("No product found!");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  // Listen auth changes
  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      setIsAuthenticated(!!u);
    });
  }, []);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.warning("You must login to add product to cart");
      return;
    }

    if (!product) return;

    const cartRef = ref(database, `carts/${user.uid}`);
    try {
      const snapshot = await get(cartRef);
      let cart: productData[] = [];

      if (snapshot.exists()) {
        cart = snapshot.val();
      }

      const existingIndex = cart.findIndex((item) => item.id === product.id);
      if (existingIndex !== -1) {
        // Increase quantity
        cart[existingIndex].quantity += 1;
      } else {
        // Add new product with quantity 1
        cart.push({ ...product, quantity: 1 });
      }

      await set(cartRef, cart);
      toast.success("Added to cart successfully!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add to cart.");
    }
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-3xl">
        Loading product...
      </div>
    );
  }

  return (
    <div className="flex justify-center navbar-light bg-light pt-8 h-[100vh]">
      <div className="px-2 py-2 w-[40vw] mt-10">
        <div className="card cursor-pointer">
          <img
            src={product.image}
            className="card-img-top w-[200px] h-[200px] mx-auto mt-4"
            alt={product.title}
          />
          <div className="card-body mx-2">
            <h2 className="card-title font-bold">{product.title}</h2>
            <p className="card-text font-semibold">Price: ${product.price}</p>
            <p className="card-text font-semibold">Rating: {product.rating.rate}</p>

            <button
              className="btn btn-primary mt-3 font-semibold"
              onClick={handleAddToCart}
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingalProduct;
