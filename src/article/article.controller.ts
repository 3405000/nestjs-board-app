import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ArticleService } from './article.service'
import { Article } from './entities/article.entity'
import { CreateArticleRequestDTO } from './DTO/create-article-request.dto'
import { ArticleStatus } from './entities/article-status.enum'
import { UpdateArticleRequestDTO } from './DTO/update-article-request.dto'
import { ArticlesStatusValidationPipe } from './pipes/article-status-validation.pipe'
import { ArticleResponseDTO } from './DTO/article-response.dto'
import { Roles } from 'src/auth/custom-guards-decorators/roles.decorator'
import { UserRole } from 'src/user/entities/user-role.enum'
import { GetUser } from 'src/auth/custom-guards-decorators/get-user.decorator'
import { User } from 'src/user/entities/user.entity'
import { SearchArticleResponseDto } from './DTO/search-article-response.dto'
import { ApiResponseDTO } from 'src/common/api-response.dto'


@Controller('api/articles')
// @UseGuards(AuthGuard(), RolesGuard)
export class ArticleController {
    private readonly logger = new Logger(ArticleController.name)

    constructor(private articleService: ArticleService) { }

    // CREATE
    @Post('/')
    async createArticle(
        @Body() createArticleRequestDto: CreateArticleRequestDTO, @GetUser() logginedUser: User): Promise<ApiResponseDTO<void>> {
        this.logger.verbose(`User: ${logginedUser.username} is try to creating a new article with title: ${createArticleRequestDto.title}`);

        await this.articleService.createArticle(createArticleRequestDto, logginedUser)

        this.logger.verbose(`Article created Successfully`);
        return new ApiResponseDTO(true, HttpStatus.CREATED, 'Article created Successfully');
    }

    // READ - all
    @Get('/')
    // @Roles(UserRole.USER)
    async getAllArticles(): Promise<ApiResponseDTO<ArticleResponseDTO[]>> {
        this.logger.verbose(`Try to Retrieving all Articles`)

        const articles: Article[] = await this.articleService.getAllArticles()
        const articlesResponseDto = articles.map(Article => new ArticleResponseDTO(Article))

        this.logger.verbose(`Retrieved all Articles list Successfully`)
        return new ApiResponseDTO(true, HttpStatus.OK, 'Retrieving success', articlesResponseDto)
    }

    // READ - by Loggined User
    @Get('/myarticles')
    async getMyAllArticles(@GetUser() logginedUser: User): Promise<ApiResponseDTO<ArticleResponseDTO[]>> {
        this.logger.verbose(`Try to Retrieving ${logginedUser.username}'s all Articles`);

        const articles: Article[] = await this.articleService.getMyAllArticles(logginedUser);
        const articlesResponseDto = articles.map(article => new ArticleResponseDTO(article));

        this.logger.verbose(`Retrieved ${logginedUser.username}'s all Articles list Successfully`);
        return new ApiResponseDTO(true, HttpStatus.OK, 'Article list retrive Successfully', articlesResponseDto);
    }

    // READ - by id
    @Get('/:id')
    async getArticleDetailById(@Param('id') id: number): Promise<ApiResponseDTO<ArticleResponseDTO>> {
        this.logger.verbose(`Try to Retrieving a article by id: ${id}`);

        const articleResponseDto = new ArticleResponseDTO(await this.articleService.getArticleById(id));

        this.logger.verbose(`Retrieved a article by ${id} details Successfully`);
        return new ApiResponseDTO(true, HttpStatus.OK, 'Article retrive Successfully', articleResponseDto);
    }

    // READ - by keyword
    @Get('/search/:keyword')
    async getArticlesByKeyword(@Query('author') author: string): Promise<ApiResponseDTO<SearchArticleResponseDto[]>> {
        this.logger.verbose(`Try to Retrieving a article by author: ${author}`);

        const articles: Article[] = await this.articleService.getArticlesByKeword(author);
        const articlesResponseDto = articles.map(article => new SearchArticleResponseDto(article));

        this.logger.verbose(`Retrieved articles list by ${author} Successfully`);
        return new ApiResponseDTO(true, HttpStatus.OK, 'Article list retrive Successfully', articlesResponseDto);
    }

    // UPDATE - by id
    @Put('/:id')
    async updateArticleById(
        @Param('id') id: number,
        @Body() updateArticleRequestDto: UpdateArticleRequestDTO): Promise<ApiResponseDTO<void>> {
        this.logger.verbose(`Try to Updating a article by id: ${id} with updateArticleRequestDto`);

        await this.articleService.updateArticleById(id, updateArticleRequestDto)

        this.logger.verbose(`Updated a article by ${id} Successfully`);
        return new ApiResponseDTO(true, HttpStatus.NO_CONTENT, 'Article update Successfully');
    }

    // UPDATE - status <ADMIN>
    @Patch('/:id')
    @Roles(UserRole.ADMIN)
    async updateArticleStatusById(
        @Param('id') id: number,
        @Body('status', ArticlesStatusValidationPipe) status: ArticleStatus): Promise<ApiResponseDTO<void>> {
        this.logger.verbose(`ADMIN is trying to Updating a article by id: ${id} with status: ${status}`);

        await this.articleService.updateArticleStatusById(id, status);

        this.logger.verbose(`ADMIN Updated a article's by ${id} status to ${status} Successfully`);
        return new ApiResponseDTO(true, HttpStatus.NO_CONTENT, 'Article status changed Successfully');
    }

    // DELETE - by id
    @Delete('/:id')
    @Roles(UserRole.USER, UserRole.ADMIN)
    async deleteArticleById(@Param('id') id: number, @GetUser() logginedUser: User): Promise<ApiResponseDTO<void>> {
        this.logger.verbose(`User: ${logginedUser.username} is trying to Deleting a article by id: ${id}`);

        await this.articleService.deleteArticleById(id, logginedUser);

        this.logger.verbose(`Deleted a article by id: ${id} Successfully`);
        return new ApiResponseDTO(true, HttpStatus.NO_CONTENT, 'Article delete Successfully');
    }
}

    
