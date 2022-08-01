import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallBack } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({ // api 키 AIzaSyAb7aGpfdsUCuUjDGD9xu_rrywIAOWxm1E
            clientID: process.env.google_clientID,
            clientSecret: process.env.google_clientSecret,
            callbackURL: process.env.google_callbackURL,
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallBack): Promise<any> {
        const {name, emails, photos} = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value || 'https://depthes.s3.ap-northeast-2.amazonaws.com/1659277489924-%EB%94%94%ED%8F%B4%ED%8A%B8%EC%9D%B4%EB%AF%B8%EC%A7%80.png',
            accessToken,
        }
        console.log(profile);
        done(null, user); // 첫번째 인수는 에러 발생 시 사용, 두번째는 저장할 데이터
    }
}