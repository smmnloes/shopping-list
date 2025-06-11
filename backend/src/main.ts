import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.use(cookieParser())
  app.use(bodyParser.json({ limit: '50mb' }))
  app.enableCors({
    origin: RegExp(app.get(ConfigService).get('ALLOWED_ORIGIN')),
    methods: [ 'GET', 'POST', 'DELETE', 'PUT', 'PATCH' ],
    credentials: true
  })
  await app.listen(3000, 'localhost')
}

bootstrap()
