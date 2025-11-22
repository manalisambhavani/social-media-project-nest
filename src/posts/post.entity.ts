export class PostEntity { }
import { User } from '../users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
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

    // This is the actual foreign key column
    @Column()
    userId: number;

    // Relation with User entity
    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })  // maps FK column to the relation
    user: User;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
