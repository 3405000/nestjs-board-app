import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardsController } from './boards/boards.controller';
import { BoardsModule } from './boards/boards.module';
import { GlobalModule } from 'global.module';

@Module({
  imports: [GlobalModule, BoardsModule],
  controllers: [BoardsController],
})
export class AppModule {}

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
