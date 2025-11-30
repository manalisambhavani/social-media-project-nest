import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Request, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
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
    async getActivePosts(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 5,) {
        const posts = await this.postservice.findAllActive(Number(page), Number(limit));

        return {
            message: 'Posts fetched successfully',
            data: posts,
        };
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
