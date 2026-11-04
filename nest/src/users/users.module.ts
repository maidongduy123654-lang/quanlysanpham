import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service.js';
import { User } from './entities/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // 👈 Bắt buộc phải có dòng này
  providers: [UsersService],
  exports: [UsersService], // 👈 Để AuthService có thể dùng
})
export class UsersModule {}