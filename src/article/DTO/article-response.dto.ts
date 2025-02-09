import { ArticleStatus } from "../article-status.enum"
import { Article } from "../article.entity"
import { UserResponseDTO } from "src/auth/DTO/user-response.dto"


export class ArticleResponseDTO {
    id: number
    author: string
    title: string
    contents: string
    status: ArticleStatus
    user: UserResponseDTO

    constructor(article: Article) {
        this.id = article.id
        this.author = article.author
        this.title = article.title
        this.contents = article.contents
        this.status = article.status
        this.user = new UserResponseDTO(article.user)
    }
}