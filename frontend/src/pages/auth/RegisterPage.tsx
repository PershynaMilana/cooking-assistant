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
            setNameError("Ім'я повинно починатися з великої літери та містити лише букви, не менше 2.");
        } else {
            setNameError(null);
        }
    };

    const validateSurname = (value: string) => {
        if (!/^[A-ZА-Я][a-zа-я]{1,}$/.test(value)) {
            setSurnameError("Прізвище повинно починатися з великої літери та містити лише букви, не менше 2.");
        } else {
            setSurnameError(null);
        }
    };

    const validateLogin = (value: string) => {
        if (value.length < 2) {
            setLoginError("Ім'я користувача має бути не менше 2 символів.");
        } else {
            setLoginError(null);
        }
    };

    const validatePassword = (value: string) => {
        if (value.length < 6) {
            setPasswordError("Пароль має бути не менше 6 символів.");
        } else {
            setPasswordError(null);
        }
    };

    const handleRegister = async () => {
        setError(null);

        // Перевірка на заповнення полів
        if (!name || !surname || !login || !password) {
            setError("Заповніть усі поля.");
            return;
        }

        // Валідація перед відправкою
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
            setError("Такий користувач вже існує.");
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
                            onChange={(e) => {
                                setName(e.target.value);
                                validateName(e.target.value);
                            }}
                            className="mt-1 block w-full font-montserratRegular p-2 border border-gray-300 rounded-md"
                            placeholder="Введіть ім'я"
                        />
                        {nameError && <div className="text-red-500">{nameError}</div>}
                    </div>

                    {/* Поле фамилии */}
                    <div>
                        <label className="block text-sm font-montserratRegular font-medium text-gray-700">
                            Прізвище:
                        </label>
                        <input
                            type="text"
                            value={surname}
                            onChange={(e) => {
                                setSurname(e.target.value);
                                validateSurname(e.target.value);
                            }}
                            className="mt-1 block w-full font-montserratRegular p-2 border border-gray-300 rounded-md"
                            placeholder="Введіть прізвище"
                        />
                        {surnameError && <div className="text-red-500">{surnameError}</div>}
                    </div>

                    {/* Поле логина */}
                    <div>
                        <label className="block text-sm font-montserratRegular font-medium text-gray-700">
                            Ім'я користувача:
                        </label>
                        <input
                            type="text"
                            value={login}
                            onChange={(e) => {
                                setLogin(e.target.value);
                                validateLogin(e.target.value);
                            }}
                            className="mt-1 block w-full font-montserratRegular p-2 border border-gray-300 rounded-md"
                            placeholder="Введіть ім'я користувача"
                        />
                        {loginError && <div className="text-red-500">{loginError}</div>}
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
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    validatePassword(e.target.value);
                                }}
                                className="mt-1 block w-full p-2 font-montserratRegular border border-gray-300 rounded-md"
                                placeholder="Введіть пароль"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                            >
                                {showPassword ? "Сховати" : "Показати"}
                            </button>
                        </div>
                        {passwordError && <div className="text-red-500">{passwordError}</div>}
                    </div>

                    {/* Відображення загальної помилки */}
                    {error && <div className="text-red-500">{error}</div>}

                    {/* Кнопка реєстрації */}
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
