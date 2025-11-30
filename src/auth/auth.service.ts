import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../user/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async signup(
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        contactNo: string,
        password: string
    ) {
        const exists = await this.userRepo.findOne({
            where: [
                { username },
                { email }
            ]
        });

        if (exists) {
            throw new ConflictException("User already exists");
        }
        const user = await this.usersService.create(
            username,
            firstName,
            lastName,
            email,
            contactNo,
            password);
        const token = await this.jwtService.signAsync({ sub: user.id, email: user.email });
        return { token };
    }

    async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid credentials');

        const payload = {
            userId: user.id,
            email: user.email,
        };

        const token = await this.jwtService.signAsync(payload);
        return { user, token };
    }
}
