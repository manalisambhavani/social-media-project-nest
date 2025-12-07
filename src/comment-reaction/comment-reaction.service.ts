import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CommentReaction } from './comment-reaction.entity';
import { Comment } from '../comment/comment.entity';

@Injectable()
export class CommentReactionService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepo: Repository<Comment>,

        @InjectRepository(CommentReaction)
        private readonly commentReactionRepo: Repository<CommentReaction>,
    ) { }

    async addReaction(commentId: number, userId: number) {
        const comment = await this.commentRepo.findOne({
            where: {
                id: commentId,
                deletedAt: IsNull(),
            },
        });

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        const existingReaction = await this.commentReactionRepo.findOne({
            where: {
                commentId,
                userId,
                deletedAt: IsNull(),
            },
        });

        if (existingReaction) {
            throw new ConflictException('Reaction already exists');
        }

        const newReaction = this.commentReactionRepo.create({
            commentId,
            userId
        });

        await this.commentReactionRepo.save(newReaction);

        return {
            message: 'Reaction added successfully',
            data: newReaction,
        };
    }

    async getReactionsByComment(commentId: string) {
        const id = +commentId;

        const comment = await this.commentRepo.findOne({
            where: {
                id,
                deletedAt: IsNull(),
            },
        });

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        const reactions = await this.commentReactionRepo.find({
            where: {
                commentId: id,
                deletedAt: IsNull(),
            },
            select: ['id', 'userId', 'commentId'],
        });

        return {
            message: 'Reactions fetched successfully',
            data: reactions,
        };
    }

    async deleteReaction(reactionId: string, userId: number) {
        const id = +reactionId;

        const reaction = await this.commentReactionRepo.findOne({
            where: {
                id,
                userId,
                deletedAt: IsNull(),
            },
        });

        if (!reaction) {
            throw new NotFoundException('Reaction does not exist');
        }

        await this.commentReactionRepo.softDelete(id);

        return {
            message: 'Reaction removed successfully',
        };
    }

}
