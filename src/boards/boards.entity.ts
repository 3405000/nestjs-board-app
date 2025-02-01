import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BoardsStatus } from "./boards-status.enum";

@Entity()
export class Board {
    @PrimaryGeneratedColumn() // PK & auto Increment
    id: number;

    @Column() // General Column
    author: string;

    @Column()
    title: string;

    @Column()
    contents: string;

    @Column()
    status: BoardsStatus;
}