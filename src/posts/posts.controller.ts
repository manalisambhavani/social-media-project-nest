import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Request, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostService } from './posts.service';
import { IsInt, IsNotEmpty, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    @Length(5, 50)
    title: string;

    @IsString()
    @Length(5, 300)
    description: string;

}

export class UpdatePostDto {
    @IsString()
    @IsNotEmpty()
    @Length(5, 50)
    title: string;

    @IsString()
    @Length(5, 300)
    description: string;
}


@Controller('posts')
export class PostController {
    constructor(private postservice: PostService) { }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createPost(@Body() dto: CreatePostDto, @Request() req) {
        const userId = req.user.userId;
        console.log("🚀 ~ PostController ~ createPost ~ req.user:", req.user)

        const post = await this.postservice.create(dto, userId);


        return {
            message: 'Post created successfully',
            data: post,
        };
    }

    @Get('get-posts')
    @UseGuards(JwtAuthGuard)
    async getActivePosts() {
        const posts = await this.postservice.findAllActive();

        return {
            message: 'Posts fetched successfully',
            data: posts,
        };
    }

    @Patch('update-post/:id')
    @UseGuards(JwtAuthGuard)
    async updatePost(
        @Param('id') id: number,
        @Body() dto: UpdatePostDto,
        @Req() req
    ) {
        const userId = req.user.userId; // from JWT

        const post = await this.postservice.updatePost(id, dto, userId);

        return {
            message: 'Post updated successfully',
            data: post,
        };
    }

    @Delete('delete-post/:id')
    @UseGuards(JwtAuthGuard)
    async deletePost(@Param('id') id: number, @Req() req) {
        const userId = req.user.userId;

        await this.postservice.deletePost(id, userId);

        return {
            message: 'Post deleted successfully',
        };
    }

}
