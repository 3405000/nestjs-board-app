import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './DTO/create-user.dto';
import { UserRole } from './users-role.enum';
import * as bcrypt from 'bcryptjs';
import { LoginUserDTO } from './DTO/login-user.dto';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>){}

    // 회원가입 기능
    async createUser(createUserDTO: CreateUserDTO): Promise<User> {
        const { username, password, email, role } = createUserDTO
        if (!username || !password || !email || !role) {
            throw new BadRequestException('Something went wrong')
        }
        await this.checkEmailExist(email)
        const hashedPassword = await this.hashPassword(password)

        const user: User = {
            id: 0,
            username,
            password,
            email,
            role: UserRole.USER
        }
        return user
    }

    // 로그인 기능
    async signIn(loginUserDTO: LoginUserDTO): Promise<string> {
        const { email, password } = loginUserDTO
        const existingUser = await this.findUserByEmail(email);

        if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
            throw new UnauthorizedException('Invalid credentials')
        }

        return "Login success"
    }

    async findUserByEmail(email: string): Promise<User> {
        const existingUser = await this.userRepository.findOne({ where: { email } })
        if (!existingUser) {
            throw new NotFoundException('User not found')
        }

        return existingUser
    }

    async checkEmailExist(email: string): Promise<void> {
        const existingUser = await this.userRepository.findOne({ where: { email }});
        if (existingUser) {
            throw new ConflictException('Email already exists')
        }
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt() // 솔트 : 비밀번호 해싱할 때 보안성을 높이기 위해 추가되는 난수
        return await bcrypt.hash(password, salt) // 비밀번호 해싱
    }
}
