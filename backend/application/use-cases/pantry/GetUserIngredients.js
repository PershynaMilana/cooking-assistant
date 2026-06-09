class GetUserIngredients {
    constructor(pantryRepository) {
        this.pantryRepository = pantryRepository;
    }

    async execute(userId) {
        return this.pantryRepository.findByUser(userId);
    }
}

module.exports = GetUserIngredients;
