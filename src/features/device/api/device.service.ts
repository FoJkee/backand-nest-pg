import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { DeviceEntity } from '../entity/device.entity';
import { DeviceModels } from '../dto/device.models';
import { tr } from '@faker-js/faker';
import { not } from 'rxjs/internal/util/not';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
  ) {}

  async getDevice(userId: string): Promise<DeviceEntity[]> {
    return await this.deviceRepository.findBy({ userId });
  }

  async createDevice(createDevice: DeviceModels): Promise<DeviceEntity> {
    return this.deviceRepository.save(createDevice);
  }

  async deleteDeviceSessionUserId(deviceId: string, userId: string) {
    return await this.deviceRepository.delete({
      deviceId,
      userId,
    });
  }
  async findDeviceUserId(
    deviceId: string,
    userId: string,
  ): Promise<DeviceEntity> {
    return this.deviceRepository.findOneBy({
      deviceId,
      userId,
    });
  }
  async findDeviceId(deviceId: string): Promise<DeviceEntity> {
    return this.deviceRepository.findOneBy({ deviceId });
  }

  async deleteDeviceId(deviceId: string, userId: string): Promise<boolean> {
    try {
      await this.deviceRepository.delete({ deviceId, userId });
      return true;
    } catch (e) {
      return false;
    }
  }
  async deleteAllOtherSession(
    deviceId: string,
    userId: string,
  ): Promise<boolean> {
    try {
      await this.deviceRepository.delete({
        deviceId: Not(deviceId),
        userId,
      });
      return true;
    } catch (e) {
      return false;
    }
  }
}
