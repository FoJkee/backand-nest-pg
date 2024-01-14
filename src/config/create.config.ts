import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { useContainer } from 'class-validator';
import { GlobalHttpExceptionFilter } from '../setting/exeptionFilter';
import { GlobalValidationPipe } from '../setting/validation.pipe';
import * as cookieParser from 'cookie-parser';

export const createConfig = (app: INestApplication): INestApplication => {
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(GlobalValidationPipe);
  app.useGlobalFilters(GlobalHttpExceptionFilter);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  return app;
};
