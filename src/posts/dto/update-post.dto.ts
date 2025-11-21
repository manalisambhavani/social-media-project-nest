import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class UpdatePostDto {
    @IsOptional()
    @IsString()
    @Length(5, 50)
    title?: string;

    @IsOptional()
    @IsString()
    @Length(5, 300)
    description?: string;
}