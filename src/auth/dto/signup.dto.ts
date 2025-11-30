import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length, Matches } from "class-validator";

export class SignupDto {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[a-z0-9]+$/, {
        message: "Username must contain only lowercase letters and numbers",
    })
    username: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^[A-Za-z\s'-]+$/, {
        message: "First name can only contain letters, spaces, apostrophes, or hyphens",
    })
    firstName: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^[A-Za-z\s'-]+$/, {
        message: "Last name can only contain letters, spaces, apostrophes, or hyphens",
    })
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
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/, {
        message:
            "Password must contain at least one uppercase, one lowercase, one number, and one special character",
    })
    password: string;
}
