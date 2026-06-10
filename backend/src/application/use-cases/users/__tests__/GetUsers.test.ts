import GetUsers from "@application/use-cases/users/GetUsers";

describe("GetUsers", () => {
    it("should return all users from the repository", async () => {
        const users = [{ id: 7, login: "bob" }];
        const userRepository = {
            findAll: jest.fn().mockResolvedValue(users),
        };
        const useCase = new GetUsers(userRepository);

        const result = await useCase.execute();

        expect(userRepository.findAll).toHaveBeenCalledWith();
        expect(result).toEqual(users);
    });
});
