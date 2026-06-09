class SearchPersonMenus {
    constructor(menuRepository) {
        this.menuRepository = menuRepository;
    }

    async execute(personId, filters) {
        return this.menuRepository.searchByPerson(personId, filters);
    }
}

module.exports = SearchPersonMenus;
