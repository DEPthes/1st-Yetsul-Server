import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiCreatedResponse, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import { Alcohol } from 'src/Entity/Alcohol/alcohol.entity';
import { Like } from 'src/Entity/Alcohol/like.entity';
import { IntroductionAlcoholService } from './introductionAlcohol.service';

@ApiTags("술 소개 페이지")
@Controller('alcohol')
export class IntroductionAlcoholController {
    constructor(private readonly alcoholService: IntroductionAlcoholService) { }


    // 이름으로 술 조회
    @Post('/description')
    @ApiBody({
        schema: {
            properties: {
                alcoholName: { type: "string" }
            }
        }
    })
    @ApiOperation({ summary: '이름으로 술 조회 API', description: '이름으로 술 조회' })
    @ApiCreatedResponse({ description: '이름으로 술 조회', type: Alcohol })
    getAlcoholByName(@Body('alcoholName') alcoholName: string): Promise<Alcohol> {
        return this.alcoholService.getAlcoholByName(alcoholName);
    }

    // 개별 술 조회
    @Get('/description/:id')
    @ApiOperation({ summary: 'id로 술 조회 API', description: 'id로 술 조회.' })
    @ApiCreatedResponse({ description: 'id로 술 조회', type: Alcohol })
    getAlcoholById(@Param('id') id: number): Promise<Alcohol> {
        return this.alcoholService.getAlcoholById(id);
    }

    @ApiOperation({ summary: "술 리스트 - 찜하기 API", description: "accessToken을 가지고 있을 때, 유저 id와 술 id를 프론트에서 주면 DB에 좋아요 저장함." })
    @ApiCreatedResponse({ description: '술 리스트 - 조회', type: Like })
    @Post('/description/:id')
    LikeAlcohol(@Body() userEmail: string, @Param('id') alcoholId: number) {
        // console.log(userEmail, alcoholId);
        return this.alcoholService.userLikedAlcohol(userEmail, alcoholId);
    }





    // 술 카테고리 별 리스트 조회
    @Post('/list/:category')
    @ApiOperation({ summary: '술 카테고리 별 리스트 조회 API', description: '술 카테고리 별 리스트 조회' })
    @ApiCreatedResponse({ description: '술 카테고리 별 리스트 조회', type: Alcohol })
    getAlcoholListByCategory(@Param('category') category: number, @Body('filter') filter: string): Promise<Alcohol[]> {
        return this.alcoholService.getAlcoholListByCategory(category, filter);
    }

    // 술 리스트 조회
    @Post('/list')
    @ApiOperation({ summary: '술 리스트 조회 API', description: '술 리스트 조회' })
    @ApiCreatedResponse({ description: '술 리스트 조회', type: Alcohol })
    getAlcoholList(@Body('filter') filter: string): Promise<Alcohol[]> {
        return this.alcoholService.getAlcoholList(filter);
    }
}