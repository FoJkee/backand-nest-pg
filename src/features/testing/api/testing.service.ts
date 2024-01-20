import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { DeviceEntity } from '../../device/entity/device.entity';

@Injectable()
export class TestingService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
  ) {}

  async deleteAll(): Promise<boolean> {
    try {
      await this.userRepository.delete({});
      await this.deviceRepository.delete({});
      return true;
    } catch (e) {
      return false;
    }
  }
}
