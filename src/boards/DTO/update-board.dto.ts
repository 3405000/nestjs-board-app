import { IsNotEmpty, IsString } from "class-validator";

export class UpdateBoardDTO {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    contents: string;
}