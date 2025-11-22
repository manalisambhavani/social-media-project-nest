export class UserEntity { }
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
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

    @Column({ default: true })
    isActive: boolean;
}
