import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length, Matches } from "class-validator";

export class SignupDto {
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
