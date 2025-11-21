export class PostEntity { }
import { User } from 'src/users/entities/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

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
}
