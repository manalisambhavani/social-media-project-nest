import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class LoginDto {
    @Transform(({ value }) => value?.trim())
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(6, 50)
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/, {
        message:
            "Password must contain at least one uppercase, one lowercase, one number, and one special character",
    })
    password: string;
}