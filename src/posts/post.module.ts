// src/post/post.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostService } from './posts.service';
import { PostController } from './posts.controller';
import { User } from 'src/users/entities/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post, User]), // <--- important: provides Post repository in this module
    ],
    providers: [PostService],
    controllers: [PostController],
})
export class PostModule { }
