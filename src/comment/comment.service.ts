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

    async getComments(
        postId: number,
        page: number = 1,
        limit: number = 10,
        userId: number,
        filters?: { dateFrom?: string; dateTo?: string },
        sort?: { sortBy?: string; sortOrder?: 'ASC' | 'DESC' }
    ) {
        const skip = (page - 1) * limit;

        const totalItems = await this.commentRepo.count({
            where: {
                post: { id: postId },
                deletedAt: IsNull(),
            },
        });

        const baseQuery = this.commentRepo
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user', 'user')
            .where('comment.postId = :postId', { postId })
            .andWhere('comment.deletedAt IS NULL');

        if (filters?.dateFrom) {
            baseQuery.andWhere('comment.createdAt >= :dateFrom', {
                dateFrom: filters.dateFrom,
            });
        }
        if (filters?.dateTo) {
            baseQuery.andWhere('comment.createdAt <= :dateTo', {
                dateTo: filters.dateTo,
            });
        }

        const sortBy = sort?.sortBy ?? 'comment.updatedAt';
        const sortOrder = sort?.sortOrder ?? 'DESC';

        baseQuery.orderBy(sortBy, sortOrder);

        baseQuery.skip(skip).take(limit);

        const comments = await baseQuery.getMany();

        if (comments.length === 0) {
            return {
                data: [],
                pagination: {
                    totalItems,
                    totalPages: Math.ceil(totalItems / limit),
                    currentPage: page,
                    pageSize: limit,
                    hasNextPage: false,
                    hasPrevPage: page > 1,
                },
            };
        }

        const commentIds = comments.map(c => c.id);

        const userReactions = await this.commentReactionRepo
            .createQueryBuilder('cr')
            .select(['cr.id', 'cr.commentId'])
            .where('cr.commentId IN (:...commentIds)', { commentIds })
            .andWhere('cr.userId = :userId', { userId })
            .andWhere('cr.deletedAt IS NULL')
            .getMany();

        const userReactionMap = new Map(
            userReactions.map(r => [r.commentId, r]),
        );

        const reactionCounts = await this.commentReactionRepo
            .createQueryBuilder('cr')
            .select('cr.commentId', 'commentId')
            .addSelect('COUNT(*)', 'count')
            .where('cr.commentId IN (:...commentIds)', { commentIds })
            .andWhere('cr.deletedAt IS NULL')
            .groupBy('cr.commentId')
            .getRawMany();

        const countMap = new Map(
            reactionCounts.map(r => [Number(r.commentId), Number(r.count)]),
        );

        const formatted = comments.map(comment => ({
            id: comment.id,
            message: comment.message,
            user: {
                id: comment.user.id,
                username: comment.user.username,
            },
            userReactionOnComment: userReactionMap.get(comment.id)
                ? { id: userReactionMap.get(comment.id)!.id }
                : null,
            count: countMap.get(comment.id) || 0,
        }));

        return {
            data: formatted,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                pageSize: limit,
                hasNextPage: page < Math.ceil(totalItems / limit),
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
