import React, { useEffect, useState } from "react";
import ProductCardData from "../Components/ProductCardData";
import Footer from "../Components/Footer.tsx";
import { Link } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database"; // Import Firebase Database
import { app } from "../Firebase/Firebase"; // Import Firebase configuration

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

const Product = () => {
    const [productData, setProductData] = useState<productData[]>([]); // State to store product data
    const [search, setSearch] = useState<String>(""); // State for search functionality

    // Fetch data from Firebase Realtime Database
    const getData = async () => {
        try {
            const db = getDatabase(app); // Initialize Firebase Database
            const dbRef = ref(db, "products"); // Reference to the "products" node
            const snapshot = await get(dbRef);

            if (snapshot.exists()) {
                const data = snapshot.val();
                const productsArray = Object.values(data) as productData[]; // Convert object to array
                setProductData(productsArray); // Set fetched data to state
            } else {
                console.log("No data available");
            }
        } catch (error) {
            console.error("Error fetching data from Firebase:", error);
        }
    };

    useEffect(() => {
        getData(); // Fetch data on component mount
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const productFilterData = productData.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase())
    ); // Search functionality logic here

    if (!productData.length) {
        return (
            <div className="text-4xl flex justify-center items-center h-[84vh] font-bold">
                Loading ...
            </div>
        );
    }

    return (
        <>
            <div className="navbar-light bg-light pt-8">
                <div className="text-4xl font-bold text-center mb-4 ">Products</div>
                <div>
                    <form className="d-flex flex justify-center " role="search">
                        <input
                            className="form-control me-2 max-w-[40%] mb-4 "
                            type="search"
                            placeholder="Search Products"
                            aria-label="Search"
                            onChange={handleSearch}
                        />
                    </form>
                </div>
                <div className="p-2 grid grid-cols-4 ">
                    {productFilterData.map((product, index) => (
                        <Link to={`/product/${product.id}`} key={index}>
                            <ProductCardData productMap={product} />
                        </Link>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Product;