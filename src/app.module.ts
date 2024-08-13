import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { ConfigModule } from '@nestjs/config';
import { MongodbModule } from './mongodb/mongodb.module';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),AuthModule, BlogModule, MongodbModule],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'blog', method: RequestMethod.ALL })
  }
}
