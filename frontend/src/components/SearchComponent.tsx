import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchIcon from '../assets/searchIcon.png';

const SearchComponent: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [, setSearchParams] = useSearchParams();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setSearchParams({ ingredient_name: searchTerm }); // Передаємо значення через searchParams
            setSearchTerm('');
            if (inputRef.current) {
                inputRef.current.blur();
            }
        }
    };

    return (
        <div className="flex items-center w-full bg-perfect-pink my-[3vh] rounded-full p-2">
            <div className="pr-3">
                <img src={`${SearchIcon}`} alt={`img`} />
            </div>
            <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={`Пошук за інгредієнтом`}
                className="w-full bg-transparent text-almost-black text-montserratMedium placeholder-gray-500 focus:outline-none"
                ref={inputRef}
            />
        </div>
    );
};

export default SearchComponent;
