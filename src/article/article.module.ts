import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Article]) // Article 엔터티를 TypeORM 모듈에 등록
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  // exports: [ArticlesService],
})
export class ArticleModule {}
