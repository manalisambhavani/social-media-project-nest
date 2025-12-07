import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './comment.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentReaction } from '../comment-reaction/comment-reaction.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepo: Repository<Post>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Comment)
        private readonly commentRepo: Repository<Comment>,

        @InjectRepository(CommentReaction)
        private readonly commentReactionRepo: Repository<CommentReaction>,
    ) { }

    async create(dto: CreateCommentDto, userId: number) {
        const { message, postId } = dto;

        const user = await this.userRepo.findOne({
            where: { id: userId }
        });

        if (!user) throw new NotFoundException('User not found');

        const post = await this.postRepo.findOne({
            where: { id: postId }
        });

        if (!post) throw new NotFoundException('Post not found');

        const newComment = this.commentRepo.create({
            message,
            postId,
            userId,
        });

        return this.commentRepo.save(newComment);
    }

    async getComments(postId: number, page: number, limit: number, userId: number) {
        const skip = (page - 1) * limit;

        const totalItems = await this.commentRepo.count({
            where: {
                post: {
                    id: postId
                },
                deletedAt: IsNull(),
            },
        });

        const comments = await this.commentRepo
            .createQueryBuilder('comment')
            .leftJoin('comment.user', 'user')
            .leftJoin(
                'comment.commentReactions',
                'loggedReaction',
                'loggedReaction.userId = :userId AND loggedReaction.deletedAt IS NULL',
                { userId }
            )
            .select([
                'comment.id AS id',
                'comment.message AS message',
                'user.id AS user_id',
                'user.username AS user_username',
                'loggedReaction.id AS reaction_id',
            ])
            .addSelect(subQuery =>
                subQuery
                    .select('COUNT(*)')
                    .from('comment-reactions', 'cr')
                    .where('cr.commentId = comment.id')
                    .andWhere('cr.deletedAt IS NULL'),
                'count'
            )
            .where('comment.postId = :postId', { postId })
            .andWhere('comment.deletedAt IS NULL')
            .orderBy('comment.createdAt', 'DESC')
            .skip(skip)
            .take(limit)
            .getRawMany();


        const formatted = comments.map(row => ({
            id: row.id,
            message: row.message,
            user: {
                id: row.user_id,
                username: row.user_username,
            },
            userReactionOnComment: {
                id: row.reaction_id ?? null,
            },
            count: Number(row.count),
        }));

        const totalPages = Math.ceil(totalItems / limit);

        return {
            data: formatted,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                pageSize: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        };
    }

    async updateComment(commentId: number, dto: UpdateCommentDto, userId: number) {
        const comment = await this.commentRepo.findOne({
            where: {
                id: commentId,
                user: { id: userId },
                deletedAt: IsNull(),
            },
        });

        if (!comment) {
            throw new NotFoundException('comment not found');
        }

        comment.message = dto.message;

        return await this.commentRepo.save(comment);
    }

    async deleteComment(commentId: number, userId: number) {
        const comment = await this.commentRepo.findOne({
            where: {
                id: commentId,
                user: { id: userId },
                deletedAt: IsNull(),
            }
        });

        if (!comment) {
            throw new NotFoundException('comment not found');
        }

        await this.commentReactionRepo.softDelete({
            comment: {
                id: commentId
            }
        });

        await this.commentRepo.softDelete(commentId);

        return { message: 'Comment deleted successfully' };
    }

}
