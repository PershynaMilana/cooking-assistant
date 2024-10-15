import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

interface RecipeType {
  id: number;
  type_name: string;
  description: string;
}

interface RecipeTypeFilterProps {
  selectedTypes: number[]; // Масив ідентифікаторів вибраних типів рецептів
  onChange: (selectedTypes: number[]) => void; // Функція для обробки змін вибору типів
}

const RecipeTypeFilter: React.FC<RecipeTypeFilterProps> = ({
  selectedTypes,
  onChange,
}) => {
  const [types, setTypes] = useState<RecipeType[]>([]); // Стан для зберігання типів рецептів
  const [isOpen, setIsOpen] = useState(false); // Стан для відкриття/закриття списку фільтрів
  const filterRef = useRef<HTMLDivElement>(null); // Створюємо ref для компонента

  //? Отримуємо список типів рецептів із бази даних
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/recipe-types"
        );
        setTypes(response.data); // Оновлюємо стан типами рецептів
      } catch (error) {
        // Обробка помилки при отриманні даних
        console.error("Помилка при отриманні типів рецептів:", error);
      }
    };

    fetchTypes();
  }, []);

  //? Обробляємо зміну вибору типів
  const handleCheckboxChange = (id: number) => {
    let updatedSelectedTypes;
    if (selectedTypes.includes(id)) {
      updatedSelectedTypes = selectedTypes.filter((typeId) => typeId !== id); // Видаляємо вибраний тип
    } else {
      updatedSelectedTypes = [...selectedTypes, id]; // Додаємо вибраний тип
    }
    onChange(updatedSelectedTypes); // Передаємо оновлений список вибраних типів
  };

  //? Закриття фільтра при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false); // Закриваємо фільтр, якщо клік був поза його межами
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);

  //? Скидання фільтрів
  const resetFilters = () => {
    onChange([]); // Скидаємо вибрані типи
    setIsOpen(false); // Закриваємо список
  };

  return (
    <div ref={filterRef} className="relative">
      <button
        className="bg-purple-600 text-white p-2 rounded-lg"
        onClick={() => setIsOpen(!isOpen)} // Перемикаємо стан відкриття/закриття фільтра
      >
        Фільтрувати
      </button>
      {isOpen && (
        <div className="absolute bg-white border rounded-lg p-4 mt-2 shadow-lg w-64 z-10">
          {types.map((type) => (
            <div key={type.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type.id)} // Відмічаємо обрані типи
                onChange={() => handleCheckboxChange(type.id)} // Обробляємо зміну вибору
              />
              <label className="ml-2">{type.type_name}</label>
            </div>
          ))}
          <button
            onClick={resetFilters}
            className="mt-2 text-purple-600 hover:underline"
          >
            Скинути фільтри
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeTypeFilter;
