import { BoardsStatus } from "./boards-status.enum";

export class Board {
    id: number;
    author: string;
    title: string;
    contects: string;
    status: BoardsStatus;
}