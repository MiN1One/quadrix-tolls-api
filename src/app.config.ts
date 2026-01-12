import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '6000', 10),
  dbUrl: process.env.DATABASE_URL,
  isDev: process.env.NODE_ENV === 'development',
  tollGuruApiKey: process.env.TOLLGURU_API_KEY,
}));
