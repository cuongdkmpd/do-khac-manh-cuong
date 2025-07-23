import { useEffect, useState } from "react";
import { getDatabase, ref, get, set, remove } from "firebase/database";
import { app } from "../Firebase/Firebase";
import { toast } from "react-toastify";

interface Product {
  id: number;
  title: string;
  price: string;
  category: string;
  description: string;
  quantity: number;
  rating: { rate: number; count: number };
}

interface Order {
  id: number;
  customerName: string;
  address: string;
  phone: string;
  items: {
    title: string;
    quantity: number;
    price: string;
  }[];
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Product>({
    id: Date.now(),
    title: "",
    price: "",
    category: "",
    description: "",
    quantity: 1,
    rating: { rate: 0, count: 0 },
  });

  const db = getDatabase(app);

  // PRODUCT CRUD
  const fetchProducts = async () => {
    const refData = ref(db, "products");
    const snapshot = await get(refData);
    if (snapshot.exists()) {
      const data = snapshot.val();
      setProducts(Object.values(data) as Product[]);
    } else {
      setProducts([]);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const refProduct = ref(db, `products/${form.id}`);
    await set(refProduct, form);
    toast.success(editingProduct ? "Cập nhật sản phẩm thành công" : "Thêm sản phẩm thành công");
    setForm({
      id: Date.now(),
      title: "",
      price: "",
      category: "",
      description: "",
      quantity: 1,
      rating: { rate: 0, count: 0 },
    });
    setEditingProduct(null);
    fetchProducts();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setForm(product);
  };

  const handleDeleteProduct = async (id: number) => {
    await remove(ref(db, `products/${id}`));
    toast.success("Xoá sản phẩm thành công");
    fetchProducts();
  };

  // ORDER
  const fetchOrders = async () => {
    const refOrders = ref(db, "orders");
    const snapshot = await get(refOrders);
    if (snapshot.exists()) {
      const data = snapshot.val();
      setOrders(Object.values(data) as Order[]);
    } else {
      setOrders([]);
    }
  };

  useEffect(() => {
    if (activeTab === "products") fetchProducts();
    else fetchOrders();
  }, [activeTab]);

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 font-semibold rounded ${activeTab === "products" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          🛠 Quản lý sản phẩm
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 font-semibold rounded ${activeTab === "orders" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          📦 Quản lý đơn hàng
        </button>
      </div>

      {activeTab === "products" && (
        <>
          <form onSubmit={handleProductSubmit} className="bg-gray-100 p-4 rounded mb-6">
            <h3 className="text-lg font-semibold mb-3">{editingProduct ? "✏️ Sửa sản phẩm" : "➕ Thêm sản phẩm"}</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Tên sản phẩm"
                className="p-2 border rounded"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Giá"
                className="p-2 border rounded"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Danh mục"
                className="p-2 border rounded"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <input
                type="number"
                placeholder="Số lượng"
                className="p-2 border rounded"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })}
              />
            </div>
            <textarea
              placeholder="Mô tả"
              className="w-full mt-3 p-2 border rounded"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <button type="submit" className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {editingProduct ? "💾 Cập nhật" : "➕ Thêm mới"}
            </button>
          </form>

          <table className="table-auto w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Tên</th>
                <th className="p-2 border">Giá</th>
                <th className="p-2 border">Danh mục</th>
                <th className="p-2 border">Số lượng</th>
                <th className="p-2 border">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="p-2 border">{product.title}</td>
                  <td className="p-2 border">${product.price}</td>
                  <td className="p-2 border">{product.category}</td>
                  <td className="p-2 border">{product.quantity}</td>
                  <td className="p-2 border">
                    <button onClick={() => handleEditProduct(product)} className="bg-yellow-500 px-3 py-1 rounded text-white mr-2">
                      Sửa
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-600 px-3 py-1 rounded text-white">
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {activeTab === "orders" && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">📦 Danh sách đơn hàng</h3>
          {orders.length === 0 ? (
            <p>Chưa có đơn hàng nào.</p>
          ) : (
            orders.map((order, idx) => (
              <div key={idx} className="border p-3 mb-4 rounded bg-gray-50">
                <p><strong>👤 Khách:</strong> {order.customerName}</p>
                <p><strong>📍 Địa chỉ:</strong> {order.address}</p>
                <p><strong>📞 SĐT:</strong> {order.phone}</p>
                <p className="mt-2"><strong>🛒 Sản phẩm:</strong></p>
                <ul className="list-disc ml-5">
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.title} × {item.quantity} — ${item.price}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
