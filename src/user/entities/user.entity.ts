import { Column, Entity, OneToMany } from "typeorm"
import { UserRole } from "./user-role.enum"
import { Article } from "src/article/entities/article.entity"
import { CommonEntity } from "src/common/entities/common.entity"

@Entity()
export class User extends CommonEntity {
    @Column()
    username: string

    @Column()
    password: string

    @Column({ unique: true }) // 이메일 중복 방지
    email: string

    @Column()
    role: UserRole

    @OneToMany(Type => Article, article => article.author, { eager: false })
    articles: Article[]
}