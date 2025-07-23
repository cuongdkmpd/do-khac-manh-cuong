import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database"; // Import Firebase Database
import { app } from "../Firebase/Firebase.tsx";
import { toast } from "react-toastify";

interface inputFormData {
    username: string;
    email: string;
    phone: string;
    password: string;
}

const Sighup = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null); // State to store email validation error
    const [formData, setFormData] = useState<inputFormData>({
        username: "",
        email: "",
        phone: "",
        password: "",
    });
    const auth = getAuth(app);
    const database = getDatabase(app); // Initialize Firebase Database

    const handleChangeData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        // Email validation
        if (formData.email === "") {
            setError("Please enter email");
            return;
        } else if (formData.email.indexOf("@") === 0) {
            setError("Email should not start with @");
            return;
        } else if (!formData.email.includes("@")) {
            setError("Email must contain @");
            return;
        } else if (
            formData.email.charAt(formData.email.length - 4) !== "." &&
            formData.email.charAt(formData.email.length - 3) !== "."
        ) {
            setError("Invalid email");
            return;
        } else {
            setError(null); // Clear error if email is valid
        }

        // Create user in Firebase Authentication
        createUserWithEmailAndPassword(auth, formData.email, formData.password)
            .then((res) => {
                const user = res.user;

                // Update user profile
                updateProfile(user, { displayName: formData.username });

                // Save user data to Firebase Realtime Database
                set(ref(database, `users/${user.uid}`), {
                    username: formData.username,
                    email: formData.email,
                    phone: formData.phone,
                });

                toast.success("Account created successfully!");
                navigate("/login");
            })
            .catch((err) => {
                toast.error(err.message);
                console.log(err);
            });
    };

    return (
        <>
            <div className="flex flex-wrap w-full justify-center items-center h-[94vh] bg-[#246b91]">
                <div className="sm:w-[48%] w-[100%] sm:mx-10 mx-2 h-[70vh] border my-10 rounded-3xl ">
                    <h1 className="text-4xl font-bold mt-8 text-center text-white">Sign Up</h1>
                    <form className="flex flex-col justify-center h-[70%] sm:w-[90%] w-[100%] sm:mx-12 mx-4 sm:my-4 my-1 ">
                        <label className="font-bold text-xl mt-5 mb-1 text-white">Username</label>
                        <input
                            className="w-[100%] h-[10%] rounded-md p-2 outline-none"
                            type="text"
                            placeholder="Name"
                            name="username"
                            onChange={handleChangeData}
                        />

                        <label className="font-bold text-xl mt-2 mb-1 text-white">Email</label>
                        <input
                            className="w-[100%] h-[10%] rounded-md p-2 outline-none"
                            type="text"
                            placeholder="Email"
                            name="email"
                            onChange={handleChangeData}
                        />
                        <span className="text-red-500">{error}</span>

                        <label className="font-bold text-xl mt-2 mb-1 text-white">Password</label>
                        <input
                            className="w-[100%] h-[10%] rounded-md p-2 outline-none"
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChangeData}
                        />

                        <button
                            className="w-[100%] h-[10%] rounded-md mt-10 bg-[#0f0f0f] text-white text20old outline-none"
                            onClick={handleSubmit}
                        >
                            Sign Up
                        </button>
                    </form>
                    <div className="flex w-[97%] my-4 sm:ml-24 ml-8">
                        <p className="text-white font-bold sm:text-xl text-[18px]">
                            Already have an account?
                        </p>
                        <Link to="/login">
                            <p className="text-white font-bold text-xl ml-2 cursor-pointer">Login</p>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sighup;