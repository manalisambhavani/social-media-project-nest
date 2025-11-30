import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './comment.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepo: Repository<Post>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Comment)
        private readonly commentRepo: Repository<Comment>,
    ) { }

    async create(dto: CreateCommentDto, userId: number) {
        const { message, postId } = dto;

        const user = await this.userRepo.findOne({ where: { id: userId, isActive: true } });
        if (!user) throw new NotFoundException('User not found');

        const post = await this.postRepo.findOne({ where: { id: postId } });
        if (!post) throw new NotFoundException('Post not found');

        const newComment = this.commentRepo.create({
            message,
            postId,
            userId,
        });

        return this.commentRepo.save(newComment);
    }

    async getComments(postId: number, page: number, limit: number) {
        const skip = (page - 1) * limit;

        const totalItems = await this.commentRepo.count({
            where: {
                post: { id: postId },
                isActive: true,
            },
        });

        const comments = await this.commentRepo.find({
            where: {
                post: { id: postId },
                isActive: true,
            },
            relations: ['user'],
            order: { id: 'DESC' },
            skip,
            take: limit,
        });

        const totalPages = Math.ceil(totalItems / limit);

        return {
            data: comments,
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
                isActive: true,
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
                isActive: true
            }
        });

        if (!comment) {
            throw new NotFoundException('comment not found');
        }
        comment.isActive = false;
        await this.commentRepo.save(comment);
    }

}
