import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
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
import {
  DeviceDecorators,
  DeviceType,
} from '../../../decorators/device.decorators';
import { UserId } from '../../../decorators/user.decorator';
import { Logout } from '../use-cases/logout';
import { RefreshTokensGuard } from '../../../guards/refreshTokens.guard';

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
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
    @DeviceDecorators() deviceType: DeviceType,
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
  @UseGuards(RefreshTokensGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Res({ passthrough: true }) res: Response,
    @DeviceDecorators() deviceType: DeviceType,
    @UserId() userId: string,
  ) {
    const userLogin = await this.commandBus.execute(
      new Logout(deviceType, userId),
    );
    if (!userLogin) throw new UnauthorizedException();
    res.clearCookie('refreshToken').sendStatus(HttpStatus.NO_CONTENT);
    return;
  }

  // @Post('refresh-token')
  // @HttpCode(HttpStatus.OK)
  // async refreshToken() {
  //   return this.commandBus.execute();
  // }
}
