import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import cookieParser from 'cookie-parser'
import { UnauthorizedRedirectFilter } from './filters/unauthorized-redirect-filter'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useStaticAssets(join(__dirname, '..', 'public'))
  app.setBaseViewsDir(join(__dirname, '..', 'views'))
  app.setViewEngine('hbs')
  app.use(cookieParser())
  app.useGlobalFilters(new UnauthorizedRedirectFilter())
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: [ 'GET', 'POST', 'DELETE' ],
    credentials: true
  })
  await app.listen(3000, 'localhost')
}

bootstrap()
