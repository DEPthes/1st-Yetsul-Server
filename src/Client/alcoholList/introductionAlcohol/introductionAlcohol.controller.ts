import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import { Alcohol } from 'src/Entity/Alcohol/alcohol.entity';
import { Like } from 'src/Entity/Alcohol/like.entity';
import { IntroductionAlcoholService } from './introductionAlcohol.service';

@ApiTags("술 소개 페이지")
@Controller('alcohol')
export class IntroductionAlcoholController {
  constructor(private readonly alcoholService: IntroductionAlcoholService) {}

    // 개별 술 조회
    @Get('/des/:id')
    @ApiOperation({ summary: 'id로 술 조회 API', description: 'id로 술 조회. /alcohol/1' })
    @ApiCreatedResponse({ description: 'id로 술 조회', type: Alcohol })
    getAlcoholById(@Param('id') id: number): Promise<Alcohol> {
        return this.alcoholService.getAlcoholById(id);
    }

    @ApiOperation({summary: "술 리스트 - 찜하기 API", description: "accessToken을 가지고 있을 때, 유저 id와 술 id를 프론트에서 주면 DB에 좋아요 저장함."})
    @ApiCreatedResponse({ description: '술 리스트 - 조회', type: Like })
    @Post('/des/:id')
    LikeAlcohol(@Body() userEmail: string, @Param('id') alcoholId: number){
        // console.log(userEmail, alcoholId);
        return this.alcoholService.userLikedAlcohol(userEmail, alcoholId);
    }   
    
    // 전체 술 리스트 조회
    @Get('/:filter')
    @ApiOperation({ summary: '술 리스트 조회 API', description: '술 리스트 조회' })
    @ApiCreatedResponse({ description: '술 리스트 조회', type: Alcohol })
    getAlcoholList(@Param('filter') filter: string): Promise<Alcohol[]> {
        return this.alcoholService.getAlcoholList(filter);
    }
   
    // 술 카테고리 별 리스트 조회
    @Get('/:category/:filter')
    @ApiOperation({ summary: '술 카테고리 별 리스트 조회 API', description: '술 카테고리 별 리스트 조회' })
    @ApiCreatedResponse({ description: '술 카테고리 별 리스트 조회', type: Alcohol })
    getAlcoholListByCategory(@Param('category') category: number, @Param('filter') filter: string): Promise<Alcohol[]> {
        return this.alcoholService.getAlcoholListByCategory(category, filter);
    }
        // // @UseGuards(AuthGuard('kakao'))
    

    
       

  
}