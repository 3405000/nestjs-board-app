import { IsNotEmpty, IsString } from "class-validator";

export class UpdateArticleRequestDTO {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    contents: string;
}