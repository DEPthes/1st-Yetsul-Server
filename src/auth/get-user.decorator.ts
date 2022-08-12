import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "./entities/user.entity";
// 커스텀 데코레이터
export const GetUser = createParamDecorator((data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest(); // 전테 리퀘스트 중에
    return req; // user 부분만 리턴
})