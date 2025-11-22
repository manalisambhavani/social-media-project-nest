import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

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
