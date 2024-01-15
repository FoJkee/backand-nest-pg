import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DeviceModels } from './dto/device.models';

export class DeviceRepoSql {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createDevice(createDevice: DeviceModels) {}
}
