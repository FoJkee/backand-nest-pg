import { Module } from '@nestjs/common';
import { TestingController } from './api/testing.controller';
import { TestingService } from './api/testing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { DeviceEntity } from '../device/entity/device.entity';

const imports = [TypeOrmModule.forFeature([UserEntity, DeviceEntity])];

@Module({
  providers: [TestingService],
  controllers: [TestingController],
  imports: [...imports],
})
export class TestingModule {}
