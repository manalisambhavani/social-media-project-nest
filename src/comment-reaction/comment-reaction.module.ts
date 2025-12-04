import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentReaction } from "./comment-reaction.entity";
import { Module } from "@nestjs/common";
import { Comment } from "src/comment/comment.entity";
import { CommentReactionService } from "./comment-reaction.service";
import { CommentReactionController } from "./comment-reaction.controller";

@Module({
    imports: [TypeOrmModule.forFeature([CommentReaction, Comment])
    ],
    providers: [CommentReactionService],
    controllers: [CommentReactionController],
})
export class CommentReactionModule { }

