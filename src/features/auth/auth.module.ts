import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/auth.controller';
import { RegistrationHandler } from './use-cases/registration';
import { UserService } from '../user/api/user.service';
import { UserRepoSql } from '../user/api/user.repo.sql';
import { EmailService } from '../../setting/email.service';
import { CqrsModule } from '@nestjs/cqrs';
import { RegistrationEmailResendingHandler } from './use-cases/registrationEmailResending';

@Module({
  controllers: [AuthController],
  providers: [
    RegistrationHandler,
    UserService,
    UserRepoSql,
    EmailService,
    RegistrationEmailResendingHandler,
  ],
  imports: [CqrsModule],
})
export class AuthModule {}
