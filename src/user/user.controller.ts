import { Body, Controller, HttpStatus, Logger, Post } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserRequestDTO } from 'src/user/DTO/create-user-request.dto'
import { UserResponseDTO } from 'src/auth/DTO/user-response.dto'
import { ApiResponseDTO } from 'src/common/api-response.dto'

@Controller('api/user')
export class UserController {
  private readonly logger = new Logger(UserController.name)
  constructor(private readonly userService: UserService) { }

  // 회원 가입 기능
  @Post('/')
  async createUser(@Body() createUserRequestDTO: CreateUserRequestDTO): Promise<ApiResponseDTO<void>> {
    this.logger.verbose(`Visitor is try to creating a new account with title: ${createUserRequestDTO.email}`)

    await this.userService.createUser(createUserRequestDTO)

    this.logger.verbose(`New account created Successfully`)
    return new ApiResponseDTO(true, HttpStatus.CREATED, 'User created Successfully')
  }
}
