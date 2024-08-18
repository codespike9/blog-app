import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { S3Service } from 'src/s3/s3.service';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports:[S3Module],
  controllers: [BlogController],
  providers: [BlogService]
})
export class BlogModule {}
