import { EntityRepository, Repository } from "typeorm";
import { User } from "./entities/user.entity";


@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(email: string, profileImg: string, nickname: string) {

        const user = this.create({ email, profileImg, nickname });
        await this.save(user);
    }

    async editUser(email, nickname, url) {
        // const profileImg = url.location;
        let profileImg;
        if (url == null)
            profileImg = '기본이미지';//'https://depthes.s3.ap-northeast-2.amazonaws.com/1659277489924-%EB%94%94%ED%8F%B4%ED%8A%B8%EC%9D%B4%EB%AF%B8%EC%A7%80.png';
        else {
            profileImg = url.location;
        }

        return this.update({
            email: email
        }, {
            nickname,
            profileImg
        });
    }
}