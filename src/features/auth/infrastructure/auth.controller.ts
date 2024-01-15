import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { RegistrationDto } from '../dto/registration.dto';
import { CommandBus } from '@nestjs/cqrs';
import { Registration } from '../use-cases/registration';
import { RegistrationEmailResendingDto } from '../dto/registrationEmailResending.dto';
import { RegistrationEmailResending } from '../use-cases/registrationEmailResending';
import { RegistrationConfirmation } from '../use-cases/registrationConfirmation';
import { RegistrationConfirmationDto } from '../dto/registrationConfirmation.dto';
import { Login } from '../use-cases/login';
import { Response } from 'express';
import { LoginDto } from '../dto/login.dto';
import { deviceEntity, DeviceType } from '../../../decorators/deviceEntity';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() registrationDto: RegistrationDto) {
    return await this.commandBus.execute(new Registration(registrationDto));
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(
    @Body() registrationEmailResendingDto: RegistrationEmailResendingDto,
  ) {
    return await this.commandBus.execute(
      new RegistrationEmailResending(registrationEmailResendingDto),
    );
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(
    @Body() registrationConfirmationDto: RegistrationConfirmationDto,
  ) {
    return await this.commandBus.execute(
      new RegistrationConfirmation(registrationConfirmationDto),
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res() res: Response,
    @Body() loginDto: LoginDto,
    @deviceEntity() deviceType: DeviceType,
  ) {
    const userLogin = await this.commandBus.execute(
      new Login(loginDto, deviceType),
    );
    res.cookie('refreshToken', userLogin.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: userLogin.accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout() {}
}
