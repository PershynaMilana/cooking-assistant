const pool = require("./db");

const PgRecipeTypeRepository = require("./infrastructure/persistence/pg/PgRecipeTypeRepository");
const PgRecipeRepository = require("./infrastructure/persistence/pg/PgRecipeRepository");
const PgMenuRepository = require("./infrastructure/persistence/pg/PgMenuRepository");
const PgMenuCategoryRepository = require("./infrastructure/persistence/pg/PgMenuCategoryRepository");
const PgPantryRepository = require("./infrastructure/persistence/pg/PgPantryRepository");
const PgUserRepository = require("./infrastructure/persistence/pg/PgUserRepository");

const BcryptPasswordHasher = require("./infrastructure/security/BcryptPasswordHasher");
const JwtTokenService = require("./infrastructure/security/JwtTokenService");

const GetAllRecipeTypes = require("./application/use-cases/recipe-types/GetAllRecipeTypes");
const GetRecipeTypeById = require("./application/use-cases/recipe-types/GetRecipeTypeById");
const CreateRecipeType = require("./application/use-cases/recipe-types/CreateRecipeType");
const UpdateRecipeType = require("./application/use-cases/recipe-types/UpdateRecipeType");
const DeleteRecipeType = require("./application/use-cases/recipe-types/DeleteRecipeType");

const CreateRecipe = require("./application/use-cases/recipes/CreateRecipe");
const GetAllRecipes = require("./application/use-cases/recipes/GetAllRecipes");
const GetRecipeById = require("./application/use-cases/recipes/GetRecipeById");
const UpdateRecipe = require("./application/use-cases/recipes/UpdateRecipe");
const DeleteRecipe = require("./application/use-cases/recipes/DeleteRecipe");
const SearchRecipes = require("./application/use-cases/recipes/SearchRecipes");
const SearchPersonRecipes = require("./application/use-cases/recipes/SearchPersonRecipes");
const GetRecipeStats = require("./application/use-cases/recipes/GetRecipeStats");
const GetAllIngredients = require("./application/use-cases/recipes/GetAllIngredients");

const GetAllMenus = require("./application/use-cases/menus/GetAllMenus");
const CreateMenu = require("./application/use-cases/menus/CreateMenu");
const GetMenuById = require("./application/use-cases/menus/GetMenuById");
const UpdateMenu = require("./application/use-cases/menus/UpdateMenu");
const DeleteMenu = require("./application/use-cases/menus/DeleteMenu");
const SearchPersonMenus = require("./application/use-cases/menus/SearchPersonMenus");

const GetAllMenuCategories = require("./application/use-cases/menu-categories/GetAllMenuCategories");

const GetUserIngredients = require("./application/use-cases/pantry/GetUserIngredients");
const AddUserIngredients = require("./application/use-cases/pantry/AddUserIngredients");
const DeleteUserIngredient = require("./application/use-cases/pantry/DeleteUserIngredient");
const UpdateIngredientQuantities = require("./application/use-cases/pantry/UpdateIngredientQuantities");
const UpdatePurchaseQuantity = require("./application/use-cases/pantry/UpdatePurchaseQuantity");
const GetPurchaseHistory = require("./application/use-cases/pantry/GetPurchaseHistory");

const RegisterUser = require("./application/use-cases/users/RegisterUser");
const LoginUser = require("./application/use-cases/users/LoginUser");
const GetUsers = require("./application/use-cases/users/GetUsers");

const RecipeTypeController = require("./controller/type.controller");
const RecipeController = require("./controller/recipe.controller");
const MenuController = require("./controller/menu.controller");
const MenuCategoryController = require("./controller/menuCategory.controller");
const UserIngredientsController = require("./controller/userIngredients.controller");
const UserController = require("./controller/user.controller");

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

module.exports = {
    userController,
    recipeController,
    recipeTypeController,
    userIngredientsController,
    menuController,
    menuCategoryController,
};
