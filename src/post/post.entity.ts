export class PostEntity { }
import { PostReaction } from '../post-reaction/post-reaction.entity';
import { Comment } from '../comment/comment.entity';
import { User } from '../user/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, DeleteDateColumn } from 'typeorm';

@Entity('post')
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        default: "",
    })
    title: string;

    @Column({
        type: 'varchar',
        default: "****",
    })
    description: string;

    @Column()
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @OneToMany(() => Comment, comment => comment.post)
    comment: Comment[];

    @OneToMany(() => PostReaction, reaction => reaction.post)
    postReactions: PostReaction[];

    @DeleteDateColumn()
    deletedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
