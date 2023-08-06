import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { SqlModule } from './database/sql/sql.module';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { UsersModule } from './resources/users/users.module';
import { LocalStrategy } from './passport/localStorage.strategy';
import { VegetablesModule } from './resources/vegetables/vegetables.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

dotenv.config();
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../uploads'),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    SqlModule,
    UsersModule,
    VegetablesModule,
  ],
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
    LocalStrategy,
  ],
})
export class AppModule {}
