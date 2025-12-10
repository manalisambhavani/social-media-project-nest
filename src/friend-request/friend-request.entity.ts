import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('friend-requests')
export class FriendRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.sentRequests)
    @JoinColumn({ name: 'senderId' })
    sender: User;

    @Column()
    senderId: number;

    @ManyToOne(() => User, (user) => user.receivedRequests)
    @JoinColumn({ name: 'receiverId' })
    receiver: User;

    @Column()
    receiverId: number;

    @Column({
        type: 'enum',
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending',
    })
    status: string;

    @DeleteDateColumn()
    deletedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
