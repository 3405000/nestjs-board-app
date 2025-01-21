import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './boards.entity';
import { CreateBoardDTO } from './DTO/create-board.dto';
import { BoardsStatus } from './boards-status.enum';

@Controller('api/boards')
export class BoardsController {
    // 생성자 주입
    constructor(private boardsService: BoardsService) { }
    
    // 주입된 인스턴스는 메서드 내에서 사용
    // READ: 게시글 조회 기능
    @Get('/')
    getAllBoards(): Board[] {
        return this.boardsService.getAllBoards();
    }

    // 특정 게시글 조회 기능
    @Get('/:id')
    getBoardById(@Param('id') id: number): Board {
        return this.boardsService.getBoardById(id)
    }

    @Get('/search/:keyword')
    getBoardsByKeword(@Query('author') author: string): Board[] {
        return this.boardsService.getBoardsByKeword(author)
    }
    
    // CREATE: 게시글 작성 기능
    @Post('/')
    createBoard(@Body() createBoardDTO: CreateBoardDTO) {
        return this.boardsService.createBoard(createBoardDTO)
    }

    // UPDATE: 게시글 수정 기능
    // 특정 번호의 게시글 일부 수정
    @Patch('/:id')
    updateBoardStatusById(@Param('id') id: number, @Body('status') status: BoardsStatus): Board {
        return this.boardsService.updateBoardStatusById(id, status)
    }

    // DELETE: 게시글 삭제 기능
    @Delete('/:id')
    deleteBoardById(@Param('id') id: number) {
        return this.boardsService.deleteBoardById(id);
    }
}

