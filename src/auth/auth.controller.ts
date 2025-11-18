import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsEmail, IsNotEmpty, MinLength, IsString, Length, IsOptional, IsPhoneNumber, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { UseGuards, Get, Request } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from 'src/posts/post.entity';


class SignupDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @Transform(({ value }) => value?.trim())
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @Length(10, 15)
    @IsPhoneNumber()
    @Matches(/^\+[1-9]\d{1,14}$/, {
        message: 'Contact number must be in E.164 format',
    })
    contactNo: string;

    @IsNotEmpty()
    @IsString()
    @Length(6, 50)
    password: string;
}

class LoginDto {
    @Transform(({ value }) => value?.trim())
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(6, 50)
    password: string;
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async signup(@Body() dto: SignupDto) {
        const { token } = await this.authService.signup(
            dto.username,
            dto.firstName,
            dto.lastName,
            dto.email,
            dto.contactNo,
            dto.password,);

        return {
            message: 'Signed up successfully',
            data: {
                token,
            },
        };
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        const { token, user } = await this.authService.login(dto.email, dto.password);

        return {
            message: `Welcome back, ${user.username}`,
            data: { token },
        };
    }
}
