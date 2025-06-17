import React, { useState, useEffect, useRef } from "react";

interface MenuCategory {
  menu_category_id: number;
  category_name: string;
}

interface MenuCategoryFilterProps {
  categories: MenuCategory[];
  selectedCategories: number[];
  onChange: React.Dispatch<React.SetStateAction<number[]>>; // Added for proper typing
}

const MenuCategoryFilter: React.FC<MenuCategoryFilterProps> = ({
                                                                 categories,
                                                                 selectedCategories,
                                                                 onChange,
                                                               }) => {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const handleCheckboxChange = (id: number) => {
    let updatedSelectedCategories;
    if (selectedCategories.includes(id)) {
      // Remove selected type if it's already in the list
      updatedSelectedCategories = selectedCategories.filter(
          (categoryId) => categoryId !== id
      );
    } else {
      // Add selected type if it's not in the list
      updatedSelectedCategories = [...selectedCategories, id];
    }
    onChange(updatedSelectedCategories);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
          filterRef.current &&
          !filterRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const resetFilters = () => {
    onChange([]);
    setIsOpen(false);
  };

  return (
      <div ref={filterRef} className="relative">
        <button
            className="bg-purple-600 text-white p-2 rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
        >
          Filter
        </button>
        {isOpen && (
            <div className="absolute bg-white border rounded-lg p-4 mt-2 shadow-lg w-64 z-10">
              {categories.map((category) => (
                  <div key={category.menu_category_id} className="flex items-center">
                    <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.menu_category_id)}
                        onChange={() => handleCheckboxChange(category.menu_category_id)}
                    />
                    <label className="ml-2">{category.category_name}</label>
                  </div>
              ))}
              <button
                  onClick={resetFilters}
                  className="mt-2 text-purple-600 hover:underline"
              >
                Reset filters
              </button>
            </div>
        )}
      </div>
  );
};

export default MenuCategoryFilter;
