import { defineConfig } from 'drizzle-kit';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default defineConfig({
  schema: './src/database/schema/*',
  out: './drizzle',
  dialect: 'postgresql',
  migrations: {
    schema: 'public',
  },
  dbCredentials: {
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    user: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DATABASE'),
  },
  verbose: true,
});
