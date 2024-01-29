import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { DeviceEntity } from '../entity/device.entity';
import { DeviceModels } from '../dto/device.models';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
  ) {}

  async getDevice(userId: string): Promise<DeviceEntity[]> {
    return await this.deviceRepository.findBy({
      userId,
    });
  }

  async createDevice(createDevice: DeviceModels): Promise<DeviceEntity> {
    return this.deviceRepository.save(createDevice);
  }

  async deleteDeviceSessionUserId(
    deviceId: string,
    userId: string,
    lastActiveDate: string,
  ) {
    return this.deviceRepository.delete({
      deviceId: deviceId,
      userId: deviceId,
      lastActiveDate: lastActiveDate,
    });
  }
  async findDeviceUserId(
    deviceId: string,
    userId: string,
  ): Promise<DeviceEntity> {
    return await this.deviceRepository.findOne({
      where: {
        deviceId,
        userId,
      },
    });
  }
  async findDeviceId(deviceId: string): Promise<DeviceEntity> {
    return await this.deviceRepository.findOneBy({ deviceId });
  }

  async deleteDeviceId(deviceId: string, userId: string) {
    return await this.deviceRepository.delete({
      deviceId,
      userId,
    });
  }
  async deleteAllOtherSession(deviceId: string, userId: string) {
    await this.deviceRepository.delete({
      userId,
      deviceId: Not(deviceId),
    });
  }
  async updateDevice(
    userId: string,
    deviceId: string,
    lastActiveDate: string,
  ): Promise<boolean> {
    try {
      await this.deviceRepository.update(
        {
          userId,
        },

        { deviceId, lastActiveDate },
      );
      return true;
    } catch (e) {
      return false;
    }
  }
}
