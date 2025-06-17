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

  // Time formatting function
  const formatCookingTime = (timeInMinutes: number) => {
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return `${hours} hr : ${minutes.toString().padStart(2, "0")} min`; // Format as hr:min
  };

  return (
      <div className="recipe-card bg-pale-beige h-[25vh] p-4 rounded-xl mb-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold font-kharkiv my-3">{title}</h2>

          <div className="text-sm font-montserratRegular text-gray-500">
            <span>Recipe type: </span>
            <span className="font-bold">{typeName}</span>
          </div>

          <div className="text-sm font-montserratRegular text-gray-500">
            <span>Cooking time: </span>
            <span className="font-bold">{formatCookingTime(cookingTime)}</span>
          </div>

          <div className="text-sm text-gray-500">
            Creation date: {formattedDate}
          </div>
        </div>

        <Link to={`/recipe/${id}`}>
          <button className="mt-4 w-full bg-dark-purple font-montserratRegular text-white py-2 px-4 rounded-full">
            Learn more
          </button>
        </Link>
      </div>
  );
};

export default RecipeCard;
