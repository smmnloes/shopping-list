import { Controller, Get, Header } from '@nestjs/common'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const version = require('../../../package.json').version

@Controller('api')
export class ApiController {

  @Get('onlinestatus')
  async getOnlineStatus(): Promise<void> {
    return
  }

  @Get('version')
  @Header('Cache-Control', 'no-store')
  async getVersion(): Promise<string> {
    return version
  }

}


