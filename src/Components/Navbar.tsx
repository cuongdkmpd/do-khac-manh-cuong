import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCheck } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../Context/Context";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../Firebase/Firebase";

const auth = getAuth(app);

const Navbar = () => {
  const { cartProduct, user, setUser } = useAuth();
  const navigate = useNavigate();

  // Đồng bộ context khi reload
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
    });

    return () => unsubscribe();
  }, [setUser]);

  const logout = () => {
    signOut(auth)
      .then(() => {
        setUser(null); // Xóa user khỏi context
        localStorage.removeItem("user"); // Xoá khỏi localStorage nếu có
        toast.warn("Logout successfully");
        navigate("/signup");
      })
      .catch((err) => {
        console.error("Logout Error:", err.message);
        toast.error("Logout failed");
      });
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light border">
        <div className="container-fluid">
          {/* Logo */}
          <div className="ml-2">
            <h1 className="text-2xl font-bold">E-Commerce</h1>
          </div>

          {/* Menu */}
          <div>
            <ul className="flex font-semibold">
              <li className="px-2">
                <Link to="/">Trang Chủ</Link>
              </li>
              <li className="px-2">
                <Link to="/about">Giới Thiệu</Link>
              </li>
              <li className="px-2">
                <Link to="/product">Sản Phẩm</Link>
              </li>
              <li className="px-2">
                <Link to="/mencloths">Thời Trang Nam</Link>
              </li>
              <li className="px-2">
                <Link to="/womencloths">Thời Trang Nữ</Link>
              </li>

              {!user && (
                <li className="px-2">
                  <Link to="/signup">Sign up</Link>
                </li>
              )}

              {user ? (
                <li className="px-2 cursor-pointer" onClick={logout}>
                  Logout
                </li>
              ) : (
                <li className="px-2 cursor-pointer">
                  <Link to="/login">Login</Link>
                </li>
              )}
            </ul>
          </div>

          {/* User Info & Cart */}
          <div>
            <form className="d-flex items-center" role="search">
              {user && (
                <>
                  <FaUserCheck className="text-3xl" />
                  <span className="text-xl font-semibold ml-2 mr-4">
                    {user.displayName || user.email}
                  </span>
                </>
              )}
              <Link to="/cart">
                <FaShoppingCart className="text-2xl me-2 cursor-pointer mx-2" />
              </Link>
              <span className="text-xl font-semibold">
                {cartProduct.length}
              </span>
            </form>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
