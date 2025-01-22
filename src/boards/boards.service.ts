import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Board } from './boards.entity';
import { BoardsStatus } from './boards-status.enum';
import { CreateBoardDTO } from './DTO/create-board.dto';
import { UpdateBoardDTO } from './DTO/update-board.dto';

@Injectable()
export class BoardsService {
    // 데이터베이스
    private boards: Board[] = [];

    // READ: 게시글 조회 기능
    getAllBoards(): Board[] {
        const boards = this.boards
        if (boards.length == 0) {
            throw new NotFoundException(`Board not found`)
        }
        return boards
    }

    // 특정 게시물 조회 기능
    getBoardById(id: number): Board {
        const board = this.boards.find((board) => board.id == id)
        if (!board) {
            throw new NotFoundException(`Board with ID ${id} not found`)
        }
        return board
    }

    getBoardsByKeword(author: string): Board[] {
        const boards = this.boards.filter((board) => board.author == author)
        if (boards.length == 0) {
            throw new NotFoundException(`Board with author ${author} not found`)
        }
        return this.boards.filter((board) => board.author == author)
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

    // UPDATE: 게시글 수정 기능
    updateBoardById(id: number, updateBoardDTO: UpdateBoardDTO): Board {
        const board = this.getBoardById(id)
        const { title, contents } = updateBoardDTO

        const errors = [];
        if (!title) {
            errors.push('Title is required');
        }
        if (!contents) {
            errors.push('Contents are required');
        }

        if (errors.length > 0) {
            throw new BadRequestException(errors.join(', ')); // 모든 에러를 한 번에 반환
        }

        board.title = title
        board.contents = contents

        return board
    }

    updateBoardStatusById(id: number, status: BoardsStatus): Board {
        const board = this.getBoardById(id)

        if (!status) {
            throw new BadRequestException('Status is required')
        }

        board.status = status
        return board
    }

    // DELETE: 게시글 삭제 기능
    deleteBoardById(id: number) {
        this.getBoardById(id)
        this.boards = this.boards.filter((board) => board.id != id)
    }
}
