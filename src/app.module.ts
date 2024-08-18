import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { ConfigModule } from '@nestjs/config';
import { MongodbModule } from './mongodb/mongodb.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { BlogController } from './blog/blog.controller';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),AuthModule, BlogModule, MongodbModule, S3Module],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'blog/all-posts', method: RequestMethod.GET }
      )
      .forRoutes(BlogController)
  }
}
