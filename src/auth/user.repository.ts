import { EntityRepository, Repository } from "typeorm";
import { User } from "./entities/user.entity";


@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(email: string, profileImg: string) {

        const user = this.create({ email, profileImg });
        await this.save(user);
    }

}