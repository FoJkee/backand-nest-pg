import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { RegistrationDto } from '../dto/registration.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
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
import { AboutMe } from '../use-cases/aboutMe';
import { BearerAuth } from '../../../guards/bearer.auth';
import {
  RefreshToken,
  RefreshTokenDecorator,
} from '../../../decorators/refreshToken.decorator';
import { RefreshTokenClass } from '../use-cases/refreshToken';
import { ThrottlerGuard } from '@nestjs/throttler';
import { DeviceDto } from '../../device/dto/device.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('registration')
  @UseGuards(ThrottlerGuard)
  @HttpCode(204)
  async registration(@Body() registrationDto: RegistrationDto) {
    return await this.commandBus.execute(new Registration(registrationDto));
  }

  @Post('registration-email-resending')
  @UseGuards(ThrottlerGuard)
  @HttpCode(204)
  async registrationEmailResending(
    @Body() registrationEmailResendingDto: RegistrationEmailResendingDto,
  ) {
    return await this.commandBus.execute(
      new RegistrationEmailResending(registrationEmailResendingDto),
    );
  }

  @Post('registration-confirmation')
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(
    @Body() registrationConfirmationDto: RegistrationConfirmationDto,
  ) {
    return await this.commandBus.execute(
      new RegistrationConfirmation(registrationConfirmationDto),
    );
  }

  @Post('login')
  @UseGuards(ThrottlerGuard)
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
  @HttpCode(204)
  async logout(
    @RefreshTokenDecorator() deviceDto: DeviceDto,
    @UserId() userId: string,
  ) {
    const userLogin = await this.commandBus.execute(
      new Logout(deviceDto, userId),
    );
    if (!userLogin) throw new UnauthorizedException();
    return;
  }

  @Post('refresh-token')
  @UseGuards(RefreshTokensGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @RefreshToken() token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userRefLogin = await this.commandBus.execute(
      new RefreshTokenClass(token),
    );

    if (!userRefLogin) throw new UnauthorizedException();

    res.cookie('refreshToken', userRefLogin.refreshTokenNew, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken: userRefLogin.accessTokenNew };
  }

  @Get('me')
  @UseGuards(BearerAuth)
  @HttpCode(HttpStatus.OK)
  async aboutMe(@UserId() userId: string) {
    return await this.queryBus.execute(new AboutMe(userId));
  }
}
