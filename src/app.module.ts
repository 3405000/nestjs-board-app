import { Module } from '@nestjs/common'
import { ArticleModule } from './article/article.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeORMConfig } from './config/typeorm.config'
import { AuthModule } from './auth/auth.module'
import { GlobalModule } from 'global.module'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { UnauthorizedExceptionFilter } from './common/filters/unauthorization.filter'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'

@Module({
  imports: [
    GlobalModule,
    TypeOrmModule.forRoot(typeORMConfig),
    ArticleModule,
    AuthModule,
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
  ]
})
export class AppModule {}

// @Module({
//   imports: [],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
