import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "./entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
        super({
            secretOrKey: "Secret1234", // secretOrKey: 'Secret1234', // module 에서 쓴 비밀 키는 토큰 생성에 사용, 여기서는 토큰 유효한지 체크할 때 사용. 용도 다름.
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() // 토큰 인증할 때 어디서 가져오는지.  bearertoken 타입으로 넘어옴.
        })
    }

    // 페이로드에 담겨져 온 유저 이름으로 그에 맞는 유저 정보가 db에 있는지 확인 후 있으면 정보 담음.
    async validate(payload) { // 토큰 유효한지 확인되면
        const {email} = payload;
        const user: User = await this.userRepository.findOne({email});

        if (!user) {
            console.log('nono!!');
            throw new UnauthorizedException();
        }

        return user;
    }
}