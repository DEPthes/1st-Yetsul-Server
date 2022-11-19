import { Controller, Get, Post, Body, UseInterceptors, Param, UploadedFiles, Req, Res } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {ApiBody, ApiCreatedResponse, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuestionAndSelectionDto } from '../../DTO/questionAndSelection.dto';
import { TicketboxService } from './ticketbox.service';
import * as multerS3 from 'multer-s3';
import * as AWS from 'aws-sdk';

const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS,
  region: process.env.AWS_REGION
});

@ApiTags("매표소")
@Controller("ticketbox")
export class TicketboxController {
    constructor(private ticketboxService: TicketboxService) { }

    @Get('/test')
    @ApiBody({ type: QuestionAndSelectionDto })
    @ApiOperation({ summary: '답과 선택지 조회 API', description: '답과 그에 대응하는 선택지 조회.' })
    getTest(@Body() questionAndSelectionDto: QuestionAndSelectionDto): Promise<any> {
        return this.ticketboxService.getTest(questionAndSelectionDto);
    }
    
    @ApiBody({schema: {properties: {resultCombination: { type: "string" }}}})
    @ApiOperation({ summary: '매표소 결과 API', description: '사용자의 선택지(1212121)에 해당하는 영화, 술 반환' })
    @ApiCreatedResponse({ description: '사용자의 선택지(1212121)에 해당하는 영화, 술 반환' })
    @Post('/result')
    getResult(@Body('resultCombination') resultCombination: string): Promise<any> {
        return this.ticketboxService.getResult(resultCombination);
    }

    // 하나만 나오는
    @ApiExcludeEndpoint()
    @Post('/result/alcoholone')
    @ApiOperation({ summary: '매표소 결과 API (술)', description: '사용자의 선택지 Body로 받고 그에 해당하는 술 배열 반환. (2개) /ticketbox/result/alcohol/1111111' })
    @ApiCreatedResponse({ description: '사용자의 선택지 Body로 받고 그에 해당하는 술 배열 반환. (2개)' })
    async getResultAlcoholOne(@Body('id') id: string) {
        return await this.ticketboxService.getResultAlcohol(id);
    }

    @ApiExcludeEndpoint()
    @Post('/result/movie') // 22221(22)
    @ApiOperation({ summary: '매표소 결과 API (영화)', description: '사용자의 선택지 param으로 받고 그에 해당하는 영화 반환. /ticketbox/result/movie/111111' })
    @ApiCreatedResponse({ description: '사용자의 선택지 param으로 받고 그에 해당하는 영화 반환' })
    getMovie(@Body('id') id: string): Promise<any> {
        return this.ticketboxService.getResultMovie(id);
    }

    // 영화 사진 등록
    @Post('/movie/image/:id')
    @UseInterceptors(FilesInterceptor("file", 10, {
        storage: multerS3({
            s3: s3,
            bucket: process.env.AWS_S3_BUCKET_NAME,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            accessKeyId: process.env.AWS_ACCESS_KEY,
            acl: 'public-read',
            key: function (req, file, cb) {
                cb(null, `${Date.now().toString()}-${file.originalname}`);
            }
        }),
        limits: {} // 이게 아마 제한 거는 거인듯, 예제에선 10장
    }))
    async putAlcoholImage(@Param('id') movie_id: number, @UploadedFiles() files: Express.Multer.File[], @Req() request, @Res() response) {
        let location;

        if (request.files == undefined) {
            console.log("no image file.");
            location = null;
        } else {
            console.log('image file exist.');
            location = request.files;
        }

        const movieImage = await this.ticketboxService.putAlcoholImage(movie_id, files, location);

        response.send(movieImage);
        return movieImage;
    }

    // 전체 id만 나오는 !!
    @ApiExcludeEndpoint()
    @Post('/result/alcoholall')
    @ApiOperation({ summary: '매표소 결과 API (술)', description: '사용자의 선택지 Body로 받고 그에 해당하는 술 배열 반환. (2개) /ticketbox/result/alcohol/1111111' })
    @ApiCreatedResponse({ description: '사용자의 선택지 Body로 받고 그에 해당하는 술 배열 반환. (2개)' })
    async getResultAlcoholAll(@Body('id') id: string) {
        return [
            await this.ticketboxService.getResultAlcoholAll("1111x1"),
            await this.ticketboxService.getResultAlcoholAll("1112x1"),
            await this.ticketboxService.getResultAlcoholAll("1121x1"), // 여러
            await this.ticketboxService.getResultAlcoholAll("1122x1"),

            await this.ticketboxService.getResultAlcoholAll("1211x1"), // 1, 3
            await this.ticketboxService.getResultAlcoholAll("1212x1"),
            await this.ticketboxService.getResultAlcoholAll("1221x1"), // 1, 3
            await this.ticketboxService.getResultAlcoholAll("1222x1"),

            await this.ticketboxService.getResultAlcoholAll("2111x1"), // 1, 3
            await this.ticketboxService.getResultAlcoholAll("2112x1"),
            await this.ticketboxService.getResultAlcoholAll("2121x1"),
            await this.ticketboxService.getResultAlcoholAll("2122x1"),

            await this.ticketboxService.getResultAlcoholAll("2211x1"), // 0 
            await this.ticketboxService.getResultAlcoholAll("2212x1"),
            await this.ticketboxService.getResultAlcoholAll("2221x1"), // 0
            await this.ticketboxService.getResultAlcoholAll("2222x1"),

            await this.ticketboxService.getResultAlcoholAll("1111x2"),
            await this.ticketboxService.getResultAlcoholAll("1112x2"),
            await this.ticketboxService.getResultAlcoholAll("1121x2"),
            await this.ticketboxService.getResultAlcoholAll("1122x2"),

            await this.ticketboxService.getResultAlcoholAll("1211x2"),
            await this.ticketboxService.getResultAlcoholAll("1212x2"),
            await this.ticketboxService.getResultAlcoholAll("1221x2"),
            await this.ticketboxService.getResultAlcoholAll("1222x2"),

            await this.ticketboxService.getResultAlcoholAll("2111x2"),
            await this.ticketboxService.getResultAlcoholAll("2112x2"),
            await this.ticketboxService.getResultAlcoholAll("2121x2"),
            await this.ticketboxService.getResultAlcoholAll("2122x2"),

            await this.ticketboxService.getResultAlcoholAll("2211x2"), // 0
            await this.ticketboxService.getResultAlcoholAll("2212x2"), // 여러 
            await this.ticketboxService.getResultAlcoholAll("2221x2"), // 0
            await this.ticketboxService.getResultAlcoholAll("2222x2"),

            await this.ticketboxService.getResultAlcoholAll("1111x3"),
            await this.ticketboxService.getResultAlcoholAll("1112x3"),
            await this.ticketboxService.getResultAlcoholAll("1121x3"),
            await this.ticketboxService.getResultAlcoholAll("1122x3"),

            await this.ticketboxService.getResultAlcoholAll("1211x3"),
            await this.ticketboxService.getResultAlcoholAll("1212x3"),
            await this.ticketboxService.getResultAlcoholAll("1221x3"),
            await this.ticketboxService.getResultAlcoholAll("1222x3"),

            await this.ticketboxService.getResultAlcoholAll("2111x3"),
            await this.ticketboxService.getResultAlcoholAll("2112x3"),
            await this.ticketboxService.getResultAlcoholAll("2121x3"),
            await this.ticketboxService.getResultAlcoholAll("2122x3"),

            await this.ticketboxService.getResultAlcoholAll("2211x3"), // 여러
            await this.ticketboxService.getResultAlcoholAll("2212x3"), // 2
            await this.ticketboxService.getResultAlcoholAll("2221x3"),
            await this.ticketboxService.getResultAlcoholAll("2222x3"), // 2
        ];
    }
}
