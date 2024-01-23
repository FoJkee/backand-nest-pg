import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../features/auth/infrastructure/auth.service';
import { UserService } from '../features/user/api/user.service';

@Injectable()
export class BearerAuth implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const auth = request.headers.authorization;
    if (!auth) throw new UnauthorizedException();

    const token = auth.split(' ')[1];
    if (!token) throw new UnauthorizedException();

    const payloadToken = await this.authService.verifyAccessToken(token);
    if (!payloadToken) throw new UnauthorizedException();

    const user = await this.userService.findUserId(payloadToken.userId);
    if (!user) throw new UnauthorizedException();

    request.user = user;
    return true;
  }
}
