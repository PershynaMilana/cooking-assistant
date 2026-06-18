import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getRecipeTypeById, updateRecipeType } from "api/recipeTypesApi";

import { Header } from "components/layout/Header";

interface RecipeType {
    type_name: string;
    description: string;
}

const EditRecipeType: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [typeData, setTypeData] = useState<RecipeType>({
        type_name: "",
        description: "",
    });
    const [errors, setErrors] = useState<{
        type_name?: string;
        description?: string;
    }>({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchRecipeType = useCallback(async () => {
        if (!id) return;
        try {
            const data = await getRecipeTypeById(id);

            setTypeData(data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error loading recipe type:", error);
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        void fetchRecipeType();
    }, [fetchRecipeType]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;

        setTypeData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { type_name?: string; description?: string } = {};

        if (!typeData.type_name) {
            newErrors.type_name = "Please fill out this field.";
        }
        if (!typeData.description) {
            newErrors.description = "Please fill out this field.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);

            return;
        }

        if (!id) return;

        try {
            await updateRecipeType(id, typeData);

            window.location.href = "/types";
        } catch (error) {
            console.error("Error updating recipe type:", error);
        }
    };

    return (
        <>
            <Header />
            <div className="mx-[15vw]">
                <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
                    Edit Recipe Type
                </h1>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <form
                        onSubmit={(e) => {
                            void handleSubmit(e);
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label>
                                Name:
                                <input
                                    type="text"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    name="type_name"
                                    value={typeData.type_name}
                                    onChange={handleInputChange}
                                />
                            </label>
                            {errors.type_name && (
                                <div className="text-red-500">
                                    {errors.type_name}
                                </div>
                            )}
                        </div>
                        <div>
                            <label>
                                Description:
                                <textarea
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    name="description"
                                    value={typeData.description}
                                    onChange={handleInputChange}
                                />
                            </label>
                            {errors.description && (
                                <div className="text-red-500">
                                    {errors.description}
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            Save
                        </button>
                    </form>
                )}
            </div>
        </>
    );
};

export default EditRecipeType;
