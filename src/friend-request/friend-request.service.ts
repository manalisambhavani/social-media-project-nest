import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { In, IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequest } from './friend-request.entity';
import { User } from '../user/user.entity';

@Injectable()
export class FriendRequestService {
    constructor(
        @InjectRepository(FriendRequest)
        private readonly friendRequestRepo: Repository<FriendRequest>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async listUsers(currentUserId: number) {
        const requests = await this.friendRequestRepo.find({
            where: [
                { senderId: currentUserId },
                { receiverId: currentUserId },
            ],
            select: ['senderId', 'receiverId'],
        });

        const excludedIds = new Set<number>();
        excludedIds.add(currentUserId);

        requests.forEach((r) => {
            excludedIds.add(r.senderId);
            excludedIds.add(r.receiverId);
        });

        const idsToExclude = Array.from(excludedIds);

        return this.userRepo.find({
            where: {
                id: Not(In(idsToExclude)),
            },
            select: ['id', 'username', 'email'],
        });
    }

    async getUserProfile(id: string) {
        const user = await this.userRepo.findOne({
            where: {
                id: +id
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };
    }

    async sendFriendRequest(senderId: number, receiverId: number) {
        if (senderId === receiverId) {
            throw new BadRequestException('You cannot send a friend request to yourself.');
        }

        const receiverExists = await this.userRepo.findOne({
            where: {
                id: receiverId,
                deletedAt: IsNull()
            }
        });

        if (!receiverExists) {
            throw new NotFoundException('User Not Found');
        }

        const existingRequest = await this.friendRequestRepo.findOne({
            where: [
                { senderId, receiverId, status: 'pending' },
                { senderId: receiverId, receiverId: senderId, status: 'pending' },
            ],
        });

        if (existingRequest) {
            throw new BadRequestException('Friend request already exists.');
        }

        const newRequest = this.friendRequestRepo.create({
            senderId,
            receiverId,
            status: 'pending',
        });

        await this.friendRequestRepo.save(newRequest);
    }

    async getFriendRequests(userId: number) {
        const request = await this.friendRequestRepo.find({
            where: {
                receiverId: userId,
                status: 'pending',
                deletedAt: IsNull(),
            },
            relations: ['sender'],
        });

        const result = request.map(req => ({
            id: req.id,
            senderId: req.senderId,
            receiverId: req.receiverId,
            status: req.status,
            sender: {
                id: req.sender.id,
                username: req.sender.username
            }
        }));

        return result;
    }

    async respondToRequest(requestId: number, loggedInUserId: number, status: string,) {
        const friendRequest = await this.friendRequestRepo.findOne({
            where: {
                id: requestId
            },
        });

        if (!friendRequest) {
            throw new NotFoundException('Friend request not found.');
        }

        if (friendRequest.receiverId !== loggedInUserId) {
            throw new ForbiddenException(
                'You are not authorized to respond to this request.',
            );
        }

        if (friendRequest.status === 'accepted' || friendRequest.status === 'declined') {
            return {
                message: `Friend request has already been ${friendRequest.status} and cannot be responded to again.`,
                data: friendRequest,
            };
        }

        if (status === 'declined') {
            friendRequest.status = 'declined';
            await this.friendRequestRepo.save(friendRequest);

            await this.friendRequestRepo.softDelete(friendRequest.id);

            return { message: 'friend request is deleted successfully' };
        }

        friendRequest.status = 'accepted';
        await this.friendRequestRepo.save(friendRequest);

        return {
            message: 'Friend request accepted.',
            data: friendRequest,
        };
    }

    async getFriends(loggedInUserId: number) {
        const friends = await this.friendRequestRepo.find({
            where: [
                { senderId: loggedInUserId, status: 'accepted', deletedAt: IsNull(), },
                { receiverId: loggedInUserId, status: 'accepted', deletedAt: IsNull(), },
            ],
            relations: ['sender', 'receiver'],
            select: {
                id: true,
                senderId: true,
                receiverId: true,
                status: true,
                sender: { id: true, username: true },
                receiver: { id: true, username: true },
            },
        });

        const friendList = friends.map((req) => {
            if (req.senderId !== loggedInUserId) {
                return {
                    id: req.sender.id,
                    username: req.sender.username,
                };
            }

            if (req.receiverId !== loggedInUserId) {
                return {
                    id: req.receiver.id,
                    username: req.receiver.username,
                };
            }
        });

        return {
            message: 'Friends',
            data: friendList,
        };
    }

    async unfriendUser(loggedInUserId: number, friendId: number) {
        const friendRequest = await this.friendRequestRepo.findOne({
            where: [
                {
                    senderId: loggedInUserId,
                    receiverId: friendId,
                    status: 'accepted',
                    deletedAt: IsNull(),
                },
                {
                    senderId: friendId,
                    receiverId: loggedInUserId,
                    status: 'accepted',
                    deletedAt: IsNull(),
                }
            ],
        });

        if (!friendRequest) {
            throw new NotFoundException('Friend not found.');
        }

        friendRequest.status = 'declined';
        await this.friendRequestRepo.save(friendRequest);

        await this.friendRequestRepo.softDelete(friendRequest.id);

        return {
            message: 'You are unfriend',
        };
    }

}
