import { Injectable } from '@nestjs/common'
import {readFile} from 'node:fs/promises'
import { resolve } from 'node:path'

@Injectable()
export class PassphraseGenerator {
  WORDS_TOTAL = 7776

  public async generate(nrOfWords = 3, separator = '-'): Promise<string> {
    const allWords = await readFile(resolve('resources', 'wordlist.txt')).then(words => words.toString().split('\n'))

    const result = []
    while(result.length < nrOfWords) {
      const randomIndex = Math.floor((Math.random() * this.WORDS_TOTAL) + 1)
      const nextWord = allWords[randomIndex].trim()
      if (!result.includes(nextWord)) {
        result.push(nextWord)
      }
    }
    return result.join(separator)
  }
}