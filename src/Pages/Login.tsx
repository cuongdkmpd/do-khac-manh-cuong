import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../Firebase/Firebase.tsx";
import { toast } from "react-toastify";
import { useAuth } from "../Context/Context"; // Import useAuth

interface inputFormData {
    email: string;
    password: string;
}

const auth = getAuth(app);

const Login = () => {
    const { setUser } = useAuth(); // Get setUser from Context
    const navigate = useNavigate();
    const [error, setError] = useState<Partial<inputFormData>>({});
    const [formData, setFormData] = useState<inputFormData>({
        email: "",
        password: "",
    });

    const handleChangeData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        let showErrorMessage: Partial<inputFormData> = {};

        // Email validation
        if (formData.email === "") {
            showErrorMessage.email = "Please enter email";
        } else if (formData.email.indexOf("@") === 0) {
            showErrorMessage.email = "Email should not start with @";
        } else if (!formData.email.includes("@")) {
            showErrorMessage.email = "Email must contain @";
        } else if (
            formData.email.charAt(formData.email.length - 4) !== "." &&
            formData.email.charAt(formData.email.length - 3) !== "."
        ) {
            showErrorMessage.email = "Invalid email";
        } else {
            setError({ email: "" });
        }

        // Password validation
        if (formData.password === "") {
            showErrorMessage.password = "Please enter your password";
        } else {
            setError({ password: "" });
        }

        // If there are validation errors, stop execution
        if (Object.keys(showErrorMessage).length > 0) {
            setError(showErrorMessage);
            return;
        }

        // Firebase Authentication
        signInWithEmailAndPassword(auth, formData.email, formData.password)
            .then((res) => {
                setUser(res.user); // Update user in Context
                toast.success("Login Successfully");
                navigate("/");
            })
            .catch((err) => {
                if (err.code === "auth/user-not-found") {
                    setError({ email: "Email not found. Please check your email." });
                } else if (err.code === "auth/wrong-password") {
                    setError({ password: "Incorrect password. Please try again." });
                } else {
                    toast.error(err.message);
                }
            });
    };

    return (
        <>
            <div className="flex flex-wrap w-full justify-center items-center h-[94vh] bg-[#246b91]">
                <div className="sm:w-[48%] w-[100%] sm:mx-10 mx-2 h-[65vh] border my-10 rounded-3xl ">
                    <h1 className="text-4xl font-bold mt-8 text-center text-white">Login</h1>
                    <form className="flex flex-col justify-center h-[70%] sm:w-[90%] w-[100%] sm:mx-12 mx-4 sm:my-4 my-1 ">
                        <label className="font-bold text-xl mt-2 mb-1 text-white">Email</label>
                        <input
                            className="w-[100%] h-[10%] rounded-md p-2 outline-none"
                            type="text"
                            placeholder="Email"
                            name="email"
                            onChange={handleChangeData}
                        />
                        <span className="text-red-500">{error.email}</span>

                        <label className="font-bold text-xl mt-2 mb-1 text-white">Password</label>
                        <input
                            className="w-[100%] h-[10%] rounded-md p-2 outline-none"
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChangeData}
                        />
                        <span className="text-red-500">{error.password}</span>

                        <button
                            className="w-[100%] h-[10%] rounded-md mt-10 bg-[#0f0f0f] text-white text20old outline-none"
                            onClick={handleSubmit}
                        >
                            Login
                        </button>
                    </form>
                    <div className="flex w-[44%] ml-36">
                        <p className="text-white font-bold sm:text-xl text-[18px]">Not a Member ?</p>
                        <Link to="/signup">
                            <p className="text-white font-bold text-xl ml-2 cursor-pointer">Sign up</p>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;