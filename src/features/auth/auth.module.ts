import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/auth.controller';
import { RegistrationHandler } from './use-cases/registration';
import { UserService } from '../user/api/user.service';
import { EmailService } from '../../setting/email.service';
import { CqrsModule } from '@nestjs/cqrs';
import { RegistrationEmailResendingHandler } from './use-cases/registrationEmailResending';
import { LoginHandler } from './use-cases/login';
import { AuthService } from './infrastructure/auth.service';
import { DeviceService } from '../device/api/device.service';
import { JwtService } from '@nestjs/jwt';
import { LogoutHandler } from './use-cases/logout';
import { RegistrationConfirmationHandler } from './use-cases/registrationConfirmation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { DeviceEntity } from '../device/entity/device.entity';

const handlers = [
  RegistrationHandler,
  RegistrationEmailResendingHandler,
  RegistrationConfirmationHandler,
  LoginHandler,
  LogoutHandler,
];

const imports = [
  CqrsModule,
  TypeOrmModule.forFeature([UserEntity, DeviceEntity]),
];
@Module({
  controllers: [AuthController],
  providers: [
    ...handlers,
    UserService,
    EmailService,
    AuthService,
    DeviceService,
    JwtService,
  ],
  imports: [...imports],
})
export class AuthModule {}
