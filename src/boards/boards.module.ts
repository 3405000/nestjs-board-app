import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';

@Module({
  providers: [BoardsService]
})
export class BoardsModule {}
