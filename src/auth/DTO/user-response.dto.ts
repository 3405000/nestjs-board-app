import { UserRole } from "../../user/entities/user-role.enum"
import { User } from "../../user/entities/user.entity"

export class UserResponseDTO {
    id: number
    username: string
    email: string
    role: UserRole

    constructor(user: User) {
        this.id = user.id
        this.username = user.username
        this.email = user.email
        this.role = user.role
    }
}