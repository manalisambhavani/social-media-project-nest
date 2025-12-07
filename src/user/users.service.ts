import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async create(
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        contactNo: string,
        password: string
    ) {
        const hash = await bcrypt.hash(password, 10);
        const user = await this.userRepo.create({
            username: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            contactNo: contactNo,
            password: password = hash,
        });
        return this.userRepo.save(user);
    }

    async findByEmail(email: string) {
        return this.userRepo.findOne({ where: { email } });
    }

    async findById(id: number) {
        return this.userRepo.findOne({
            where: { id },
            select: ['username', 'firstName', 'lastName', 'email'],
        });
    }

}

