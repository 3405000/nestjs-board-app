import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common'
import { BoardsService } from './boards.service'
import { Board } from './boards.entity'
import { CreateBoardDTO } from './DTO/create-board.dto'
import { BoardsStatus } from './boards-status.enum'
import { UpdateBoardDTO } from './DTO/update-board.dto'
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe'
import { BoardResponseDTO } from './DTO/board-response.dto'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/auth/custom-role.guard'
import { Roles } from 'src/auth/roles.decorator'
import { UserRole } from 'src/auth/users-role.enum'
import { GetUser } from 'src/auth/get-user.decorator'
import { User } from 'src/auth/users.entity'


@Controller('api/boards')
@UseGuards(AuthGuard(), RolesGuard)
export class BoardsController {
    private readonly logger = new Logger(BoardsController.name)
    // 생성자 주입
    constructor(private boardsService: BoardsService) { }
    // 주입된 인스턴스는 메서드 내에서 사용

    // CREATE
    // 게시글 작성 기능
    @Post('/')
    async createBoard(@Body() createBoardDTO: CreateBoardDTO, @GetUser() logginedUser: User): Promise<BoardResponseDTO> {
        this.logger.verbose(`User: ${logginedUser.username} is try to creating a new board with title: ${createBoardDTO.title}`)
        
        const boardResponseDTO = new BoardResponseDTO(await this.boardsService.createBoard(createBoardDTO, logginedUser))
        
        this.logger.verbose(`Board title with ${boardResponseDTO.title} created Successfully`)
        return boardResponseDTO
    }

    // READ: 게시글 조회 기능
    @Get('/')
    async getAllBoards(): Promise<BoardResponseDTO[]> {
        this.logger.verbose(`Try to Retrieving all Boards`)

        const boards: Board[] = await this.boardsService.getAllBoards()
        const boardsResponseDTO = boards.map(board => new BoardResponseDTO(board))

        this.logger.verbose(`Retrieved all boards list Successfully`)
        return boardsResponseDTO
    }

    // 나의 게시글 조회 기능
    @Get('/myBoards')
    async getMyAllBoards(@GetUser() logginedUser: User): Promise<BoardResponseDTO[]> {
        this.logger.verbose(`Try to Retrieving ${logginedUser.username}'s all Boards`)

        const boards: Board[] = await this.boardsService.getMyAllBoards(logginedUser)
        const boardsResponseDTO = boards.map(board => new BoardResponseDTO(board))

        this.logger.verbose(`Retrieved ${logginedUser.username}'s all Boards list Successfully`)
        return boardsResponseDTO
    }
    
    // 특정 게시글 조회 기능
    @Get('/:id')
    @Roles(UserRole.USER) // 로그인 유저가 USER만 접근 가능
    async getBoardById(@Param('id') id: number): Promise<BoardResponseDTO> {
        this.logger.verbose(`Try to Retrieving a board by id: ${id}`)

        const boardResponseDTO = new BoardResponseDTO(await this.boardsService.getBoardById(id))
        
        this.logger.verbose(`Retrieved a board by ${id} details Successfully`)
        return boardResponseDTO
    }
    
    @Get('/search/:keyword')
    async getBoardsByKeword(@Query('author') author: string): Promise<BoardResponseDTO[]> {
        this.logger.verbose(`Try to Retrieving a board by author: ${author}`)

        const boards: Board[] = await this.boardsService.getBoardsByKeword(author)
        const boardsResponseDTO = boards.map(board => new BoardResponseDTO(board))

        this.logger.verbose(`Retrieved boards list by ${author} Successfully`)
        return boardsResponseDTO
    }

    // UPDATE: 게시글 수정 기능
    // 특정 번호의 게시글 수정
    @Put('/:id')
    async updateBoardById(@Param('id') id: number, @Body() updateBoardDTO: UpdateBoardDTO): Promise<BoardResponseDTO> {
        this.logger.verbose(`Try to Updating a board by id: ${id} with updateBoardDto`)
        
        const boardResponseDTO = new BoardResponseDTO(await this.boardsService.updateBoardById(id, updateBoardDTO))
        
        this.logger.verbose(`Updated a board by ${id} Successfully`)
        return boardResponseDTO
    }

    // 특정 번호의 게시글 status 수정 (관리자만 가능)
    @Patch('/:id')
    @Roles(UserRole.ADMIN)
    async updateBoardStatusById(@Param('id') id: number, @Body('status', BoardStatusValidationPipe) status:  BoardsStatus): Promise<void> {
        this.logger.verbose(`ADMIN is trying to Updating a board by id: ${id} with status: ${status}`)
        
        await this.boardsService.updateBoardStatusById(id, status)

        this.logger.verbose(`ADMIN Updated a board's by ${id} status to ${status} Successfully`)
    }

    // DELETE: 게시글 삭제 기능
    @Delete('/:id')
    @Roles(UserRole.ADMIN, UserRole.USER)
    async deleteBoardById(@Param('id') id: number, @GetUser() logginedUser: User): Promise<void> {
        this.logger.verbose(`User: ${logginedUser.username} is trying to Deleting a board by id: ${id}`)
        
        await this.boardsService.deleteBoardById(id, logginedUser)

        this.logger.verbose(`Deleted a board by id: ${id} Successfully`)
    }
}
    
