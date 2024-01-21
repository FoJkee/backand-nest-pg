import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const auth = request.headers.authorization;
    if (!auth) throw new UnauthorizedException();

    const code = Buffer.from('admin:qwerty', 'utf-8').toString('base64');

    if (auth !== `Basic ${code}`) throw new UnauthorizedException();
    return true;
  }
}
