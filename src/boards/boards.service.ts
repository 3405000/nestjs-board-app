import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Board } from './boards.entity';
import { BoardsStatus } from './boards-status.enum';
import { CreateBoardDTO } from './DTO/create-board.dto';
import { UpdateBoardDTO } from './DTO/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class BoardsService {
    // 데이터베이스
    // private boards: Board[] = [];
    constructor(
        @InjectRepository(Board) 
        private boardsRepository: Repository<Board>
    ) { }

    // READ: 게시글 조회 기능
    async getAllBoards(): Promise<Board[]> {
        const boards = await this.boardsRepository.find()
        return boards
    }

    // 특정 게시물 조회 기능
    getBoardById(id: number): Promise<Board> {
        const board = this.boardsRepository.findOneBy({ id: id })
        if (!board) {
            throw new NotFoundException(`Board with ID ${id} not found`)
        }
        return board
    }

    // 작성자(keyword)로 검색해 게시글 조회
    async getBoardsByKeword(author: string): Promise<Board[]> {
        if (!author) {
            throw new BadRequestException('Author keyword must be provided')
        }

        const boards = await this.boardsRepository.findBy({ author: author })

        if (boards.length == 0) {
            throw new NotFoundException(`No boards found for author: ${author}`)
        }

        return boards
    }

    // CREATE: 게시글 작성 기능
    async createBoard(createBoardDTO: CreateBoardDTO): Promise<Board> {
        const {author, title, contents} = createBoardDTO;
        
        const board: Board = {
            id: 0, // 임시
            author, // author: createBoardDTO.author
            title, // title: createBoardDTO.title
            contents, // contents: createBoardDTO.contents
            status: BoardsStatus.PUBLIC,
            user: null
        }
        
        return await this.boardsRepository.save(board)
    }

    // UPDATE: 게시글 수정 기능
    async updateBoardById(id: number, updateBoardDTO: UpdateBoardDTO): Promise<Board> {
        const board = await this.getBoardById(id)
        const { title, contents } = updateBoardDTO

        if (!title || !contents) {
            throw new BadRequestException('Title and contents must be provided')
        }

        board.title = title
        board.contents = contents

        return this.boardsRepository.save(board)
    }

    async updateBoardStatusById(id: number, status: BoardsStatus): Promise<void> {
        const result = await this.boardsRepository.update(id, { status })

        if (result.affected == 0) {
            throw new NotFoundException(`Board with ID ${id} not found`)
        }
    }

    // DELETE: 게시글 삭제 기능
    async deleteBoardById(id: number): Promise<void> {
        const board = await this.getBoardById(id)
        await this.boardsRepository.delete(board)
    }
}
