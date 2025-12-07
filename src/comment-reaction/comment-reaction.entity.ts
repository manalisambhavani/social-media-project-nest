import { Comment } from '../comment/comment.entity';
import { User } from '../user/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany, DeleteDateColumn } from 'typeorm';

@Entity('comment-reactions')
export class CommentReaction {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    commentId: number;

    @ManyToOne(() => Comment, (comment) => comment.commentReactions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'commentId' })
    comment: Comment;

    @Column({ type: 'int' })
    userId: number;

    @ManyToOne(() => User, user => user.commentReactions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @DeleteDateColumn()
    deletedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
