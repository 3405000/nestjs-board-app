import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Board } from './boards.entity';
import { BoardsStatus } from './boards-status.enum';
import { CreateBoardDTO } from './DTO/create-board.dto';
import { UpdateBoardDTO } from './DTO/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/users.entity';
@Injectable()
export class BoardsService {
    private readonly logger = new Logger(BoardsService.name)

    // 데이터베이스
    // private boards: Board[] = [];
    constructor(
        @InjectRepository(Board) 
        private boardsRepository: Repository<Board>
    ) { }

    // CREATE
    // 게시글 작성 기능
    async createBoard(createBoardDTO: CreateBoardDTO, logginedUser: User): Promise<Board> {
        this.logger.verbose(`User: ${logginedUser.username} is creating a new board with title : %${createBoardDTO.title}`)
        
        const { title, contents } = createBoardDTO;
        
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
        const createdBoard = await this.boardsRepository.save(board)

        this.logger.verbose(`Board titie with ${createdBoard.title} created successfully`)
        return createdBoard
    }

    // READ
    // 게시글 조회 기능
    async getAllBoards(): Promise<Board[]> {
        this.logger.verbose(`Retrieving all boards`)

        const boards = await this.boardsRepository.find()

        this.logger.verbose(`Retrieving all boards successfully`)
        return boards
    }

    // 나의 게시글 조회 기능
    async getMyAllBoards(logginedUser: User): Promise<Board[]> {
        this.logger.verbose(`Retrieving ${logginedUser.username}'s all boards`)

        // 기본 조회에서는 엔터티를 즉시 로딩으로 변경해야 user에 접근할 수 있다.
        // const boards = await this.boardsRepository.findBy({ user : logginedUser })

        // 쿼리 빌더를 통해 lazy loading 설정된 엔터티와 관계를 가진 엔터티(user) 명시적 접근이 가능하다.
        const boards = await this.boardsRepository.createQueryBuilder('board')
            .leftJoinAndSelect('board.user', 'user') // 사용자 정보를 조인 (레이지 로딩 상태에서 user 추가 관리)
            .where('board.userId = :userId', { userId : logginedUser.id })
            .getMany()
        
        this.logger.verbose(`Retrieving ${logginedUser.username}'s all boards Successfylly`)
        return boards
    }

    
    // 특정 게시물 조회 기능
    async getBoardById(id: number): Promise<Board> {
        this.logger.verbose(`Retrieving a board by id ${id}`)

        // const board = await this.boardsRepository.findOneBy({ id: id })
        
        const board = await this.boardsRepository.createQueryBuilder('board')
            .leftJoinAndSelect('board.user', 'user')
            .where('board.id = :id', { id })
            .getOne()

        if (!board) {
            throw new NotFoundException(`Board with ID ${id} not found`)
        }

        this.logger.verbose(`Retrieving a board by id ${id} successfully`)
        return board
    }

    // 작성자(keyword)로 검색해 게시글 조회
    async getBoardsByKeword(author: string): Promise<Board[]> {
        this.logger.verbose(`Retrieving boards by author ${author}`)
        
        if (!author) {
            throw new BadRequestException('Author keyword must be provided')
        }

        const boards = await this.boardsRepository.findBy({ author: author })

        if (boards.length == 0) {
            throw new NotFoundException(`No boards found for author: ${author}`)
        }

        this.logger.verbose(`Retrieving boards by author ${author} successfully`)
        return boards
    }
    

    // UPDATE
    // 게시글 수정 기능
    async updateBoardById(id: number, updateBoardDTO: UpdateBoardDTO): Promise<Board> {
        this.logger.verbose(`Updating a board by id: ${id}`)
        
        const board = await this.getBoardById(id)
        const { title, contents } = updateBoardDTO

        if (!title || !contents) {
            throw new BadRequestException('Title and contents must be provided')
        }

        board.title = title
        board.contents = contents

        const updatedBoard = await this.boardsRepository.save(board)

        this.logger.verbose(`Updating a board by id: ${id} successfully`)
        return updatedBoard
    }

    async updateBoardStatusById(id: number, status: BoardsStatus): Promise<void> {
        this.logger.verbose(`Updating a board by id: ${id} with status ${status}`)
        
        const result = await this.boardsRepository.update(id, { status })

        if (result.affected == 0) {
            throw new NotFoundException(`Board with ID ${id} not found`)
        }

        this.logger.verbose(`Updating a board by id: ${id} with status ${status} successfully`)
    }

    // DELETE: 게시글 삭제 기능
    async deleteBoardById(id: number, logginedUser: User): Promise<void> {
        this.logger.verbose(`User ${logginedUser.username} is deleting a board by id ${id}`)

        const board = await this.getBoardById(id)
        // 작성자와 요청한 사용자가 같은지 확인
        if (board.user.id !== logginedUser.id) {
            throw new UnauthorizedException('Do not have permission to delete this board')
        }

        this.logger.verbose(`Deleting a board by id ${id} successfully`)
        await this.boardsRepository.delete(board)
    }
}
