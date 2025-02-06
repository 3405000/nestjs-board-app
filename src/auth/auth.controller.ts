import { Body, Controller, Logger, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './DTO/create-user.dto';
import { UserResponseDTO } from './DTO/user-response.dto';
import { LoginUserDTO } from './DTO/login-user.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from './users.entity';
import { GetUser } from './get-user.decorator';

@Controller('api/auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name)

    constructor(private authService: AuthService){}

    // 회원 가입 기능
    @Post('/signup')
    async createUser(@Body() createUserDTO: CreateUserDTO): Promise<UserResponseDTO> {
        this.logger.verbose(`Visitor is try to creating a new account with title: ${createUserDTO.email}`)

        const userResponseDTO = new UserResponseDTO(await this.authService.createUser(createUserDTO))

        this.logger.verbose(`New account email with ${userResponseDTO.email} created Successfully`)
        return userResponseDTO
    }

    // 로그인 기능
    @Post('/signin')
    async signIn(@Body() loginUserDTO: LoginUserDTO, @Res() res: Response): Promise<void> {
        this.logger.verbose(`User with email: ${loginUserDTO.email} is try to signing in`)

        const accessToken = await this.authService.signIn(loginUserDTO)

        // 2. JWT를 쿠키에 저장
        // res.cookie('Authorization', accessToken, {
        //     httpOnly: true,
        //     secure: false,
        //     maxAge: 360000,
        //     sameSite: 'none'
        // })
        // res.send({message: "Login Success"})

        // 2. JWT를 헤더에 저장
        res.setHeader('Authorization', accessToken)
        res.send({ message: "Login Success", accessToken})

        this.logger.verbose(`User with email: ${loginUserDTO.email} issued JWT ${accessToken}`)
    }
}
