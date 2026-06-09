class RecipeController {
    constructor({
        createRecipe,
        getAllRecipes,
        getRecipeById,
        updateRecipe,
        deleteRecipe,
        searchRecipes,
        searchPersonRecipes,
        getRecipeStats,
        getAllIngredients,
    }) {
        this.createRecipeUseCase = createRecipe;
        this.getAllRecipesUseCase = getAllRecipes;
        this.getRecipeByIdUseCase = getRecipeById;
        this.updateRecipeUseCase = updateRecipe;
        this.deleteRecipeUseCase = deleteRecipe;
        this.searchRecipesUseCase = searchRecipes;
        this.searchPersonRecipesUseCase = searchPersonRecipes;
        this.getRecipeStatsUseCase = getRecipeStats;
        this.getAllIngredientsUseCase = getAllIngredients;
    }

    createRecipe = async (req, res) => {
        const { title, content, ingredients, type_id, cooking_time, servings } =
            req.body;
        const person_id = req.user.id;

        const created = await this.createRecipeUseCase.execute({
            title,
            content,
            person_id,
            ingredients,
            type_id,
            cooking_time,
            servings,
        });

        res.json(created);
    };

    getAllRecipes = async (_req, res) => {
        const recipes = await this.getAllRecipesUseCase.execute();
        res.json(recipes);
    };

    getRecipeWithIngredients = async (req, res) => {
        const recipe = await this.getRecipeByIdUseCase.execute(req.params.id);
        res.json(recipe);
    };

    updateRecipe = async (req, res) => {
        const recipeId = req.params.id;
        const {
            title,
            content,
            ingredients: newIngredients,
            type_id,
            cooking_time,
            servings,
        } = req.body;

        const updated = await this.updateRecipeUseCase.execute(recipeId, {
            title,
            content,
            ingredients: newIngredients,
            type_id,
            cooking_time,
            servings,
        });

        res.json(updated);
    };

    searchRecipes = async (req, res) => {
        const recipes = await this.searchRecipesUseCase.execute(req.query);
        res.json(recipes);
    };

    searchPersonRecipes = async (req, res) => {
        const person_id = req.user.id;
        const recipes = await this.searchPersonRecipesUseCase.execute(
            person_id,
            req.query,
        );

        res.json(recipes);
    };

    deleteRecipe = async (req, res) => {
        await this.deleteRecipeUseCase.execute(req.params.id);
        res.json({ message: "Recipe successfully deleted" });
    };

    getAllIngredients = async (_req, res) => {
        const ingredients = await this.getAllIngredientsUseCase.execute();
        res.json(ingredients);
    };

    getRecipesStats = async (_req, res) => {
        const stats = await this.getRecipeStatsUseCase.execute();
        res.json(stats);
    };
}

module.exports = RecipeController;
