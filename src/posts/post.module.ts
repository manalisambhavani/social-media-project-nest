import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostService } from './posts.service';
import { PostController } from './posts.controller';
import { User } from '../users/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post, User]),
    ],
    providers: [PostService],
    controllers: [PostController],
})
export class PostModule { }
