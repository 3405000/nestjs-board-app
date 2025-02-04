import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "./users-role.enum";

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
}