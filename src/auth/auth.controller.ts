import { Body, Controller, Logger, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpRequestDTO } from './DTO/sign-up-request.dto';
import { UserResponseDTO } from './DTO/user-response.dto';
import { SignInUserDTO } from './DTO/sign-in-request.dto';
import { Response } from 'express';

@Controller('api/auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name)

    constructor(private authService: AuthService){}

    // 회원 가입 기능
    @Post('/signup')
    async createUser(@Body() signUpUserDTO: SignUpRequestDTO): Promise<UserResponseDTO> {
        this.logger.verbose(`Visitor is try to creating a new account with title: ${signUpUserDTO.email}`)

        const userResponseDTO = new UserResponseDTO(await this.authService.createUser(signUpUserDTO))

        this.logger.verbose(`New account email with ${userResponseDTO.email} created Successfully`)
        return userResponseDTO
    }

    // 로그인 기능
    @Post('/signin')
    async signIn(@Body() signInUserDTO: SignInUserDTO, @Res() res: Response): Promise<void> {
        this.logger.verbose(`User with email: ${signInUserDTO.email} is try to signing in`)

        const accessToken = await this.authService.signIn(signInUserDTO)

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

        this.logger.verbose(`User with email: ${signInUserDTO.email} issued JWT ${accessToken}`)
    }
}
