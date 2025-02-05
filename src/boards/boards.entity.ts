import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BoardsStatus } from "./boards-status.enum";
import { User } from "src/auth/users.entity";

@Entity()
export class Board {
    @PrimaryGeneratedColumn() // PK & auto Increment
    id: number

    @Column() // General Column
    author: string

    @Column()
    title: string

    @Column()
    contents: string

    @Column()
    status: BoardsStatus

    @ManyToOne(Type => User, user => user.boards, { eager: false }) // eager false = lazy loading 상태
    user: User
}