export class UserEntity { }
import { PostReaction } from '../post-reaction/post-reaction.entity';
import { Comment } from '../comment/comment.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CommentReaction } from '../comment-reaction/comment-reaction.entity';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({
        type: 'varchar',
        nullable: false,
        default: "",
    })
    firstName: string;

    @Column({
        type: 'varchar',
        nullable: false,
        default: "****",
    })
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({
        nullable: true,
    })
    contactNo: string;

    @Column({
        type: 'varchar',
        nullable: false,
        default: "****",
    })
    password: string;

    @OneToMany(() => Comment, comment => comment.user)
    comment: Comment[];

    @OneToMany(() => PostReaction, (reaction) => reaction.user)
    postReactions: PostReaction[];

    @OneToMany(() => CommentReaction, (reaction) => reaction.user)
    commentReactions: CommentReaction[];

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
