import {
    Controller,
    Post,
    Req,
    UploadedFiles,
    UseInterceptors,
  } from '@nestjs/common';
  import * as AWS from 'aws-sdk';
  import * as multerS3 from 'multer-s3';
  import { FilesInterceptor } from '@nestjs/platform-express/multer/interceptors/files.interceptor';
  import { UploadFileService } from './upload-file.service';
  
  // AWS S3
  const s3 = new AWS.S3();
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2'
  });
  
  @Controller('/file')
  export class UploadFileController {
    constructor(private readonly UploadFileService: UploadFileService) { }
  
    // 리뷰 작성 테스트 (upload-file)
    @Post()
    @UseInterceptors(FilesInterceptor('file', 10, {
      storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: function (request, file, cb) {
          cb(null, `${Date.now().toString()}-${file.originalname}`);
        },
      }),
      limits: {}
    }),
    )
    async uploadFile(
      @UploadedFiles() files: Express.Multer.File[], @Req() request) {
      const location = request.files;
      return this.UploadFileService.uploadFile(files, location);
    }
  }