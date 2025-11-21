// src/post/post.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from 'src/users/entities/entities/user.entity';
import { CreatePostDto, UpdatePostDto } from './posts.controller';
import { title } from 'process';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepo: Repository<Post>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async create(dto: CreatePostDto, userId: number) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User not found`);
        }

        const post = this.postRepo.create({
            title: dto.title,
            description: dto.description,
            userId: userId,
        });

        const saved = await this.postRepo.save(post);
        console.log("🚀 ~ PostService ~ create ~ saved:", saved)

        return this.postRepo.findOne({
            where: { id: saved.id },
        });
    }

    async findAllActive() {
        const posts = await this.postRepo.find({
            where: { isActive: true },
            relations: ['user'],
            select: {
                id: true,
                title: true,
                description: true,
                isActive: true,
                user: {
                    id: true,
                    username: true,
                },
            },
        });

        return posts;
    }

    async updatePost(postId: number, dto: UpdatePostDto, userId: number) {
        const post = await this.postRepo.findOne({
            where: {
                id: postId,
                user: { id: userId }, // only post created by logged user
                isActive: true,         // only active posts
            },
            relations: ['user'],     // to access post.user
            select: {
                id: true,
                title: true,
                description: true,
                isActive: true,
                user: {
                    id: true,
                    username: true,
                },
            },
        });

        // If ANY of the conditions fail → single error
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        // Update
        post.title = dto.title ?? post.title;
        post.description = dto.description ?? post.description;

        return await this.postRepo.save(post);
    }

    async deletePost(postId: number, userId: number) {
        const post = await this.postRepo.findOne({
            where: {
                id: postId,
                user: { id: userId },   // check owner
                isActive: true            // must be active
            }
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        // Soft delete → only update active field
        post.isActive = false;
        await this.postRepo.save(post);
    }

}
