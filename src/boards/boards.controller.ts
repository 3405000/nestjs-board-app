import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common'
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
    // 생성자 주입
    constructor(private boardsService: BoardsService) { }
    
    // 주입된 인스턴스는 메서드 내에서 사용
    // READ: 게시글 조회 기능
    @Get('/')
    async getAllBoards(): Promise<BoardResponseDTO[]> {
        const boards: Board[] = await this.boardsService.getAllBoards();
        const boardsResponseDTO = boards.map(board => new BoardResponseDTO(board))

        return boardsResponseDTO
    }

    // 나의 게시글 조회 기능
    @Get('/myBoards')
    async getMyAllBoards(@GetUser() logginedUser: User): Promise<BoardResponseDTO[]> {
        const boards: Board[] = await this.boardsService.getMyAllBoards(logginedUser);
        const boardsResponseDTO = boards.map(board => new BoardResponseDTO(board))

        return boardsResponseDTO
    }
    
    // 특정 게시글 조회 기능
    @Get('/:id')
    @Roles(UserRole.USER) // 로그인 유저가 USER만 접근 가능
    async getBoardById(@Param('id') id: number): Promise<BoardResponseDTO> {
        return new BoardResponseDTO(await this.boardsService.getBoardById(id))
    }
    
    @Get('/search/:keyword')
    async getBoardsByKeword(@Query('author') author: string): Promise<BoardResponseDTO[]> {
        const boards: Board[] = await this.boardsService.getBoardsByKeword(author)
        return boards.map(board => new BoardResponseDTO(board))
    }
    
    // CREATE: 게시글 작성 기능
    @Post('/')
    // @UsePipes(ValidationPipe)
    async createBoard(@Body() createBoardDTO: CreateBoardDTO, @GetUser() logginedUser: User): Promise<BoardResponseDTO> {
        return new BoardResponseDTO(await this.boardsService.createBoard(createBoardDTO, logginedUser))
    }

    // UPDATE: 게시글 수정 기능
    // 특정 번호의 게시글 수정
    @Put('/:id')
    async updateBoardById(@Param('id') id: number, @Body() updateBoardDTO: UpdateBoardDTO): Promise<BoardResponseDTO> {
        return new BoardResponseDTO(await this.boardsService.updateBoardById(id, updateBoardDTO))
    }

    // 특정 번호의 게시글 status 수정
    @Patch('/:id')
    async updateBoardStatusById(@Param('id') id: number, @Body('status', BoardStatusValidationPipe) status:  BoardsStatus): Promise<void> {
        await this.boardsService.updateBoardStatusById(id, status)
    }

    // DELETE: 게시글 삭제 기능
    @Delete('/:id')
    async deleteBoardById(@Param('id') id: number): Promise<void> {
        await this.boardsService.deleteBoardById(id);
    }
}
    
