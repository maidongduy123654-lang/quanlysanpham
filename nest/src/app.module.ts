import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as fs from 'fs';           
import * as path from 'path';      
import { Product } from './product/entities/product.entity.js'; 
import { AuthModule } from './auth/auth.module.js';
import { ProductModule } from './product/product.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        ssl: {                                             
          ca: fs.readFileSync(path.join(process.cwd(), 'ca.pem')),
          rejectUnauthorized: true,
        },
        entities: [Product],
        synchronize: false, 
      }),
    }),
    AuthModule,
    ProductModule,
  ],
})
export class AppModule {}
