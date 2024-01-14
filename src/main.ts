import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createConfig } from './config/create.config';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  createConfig(app);
  await app.listen(process.env.PORT);
}
bootstrap();
