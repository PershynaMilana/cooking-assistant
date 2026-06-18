import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useSearchParams } from "react-router-dom";

import SearchIcon from "assets/searchIcon.png";

interface SearchComponentProps {
    placeholder: string;
}

export const SearchComponent: React.FC<SearchComponentProps> = ({
    placeholder,
}) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchParams, setSearchParams] = useSearchParams();
    const inputRef = useRef<HTMLInputElement>(null);
    const location = useLocation();
    const { t } = useTranslation();

    // set initial search term from URL search parameters
    useEffect(() => {
        const initialSearchTerm = searchParams.get("ingredient_name") ?? "";

        setSearchTerm(initialSearchTerm);
    }, [searchParams]);

    // clear search when navigating to home page
    useEffect(() => {
        if (location.pathname === "/") {
            setSearchTerm("");
            setSearchParams({});
        }
    }, [location, setSearchParams]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setSearchParams({ ingredient_name: searchTerm });
            if (inputRef.current) {
                inputRef.current.blur();
            }
        }
    };

    const handleReset = () => {
        setSearchTerm("");
        setSearchParams({});
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className="flex items-center w-full bg-perfect-pink my-[3vh] rounded-full p-2 relative">
            <div className="pr-3">
                <img src={SearchIcon} alt="Search Icon" />
            </div>
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder={`${t("search.placeholderPrefix")} ${placeholder}`}
                className="w-full bg-transparent text-almost-black text-montserratMedium placeholder-gray-500 focus:outline-none"
                ref={inputRef}
            />
            {searchTerm && (
                <button
                    onClick={handleReset}
                    className="absolute right-4 text-almost-white bg-dark-purple rounded-full p-2 text-montserratMedium"
                >
                    {t("search.reset")}
                </button>
            )}
        </div>
    );
};
