import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';
import { PostReactionController } from './post-reaction.controller';
import { PostReactionService } from './post-reaction.service';
import { PostReaction } from './post-reaction.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post, User, PostReaction]),
    ],
    providers: [PostReactionService],
    controllers: [PostReactionController],
})
export class PostReactionModule { }
