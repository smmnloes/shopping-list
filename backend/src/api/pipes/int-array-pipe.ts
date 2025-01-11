import { Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class IntArrayPipe implements PipeTransform<string[], number[]> {
    transform(value: string[]): number[] {
      return value.map(stringValue => Number.parseInt(stringValue)).filter(v => !isNaN(v))
    }
}