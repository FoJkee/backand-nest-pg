import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigEnvType } from '../../../setting/env.config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<ConfigEnvType, true>,
  ) {}

  async generateToken(
    userId: string,
    deviceId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.jwtService.sign(
      { userId, deviceId },
      {
        secret: this.configService.get('secrets', { infer: true })
          .secretAccessToken,
        expiresIn: this.configService.get('secrets', { infer: true })
          .expirationAccessToken,
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        userId,
        deviceId,
      },
      {
        secret: this.configService.get('secrets', { infer: true })
          .secretRefreshToken,
        expiresIn: this.configService.get('secrets', { infer: true })
          .expirationRefreshToken,
      },
    );
    return { accessToken, refreshToken };
  }

  async decodeToken(token: string): Promise<string> {
    const result = await this.jwtService.decode(token);
    return new Date(result.iat * 1000).toISOString();
  }

  async verifyRefreshToken(refreshToken: string) {
    try {
      return this.jwtService.verify(refreshToken, {
        secret: this.configService.get('secrets', { infer: true })
          .secretRefreshToken,
      });
    } catch (e) {
      return null;
    }
  }

  async verifyAccessToken(accessToken: string) {
    try {
      return this.jwtService.verify(accessToken, {
        secret: this.configService.get('secrets', { infer: true })
          .secretAccessToken,
      });
    } catch (e) {
      return null;
    }
  }
}
