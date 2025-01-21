import { Injectable } from '@nestjs/common';
import { Board } from './boards.entity';
import { BoardsStatus } from './boards-status.enum';
import { CreateBoardDTO } from './DTO/create-board.dto';

@Injectable()
export class BoardsService {
    // 데이터베이스
    private boards: Board[] = [];

    // READ: 게시글 조회 기능
    getAllBoards(): Board[] {
        return this.boards;
    }

    // 특정 게시물 조회 기능
    getBoardById(id: number): Board {
        return this.boards.find((board) => board.id == id)
    }

    // CREATE: 게시글 작성 기능
    createBoard(createBoardDTO: CreateBoardDTO) {
        const {author, title, contents} = createBoardDTO;
        
        const board: Board = {
            id: this.boards.length+1, // 임시
            author,
            title,
            contents,
            status: BoardsStatus.PUBLIC
        }

        const savedBoard = this.boards.push(board);
        return savedBoard;
    }
}
