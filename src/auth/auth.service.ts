import { Injectable, Logger, NotFoundException, Res, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { SignInUserDTO } from './DTO/sign-in-request.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name)

    constructor(
        @InjectRepository(User)
        private jwtService: JwtService,
        private userService: UserService
    ) { }

    // 로그인 기능
    async signIn(signInUserDTO: SignInUserDTO): Promise<string> {
        this.logger.verbose(`User with email: ${signInUserDTO.email} is signing in`)

        const { email, password } = signInUserDTO

        try {
            const existingUser = await this.userService.findUserByEmail(email);

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
            this.logger.verbose(`User with email: ${signInUserDTO.email} issued JWT ${accessToken}`)
            return accessToken

        } catch (error) {
            this.logger.error(`Invalid credentials or Internal Server error`)
            throw error;
        }
    }
}
