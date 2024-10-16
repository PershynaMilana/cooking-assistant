import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header.tsx";

const AddRecipeType = () => {
    const [typeData, setTypeData] = useState({ type_name: "", description: "" });
    const [errors, setErrors] = useState({ type_name: "", description: "" });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTypeData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Проверка, заполнены ли все поля
        const newErrors = {};
        if (!typeData.type_name) {
            newErrors.type_name = "Заповніть поле";
        }
        if (!typeData.description) {
            newErrors.description = "Заповніть поле";
        }

        // Если есть ошибки, обновляем состояние и выходим из функции
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await axios.post("http://localhost:8080/api/recipe-types", typeData);
            alert("Тип рецепта успішно додано");
            window.location.href = "/types";
        } catch (error) {
            console.error("Помилка додавання типу рецепта", error);
        }
    };

    return (
        <>
            <Header />
            <div className="mx-[15vw]">
                <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">Додавання нового типу рецепта</h1>
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
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Додати</button>
                </form>
            </div>
        </>
    );
};

export default AddRecipeType;
