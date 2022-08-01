import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-kakao";

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor() {
        super({ // api 키 AIzaSyAb7aGpfdsUCuUjDGD9xu_rrywIAOWxm1E
            clientID: process.env.kakao_RestApiKey,
            clientSecret: process.env.kakao_clientSecret,
            callbackURL: process.env.kakao_callbackURL,
            //scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done): Promise<any> {
        //const {name, emails, photos} = profile;
        const user = {
            //email: profile._json && profile._json.kakao_account_email,
            email: profile._json.kakao_account.email,
            nick: profile.displayName,
            picture: profile._json.properties.profile_image|| 'https://depthes.s3.ap-northeast-2.amazonaws.com/1659277489924-%EB%94%94%ED%8F%B4%ED%8A%B8%EC%9D%B4%EB%AF%B8%EC%A7%80.png',
            accessToken,
        }
        console.log("validate에서 찍은 profile입니다. ")
        // console.log(profile);
        done(null, user); // 첫번째 인수는 에러 발생 시 사용, 두번째는 저장할 데이터
    }
}