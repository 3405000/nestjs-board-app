import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, Res, UnauthorizedException } from '@nestjs/common';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './DTO/create-user.dto';
import { UserRole } from './users-role.enum';
import * as bcrypt from 'bcryptjs';
import { LoginUserDTO } from './DTO/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name)

    constructor(
        @InjectRepository(User) 
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ){}

    // 회원가입 기능
    async createUser(createUserDTO: CreateUserDTO): Promise<User> {
        this.logger.verbose(`Visitor is creating a new account with title: ${createUserDTO.email}`)

        const { username, password, email, role } = createUserDTO
        if (!username || !password || !email || !role) {
            throw new BadRequestException('Something went wrong')
        }
        await this.checkEmailExist(email)
        const hashedPassword = await this.hashPassword(password)

        const user = this.userRepository.create({
            username,
            password: hashedPassword,
            email,
            role: UserRole.USER,
        })
        
        const createdUser = await this.userRepository.save(user)

        this.logger.verbose(`New account email with ${createdUser.email} created Successfully`);
        return createdUser
    }

    // 로그인 기능
    async signIn(loginUserDTO: LoginUserDTO): Promise<string> {
        this.logger.verbose(`User with email: ${loginUserDTO.email} is signing in`)

        const { email, password } = loginUserDTO

        try {
            const existingUser = await this.findUserByEmail(email);
    
            if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
                throw new UnauthorizedException('Invalid credentials')
            }
    
            // 1. JWT 토큰 생성
            const payload = {
                email: existingUser.email,
                username: existingUser.username,
                role: existingUser.role
            }

            // accessToken
            const accessToken = this.jwtService.sign(payload) 
            this.logger.verbose(`User with email: ${loginUserDTO.email} issued JWT ${accessToken}`)
            return accessToken

        } catch (error) {
            this.logger.error(`Invalid credentials or Internal Server error`)
            throw error;
        }
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
