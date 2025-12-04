import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
                isActive: true
            },
        });
        if (!comment) {
            throw new NotFoundException('Comment not found');
        }
        const existingReaction = await this.commentReactionRepo.findOne({
            where: {
                commentId,
                userId,
                isActive: true
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
        const comment = await this.commentRepo.findOne({
            where: {
                id: +commentId,
                isActive: true
            },
        });

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }
        const reactions = await this.commentReactionRepo.find({
            where: {
                commentId: +commentId,
                isActive: true
            },
            select: ['id', 'userId', 'commentId'],
        });
        return {
            message: 'Reactions fetched successfully',
            data: reactions,
        };
    }

    async deleteReaction(reactionId: string, userId: number) {
        const reaction = await this.commentReactionRepo.findOne({
            where: {
                id: +reactionId,
                userId: userId,
                isActive: true,
            },
        });
        if (!reaction) {
            throw new NotFoundException('Reaction does not exist');
        }
        reaction.isActive = false;
        await this.commentReactionRepo.save(reaction);
        return {
            message: 'Reaction removed successfully',
        };
    }

}
