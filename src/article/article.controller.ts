import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ArticleService } from './article.service'
import { Article } from './entities/article.entity'
import { CreateArticleRequestDTO } from './DTO/create-article-request.dto'
import { ArticleStatus } from './entities/article-status.enum'
import { UpdateArticleRequestDTO } from './DTO/update-article-request.dto'
import { ArticlesStatusValidationPipe } from './pipes/article-status-validation.pipe'
import { ArticleResponseDTO } from './DTO/article-response.dto'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/auth/custom-guards-decorators/custom-role.guard'
import { Roles } from 'src/auth/custom-guards-decorators/roles.decorator'
import { UserRole } from 'src/user/entities/user-role.enum'
import { GetUser } from 'src/auth/custom-guards-decorators/get-user.decorator'
import { User } from 'src/user/entities/user.entity'
import { SearchArticleResponseDto } from './DTO/search-article-response.dto'
import { ApiResponseDTO } from 'src/common/api-response.dto'


@Controller('api/articles')
@UseGuards(AuthGuard(), RolesGuard)
export class ArticleController {
    private readonly logger = new Logger(ArticleController.name)
    // 생성자 주입
    constructor(private articleService: ArticleService) { }
    // 주입된 인스턴스는 메서드 내에서 사용

    // CREATE
    // 게시글 작성 기능
    @Post('/')
    async createArticle(@Body() createArticleDTO: CreateArticleRequestDTO, @GetUser() logginedUser: User): Promise<ApiResponseDTO<void>> {
        this.logger.verbose(`User: ${logginedUser.username} is try to creating a new article with title: ${createArticleDTO.title}`)
        
        await this.articleService.createArticle(createArticleDTO, logginedUser)
        
        this.logger.verbose(`Article created Successfully`)
        return new ApiResponseDTO(true, HttpStatus.CREATED, 'Article created Successfully')
    }

    // READ: 게시글 조회 기능
    @Get('/')
    async getAllArticles(): Promise<ApiResponseDTO<ArticleResponseDTO[]>> {
        this.logger.verbose(`Try to Retrieving all Articles`)

        const articles: Article[] = await this.articleService.getAllArticles()
        const articlesResponseDTO = articles.map(article => new ArticleResponseDTO(article))

        this.logger.verbose(`Retrieved all articles list Successfully`)
        return new ApiResponseDTO(true, HttpStatus.OK, 'Article list retrive Successfully', articlesResponseDTO)
    }

    // 나의 게시글 조회 기능
    @Get('/myArticles')
    async getMyAllArticles(@GetUser() logginedUser: User): Promise<ApiResponseDTO<ArticleResponseDTO[]>> {
        this.logger.verbose(`Try to Retrieving ${logginedUser.username}'s all Articles`)

        const articles: Article[] = await this.articleService.getMyAllArticles(logginedUser)
        const articlesResponseDTO = articles.map(article => new ArticleResponseDTO(article))

        this.logger.verbose(`Retrieved ${logginedUser.username}'s all Articles list Successfully`)
        return new ApiResponseDTO(true, HttpStatus.OK, 'Article list retrive Successfully', articlesResponseDTO)
    }
    
    // 특정 게시글 조회 기능
    @Get('/:id')
    @Roles(UserRole.USER) // 로그인 유저가 USER만 접근 가능
    async getArticleById(@Param('id') id: number): Promise<ApiResponseDTO<ArticleResponseDTO>> {
        this.logger.verbose(`Try to Retrieving a article by id: ${id}`)

        const articleResponseDTO = new ArticleResponseDTO(await this.articleService.getArticleById(id))
        
        this.logger.verbose(`Retrieved a article by ${id} details Successfully`)
        return new ApiResponseDTO(true, HttpStatus.OK, 'Article retrive Successfully', articleResponseDTO)
    }
    
    @Get('/search/:keyword')
    async getArticlesByKeword(@Query('author') author: string): Promise<ApiResponseDTO<SearchArticleResponseDto[]>> {
        this.logger.verbose(`Try to Retrieving a article by author: ${author}`)

        const articles: Article[] = await this.articleService.getArticlesByKeword(author)
        const articlesResponseDTO = articles.map(article => new SearchArticleResponseDto(article))

        this.logger.verbose(`Retrieved articles list by ${author} Successfully`)
        return new ApiResponseDTO(true, HttpStatus.OK, 'Article list retrive Successfully', articlesResponseDTO)
    }

    // UPDATE: 게시글 수정 기능
    // 특정 번호의 게시글 수정
    @Put('/:id')
    async updateArticleById(@Param('id') id: number, @Body() updateArticleDTO: UpdateArticleRequestDTO): Promise<ApiResponseDTO<void>> {
        this.logger.verbose(`Try to Updating a article by id: ${id} with updateArticleDto`)
        
        await this.articleService.updateArticleById(id, updateArticleDTO)
        
        this.logger.verbose(`Updated a article by ${id} Successfully`)
        return new ApiResponseDTO(true, HttpStatus.NO_CONTENT, 'Article updated Successfully')
    }

    // 특정 번호의 게시글 status 수정 (관리자만 가능)
    @Patch('/:id')
    @Roles(UserRole.ADMIN)
    async updateArticleStatusById(@Param('id') id: number, @Body('status', ArticlesStatusValidationPipe) status:  ArticleStatus): Promise<ApiResponseDTO<void>> {
        this.logger.verbose(`ADMIN is trying to Updating a article by id: ${id} with status: ${status}`)
        
        await this.articleService.updateArticleStatusById(id, status)

        this.logger.verbose(`ADMIN Updated a article's by ${id} status to ${status} Successfully`)

        return new ApiResponseDTO(true, HttpStatus.NO_CONTENT, 'Article status changed Successfully')
    }

    // DELETE: 게시글 삭제 기능
    @Delete('/:id')
    @Roles(UserRole.ADMIN, UserRole.USER)
    async deleteArticleById(@Param('id') id: number, @GetUser() logginedUser: User): Promise<ApiResponseDTO<void>> {
        this.logger.verbose(`User: ${logginedUser.username} is trying to Deleting a article by id: ${id}`)
        
        await this.articleService.deleteArticleById(id, logginedUser)

        this.logger.verbose(`Deleted a article by id: ${id} Successfully`)

        return new ApiResponseDTO(true, HttpStatus.NO_CONTENT, 'Article deleted Successfully')
    }
}
    
