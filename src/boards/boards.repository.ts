import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { createPool, Pool } from "mysql2/promise";
import { databaseConfig } from "src/config/database.config";
import { Board } from "./boards.entity";

@Injectable()
export class BoardsRepository {
    private connectionPool: Pool
    constructor() {
        this.connectionPool = createPool(databaseConfig);
        this.connectionPool.getConnection()
        .then(() => console.log('DB Connected'))
        .catch(err => console.error('DB Connection Failed', err))
    }

    // 게시글 조회 관련 데이터 엑세스
    async findAll(): Promise<Board[]> {
        const selectQuery = 'SELECT * FROM BOARD'
        try {
            const [result] = await this.connectionPool.query(selectQuery)
            return result as Board[]
        } catch(err) {
            throw new InternalServerErrorException('Database query failed', err)
        }
    }

    async saveBoard(board: Board): Promise<string> {
        const insertQuery = 'INSERT INTO BOARD(NAME, PHONE, EMAIL, MEMO, CREATE_AT, MODIFY AT) VALUES (?, ?, ?, ?)'
        try {
            const result = await this.connectionPool.query(insertQuery, [board.author, board.title, board.contents, board.status])
            const message = "Created Success!"
            return message
        } catch(err) {
            throw new InternalServerErrorException('Database query failed', err)
        }
    }
}