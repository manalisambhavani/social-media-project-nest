import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Put, Req, UseGuards } from "@nestjs/common";
import { FriendRequestService } from "./friend-request.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller('friend-request')
export class FriendRequestController {
    constructor(private friendRequestService: FriendRequestService) { }

    @Get('list-users')
    @UseGuards(JwtAuthGuard)
    async listUsers(@Req() req) {
        const userId = req.user.userId;
        const users = await this.friendRequestService.listUsers(userId);

        return {
            message: 'Users fetched successfully',
            data: { users },
        };
    }

    @Get('user/:id')
    @UseGuards(JwtAuthGuard)
    async getUserProfile(@Param('id') id: string) {
        const user = await this.friendRequestService.getUserProfile(id);

        return {
            message: 'User fetched successfully',
            data: user,
        };
    }

    @Post('send-friend-request/:id')
    @UseGuards(JwtAuthGuard)
    async sendFriendRequest(
        @Param('id') receiverId: string,
        @Req() req: any,
    ) {
        const senderId = req.user.userId;

        await this.friendRequestService.sendFriendRequest(senderId, +receiverId);

        return {
            message: 'Friend request sent.',
        };
    }

    @Get('')
    @UseGuards(JwtAuthGuard)
    async getFriendRequests(@Req() req: any) {
        const userId = req.user.userId;

        const result = await this.friendRequestService.getFriendRequests(userId);

        return {
            message: 'Friend request fetched successfully',
            data: result,
        };
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async respondToRequest(
        @Param('id') id: string,
        @Body('status') status: string,
        @Req() req: any
    ) {
        const userId = req.user.userId;

        if (!['accepted', 'declined'].includes(status)) {
            throw new BadRequestException(
                'Invalid status. Must be accepted or declined.',
            );
        }

        return this.friendRequestService.respondToRequest(+id, userId, status);
    }

    @Get('friends')
    @UseGuards(JwtAuthGuard)
    async getFriends(@Req() req: any) {
        const loggedInUserId = req.user.userId;

        return this.friendRequestService.getFriends(loggedInUserId);
    }

    @Put('unfriend/:id')
    @UseGuards(JwtAuthGuard)
    async unfriend(
        @Param('id') friendId: number,
        @Req() req,
    ) {
        const loggedInUserId = req.user.userId;

        return this.friendRequestService.unfriendUser(loggedInUserId, friendId);
    }


}