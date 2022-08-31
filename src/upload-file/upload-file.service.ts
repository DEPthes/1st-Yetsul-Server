import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadFile } from 'src/Entity/Alcohol/upload-file.entity';
import { UploadFileRepository } from 'src/Repository/upload-file.repository';

@Injectable()
export class UploadFileService {
  constructor(
    @InjectRepository(UploadFileRepository)
    private readonly UploadFileRepository: UploadFileRepository
  ) { }

  // 파일 업로드
  async uploadFile(files: Express.Multer.File[], location) {

    const uploadfiles = []; // 업로드 할 파일 배열 (여러 장 가능)

    for (const element in files) { // 업로드 한 파일 개수 만큼
      const file = new UploadFile();
      file.originalName = files[element].originalname;
      file.encoding = files[element].encoding;
      file.mimeType = files[element].mimetype;
      file.size = files[element].size;
      file.url = location[element].location;
      uploadfiles.push(file); // 업로드 할 파일 배열에 파일 넣기
    }

    try {
      return { "data": await this.UploadFileRepository.save(uploadfiles) };
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}