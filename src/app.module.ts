import { DatabaseModule } from '@database/database.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IConfiguration, configuration } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    DatabaseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<IConfiguration>) => {
        const postgresConfig = configService.get('postgres', { infer: true });
        return {
          host: postgresConfig.host,
          port: postgresConfig.port,
          user: postgresConfig.username,
          password: postgresConfig.password,
          database: postgresConfig.database,
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
