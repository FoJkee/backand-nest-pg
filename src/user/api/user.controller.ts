import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserDto, UserQueryDto } from '../dto/user.dto';
import { CreateUser } from '../use-cases/createUser';
import { DeleteUser } from '../use-cases/deleteUser';
import { GetAllUser } from '../use-cases/getAllUser';

@Controller('sa')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('users')
  @HttpCode(201)
  async createUser(@Body() userDto: UserDto) {
    return await this.commandBus.execute(new CreateUser(userDto));
  }
  @Delete('users/:userId')
  @HttpCode(200)
  async deleteUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.commandBus.execute(new DeleteUser(userId));
  }

  @Get('users')
  @HttpCode(200)
  async getAllUsers(@Query() userQueryDto: UserQueryDto) {
    return await this.queryBus.execute(new GetAllUser(userQueryDto));
  }
}
