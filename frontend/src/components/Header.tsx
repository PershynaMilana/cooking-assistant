import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="bg-perfect-purple p-6 py-8 text-white">
            <nav>
                <ul className="flex justify-between items-center">
                    {/* Левая часть с центральными элементами */}
                    <div className="flex space-x-14 ml-[20vw]">
                        <li>
                            <Link to="/main" className="font-montserratRegular text-l">Головна</Link>
                        </li>
                        <li>
                            <Link to="/add-recipe"  className="font-montserratRegular text-l">Додати рецепт</Link>
                        </li>
                    </div>

                    {/* Правая часть с элементами, прижатыми справа */}
                    <div className="flex space-x-14 mr-[5vw]">
                        <li>
                            <Link to="/login"  className="font-montserratRegular text-l">Вхід</Link>
                        </li>
                        <li>
                            <Link to="/registration" className="bg-dark-purple px-5 py-3 rounded-full font-montserratRegular text-l">Реєстрація</Link>
                        </li>
                    </div>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
