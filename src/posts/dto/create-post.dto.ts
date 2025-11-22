import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    @Length(5, 50)
    title: string;

    @IsString()
    @Length(5, 300)
    description: string;

}