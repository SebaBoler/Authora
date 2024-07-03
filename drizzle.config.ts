import { defineConfig } from 'drizzle-kit';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { IConfiguration } from 'src/config/configuration';

config();

const configService = new ConfigService<IConfiguration, true>();
const postgresConfig = configService.get('postgres', { infer: true });

export default defineConfig({
  schema: './src/database/schema/*',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: postgresConfig.host,
    port: postgresConfig.port,
    user: postgresConfig.username,
    password: postgresConfig.password,
    database: postgresConfig.database,
  },
  verbose: true,
});
