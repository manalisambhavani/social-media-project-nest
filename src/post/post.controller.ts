import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Request, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
    constructor(private postservice: PostService) { }

    @Post('')
    @UseGuards(JwtAuthGuard)
    async createPost(@Body() dto: CreatePostDto, @Request() req) {
        const { userId } = req.user;

        const post = await this.postservice.create(dto, userId);

        return {
            message: 'Post created successfully',
            data: post,
        };
    }

    @Get('')
    @UseGuards(JwtAuthGuard)
    async getPosts(
        @Req() req: any,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('dateFrom') dateFrom: string,
        @Query('dateTo') dateTo: string,
        @Query('sortOrder') sortOrder: 'ASC' | 'DESC') {

        const userId = req.user.userId;

        const result = await this.postservice.getPosts(
            userId,
            page,
            limit,
            { dateFrom, dateTo },
            { sortBy: 'post.updatedAt', sortOrder });

        return {
            message: 'Posts fetched successfully',
            data: result.items,
            pagination: {
                totalItems: result.totalItems,
                totalPages: result.totalPages,
                currentPage: result.page,
                pageSize: result.limit,
                hasNextPage: result.page < result.totalPages,
                hasPrevPage: result.page > 1
            }
        }
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async updatePost(
        @Param('id') id: number,
        @Body() dto: UpdatePostDto,
        @Req() req
    ) {
        const { userId } = req.user;

        const post = await this.postservice.updatePost(id, dto, userId);

        return {
            message: 'Post updated successfully',
            data: post,
        };
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deletePost(@Param('id') id: number, @Req() req) {
        const { userId } = req.user;

        await this.postservice.deletePost(id, userId);

        return {
            message: 'Post deleted successfully',
        };
    }

}
