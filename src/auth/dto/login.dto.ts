import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class LoginDto {
    @Transform(({ value }) => value?.trim())
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(6, 50)
    password: string;
}