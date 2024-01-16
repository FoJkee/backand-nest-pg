import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class TestingRepoSql {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async deleteAll(): Promise<boolean> {
    try {
      await this.dataSource.query(`
    delete from public."users";
    delete from public."devices"`);
      return true;
    } catch (e) {
      return false;
    }
  }
}
