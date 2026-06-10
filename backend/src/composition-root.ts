import AddUserIngredients from "@application/use-cases/pantry/AddUserIngredients";
import DeleteUserIngredient from "@application/use-cases/pantry/DeleteUserIngredient";
import GetPurchaseHistory from "@application/use-cases/pantry/GetPurchaseHistory";
import GetUserIngredients from "@application/use-cases/pantry/GetUserIngredients";
import UpdateIngredientQuantities from "@application/use-cases/pantry/UpdateIngredientQuantities";
import UpdatePurchaseQuantity from "@application/use-cases/pantry/UpdatePurchaseQuantity";
import GetAllMenuCategories from "@application/use-cases/menu-categories/GetAllMenuCategories";
import CreateMenu from "@application/use-cases/menus/CreateMenu";
import DeleteMenu from "@application/use-cases/menus/DeleteMenu";
import GetAllMenus from "@application/use-cases/menus/GetAllMenus";
import GetMenuById from "@application/use-cases/menus/GetMenuById";
import SearchPersonMenus from "@application/use-cases/menus/SearchPersonMenus";
import UpdateMenu from "@application/use-cases/menus/UpdateMenu";
import CreateRecipeType from "@application/use-cases/recipe-types/CreateRecipeType";
import DeleteRecipeType from "@application/use-cases/recipe-types/DeleteRecipeType";
import GetAllRecipeTypes from "@application/use-cases/recipe-types/GetAllRecipeTypes";
import GetRecipeTypeById from "@application/use-cases/recipe-types/GetRecipeTypeById";
import UpdateRecipeType from "@application/use-cases/recipe-types/UpdateRecipeType";
import CreateRecipe from "@application/use-cases/recipes/CreateRecipe";
import DeleteRecipe from "@application/use-cases/recipes/DeleteRecipe";
import GetAllIngredients from "@application/use-cases/recipes/GetAllIngredients";
import GetAllRecipes from "@application/use-cases/recipes/GetAllRecipes";
import GetRecipeById from "@application/use-cases/recipes/GetRecipeById";
import GetRecipeStats from "@application/use-cases/recipes/GetRecipeStats";
import SearchPersonRecipes from "@application/use-cases/recipes/SearchPersonRecipes";
import SearchRecipes from "@application/use-cases/recipes/SearchRecipes";
import UpdateRecipe from "@application/use-cases/recipes/UpdateRecipe";
import GetUsers from "@application/use-cases/users/GetUsers";
import LoginUser from "@application/use-cases/users/LoginUser";
import RegisterUser from "@application/use-cases/users/RegisterUser";
import MenuCategoryController from "@controller/menuCategory.controller";
import MenuController from "@controller/menu.controller";
import RecipeController from "@controller/recipe.controller";
import RecipeTypeController from "@controller/type.controller";
import UserIngredientsController from "@controller/userIngredients.controller";
import UserController from "@controller/user.controller";
import pool from "./db";
import PgMenuCategoryRepository from "@infrastructure/persistence/pg/PgMenuCategoryRepository";
import PgMenuRepository from "@infrastructure/persistence/pg/PgMenuRepository";
import PgPantryRepository from "@infrastructure/persistence/pg/PgPantryRepository";
import PgRecipeRepository from "@infrastructure/persistence/pg/PgRecipeRepository";
import PgRecipeTypeRepository from "@infrastructure/persistence/pg/PgRecipeTypeRepository";
import PgUserRepository from "@infrastructure/persistence/pg/PgUserRepository";
import BcryptPasswordHasher from "@infrastructure/security/BcryptPasswordHasher";
import JwtTokenService from "@infrastructure/security/JwtTokenService";

const recipeTypeRepository = new PgRecipeTypeRepository(pool);
const recipeRepository = new PgRecipeRepository(pool);
const menuRepository = new PgMenuRepository(pool);
const menuCategoryRepository = new PgMenuCategoryRepository(pool);
const pantryRepository = new PgPantryRepository(pool);
const userRepository = new PgUserRepository(pool);

const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService();

const recipeTypeController = new RecipeTypeController({
    getAllRecipeTypes: new GetAllRecipeTypes(recipeTypeRepository),
    getRecipeTypeById: new GetRecipeTypeById(recipeTypeRepository),
    createRecipeType: new CreateRecipeType(recipeTypeRepository),
    updateRecipeType: new UpdateRecipeType(recipeTypeRepository),
    deleteRecipeType: new DeleteRecipeType(recipeTypeRepository),
});

const recipeController = new RecipeController({
    createRecipe: new CreateRecipe(recipeRepository),
    getAllRecipes: new GetAllRecipes(recipeRepository),
    getRecipeById: new GetRecipeById(recipeRepository),
    updateRecipe: new UpdateRecipe(recipeRepository),
    deleteRecipe: new DeleteRecipe(recipeRepository),
    searchRecipes: new SearchRecipes(recipeRepository),
    searchPersonRecipes: new SearchPersonRecipes(recipeRepository),
    getRecipeStats: new GetRecipeStats(recipeRepository),
    getAllIngredients: new GetAllIngredients(recipeRepository),
});

const menuController = new MenuController({
    getAllMenus: new GetAllMenus(menuRepository),
    createMenu: new CreateMenu(menuRepository),
    getMenuById: new GetMenuById(menuRepository),
    updateMenu: new UpdateMenu(menuRepository),
    deleteMenu: new DeleteMenu(menuRepository),
    searchPersonMenus: new SearchPersonMenus(menuRepository),
});

const menuCategoryController = new MenuCategoryController({
    getAllMenuCategories: new GetAllMenuCategories(menuCategoryRepository),
});

const userIngredientsController = new UserIngredientsController({
    getUserIngredients: new GetUserIngredients(pantryRepository),
    addUserIngredients: new AddUserIngredients(pantryRepository),
    deleteUserIngredient: new DeleteUserIngredient(pantryRepository),
    updateIngredientQuantities: new UpdateIngredientQuantities(
        pantryRepository,
    ),
    updatePurchaseQuantity: new UpdatePurchaseQuantity(pantryRepository),
    getPurchaseHistory: new GetPurchaseHistory(pantryRepository),
});

const userController = new UserController({
    registerUser: new RegisterUser(userRepository, passwordHasher),
    loginUser: new LoginUser(userRepository, passwordHasher, tokenService),
    getUsers: new GetUsers(userRepository),
});

const controllers = {
    userController,
    recipeController,
    recipeTypeController,
    userIngredientsController,
    menuController,
    menuCategoryController,
};

export default controllers;
