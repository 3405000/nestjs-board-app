import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { User } from "../../user/entities/user.entity"
import * as dotenv from 'dotenv'
import { UserService } from "src/user/user.service"

dotenv.config()

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        // 3. Cookie에 있는 JWT 토큰 추출
        super({
            secretOrKey: process.env.JWT_SECRET, // 검증하기 위한 secret key
            // jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
            //     let token = null
            //     if (req && req.cookies) {
            //         token = req.cookies['Authorization'] // 쿠키에서 JWT 추출
            //     }
            //     return token
            // }])
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Authorization 헤더에서 JWT 추출
        })
    } // 4. Secret Key로 검증 - 해당 인스턴스가 생성되는 시점 자체가 검증 과정

    // 5. JWT에서 사용자 정보 가져오기
    async validate(payload) {
        const { email } = payload

        const user: User = await this.userService.findUserByEmail(email)

        if (!user) {
            throw new UnauthorizedException()
        }
        return user
    }
}