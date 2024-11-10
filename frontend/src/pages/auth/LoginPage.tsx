import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const LoginPage: React.FC = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();


    // TODO: написать валидацию логина
    const handleLogin = async () => {
        setError(null);

        if (!login || !password) {
            setError("Заполните все поля.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/api/login", {
                login,
                password,
            });

            const { token } = response.data;

            // Сохранение токена в localStorage для последующего использования
            localStorage.setItem("authToken", token);
           // alert("Успешный вход в систему!");

            // Перенаправляем пользователя на главную страницу после входа
            navigate("/main");
        } catch (error: unknown) {
            setError("Неверное имя пользователя или пароль.");
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

                    <div>
                        <label className="block text-sm font-montserratRegular font-medium text-gray-700">
                            Пароль:
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 font-montserratRegular block w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Введіть пароль"
                        />
                    </div>

                    {error && <div className="text-red-500">{error}</div>}

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
