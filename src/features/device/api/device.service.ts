import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceEntity } from '../entity/device.entity';
import { DeviceModels } from '../dto/device.models';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
  ) {}

  async createDevice(createDevice: DeviceModels): Promise<DeviceEntity> {
    return this.deviceRepository.save(createDevice);
  }

  async deleteDeviceSessionUserId(deviceId: string, userId: string) {
    return await this.deviceRepository.delete({
      deviceId,
      userId,
    });
  }
}
