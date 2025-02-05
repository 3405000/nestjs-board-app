import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Board } from './boards.entity';
import { BoardsStatus } from './boards-status.enum';
import { CreateBoardDTO } from './DTO/create-board.dto';
import { UpdateBoardDTO } from './DTO/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/users.entity';
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

    // 나의 게시글 조회 기능
    async getMyAllBoards(logginedUser: User): Promise<Board[]> {
        // 기본 조회에서는 엔터티를 즉시 로딩으로 변경해야 user에 접근할 수 있다.
        // const boards = await this.boardsRepository.findBy({ user : logginedUser })

        // 쿼리 빌더를 통해 lazy loading 설정된 엔터티와 관계를 가진 엔터티(user) 명시적 접근이 가능하다.
        const boards = await this.boardsRepository.createQueryBuilder('board')
            .leftJoinAndSelect('board.user', 'user') // 사용자 정보를 조인 (레이지 로딩 상태에서 user 추가 관리)
            .where('board.userId = :userId', { userId : logginedUser.id })
            .getMany()
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
    async createBoard(createBoardDTO: CreateBoardDTO, logginedUser: User): Promise<Board> {
        const { title, contents} = createBoardDTO;
        
        if (!title || !contents) {
            throw new BadRequestException('Title and contents must be provided')
        }
        const board: Board = this.boardsRepository.create({
            author: logginedUser.username,
            title, // title: createBoardDTO.title
            contents, // contents: createBoardDTO.contents
            status: BoardsStatus.PUBLIC,
            user: logginedUser
        })
        
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
