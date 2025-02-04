import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './DTO/create-user.dto';
import { UserRole } from './users-role.enum';

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

        const user: User = {
            id: 0,
            username,
            password,
            email,
            role: UserRole.USER
        }
        return user
    }

    async checkEmailExist(email: string): Promise<void> {
        const existingUser = await this.userRepository.findOne({ where: { email }});
        if (existingUser) {
            throw new ConflictException('Email already exists')
        }
    }
}
