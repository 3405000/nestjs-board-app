import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Article } from './entities/article.entity';
import { ArticleStatus } from './entities/article-status.enum';
import { CreateArticleRequestDTO } from './DTO/create-article-request.dto';
import { UpdateArticleRequestDTO } from './DTO/update-article-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { SearchArticleResponseDto } from './DTO/search-article-response.dto';
@Injectable()
export class ArticleService {
    private readonly logger = new Logger(ArticleService.name)

    // 데이터베이스
    // private articles: Article[] = [];
    constructor(
        @InjectRepository(Article) 
        private articlesRepository: Repository<Article>
    ) { }

    // CREATE
    // 게시글 작성 기능
    async createArticle(createArticleDTO: CreateArticleRequestDTO, logginedUser: User): Promise<void> {
        this.logger.verbose(`User: ${logginedUser.username} is creating a new article with title : %${createArticleDTO.title}`)
        
        const { title, contents } = createArticleDTO;
        
        if (!title || !contents) {
            throw new BadRequestException('Title and contents must be provided')
        }
        const article: Article = this.articlesRepository.create({
            author: logginedUser.username,
            title, // title: createArticleDTO.title
            contents, // contents: createArticleDTO.contents
            status: ArticleStatus.PUBLIC,
            user: logginedUser
        })
        await this.articlesRepository.save(article)

        this.logger.verbose(`Article titie with ${article.title} created successfully`)
    }

    // READ
    // 게시글 조회 기능
    async getAllArticles(): Promise<Article[]> {
        this.logger.verbose(`Retrieving all articles`)

        const articles = await this.articlesRepository.find()

        this.logger.verbose(`Retrieving all articles successfully`)
        return articles
    }

    // 나의 게시글 조회 기능
    async getMyAllArticles(logginedUser: User): Promise<Article[]> {
        this.logger.verbose(`Retrieving ${logginedUser.username}'s all articles`)

        // 기본 조회에서는 엔터티를 즉시 로딩으로 변경해야 user에 접근할 수 있다.
        // const articles = await this.articlesRepository.findBy({ user : logginedUser })

        // 쿼리 빌더를 통해 lazy loading 설정된 엔터티와 관계를 가진 엔터티(user) 명시적 접근이 가능하다.
        const articles = await this.articlesRepository.createQueryBuilder('article')
            .leftJoinAndSelect('article.user', 'user') // 사용자 정보를 조인 (레이지 로딩 상태에서 user 추가 관리)
            .where('article.userId = :userId', { userId : logginedUser.id })
            .getMany()
        
        this.logger.verbose(`Retrieving ${logginedUser.username}'s all articles Successfylly`)
        return articles
    }

    
    // 특정 게시물 조회 기능
    async getArticleById(id: number): Promise<Article> {
        this.logger.verbose(`Retrieving a article by id ${id}`)

        // const article = await this.articlesRepository.findOneBy({ id: id })
        
        const article = await this.articlesRepository.createQueryBuilder('article')
            .leftJoinAndSelect('article.user', 'user')
            .where('article.id = :id', { id })
            .getOne()

        if (!article) {
            throw new NotFoundException(`Article with ID ${id} not found`)
        }

        this.logger.verbose(`Retrieving a article by id ${id} successfully`)
        return article
    }

    // 작성자(keyword)로 검색해 게시글 조회
    async getArticlesByKeword(author: string): Promise<Article[]> {
        this.logger.verbose(`Retrieving articles by author ${author}`)
        
        if (!author) {
            throw new BadRequestException('Author keyword must be provided')
        }

        const articles = await this.articlesRepository.findBy({ author: author })

        if (articles.length == 0) {
            throw new NotFoundException(`No articles found for author: ${author}`)
        }

        this.logger.verbose(`Retrieving articles by author ${author} successfully`)
        return articles
    }
    

    // UPDATE
    // 게시글 수정 기능
    async updateArticleById(id: number, updateArticleDTO: UpdateArticleRequestDTO): Promise<void> {
        this.logger.verbose(`Updating a article by id: ${id}`)
        
        const article = await this.getArticleById(id)
        const { title, contents } = updateArticleDTO

        if (!title || !contents) {
            throw new BadRequestException('Title and contents must be provided')
        }

        article.title = title
        article.contents = contents

        await this.articlesRepository.save(article)

        this.logger.verbose(`Updating a article by id: ${id} successfully`)
    }

    async updateArticleStatusById(id: number, status: ArticleStatus): Promise<void> {
        this.logger.verbose(`Updating a article by id: ${id} with status ${status}`)
        
        const result = await this.articlesRepository.update(id, { status })

        if (result.affected == 0) {
            throw new NotFoundException(`Article with ID ${id} not found`)
        }

        this.logger.verbose(`Updating a article by id: ${id} with status ${status} successfully`)
    }

    // DELETE: 게시글 삭제 기능
    async deleteArticleById(id: number, logginedUser: User): Promise<void> {
        this.logger.verbose(`User ${logginedUser.username} is deleting a article by id ${id}`)

        const article = await this.getArticleById(id)
        // 작성자와 요청한 사용자가 같은지 확인
        if (article.user.id !== logginedUser.id) {
            throw new UnauthorizedException('Do not have permission to delete this article')
        }

        this.logger.verbose(`Deleting a article by id ${id} successfully`)
        await this.articlesRepository.delete(article)
    }
}
