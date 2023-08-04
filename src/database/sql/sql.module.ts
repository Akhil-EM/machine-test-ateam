import { Module } from '@nestjs/common';
import { databaseProviders } from './sql.provider';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class SqlModule {}
