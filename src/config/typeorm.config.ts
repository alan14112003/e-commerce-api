import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DATABASE_HOST', 'localhost'),
  port: configService.get<number>('DATABASE_PORT', 3306),
  username: configService.get<string>('DATABASE_USER', 'root'),
  password: configService.get<string>('DATABASE_PASSWORD', 'password'),
  database: configService.get<string>('DATABASE_NAME', 'test'),
  autoLoadEntities: true,
  synchronize: true, // Không nên dùng trong môi trường production
  entities: ['dist/**/*.entity.js'],
});

// Tạo DataSource để sử dụng với CLI của TypeORM
export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 3306,
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'test',
  entities: ['dist/**/*.entity.js'],
  synchronize: true,
});
