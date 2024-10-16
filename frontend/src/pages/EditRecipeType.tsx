import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../components/Header.tsx";

const EditRecipeType = () => {
    const { id } = useParams();
    const [typeData, setTypeData] = useState({ type_name: "", description: "" });
    const [errors, setErrors] = useState({ type_name: "", description: "" });
    const [isLoading, setIsLoading] = useState(true); // Состояние для загрузки данных

    useEffect(() => {
        fetchRecipeType();
    }, []);

    const fetchRecipeType = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/recipe-type/${id}`);
            setTypeData(response.data);
            console.log(response.data)
            setIsLoading(false); // Данные загружены, снимаем состояние загрузки
        } catch (error) {
            console.error("Помилка завантаження типу рецепта", error);
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTypeData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!typeData.type_name) {
            newErrors.type_name = "Заповніть поле";
        }
        if (!typeData.description) {
            newErrors.description = "Заповніть поле";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await axios.put(`http://localhost:8080/api/recipe-type/${id}`, typeData);
            alert("Тип рецепта успішно оновлено");
            window.location.href = "/types";
        } catch (error) {
            console.error("Помилка оновлення типу рецепта", error);
        }
    };

    return (
        <>
            <Header />
            <div className="mx-[15vw]">
                <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">Редагування типу рецепта</h1>
                {isLoading ? (
                    <p>Завантаження...</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label>
                                Назва:
                                <input
                                    type="text"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    name="type_name"
                                    value={typeData.type_name}
                                    onChange={handleInputChange}
                                />
                            </label>
                            {errors.type_name && <div className="text-red-500">{errors.type_name}</div>}
                        </div>
                        <div>
                            <label>
                                Опис:
                                <textarea
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    name="description"
                                    value={typeData.description}
                                    onChange={handleInputChange}
                                />
                            </label>
                            {errors.description && <div className="text-red-500">{errors.description}</div>}
                        </div>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Зберегти</button>
                    </form>
                )}
            </div>
        </>
    );
};

export default EditRecipeType;
