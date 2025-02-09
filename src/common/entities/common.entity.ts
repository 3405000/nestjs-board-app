import { CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export abstract class CommonEntity {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn({ type: 'timestamp' })
    createAt: Date

    @CreateDateColumn({ type: 'timestamp' })
    updateAt: Date
}