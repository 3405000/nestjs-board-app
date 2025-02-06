import { IsNotEmpty, IsString } from "class-validator";

export class CreateArticleRequestDTO {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    contents: string;
}