import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateCommentDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(100)
    message: string;

}