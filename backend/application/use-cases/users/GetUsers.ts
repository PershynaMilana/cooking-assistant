import type { UserRepository } from "../../../domain/repositories/UserRepository";

export default class GetUsers {
    constructor(private userRepository: Pick<UserRepository, "findAll">) {}

    async execute(): Promise<unknown[]> {
        return this.userRepository.findAll();
    }
}
