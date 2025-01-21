import { Body, Controller, Get, Post } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './boards.entity';

@Controller('api/boards')
export class BoardsController {
    // 생성자 주입
    constructor(private boardsService: BoardsService) { }
    
    // 주입된 인스턴스는 메서드 내에서 사용
    // 게시글 조회 기능
    @Get('/')
    getAllBoards(): Board[] {
        return this.boardsService.getAllBoards();
    }

    @Post('/')
    createBoard (
        @Body('author') author: string,
        @Body('title') title: string,
        @Body('contents') contents: string,
    ) {
        return this.boardsService.createBoard(author, title, contents)
    }
}
