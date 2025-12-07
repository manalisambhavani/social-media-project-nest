import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { PostReactionDto } from './dto/post-reaction.dto';
import { Post } from '../post/post.entity';
import { PostReaction } from './post-reaction.entity';

@Injectable()
export class PostReactionService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepo: Repository<Post>,

        @InjectRepository(PostReaction)
        private readonly postReactionRepo: Repository<PostReaction>,
    ) { }

    async addReaction(
        postId: number,
        userId: number,
        dto: PostReactionDto,
    ) {

        const { reactionName } = dto;

        const post = await this.postRepo.findOne({
            where: {
                id: postId,
                deletedAt: IsNull(),
            },
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        const existingReaction = await this.postReactionRepo.findOne({
            where: {
                postId,
                userId,
                deletedAt: IsNull(),
            },
        });

        if (!existingReaction) {
            const newReaction = this.postReactionRepo.create({
                reactionName,
                postId,
                userId,
            });
            await this.postReactionRepo.save(newReaction);

            return { message: 'Reaction added successfully' };
        }

        existingReaction.reactionName = reactionName;
        await this.postReactionRepo.save(existingReaction);

        return { message: 'Reaction updated successfully' };
    }

    async listReactions(postId: number) {
        const post = await this.postRepo.findOne({
            where: {
                id: postId,
                deletedAt: IsNull(),
            },
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        const reactions = await this.postReactionRepo.find({
            where: {
                postId,
                deletedAt: IsNull(),
            },
        });

        if (!reactions.length) {
            throw new NotFoundException('Reactions do not exist');
        }

        const response = reactions.map((ele) => ({
            userId: ele.userId,
            postId: ele.postId,
            reactionName: ele.reactionName,
        }));

        return {
            message: 'Reactions fetched successfully',
            data: response,
        };
    }

    async deleteReaction(reactionId: number, userId: number) {
        const reaction = await this.postReactionRepo.findOne({
            where: {
                id: reactionId,
                userId: userId,
                deletedAt: IsNull(),
            },
        });

        if (!reaction) {
            throw new NotFoundException('Reaction does not exist');
        }

        await this.postReactionRepo.softDelete(reactionId);

        return {
            message: 'Reaction removed successfully',
        };
    }

}
