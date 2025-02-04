import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './DTO/create-user.dto';
import { UserResponseDTO } from './DTO/user-response.dto';
import { LoginUserDTO } from './DTO/login-user.dto';

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService){}

    // 회원 가입 기능
    @Post('/signup')
    async createUser(@Body() createUserDTO: CreateUserDTO): Promise<UserResponseDTO> {
        return new UserResponseDTO(await this.authService.createUser(createUserDTO))
    }

    // 로그인 기능
    @Post('/signin')
    async signIn(@Body() loginUserDTO: LoginUserDTO): Promise<string> {
        return this.authService.signIn(loginUserDTO)
    }
}
