import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

interface RecipeType {
  id: number;
  type_name: string;
  description: string;
}

interface RecipeTypeFilterProps {
  selectedTypes: number[]; // Array of selected recipe type IDs
  onChange: (selectedTypes: number[]) => void; // Function to handle type selection changes
}

const RecipeTypeFilter: React.FC<RecipeTypeFilterProps> = ({
                                                             selectedTypes,
                                                             onChange,
                                                           }) => {
  const [types, setTypes] = useState<RecipeType[]>([]); // State to store recipe types
  const [isOpen, setIsOpen] = useState(false); // State for opening/closing the filter dropdown
  const filterRef = useRef<HTMLDivElement>(null); // Create ref for the component

  //? Fetch the list of recipe types from the database
  useEffect(() => {
    const fetchTypes = async () => {
      const token = localStorage.getItem("authToken"); // Get token from localStorage

      try {
        const response = await axios.get(
            "http://localhost:8080/api/recipe-types",
            {
              headers: {
                Authorization: token ? `Bearer ${token}` : "", // Add token to header
              },
            }
        );
        setTypes(response.data); // Update state with recipe types
      } catch (error) {
        // Error handling
        console.error("Error fetching recipe types:", error);
      }
    };

    fetchTypes();
  }, []);

  //? Handle type selection change
  const handleCheckboxChange = (id: number) => {
    let updatedSelectedTypes;
    if (selectedTypes.includes(id)) {
      updatedSelectedTypes = selectedTypes.filter((typeId) => typeId !== id); // Remove selected type
    } else {
      updatedSelectedTypes = [...selectedTypes, id]; // Add selected type
    }
    onChange(updatedSelectedTypes); // Pass updated list of selected types
  };

  //? Close filter when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
          filterRef.current &&
          !filterRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false); // Close the filter if clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);

  //? Reset filters
  const resetFilters = () => {
    onChange([]); // Reset selected types
    setIsOpen(false); // Close the dropdown
  };

  return (
      <div ref={filterRef} className="relative">
        <button
            className="bg-purple-600 text-white p-2 rounded-lg"
            onClick={() => setIsOpen(!isOpen)} // Toggle filter open/close state
        >
          Filter
        </button>
        {isOpen && (
            <div className="absolute bg-white border rounded-lg p-4 mt-2 shadow-lg w-64 z-10">
              {types.map((type) => (
                  <div key={type.id} className="flex items-center">
                    <input
                        type="checkbox"
                        checked={selectedTypes.includes(type.id)} // Mark selected types
                        onChange={() => handleCheckboxChange(type.id)} // Handle selection change
                    />
                    <label className="ml-2">{type.type_name}</label>
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

export default RecipeTypeFilter;
