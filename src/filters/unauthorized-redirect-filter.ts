import { ArgumentsHost, Catch, ExceptionFilter, UnauthorizedException } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(UnauthorizedException)
export class UnauthorizedRedirectFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    if (ctx.getRequest<Request>().url === '/auth/login') {
      response
        .status(401)
        .json({
          statusCode: 401,
          message: exception.message
        })
    } else {
      response.redirect('/login')
    }
  }
}