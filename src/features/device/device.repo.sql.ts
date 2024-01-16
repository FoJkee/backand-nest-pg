import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DeviceModels } from './dto/device.models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeviceRepoSql {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createDevice(createDevice: DeviceModels) {
    const device = await this.dataSource.query(
      `
    insert into devices (userid, deviceid, devicename, ip, lastactivedate)
    values ($1, $2, $3, $4, $5)
    returning userid, deviceid, devicename, ip, lastactivedate
    `,
      [
        createDevice.userId,
        createDevice.deviceId,
        createDevice.deviceName,
        createDevice.ip,
        createDevice.lastActiveDate,
      ],
    );
    return device[0];
  }
}
