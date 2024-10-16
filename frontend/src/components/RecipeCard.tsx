import React from "react";
import { Link } from "react-router-dom";

interface RecipeCardProps {
  id: number;
  title: string;
  typeName: string;
  creationDate: string;
  cookingTime: number;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  title,
  typeName,
  creationDate,
  cookingTime,
}) => {
  const formattedDate = new Date(creationDate).toLocaleDateString("uk-UA");

  // Функція форматування часу
  const formatCookingTime = (timeInMinutes: number) => {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return `${hours} год : ${minutes.toString().padStart(2, "0")} хв`; // Форматуємо як годгод:хвхв
  };

  return (
    <div className="recipe-card bg-pale-beige h-[25vh] p-4 rounded-xl mb-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold font-kharkiv my-3">{title}</h2>

        <div className="text-sm font-montserratRegular text-gray-500">
          <span>Тип рецепту: </span>
          <span className="font-bold">{typeName}</span>
        </div>

        <div className="text-sm font-montserratRegular text-gray-500">
          <span>Час приготування: </span>
          <span className="font-bold">{formatCookingTime(cookingTime)}</span>
        </div>

        <div className="text-sm text-gray-500">
          Дата створення: {formattedDate}
        </div>
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
