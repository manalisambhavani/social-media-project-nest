import { IsNotEmpty, IsString, MinLength, MaxLength, IsNumber } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(100)
    message: string;

    @IsNumber()
    postId: number;
}