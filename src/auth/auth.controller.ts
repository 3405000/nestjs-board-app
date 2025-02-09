import { Body, Controller, HttpStatus, Logger, Post, Res, } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignInUserDTO } from './DTO/sign-in-request.dto'
import { Response } from 'express'
import { ApiResponseDTO } from 'src/common/api-response.dto'

@Controller('api/auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name)

    constructor(private authService: AuthService) { }

    // 로그인 기능
    @Post('/signin')
    async signIn(@Body() signInUserDTO: SignInUserDTO, @Res() res: Response): Promise<void> {
        this.logger.verbose(`User with email: ${signInUserDTO.email} is try to signing in`)

        const accessToken = await this.authService.signIn(signInUserDTO)

        this.logger.verbose(`User with email: ${signInUserDTO.email} issued JWT ${accessToken}`)
        
        // 2. JWT를 헤더에 저장 후 ApiResponse를 바디에 담아 전송
        res.setHeader('Authorization', accessToken)
        const response = new ApiResponseDTO(true, HttpStatus.OK, 'User logged in successfully', { accessToken })
        
        res.send(response)

    }
}
