import type {
    CreateMenuRequest,
    Menu,
    MenuDetails,
    MenuListParams,
    UpdateMenuRequest,
} from "types/menu";

import { API_ROUTES } from "api/endpoints";

import { baseApi } from "./baseApi";
import { listProvidesTags, listTag } from "./cacheTags";

const MENU = "Menu" as const;
const MENU_LIST = listTag(MENU);

type MenuId = string | number;

export const menusApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getMenus: build.query<Menu[], MenuListParams>({
            query: (params) => ({ url: API_ROUTES.menu.list, params }),
            providesTags: (result) => listProvidesTags(MENU, result),
        }),
        getMenusByPerson: build.query<Menu[], MenuListParams>({
            query: (params) => ({ url: API_ROUTES.menu.byPerson, params }),
            providesTags: (result) => listProvidesTags(MENU, result),
        }),
        getMenuById: build.query<MenuDetails, MenuId>({
            query: (id) => ({ url: API_ROUTES.menu.byId(id) }),
            providesTags: (_result, _error, id) => [{ type: MENU, id }],
        }),
        createMenu: build.mutation<null, CreateMenuRequest>({
            query: (data) => ({
                url: API_ROUTES.menu.create,
                method: "POST",
                data,
            }),
            invalidatesTags: [MENU_LIST],
        }),
        updateMenu: build.mutation<
            null,
            { id: MenuId; data: UpdateMenuRequest }
        >({
            query: ({ id, data }) => ({
                url: API_ROUTES.menu.byId(id),
                method: "PUT",
                data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: MENU, id },
                MENU_LIST,
            ],
        }),
        deleteMenu: build.mutation<null, MenuId>({
            query: (id) => ({
                url: API_ROUTES.menu.byId(id),
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: MENU, id },
                MENU_LIST,
            ],
        }),
    }),
});

export const {
    useGetMenusQuery,
    useGetMenusByPersonQuery,
    useGetMenuByIdQuery,
    useCreateMenuMutation,
    useUpdateMenuMutation,
    useDeleteMenuMutation,
} = menusApi;
