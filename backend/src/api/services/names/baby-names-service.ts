import { Injectable, OnModuleInit } from '@nestjs/common'
import names from './alphabetical-names.json'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BabyName } from '../../../data/entities/baby-name'


@Injectable()
export class BabyNamesService implements OnModuleInit {

  constructor(@InjectRepository(BabyName) readonly babyNameRepository: Repository<BabyName>) {
  }

  async onModuleInit() {
    const count = await this.babyNameRepository.count()
    if (count === 0) {
      await this.initializeNameDB()
    }
  }

  private async initializeNameDB(): Promise<void> {
    console.log('Initializing baby name DB')
    console.time('NameDBInit')
    await Promise.all([ this.babyNameRepository.save(names.boys.map(name => new BabyName(name, 'BOY'))),
      this.babyNameRepository.save(names.boys.map(name => new BabyName(name, 'BOY'))) ])
    console.timeEnd('NameDBInit')
  }

}