import { IsNotEmpty, IsString } from "class-validator";

export class CreateBoardDTO {
    @IsNotEmpty()
    @IsString()
    author: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    contents: string;
}