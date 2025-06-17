import React, { useState } from "react";
import axios from "axios";
import Header from "../../components/Header.tsx";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [nameError, setNameError] = useState<string | null>(null);
    const [surnameError, setSurnameError] = useState<string | null>(null);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validateName = (value: string) => {
        if (!/^[A-ZА-Я][a-zа-я]{1,}$/.test(value)) {
            setNameError("Name must start with a capital letter and contain only letters, at least 2 characters.");
        } else {
            setNameError(null);
        }
    };

    const validateSurname = (value: string) => {
        if (!/^[A-ZА-Я][a-zа-я]{1,}$/.test(value)) {
            setSurnameError("Surname must start with a capital letter and contain only letters, at least 2 characters.");
        } else {
            setSurnameError(null);
        }
    };

    const validateLogin = (value: string) => {
        if (value.length < 2) {
            setLoginError("Username must be at least 2 characters.");
        } else {
            setLoginError(null);
        }
    };

    const validatePassword = (value: string) => {
        if (value.length < 6) {
            setPasswordError("Password must be at least 6 characters.");
        } else {
            setPasswordError(null);
        }
    };

    const handleRegister = async () => {
        setError(null);

        // Check if all fields are filled
        if (!name || !surname || !login || !password) {
            setError("Please fill in all fields.");
            return;
        }

        // Validation before sending
        validateName(name);
        validateSurname(surname);
        validateLogin(login);
        validatePassword(password);

        if (nameError || surnameError || loginError || passwordError) {
            return;
        }

        try {
            await axios.post("http://localhost:8080/api/register", {
                name,
                surname,
                login,
                password,
            });

            navigate("/login");
        } catch (error) {
            setError("This user already exists.");
        }
    };

    return (
        <div>
            <Header />
            <div className="mx-[35vw] flex flex-column items-center justify-center mt-[10vh]">
                <form className="space-y-4 items-center w-full">
                    <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
                        Register
                    </h1>

                    {/* Name field */}
                    <div>
                        <label className="block text-sm font-montserratRegular font-medium text-gray-700">
                            Name:
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                validateName(e.target.value);
                            }}
                            className="mt-1 block w-full font-montserratRegular p-2 border border-gray-300 rounded-md"
                            placeholder="Enter name"
                        />
                        {nameError && <div className="text-red-500">{nameError}</div>}
                    </div>

                    {/* Surname field */}
                    <div>
                        <label className="block text-sm font-montserratRegular font-medium text-gray-700">
                            Surname:
                        </label>
                        <input
                            type="text"
                            value={surname}
                            onChange={(e) => {
                                setSurname(e.target.value);
                                validateSurname(e.target.value);
                            }}
                            className="mt-1 block w-full font-montserratRegular p-2 border border-gray-300 rounded-md"
                            placeholder="Enter surname"
                        />
                        {surnameError && <div className="text-red-500">{surnameError}</div>}
                    </div>

                    {/* Username field */}
                    <div>
                        <label className="block text-sm font-montserratRegular font-medium text-gray-700">
                            Username:
                        </label>
                        <input
                            type="text"
                            value={login}
                            onChange={(e) => {
                                setLogin(e.target.value);
                                validateLogin(e.target.value);
                            }}
                            className="mt-1 block w-full font-montserratRegular p-2 border border-gray-300 rounded-md"
                            placeholder="Enter username"
                        />
                        {loginError && <div className="text-red-500">{loginError}</div>}
                    </div>

                    {/* Password field */}
                    <div>
                        <label className="block text-sm font-montserratRegular font-medium text-gray-700">
                            Password:
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    validatePassword(e.target.value);
                                }}
                                className="mt-1 block w-full p-2 font-montserratRegular border border-gray-300 rounded-md"
                                placeholder="Enter password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {passwordError && <div className="text-red-500">{passwordError}</div>}
                    </div>

                    {/* General error display */}
                    {error && <div className="text-red-500">{error}</div>}

                    {/* Register button */}
                    <button
                        type="button"
                        onClick={handleRegister}
                        className="bg-dark-purple w-full font-montserratRegular text-center text-white py-2 px-4 rounded-full"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
