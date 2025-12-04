import { CommentReaction } from '../comment-reaction/comment-reaction.entity';
import { Post } from '../post/post.entity';
import { User } from '../user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';

@Entity('comment')
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', default: "" })
    message: string;

    @Column()
    userId: number;

    @ManyToOne(() => User, user => user.comment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    postId: number;

    @ManyToOne(() => Post, post => post.comment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'postId' })
    post: Post;

    @OneToMany(() => CommentReaction, (reaction) => reaction.comment)
    commentReactions: CommentReaction[];

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
