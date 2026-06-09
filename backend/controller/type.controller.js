class RecipeTypeController {
    constructor({
        getAllRecipeTypes,
        getRecipeTypeById,
        createRecipeType,
        updateRecipeType,
        deleteRecipeType,
    }) {
        this.getAllRecipeTypesUseCase = getAllRecipeTypes;
        this.getRecipeTypeByIdUseCase = getRecipeTypeById;
        this.createRecipeTypeUseCase = createRecipeType;
        this.updateRecipeTypeUseCase = updateRecipeType;
        this.deleteRecipeTypeUseCase = deleteRecipeType;
    }

    getAll = async (_req, res) => {
        const types = await this.getAllRecipeTypesUseCase.execute();
        res.json(types);
    };

    getById = async (req, res) => {
        const type = await this.getRecipeTypeByIdUseCase.execute(req.params.id);
        res.json(type);
    };

    create = async (req, res) => {
        const { type_name, description } = req.body;
        const created = await this.createRecipeTypeUseCase.execute({
            type_name,
            description,
        });
        res.json(created);
    };

    update = async (req, res) => {
        const { type_name, description } = req.body;
        const updated = await this.updateRecipeTypeUseCase.execute(
            req.params.id,
            {
                type_name,
                description,
            },
        );
        res.json(updated);
    };

    remove = async (req, res) => {
        await this.deleteRecipeTypeUseCase.execute(req.params.id);
        res.json({
            message: "Recipe type and all related recipes successfully deleted",
        });
    };
}

module.exports = RecipeTypeController;
