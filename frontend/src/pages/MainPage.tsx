import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import Header from "../components/Header.tsx";
import SearchComponent from "../components/SearchComponent.tsx";
import axios from 'axios';

interface Recipe {
    id: number;
    title: string;
    content: string;
    ingredients: string[];
}

const MainPage: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const ingredientName = searchParams.get('ingredient_name'); // Получаем параметр из URL

    // Функция для получения рецептов
    const fetchRecipes = async () => {
        try {
            let response;
            if (ingredientName) {
                // Если есть параметр поиска, делаем запрос с ним
                response = await axios.get(`http://localhost:8080/api/recipes-by-ingredient-name`, {
                    params: { ingredient_name: ingredientName },
                });
            } else {
                // Иначе делаем обычный запрос
                response = await axios.get('http://localhost:8080/api/recipes');
            }

            setRecipes(response.data);
        } catch (error: any) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, [ingredientName]); // Обновляем запрос, если изменился параметр

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    return (
        <div>
            <Header />
            <div className="mx-[15vw]">
                <SearchComponent />
                <h1 className="text-relative-h3 font-normal font-montserratMedium p-4">Всі рецепти</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {recipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            id={recipe.id}
                            title={recipe.title}
                            content={recipe.content}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MainPage;
