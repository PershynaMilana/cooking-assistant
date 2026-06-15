import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

interface RecipeType {
    id: number;
    type_name: string;
    description: string;
}

interface RecipeTypeFilterProps {
    selectedTypes: number[]; // array of selected recipe type IDs
    onChange: (selectedTypes: number[]) => void; // function to handle type selection changes
}

const RecipeTypeFilter: React.FC<RecipeTypeFilterProps> = ({
    selectedTypes,
    onChange,
}) => {
    const [types, setTypes] = useState<RecipeType[]>([]); // state to store recipe types
    const [isOpen, setIsOpen] = useState(false); // state for opening/closing the filter dropdown
    const filterRef = useRef<HTMLDivElement>(null); // create ref for the component

    // fetch the list of recipe types from the database
    useEffect(() => {
        const fetchTypes = async () => {
            const token = localStorage.getItem("authToken"); // get token from localStorage

            try {
                const response = await axios.get(
                    "http://localhost:8080/api/recipe-types",
                    {
                        headers: {
                            Authorization: token ? `Bearer ${token}` : "", // add token to header
                        },
                    },
                );
                setTypes(response.data); // update state with recipe types
            } catch (error) {
                // error handling
                console.error("Error fetching recipe types:", error);
            }
        };

        fetchTypes();
    }, []);

    // handle type selection change
    const handleCheckboxChange = (id: number) => {
        let updatedSelectedTypes;
        if (selectedTypes.includes(id)) {
            updatedSelectedTypes = selectedTypes.filter(
                (typeId) => typeId !== id,
            ); // remove selected type
        } else {
            updatedSelectedTypes = [...selectedTypes, id]; // add selected type
        }
        onChange(updatedSelectedTypes); // pass updated list of selected types
    };

    // close filter when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                filterRef.current &&
                !filterRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false); // close the filter if clicking outside
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [filterRef]);

    // reset filters
    const resetFilters = () => {
        onChange([]); // reset selected types
        setIsOpen(false); // close the dropdown
    };

    return (
        <div ref={filterRef} className="relative">
            <button
                className="bg-purple-600 text-white p-2 rounded-lg"
                onClick={() => setIsOpen(!isOpen)} // toggle filter open/close state
            >
                Filter
            </button>
            {isOpen && (
                <div className="absolute bg-white border rounded-lg p-4 mt-2 shadow-lg w-64 z-10">
                    {types.map((type) => (
                        <div key={type.id} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedTypes.includes(type.id)} // mark selected types
                                onChange={() => handleCheckboxChange(type.id)} // handle selection change
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
