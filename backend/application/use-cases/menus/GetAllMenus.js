class GetAllMenus {
    constructor(menuRepository) {
        this.menuRepository = menuRepository;
    }

    async execute(filters) {
        return this.menuRepository.findAll(filters);
    }
}

module.exports = GetAllMenus;
