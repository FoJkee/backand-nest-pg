import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RegistrationDto } from './dto/registration.dto';
import { CommandBus } from '@nestjs/cqrs';
import { Registration } from './use-cases/registration';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post()
  @HttpCode(204)
  async registration(@Body() registrationDto: RegistrationDto) {
    return await this.commandBus.execute(new Registration(registrationDto));
  }
}
