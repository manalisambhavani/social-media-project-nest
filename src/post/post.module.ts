import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { User } from '../user/user.entity';
import { Comment } from '../comment/comment.entity';
import { CommentReaction } from '../comment-reaction/comment-reaction.entity';
import { PostReaction } from '../post-reaction/post-reaction.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post, User, Comment, CommentReaction, PostReaction]),
    ],
    providers: [PostService],
    controllers: [PostController],
})
export class PostModule { }
