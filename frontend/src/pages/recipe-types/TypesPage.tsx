import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header.tsx";
import { Link } from "react-router-dom";

interface RecipeType {
  id: number;
  type_name: string;
}

const TypesPage: React.FC = () => {
  const [recipeTypes, setRecipeTypes] = useState<RecipeType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<RecipeType | null>(null);

  useEffect(() => {
    fetchRecipeTypes();
  }, []);

  const fetchRecipeTypes = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get<RecipeType[]>(
          "http://localhost:8080/api/recipe-types",
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
      );
      setRecipeTypes(response.data);
    } catch (error) {
      console.error("Error loading recipe types:", error);
    }
  };

  const handleDeleteClick = (type: RecipeType) => {
    setSelectedType(type);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem("authToken");
    if (selectedType) {
      try {
        await axios.delete(
            `http://localhost:8080/api/recipe-type/${selectedType.id}`,
            {
              headers: {
                Authorization: token ? `Bearer ${token}` : "",
              },
            }
        );
        fetchRecipeTypes();
        setIsModalOpen(false);
        setSelectedType(null);
      } catch (error) {
        console.error("Error deleting recipe type:", error);
      }
    }
  };

  const handleEditClick = (type: RecipeType) => {
    window.location.href = `/types/${type.id}`;
  };

  return (
      <>
        <Header />
        <div className="mx-[15vw]">
          <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
            Recipe Types
          </h1>
          <Link to="/add-type" className="font-montserratRegular text-l">
            <button className="bg-yellow-500 text-white py-2 px-4 rounded-full">
              Add
            </button>
          </Link>
          <ul>
            {recipeTypes.map((type) => (
                <li
                    key={type.id}
                    className="bg-gray-100 rounded-lg my-5 p-4 flex items-center justify-between"
                >
                  <span className="text-left">{type.type_name}</span>
                  <div className="flex space-x-2">
                    <button
                        className="bg-yellow-500 text-white py-2 px-4 rounded-full"
                        onClick={() => handleEditClick(type)}
                    >
                      Edit
                    </button>
                    <button
                        className="bg-red-500 text-white py-2 px-4 rounded-full"
                        onClick={() => handleDeleteClick(type)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
            ))}
          </ul>

          {isModalOpen && selectedType && (
              <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <p className="mb-4">
                    Are you sure you want to delete the type "{selectedType.type_name}"?
                    All recipes of this type will also be deleted.
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={handleDeleteConfirm}
                    >
                      Confirm
                    </button>
                    <button
                        className="bg-gray-300 px-4 py-2 rounded"
                        onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
          )}
        </div>
      </>
  );
};

export default TypesPage;
