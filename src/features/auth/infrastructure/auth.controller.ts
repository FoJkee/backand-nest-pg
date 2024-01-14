import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RegistrationDto } from '../dto/registration.dto';
import { CommandBus } from '@nestjs/cqrs';
import { Registration } from '../use-cases/registration';
import { RegistrationEmailResendingDto } from '../dto/registrationEmailResending.dto';
import { RegistrationEmailResending } from '../use-cases/registrationEmailResending';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post('registration')
  @HttpCode(204)
  async registration(@Body() registrationDto: RegistrationDto) {
    return await this.commandBus.execute(new Registration(registrationDto));
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async registrationEmailResending(
    @Body() registrationEmailResendingDto: RegistrationEmailResendingDto,
  ) {
    return await this.commandBus.execute(
      new RegistrationEmailResending(registrationEmailResendingDto),
    );
  }
}
