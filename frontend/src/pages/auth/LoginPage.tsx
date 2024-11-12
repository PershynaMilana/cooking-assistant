import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const LoginPage: React.FC = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError(null);

        if (!login || !password) {
            setError("Заповніть всі поля.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/api/login", {
                login,
                password,
            });

            console.log("http://localhost:8080/api/login", login, password)

            const { token } = response.data;
            localStorage.setItem("authToken", token);
            navigate("/main");
        } catch (error: unknown) {
            setError("Неправильне ім'я користувача або пароль.");
        }
    };

    return (
        <div>
            <Header />
            <div className="mx-[35vw] flex flex-column items-center justify-center mt-[15vh]">
                <form className="space-y-4 items-center w-full">
                    <h1 className="text-relative-h3 items-center my-[7vh] font-kharkiv font-bold mb-4">
                        Вхід
                    </h1>

                    {/* Поле логина */}
                    <div>
                        <label className="block text-sm font-montserratRegular font-medium text-gray-700">
                            Ім'я користувача:
                        </label>
                        <input
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            className="mt-1 block w-full font-montserratRegular p-2 border border-gray-300 rounded-md"
                            placeholder="Введіть ім'я користувача"
                        />
                    </div>

                    {/* Поле пароля */}
                    <div>
                        <label className="block text-sm font-montserratRegular font-medium text-gray-700">
                            Пароль:
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 font-montserratRegular block w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Введіть пароль"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                            >
                                {showPassword ? "Сховати" : "Показати"}
                            </button>
                        </div>
                    </div>

                    {/* Отображение ошибки */}
                    {error && <div className="text-red-500">{error}</div>}

                    {/* Кнопка входа */}
                    <button
                        type="button"
                        onClick={handleLogin}
                        className="bg-dark-purple w-full font-montserratRegular text-center text-white py-2 px-4 rounded-full"
                    >
                        Увійти
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
