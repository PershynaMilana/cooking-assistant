import React from "react";
import { Link } from "react-router-dom";

interface RecipeCardProps {
  id: number;
  title: string;
  content: string;
  typeName: string; // Добавлено поле типа
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  title,
  content,
  typeName,
}) => {
  return (
    <div className="recipe-card bg-pale-beige h-[25vh] p-4 rounded-xl mb-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold font-kharkiv my-3">{title}</h2>
        <p className="text-md font-montserratRegular text-gray-600">
          {content}
        </p>
        <p className="text-sm font-montserratRegular text-gray-500">
          <span>Тип рецепту: </span>
          <span className="font-bold">{typeName}</span> {/* Жирный текст */}
        </p>
      </div>
      <Link to={`/recipe/${id}`}>
        <button className="mt-4 w-full bg-dark-purple font-montserratRegular text-white py-2 px-4 rounded-full">
          Детальніше
        </button>
      </Link>
    </div>
  );
};

export default RecipeCard;
