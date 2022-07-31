import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-naver-v2";

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
    constructor() {
        super({
            clientID: process.env.naver_clientID,
            clientSecret: process.env.naver_clientSecret,
            callbackURL: process.env.naver_callbackURL,
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done): Promise<any> {
        //const {name, emails, photos} = profile;
        const user = {
            email: profile.email,
            name: profile.name,
            id: profile.id,
            picture: profile.profileImage+"" || 'https://depthes.s3.ap-northeast-2.amazonaws.com/1659277489924-%EB%94%94%ED%8F%B4%ED%8A%B8%EC%9D%B4%EB%AF%B8%EC%A7%80.png',
            accessToken,
        }
        console.log(profile);
        done(null, user); // 첫번째 인수는 에러 발생 시 사용, 두번째는 저장할 데이터
    }
}