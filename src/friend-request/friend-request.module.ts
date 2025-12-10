import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendRequest } from "./friend-request.entity";
import { User } from "../user/user.entity";
import { FriendRequestService } from "./friend-request.service";
import { FriendRequestController } from "./friend-request.controller";

@Module({
    imports: [TypeOrmModule.forFeature([FriendRequest, User])],
    controllers: [FriendRequestController],
    providers: [FriendRequestService],
})
export class FriendRequestModule { }
