import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { PUBLIC_PATHS, ROUTES } from "constants/routes";

import { useAppDispatch } from "redux/hooks";
import { useLogoutMutation } from "redux/services/authApi";
import { baseApi } from "redux/services/baseApi";

const NAV_LINKS = [
    { to: ROUTES.main, labelKey: "header.home" },
    { to: ROUTES.myRecipes, labelKey: "header.myRecipes" },
    { to: ROUTES.stats, labelKey: "header.statistics" },
    { to: ROUTES.recipeTypes, labelKey: "header.types" },
    { to: ROUTES.ingredients, labelKey: "header.myIngredients" },
    { to: ROUTES.menu, labelKey: "header.menu" },
    { to: ROUTES.myMenus, labelKey: "header.myMenus" },
];

export const Header: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { pathname } = useLocation();
    const isOnAuthPage = PUBLIC_PATHS.includes(pathname);
    const [logout] = useLogoutMutation();

    const handleLogout = async () => {
        // a failed logout is toasted by the global listener
        const result = await logout(null);

        if ("data" in result) {
            // drop every cached query so the next user starts clean
            dispatch(baseApi.util.resetApiState());
            navigate(ROUTES.login);
        }
    };

    return (
        <header className="bg-perfect-purple p-6 py-8 text-white">
            <nav>
                <ul className="flex justify-between items-center">
                    <div className="flex space-x-14 ml-[10vw]">
                        {NAV_LINKS.map((link) => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    className="font-montserratRegular text-l"
                                >
                                    {t(link.labelKey)}
                                </Link>
                            </li>
                        ))}
                    </div>

                    {!isOnAuthPage ? (
                        <div className="flex items-center gap-3 mr-[3vw]">
                            <button
                                onClick={() => {
                                    void handleLogout();
                                }}
                                className="bg-dark-purple font-montserratRegular px-8 py-2 -mt-1 rounded-full"
                            >
                                {t("header.logout")}
                            </button>
                        </div>
                    ) : (
                        <div className="flex space-x-14 mr-[5vw]">
                            <li>
                                <Link
                                    to={ROUTES.login}
                                    className="font-montserratRegular text-l"
                                >
                                    {t("header.login")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={ROUTES.registration}
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
