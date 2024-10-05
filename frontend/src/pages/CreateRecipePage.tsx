import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header.tsx';

interface Ingredient {
    id: number;
    name: string;
}

const CreateRecipePage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
    const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Получение списка ингредиентов
    const fetchIngredients = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/ingredients');
            setAllIngredients(response.data);
        } catch (error: any) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchIngredients();
    }, []);

    // Обработка кликов по кнопкам ингредиентов
    const toggleIngredientSelection = (ingredientId: number) => {
        setSelectedIngredients(prevSelected => {
            if (prevSelected.includes(ingredientId)) {
                return prevSelected.filter(id => id !== ingredientId); // Убираем выбранный ингредиент
            } else {
                return [...prevSelected, ingredientId]; // Добавляем ингредиент
            }
        });
    };

    // Валидация формы
    const validateForm = () => {
        if (!title.trim()) {
            setError('Название рецепта не может быть пустым');
            return false;
        }
        if (!content.trim()) {
            setError('Описание рецепта не может быть пустым');
            return false;
        }
        if (selectedIngredients.length === 0) {
            setError('Выберите хотя бы один ингредиент');
            return false;
        }
        setError(null);
        return true;
    };

    // Отправка запроса на создание нового рецепта с использованием FormData и Axios
    const handleCreateRecipe = async () => {
        if (!validateForm()) return;

        try {
            // Формируем JSON с данными
            const recipeData = {
                title: title,
                content: content,
                person_id: 1,
                ingredients: selectedIngredients, // Передаем как массив чисел
            };
            console.log(recipeData);

            // Используем Axios для отправки данных
            await axios.post('http://localhost:8080/api/recipe', recipeData, {
                headers: {
                    'Content-Type': 'application/json', // Указываем тип контента
                },
            });

            navigate('/'); // Перенаправляем на главную страницу после успешного создания
        } catch (error: any) {
            setError(error.message);
        }
    };


    return (
        <div>
            <Header />
            <div className="mx-[15vw]">
                <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">Добавить новый рецепт</h1>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Название</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Описание</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            rows={4}
                        />
                    </div>

                    {/* Ингредиенты */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ингредиенты</label>
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

                    {/* Отображение ошибки */}
                    {error && <div className="text-red-500">{error}</div>}

                    <button
                        type="button"
                        onClick={handleCreateRecipe}
                        className="bg-green-500 text-white py-2 px-4 rounded-full"
                    >
                        Создать рецепт
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateRecipePage;
