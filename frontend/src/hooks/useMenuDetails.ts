import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "constants/routes";
import type { MenuDetails } from "types/menu";

import { getApiErrorMessage } from "api/httpError";
import { deleteMenu as deleteMenuApi, getMenuById } from "api/menusApi";

import { getUserIdSafe } from "utils/getCurrentUserId";

export const useMenuDetails = (id: string | undefined) => {
    const navigate = useNavigate();
    const [menu, setMenu] = useState<MenuDetails | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    const fetchMenuDetails = useCallback(async () => {
        if (!id) {
            return;
        }

        try {
            const data = await getMenuById(id);

            setMenu(data);
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        }
    }, [id]);

    useEffect(() => {
        setCurrentUserId(getUserIdSafe());
        void fetchMenuDetails();
    }, [fetchMenuDetails]);

    const deleteMenu = async () => {
        if (!menu) {
            return;
        }

        try {
            await deleteMenuApi(menu.menu.id);
            navigate(ROUTES.menu);
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        }
    };

    const isOwner = menu?.menu.personid === currentUserId;

    return { menu, error, isOwner, deleteMenu };
};
