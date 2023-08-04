import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { SqlModule } from './database/sql/sql.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { UsersModule } from './resources/users/users.module';

dotenv.config();
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SqlModule, UsersModule],
  controllers: [AppController],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ResponseInterceptor,
    },
    {
      provide: 'APP_FILTER',
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
