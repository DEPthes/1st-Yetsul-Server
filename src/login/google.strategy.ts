import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallBack } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({ // api 키 AIzaSyAb7aGpfdsUCuUjDGD9xu_rrywIAOWxm1E
            clientID: '1022632409316-erbqlfejanv3cam6k1c8gdhkhsqphj56.apps.googleusercontent.com',
            clientSecret: "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",
            callbackURL: "http://localhost:3000/auth/google/callback",
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallBack): Promise<any> {
        const {name, emails, photos} = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken
        }
        done(null, user);
    }
}