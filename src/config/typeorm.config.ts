import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const typeORMConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    port: +process.env.DB_PORT, //+는 문자->숫자로 바꿔줌
    database: process.env.DB_NAME,
    entities: [__dirname + '/../**/*.entity.{js,ts}'], // 엔티티 파일의 위치
    synchronize: true, // 개발중에만 true로 설정
    logging: true, // SQL로그가 출력되도록
};