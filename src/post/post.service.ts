import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../user/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostReaction } from '../post-reaction/post-reaction.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepo: Repository<Post>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    private safeJsonParse(value: any) {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        try {
            return JSON.parse(value);
        } catch {
            return [];
        }
    }

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

    async getPosts(userId: number, page = 1, limit = 10) {
        const offset = (page - 1) * limit;

        const query = this.postRepo
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')

            .leftJoin(
                PostReaction,
                'userReaction',
                'userReaction.postId = post.id AND userReaction.userId = :userId AND userReaction.isActive = true',
                { userId }
            )
            .addSelect([
                'userReaction.id',
                'userReaction.reactionName'
            ])
            .addSelect(subQuery => {
                return subQuery
                    .select(`
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'reactionName', pr."reactionName",
                                'count', pr.count
                            )
                        ) FILTER (WHERE pr.count IS NOT NULL),
                        '[]'
                    )
                `)
                    .from(subQuery => {
                        return subQuery
                            .select(`pr2."reactionName"`, 'reactionName')
                            .addSelect(`COUNT(*)`, 'count')
                            .from(PostReaction, 'pr2')
                            .where('pr2."postId" = post.id')
                            .andWhere('pr2."isActive" = true')
                            .groupBy('pr2."reactionName"');
                    }, 'pr');
            }, 'reactionCounts')
            .where('post.isActive = true')
            .orderBy('post.createdAt', 'DESC')
            .skip(offset)
            .take(limit);

        const { raw, entities } = await query.getRawAndEntities();

        const totalItems = await this.postRepo.count({
            where: { isActive: true }
        });

        const response = entities.map((post, index) => {
            const row = raw[index];

            return {
                id: post.id,
                title: post.title,
                description: post.description,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,

                user: {
                    id: post.user.id,
                    username: post.user.username,
                },
                userReaction: row.userReaction_id
                    ? {
                        id: row.userReaction_id,
                        reactionName: row.userReaction_reactionName
                    }
                    : null,
                reactionCounts: this.safeJsonParse(row.reactionCounts)
            };
        });

        return {
            items: response,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            page,
            limit
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
