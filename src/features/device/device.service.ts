import { Injectable } from '@nestjs/common';
import { DeviceModels } from './dto/device.models';
import { DeviceRepoSql } from './device.repo.sql';

@Injectable()
export class DeviceService {
  constructor(private readonly deviceRepoSql: DeviceRepoSql) {}

  async createDevice(createDevice: DeviceModels) {
    return await this.deviceRepoSql.createDevice(createDevice);
  }
}
