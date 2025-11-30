import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @Post('')
    @UseGuards(JwtAuthGuard)
    async create(@Body() dto: CreateCommentDto, @Req() req) {
        const userId = req.user.userId;

        const newComment = await this.commentService.create(dto, userId);

        return {
            message: 'Comment Added successfully',
            data: newComment,
        };
    }

    @Get(':postId')
    @UseGuards(JwtAuthGuard)
    async getComments(
        @Param('postId') postId: number,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        const result = await this.commentService.getComments(postId, page, limit);

        return {
            message: 'Comments fetched successfully',
            data: result.data,
            pagination: result.pagination,
        };
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async updateComment(
        @Param('id') id: number,
        @Body() dto: UpdateCommentDto,
        @Req() req
    ) {
        const { userId } = req.user;

        const comment = await this.commentService.updateComment(id, dto, userId);

        return {
            message: 'Comment updated successfully',
            data: comment,
        };
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteComment(@Param('id') id: number, @Req() req) {
        const { userId } = req.user;

        await this.commentService.deleteComment(id, userId);

        return {
            message: 'Comment deleted successfully',
        };
    }

}
