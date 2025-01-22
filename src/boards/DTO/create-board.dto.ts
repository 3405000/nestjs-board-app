import { IsNotEmpty, IsString } from "class-validator";

export class CreateBoardDTO {
    @IsNotEmpty()
    @IsString()
    author: string;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    contents: string;
}