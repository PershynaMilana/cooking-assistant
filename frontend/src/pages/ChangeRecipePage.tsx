import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header.tsx';

interface Recipe {
    title: string;
    content: string;
    ingredients: string[]; // Изначально выбранные ингредиенты
}

interface Ingredient {
    id: number;
    name: string;
}

const ChangeRecipePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
    const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]); // ID выбранных ингредиентов
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Получаем детали рецепта и все доступные ингредиенты
    const fetchRecipeDetails = async () => {
        try {
            const recipeResponse = await axios.get(`http://localhost:8080/api/recipe/${id}`);
            const recipeData = recipeResponse.data;

            setRecipe(recipeData);
            setTitle(recipeData.title);
            setContent(recipeData.content);
            setSelectedIngredients(recipeData.ingredients.map((ing: string) => ing.id)); // Задаём выбранные ингредиенты

            const ingredientsResponse = await axios.get('http://localhost:8080/api/ingredients');
            setAllIngredients(ingredientsResponse.data);
        } catch (error: any) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchRecipeDetails();
    }, [id]);

    // Обработка кликов по кнопкам ингредиентов
    const toggleIngredientSelection = (ingredientId: number) => {
        setSelectedIngredients(prevSelected => {
            if (prevSelected.includes(ingredientId)) {
                // Если ингредиент уже выбран, снимаем выбор
                return prevSelected.filter(id => id !== ingredientId);
            } else {
                // Иначе добавляем в выбранные
                return [...prevSelected, ingredientId];
            }
        });
    };

    // Обновление рецепта
    const handleUpdateRecipe = async () => {
        try {
            // Отправляем только изменённые поля
            const updatedRecipe = {
                ...(title !== recipe?.title && { title }), // Если название изменилось, включаем его в запрос
                ...(content !== recipe?.content && { content }), // Если описание изменилось
                ingredients: selectedIngredients, // Всегда отправляем выбранные ингредиенты
            };

            await axios.put(`http://localhost:8080/api/recipe/${id}`, updatedRecipe, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            navigate(`/main}`); // После успешного обновления перенаправляем на страницу деталей
        } catch (error: any) {
            setError(error.message);
        }
    };

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    if (!recipe || allIngredients.length === 0) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <Header />
            <div className="mx-[15vw]">
                <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">Змінити рецепт</h1>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Назва</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Опис</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            rows={4}
                        />
                    </div>

                    {/* Ингредиенты */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Інградієнти</label>
                        <div className="flex flex-wrap gap-2">
                            {allIngredients.map((ingredient) => (
                                <button
                                    key={ingredient.id}
                                    type="button"
                                    onClick={() => toggleIngredientSelection(ingredient.id)}
                                    className={`py-2 px-4 rounded-full ${
                                        selectedIngredients.includes(ingredient.id)
                                            ? 'bg-blue-700 text-white' // Выбранный ингредиент
                                            : 'bg-gray-300 text-black' // Невыбранный ингредиент
                                    }`}
                                >
                                    {ingredient.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleUpdateRecipe}
                        className="bg-green-500 text-white py-2 px-4 rounded-full"
                    >
                        Змінити
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangeRecipePage;
