import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Comment } from './comment.entity';
import { Post } from '../post/post.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentReaction } from '../comment-reaction/comment-reaction.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post, User, Comment, CommentReaction]),
    ],
    providers: [CommentService],
    controllers: [CommentController],
})
export class CommentModule { }
