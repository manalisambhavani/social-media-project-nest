import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
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
        @Req() req: any,
        @Param('postId') postId: number,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('dateFrom') dateFrom?: string,
        @Query('dateTo') dateTo?: string,
        @Query('sortBy') sortBy?: string,
        @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    ) {
        const userId = req.user.userId;

        const result = await this.commentService.getComments(
            Number(postId),
            Number(page),
            Number(limit),
            userId,
            {
                dateFrom,
                dateTo,
            },
            {
                sortBy,
                sortOrder,
            },
        );

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
