import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { UserRole } from "./user-role.enum"
import { Article } from "src/article/article.entity"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

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