import { Controller, Post, Param, Body, Req, UseGuards, Get, Delete } from '@nestjs/common';
import { PostReactionService } from './post-reaction.service';
import { PostReactionDto } from './dto/post-reaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('post-reactions')
export class PostReactionController {
    constructor(private postReactionService: PostReactionService) { }

    @Post(':id')
    @UseGuards(JwtAuthGuard)
    async reactToPost(
        @Param('id') postId: number,
        @Req() req,
        @Body() dto: PostReactionDto,
    ) {
        const userId = req.user.userId;

        return this.postReactionService.addReaction(postId, userId, dto);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async listReactions(@Param('id') postId: number) {
        return this.postReactionService.listReactions(postId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteReaction(
        @Param('id') reactionId: number,
        @Req() req,
    ) {
        const userId = req.user.userId;

        return this.postReactionService.deleteReaction(reactionId, userId);
    }
}
