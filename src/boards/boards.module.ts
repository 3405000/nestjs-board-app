import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './boards.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board]) // Board 엔터티를 TypeORM 모듈에 등록
  ],
  controllers: [BoardsController],
  providers: [BoardsService],
  // exports: [BoardsService],
})
export class BoardsModule {}
