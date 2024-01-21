import { Module } from '@nestjs/common';
import { DeviceController } from './api/device.controller';
import { DeviceService } from './api/device.service';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from './entity/device.entity';
import { DeleteDeviceIdHandler } from './user-cases/delete.deviceid';
import { AuthService } from '../auth/infrastructure/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/api/user.service';
import { UserEntity } from '../user/entity/user.entity';

const handlers = [DeleteDeviceIdHandler];

@Module({
  controllers: [DeviceController],
  providers: [DeviceService, ...handlers, AuthService, JwtService, UserService],
  imports: [CqrsModule, TypeOrmModule.forFeature([DeviceEntity, UserEntity])],
  exports: [DeviceService],
})
export class DeviceModule {}
