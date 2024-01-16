import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/auth.controller';
import { RegistrationHandler } from './use-cases/registration';
import { UserService } from '../user/api/user.service';
import { UserRepoSql } from '../user/api/user.repo.sql';
import { EmailService } from '../../setting/email.service';
import { CqrsModule } from '@nestjs/cqrs';
import { RegistrationEmailResendingHandler } from './use-cases/registrationEmailResending';
import { LoginHandler } from './use-cases/login';
import { AuthService } from './infrastructure/auth.service';
import { DeviceService } from '../device/device.service';
import { JwtService } from '@nestjs/jwt';
import { DeviceRepoSql } from '../device/device.repo.sql';

const handlers = [
  RegistrationHandler,
  RegistrationEmailResendingHandler,
  LoginHandler,
];
@Module({
  controllers: [AuthController],
  providers: [
    ...handlers,
    UserService,
    UserRepoSql,
    EmailService,
    AuthService,
    DeviceService,
    JwtService,
    DeviceRepoSql,
  ],
  imports: [CqrsModule],
})
export class AuthModule {}
