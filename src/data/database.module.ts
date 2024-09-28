import { Module } from '@nestjs/common'
import { datasourceProvider } from './datasource.providers'

@Module({
  providers: [
    datasourceProvider,
  ],
  exports: []
})
export class DatabaseModule {
}
