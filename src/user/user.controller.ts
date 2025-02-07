import { Body, Controller, Logger, Post } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserRequestDTO } from 'src/user/DTO/create-user-request.dto'
import { UserResponseDTO } from 'src/auth/DTO/user-response.dto'

@Controller('api/user')
export class UserController {
  private readonly logger = new Logger(UserController.name)
  constructor(private readonly userService: UserService) { }

  // 회원 가입 기능
  @Post('/')
  async createUser(@Body() createUserRequestDTO: CreateUserRequestDTO): Promise<UserResponseDTO> {
    this.logger.verbose(`Visitor is try to creating a new account with title: ${createUserRequestDTO.email}`)

    const userResponseDTO = new UserResponseDTO(await this.userService.createUser(createUserRequestDTO))

    this.logger.verbose(`New account email with ${userResponseDTO.email} created Successfully`)
    return userResponseDTO
  }
}
