import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../user/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepo: Repository<Post>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async create(dto: CreatePostDto, userId: number) {
        const user = await this.userRepo.findOne({ where: { id: userId, isActive: true } });
        if (!user) {
            throw new NotFoundException(`User not found`);
        }

        const post = this.postRepo.create({
            title: dto.title,
            description: dto.description,
            userId: userId,
        });

        return this.postRepo.save(post);
    }

    async findAllActive(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [post, total] = await this.postRepo.findAndCount({
            where: { isActive: true },
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });

        return {
            data: post,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }


    async updatePost(postId: number, dto: UpdatePostDto, userId: number) {
        const post = await this.postRepo.findOne({
            where: {
                id: postId,
                user: { id: userId },
                isActive: true,
            },
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        post.title = dto.title ?? post.title;
        post.description = dto.description ?? post.description;

        return await this.postRepo.save(post);
    }

    async deletePost(postId: number, userId: number) {
        const post = await this.postRepo.findOne({
            where: {
                id: postId,
                user: { id: userId },
                isActive: true
            }
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        post.isActive = false;
        await this.postRepo.save(post);
    }

}
