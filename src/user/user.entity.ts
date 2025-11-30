export class UserEntity { }
import { Comment } from '../comment/comment.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

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

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
