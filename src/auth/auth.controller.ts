import { Body, Controller, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './DTO/create-user.dto';
import { UserResponseDTO } from './DTO/user-response.dto';
import { LoginUserDTO } from './DTO/login-user.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from './users.entity';
import { GetUser } from './get-user.decorator';

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
    async signIn(@Body() loginUserDTO: LoginUserDTO, @Res() res: Response): Promise<void> {
        const accessToken = await this.authService.signIn(loginUserDTO)

        // 2. JWT를 쿠키에 저장
        res.cookie('Authorization', accessToken, {
            httpOnly: true,
            secure: false,
            maxAge: 360000,
            sameSite: 'none'
        })

        res.send({message: "Login Success"})
    }

    @Post('/test')
    @UseGuards(AuthGuard('jwt')) //@UseGuards는 해당 인증 가드가 적용되는 부분 표시, AuthGuard는 인증가드가 어떤 전략을 사용할지 결정
    testForAuth(@GetUser() user: User) {
        console.log(user)
        console.log(user.email)
        return { message: 'Authenticated User', user: user }
    }
}
