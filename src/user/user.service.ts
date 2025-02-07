import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { User } from './user.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateUserRequestDTO } from 'src/user/DTO/create-user-request.dto'
import { UserRole } from './user-role.enum'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name)

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    // 회원가입 기능
    async createUser(createUserRequestDTO: CreateUserRequestDTO): Promise<User> {
        this.logger.verbose(`Visitor is creating a new account with title: ${createUserRequestDTO.email}`)

        const { username, password, email, role } = createUserRequestDTO
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

    async checkEmailExist(email: string): Promise<void> {
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('Email already exists')
        }
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt() // 솔트 : 비밀번호 해싱할 때 보안성을 높이기 위해 추가되는 난수
        return await bcrypt.hash(password, salt) // 비밀번호 해싱
    }

    // email로 회원 조회 가능
    async findUserByEmail(email: string): Promise<User> {
        const existingUser = await this.userRepository.findOne({ where: { email } })
        if (!existingUser) {
            throw new NotFoundException('User not found')
        }

        return existingUser
    }
}
