import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  NotAcceptableException,
} from '@nestjs/common';
import { unlinkSync } from 'fs';
import { join } from 'path';
import { imageSize } from 'image-size';

@Injectable()
export class ImageValidationInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const uploadedFiles = request.files;
    const maxImageSize = 1024 * 1024; //one MB
    const uploadPath = join(__dirname, '../../../uploads', 'images');
    const removeFiles = async () => {
      for (const field of Object.keys(uploadedFiles)) {
        const files = uploadedFiles[field];
        for (const file of files) {
          await unlinkSync(`${uploadPath}/${file.filename}`);
        }
      }
    };

    if (!uploadedFiles) {
      throw new HttpException('image is  required', HttpStatus.NOT_ACCEPTABLE);
    } else {
      if (!uploadedFiles.image) {
        await removeFiles();
        throw new HttpException(`image is required`, HttpStatus.NOT_ACCEPTABLE);
      }
    }

    //only accept images
    for (const field of Object.keys(uploadedFiles)) {
      const files = uploadedFiles[field];
      for (const file of files) {
        if (!['image/png', 'image/jpeg'].includes(file.mimetype)) {
          await removeFiles();
          throw new HttpException(
            'only jpeg and png images accepted',
            HttpStatus.NOT_ACCEPTABLE,
          );
        }

        //validate for image size 1MB
        if (file.size >= maxImageSize) {
          await removeFiles();
          throw new HttpException(
            'images must be less than 1MB',
            HttpStatus.NOT_ACCEPTABLE,
          );
        }

        //imageFirst dimension validations
        if (file.fieldname === 'image') {
          const { height, width } = imageSize(`${uploadPath}/${file.filename}`);
          if (width !== 400 || height !== 400) {
            await removeFiles();
            throw new NotAcceptableException(
              'image dimensions must be 400 * 400 px',
            );
          }
        }
      }
    }
    return next.handle();
  }
}
