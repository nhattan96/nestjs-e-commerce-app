import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const PostgreTypeOrmModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
    const config: TypeOrmModuleOptions = {
      type: 'postgres',
      host: configService.get<string>('POSTGRE_HOST', 'localhost'),
      port: parseInt(configService.get<string>('POSTGRE_PORT', '5432'), 10),
      username: configService.get<string>('POSTGRE_USERNAME'),
      password: configService.get<string>('POSTGRE_PASSWORD'),
      database: configService.get<string>('POSTGRE_DATABASE'),
      synchronize: true,
      autoLoadEntities: true,
    };

    console.log('PostgreSQL connected !');

    return config;
  },
});
