import { Controller, Delete, HttpCode } from '@nestjs/common';
import { TestingRepoSql } from './testing.repo.sql';

@Controller('testing')
export class TestingController {
  constructor(private readonly testingRepoSql: TestingRepoSql) {}

  @Delete('all-data')
  @HttpCode(204)
  async deleteAll(): Promise<boolean> {
    return await this.testingRepoSql.deleteAll();
  }
}
