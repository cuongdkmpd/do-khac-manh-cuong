import { useEffect, useState } from "react";
import { useAuth } from "../Context/Context";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { getDatabase, ref, get, set, remove } from "firebase/database";
import { app } from "../Firebase/Firebase";

const CartProduct = () => {
  const { cartProduct, setCartProduct, user } = useAuth();
  const database = getDatabase(app);
  const [showForm, setShowForm] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const fetchCart = async () => {
    if (!user) return;
    try {
      const cartRef = ref(database, `carts/${user.uid}`);
      const snapshot = await get(cartRef);
      if (snapshot.exists()) {
        setCartProduct(snapshot.val());
      } else {
        setCartProduct([]);
      }
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  };

  const updateCartInFirebase = async (updatedCart) => {
    if (!user) return;
    const cartRef = ref(database, `carts/${user.uid}`);
    await set(cartRef, updatedCart);
  };

  const increaseQuantity = (index: number) => {
    const newCart = cartProduct.map((item, i) =>
      i === index ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartProduct(newCart);
    updateCartInFirebase(newCart);
  };

  const decreaseQuantity = (index: number) => {
    const newCart = cartProduct.map((item, i) =>
      i === index && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCartProduct(newCart);
    updateCartInFirebase(newCart);
  };

  const deleteCartItem = (index: number) => {
    const newCart = cartProduct.filter((_, i) => i !== index);
    setCartProduct(newCart);
    updateCartInFirebase(newCart);
    toast.success("Deleted from cart");
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const orderData = {
      user: user.uid,
      items: cartProduct,
      shipping: shippingInfo,
      createdAt: new Date().toISOString(),
    };

    try {
      const orderRef = ref(database, `orders/${user.uid}_${Date.now()}`);
      await set(orderRef, orderData);

      // Clear cart
      const cartRef = ref(database, `carts/${user.uid}`);
      await remove(cartRef);
      setCartProduct([]);
      setShowForm(false);
      toast.success("Order placed successfully!");
      alert("🎉 Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ liên hệ sớm!");
    } catch (err) {
      console.error("Order failed:", err);
      toast.error("Failed to place order.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🛒 Your Cart</h2>

      {cartProduct.length === 0 ? (
        <p className="text-xl">No items in the cart...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            {cartProduct.map((item, index) => (
              <div key={index} className="border p-4 rounded shadow-md">
                <img src={item.image} alt={item.title} className="w-32 h-32 mx-auto" />
                <h3 className="font-semibold">{item.title}</h3>
                <p>Price: ${item.price}</p>
                <p>Total: ${item.price * item.quantity}</p>
                <div className="flex items-center gap-2 mt-2">
                  <FaCircleMinus
                    className="cursor-pointer"
                    onClick={() => decreaseQuantity(index)}
                  />
                  <span>{item.quantity}</span>
                  <FaCirclePlus
                    className="cursor-pointer"
                    onClick={() => increaseQuantity(index)}
                  />
                  <MdDelete
                    className="text-red-500 text-2xl cursor-pointer ml-auto"
                    onClick={() => deleteCartItem(index)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setShowForm(true)}
            >
              🛍️ Đặt hàng
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleOrder}
              className="mt-6 p-4 border rounded w-full max-w-lg bg-gray-50"
            >
              <h3 className="text-xl font-semibold mb-4">Thông tin giao hàng</h3>
              <input
                type="text"
                placeholder="Họ và tên"
                className="w-full p-2 mb-3 border rounded"
                required
                value={shippingInfo.name}
                onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Số điện thoại"
                className="w-full p-2 mb-3 border rounded"
                required
                value={shippingInfo.phone}
                onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
              />
              <input
                type="text"
                placeholder="Địa chỉ giao hàng"
                className="w-full p-2 mb-3 border rounded"
                required
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                ✅ Xác nhận đặt hàng
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default CartProduct;
