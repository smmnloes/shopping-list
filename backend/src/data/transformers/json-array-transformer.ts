import { ValueTransformer } from 'typeorm'

export class JSONArrayTransformer implements ValueTransformer {
  to(value: any[]): string {
    return JSON.stringify(value)
  }

  from(value: string): any[] {
    return JSON.parse(value)
  }
}