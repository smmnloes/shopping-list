import { describe, test } from 'node:test'
import { extractTitleFromContent } from './note-transformers'
import assert from 'node:assert'

describe('Test the title extraction from content', () => {
  test('Should extract with only p-tags present', () => {
    assert.equal(extractTitleFromContent('<p>only p tags here</p>'), 'only p tags here')
  })

  test('Should extract with more p-tags present', () => {
    assert.equal(extractTitleFromContent('<p>Hallo</p><p>Dies ist ein test</p><p>um zu sehen</p><p>ob die titelextraktion</p><p>funktioniert</p>'), 'Hallo')
  })

  test('Should extract with first tag being an h-tag', () => {
    assert.equal(extractTitleFromContent('<h1>Title</h1><p>everything else</p>'), 'Title')
  })
})