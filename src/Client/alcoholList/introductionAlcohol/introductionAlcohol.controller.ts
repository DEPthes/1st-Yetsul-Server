import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/getUser.decorator';
import { Alcohol } from 'src/Entity/Alcohol/alcohol.entity';
import { Like } from 'src/Entity/Alcohol/like.entity';
import { IntroductionAlcoholService } from './introductionAlcohol.service';

@Controller('alcohol')
export class IntroductionAlcoholController {
    constructor(private readonly alcoholService: IntroductionAlcoholService) { }


    // 이름으로 술 조회
    @Post('/description')
    getAlcoholByName(@Body('alcoholName') alcoholName: string) {
        return this.alcoholService.getAlcoholByName(alcoholName);
    }

    // 개별 술 조회
    @Get('/description/:id')
    getAlcoholById(@Param('id') id: number) {
        return this.alcoholService.getAlcoholById(id);
    }

    // 사용자가 술 찜했는지 확인하기 (토큰으로)
    @UseGuards(AuthGuard())
    @Post('/description/:id/likeornot') // id는 술 아이디
    likeOrNot(@GetUser() user: User, @Param('id') alcoholId: number) {

        const userId = user.id;

        return this.alcoholService.likeOrNot(userId, alcoholId);
    }

    // 술 찜하기 (사용자 아이디, 토큰으로)
    // accessToken을 가지고 있을 때, 유저 id와 술 id를 프론트에서 주면 DB에 좋아요 저장함. -> ?
    @UseGuards(AuthGuard())
    @Post('/description/:id')
    LikeAlcohol(@GetUser() user: User, @Param('id') alcoholId: number) {

        const userId = user.id;

        return this.alcoholService.userLikedAlcohol(userId, alcoholId);
    }

    // 술 카테고리 별 리스트 조회
    @Post('/list/:category')
    getAlcoholListByCategory(@Param('category') category: number, @Body('filter') filter: string): Promise<Alcohol[]> {
        return this.alcoholService.getAlcoholListByCategory(category, filter);
    }

    // 술 전체 리스트 조회
    @Post('/list')
    getAlcoholList(@Body('filter') filter: string): Promise<Alcohol[]> {
        return this.alcoholService.getAlcoholList(filter);
    }
}