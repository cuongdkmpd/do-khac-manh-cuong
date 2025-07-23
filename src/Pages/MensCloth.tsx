import { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database"; // Import Firebase Database
import { app } from "../Firebase/Firebase"; // Import Firebase configuration
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";

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

const MensCloth = () => {
    const [productData, setProductData] = useState<productData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

    // Fetch data from Firebase Realtime Database
    const getData = async () => {
        try {
            const db = getDatabase(app); // Initialize Firebase Database
            const dbRef = ref(db, "products"); // Reference to the "products" node
            const snapshot = await get(dbRef);

            if (snapshot.exists()) {
                const data = snapshot.val();
                const productsArray = Object.values(data) as productData[]; // Convert object to array
                const mensClothing = productsArray.filter(
                    (product) => product.category.toLowerCase() === "men's clothing"
                ); // Filter for men's clothing
                setProductData(mensClothing); // Set filtered data to state
                setIsLoading(false); // Set loading to false
            } else {
                console.log("No data available");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error fetching data from Firebase:", error);
            setIsError(true);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getData(); // Fetch data on component mount
    }, []);

    if (isLoading) {
        return (
            <div className="text-4xl flex justify-center items-center h-[84vh] font-bold">
                Loading ...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-4xl flex justify-center items-center h-[84vh] font-bold">
                Error fetching data
            </div>
        );
    }

    return (
        <>
            <div>
                <div className="navbar-light bg-light pt-8">
                    <div className="w-full flex justify-center">
                        <h1 className="text-3xl font-bold my-10">
                            Thời Trang Nam: {productData.length}
                        </h1>
                    </div>
                    <div className="p-2 grid grid-cols-4">
                        {productData.map((currData, index) => (
                            <Link to={`/product/${currData.id}`} key={index}>
                                <div className="px-2 py-2">
                                    <div className="card cursor-pointer">
                                        <img
                                            src={currData.image}
                                            className="card-img-top w-[200px] h-[200px] mx-auto mt-4"
                                        />
                                        <div className="card-body mx-2">
                                            <h2 className="card-title font-bold">{currData.title}</h2>
                                            <p className="card-text font-semibold">$: {currData.price}</p>
                                            <p className="card-text font-semibold">
                                                Rating: {currData.rating.rate}
                                            </p>
                                            <button className="btn btn-primary mt-3 font-semibold">
                                                Thêm Vào Giỏ
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MensCloth;