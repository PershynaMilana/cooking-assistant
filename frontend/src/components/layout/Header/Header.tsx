import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/login");
    };

    return (
        <header className="bg-perfect-purple p-6 py-8 text-white">
            <nav>
                <ul className="flex justify-between items-center">
                    <div className="flex space-x-14 ml-[10vw]">
                        <li>
                            <Link
                                to="/main"
                                className="font-montserratRegular text-l"
                            >
                                {t("header.home")}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/my-recipes"
                                className="font-montserratRegular text-l"
                            >
                                {t("header.myRecipes")}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/stats"
                                className="font-montserratRegular text-l"
                            >
                                {t("header.statistics")}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/types"
                                className="font-montserratRegular text-l"
                            >
                                {t("header.types")}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/ingredients"
                                className="font-montserratRegular text-l"
                            >
                                {t("header.myIngredients")}
                            </Link>
                        </li>
                        {/* New "Menu" tab */}
                        <li>
                            <Link
                                to="/menu"
                                className="font-montserratRegular text-l"
                            >
                                {t("header.menu")}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/my-menus"
                                className="font-montserratRegular text-l"
                            >
                                {t("header.myMenus")}
                            </Link>
                        </li>
                    </div>

                    {token ? (
                        <button
                            onClick={handleLogout}
                            className="bg-dark-purple font-montserratRegular px-8 py-2 -mt-1 mr-[3vw] rounded-full"
                        >
                            {t("header.logout")}
                        </button>
                    ) : (
                        <div className="flex space-x-14 mr-[5vw]">
                            <li>
                                <Link
                                    to="/login"
                                    className="font-montserratRegular text-l"
                                >
                                    {t("header.login")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/registration"
                                    className="bg-dark-purple px-5 py-3 rounded-full font-montserratRegular text-l"
                                >
                                    {t("header.register")}
                                </Link>
                            </li>
                        </div>
                    )}
                </ul>
            </nav>
        </header>
    );
};
