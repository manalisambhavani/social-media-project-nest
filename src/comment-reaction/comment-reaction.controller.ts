import { Controller, Post, Param, Req, UseGuards, Get, Delete } from '@nestjs/common';
import { CommentReactionService } from './comment-reaction.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comment-reactions')
export class CommentReactionController {
    constructor(private readonly CommentReactionService: CommentReactionService) { }

    @Post(':id')
    @UseGuards(JwtAuthGuard)
    async addReaction(@Param('id') commentId: number, @Req() req) {
        const userId = req.user.userId;

        return this.CommentReactionService.addReaction(commentId, userId);
    }

    @Get(':id')
    async getReactionsByComment(@Param('id') id: string) {
        return this.CommentReactionService.getReactionsByComment(id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteReaction(
        @Param('id') id: string,
        @Req() req: any,
    ) {
        const userId = req.user.userId;
        return this.CommentReactionService.deleteReaction(id, userId);
    }

}



