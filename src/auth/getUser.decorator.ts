import { createParamDecorator } from "@nestjs/common";
// 커스텀 데코레이터
export const GetUser = createParamDecorator((data, ctx) => {
    const req = ctx.switchToHttp().getRequest(); // 전체 리퀘스트 중에
    return req.user; // user 부분만 리턴
})