import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';

@Entity('post-reactions')
export class PostReaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    reactionName: string;

    @Column()
    postId: number;

    @Column()
    userId: number;

    @ManyToOne(() => User, user => user.postReactions, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Post, post => post.postReactions, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'postId' })
    post: Post;

    @DeleteDateColumn()
    deletedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
