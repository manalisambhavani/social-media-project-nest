import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // ✅ Required
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule], // ✅ Export if used by other modules (e.g. Auth)
})
export class UsersModule { }
