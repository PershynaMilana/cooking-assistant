import React from "react";
import {Link} from "react-router-dom";

interface MenuCardProps {
  id: number;
  title: string;
  content: string;
  categoryName: string;
}

const MenuCard: React.FC<MenuCardProps> = ({
  id,
  title,
  content,
  categoryName,
}) => {
  return (
    <div className="menu-card bg-pale-beige h-[25vh] p-4 rounded-xl mb-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold font-kharkiv my-3">{title}</h2>

        <div className="text-sm font-montserratRegular text-gray-500">
          <span>Категория: </span>
          <span className="font-bold">{categoryName}</span>
        </div>

        <div className="text-sm font-montserratRegular text-gray-700 mt-2">
          {content}
        </div>
      </div>
      <Link to={`/menu/${id}`}>
        <button className="mt-4 w-full bg-dark-purple font-montserratRegular text-white py-2 px-4 rounded-full">
          Детальніше
        </button>
      </Link>
    </div>
  );
};

export default MenuCard;
