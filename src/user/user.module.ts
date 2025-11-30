import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './user.controller';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // ✅ Required
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule], // ✅ Export if used by other modules (e.g. Auth)
})
export class UsersModule { }
