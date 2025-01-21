import { Controller, Get } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './boards.entity';

@Controller('boards')
export class BoardsController {
    // 생성자 주입
    constructor(private boardsService: BoardsService) { }
    
    // 주입된 인스턴스는 메서드 내에서 사용
    // 게시글 조회 기능
    @Get('/')
    getAllBoards(): Board[] {
        return this.boardsService.getAllBoards();
    }
}
