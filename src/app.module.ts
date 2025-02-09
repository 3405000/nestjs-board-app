import { Module, ValidationPipe } from '@nestjs/common'
import { ArticleModule } from './article/article.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeORMConfig } from './config/typeorm.config'
import { AuthModule } from './auth/auth.module'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { UnauthorizedExceptionFilter } from './common/filters/unauthorization.filter'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    ArticleModule,
    AuthModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    }
  ]
})
export class AppModule {}

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
