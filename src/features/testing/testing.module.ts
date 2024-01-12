import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { TestingRepoSql } from './testing.repo.sql';

@Module({
  providers: [TestingRepoSql],
  controllers: [TestingController],
  imports: [],
})
export class TestingModule {}
