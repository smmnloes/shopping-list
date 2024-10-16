import { ValueTransformer } from 'typeorm';

export class BooleanArrayTransformer implements ValueTransformer {
  to(value: boolean[]): string {
    return JSON.stringify(value);
  }

  from(value: string): boolean[] {
    return JSON.parse(value);
  }
}