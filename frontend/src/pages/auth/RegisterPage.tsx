import React, { useState } from "react";
import axios from "axios";
import Header from "../../components/Header.tsx";
import {useNavigate} from "react-router-dom";

const RegisterPage: React.FC = () => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // TODO: написать валидацию регистрации
    const handleRegister = async () => {
        setError(null);
        if (!name || !surname || !login || !password) {
            setError("Заполните все поля.");
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
            setError((error as Error).message);
        }
    };


    return (
        <div>
            <Header />
            <div className="mx-[35vw] flex flex-column items-center justify-center mt-[10vh]">

                <form className="space-y-4 items-center w-full">
                    <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
                        Реєстрація
                    </h1>
                    {/* Поле имени */}
                    <div>
                        <label className="block text-sm font-montserratRegular font-medium text-gray-700">
                            Ім'я:
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full font-montserratRegular p-2 border border-gray-300 rounded-md"
                            placeholder="Введіть ім'я"
                        />
                    </div>

                    {/* Поле фамилии */}
                    <div>
                        <label className="block text-sm font-montserratRegular font-medium text-gray-700">
                            Прізвище:
                        </label>
                        <input
                            type="text"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            className="mt-1 block w-full font-montserratRegular p-2 border border-gray-300 rounded-md"
                            placeholder="Введіть прізвище"
                        />
                    </div>

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
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full p-2 font-montserratRegular border border-gray-300 rounded-md"
                            placeholder="Введіть пароль"
                        />
                    </div>

                    {/* Отображение ошибки */}
                    {error && <div className="text-red-500">{error}</div>}

                    {/* Кнопка регистрации */}
                    <button
                        type="button"
                        onClick={handleRegister}
                        className="bg-dark-purple w-full font-montserratRegular text-center text-white py-2 px-4 rounded-full"
                    >
                        Зареєструватися
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
