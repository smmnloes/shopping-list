import { extractTitleFromContent } from './note-transformers'

describe('Test the title extraction from content', () => {
  it('Should extract with only p-tags present', () => {
    expect(extractTitleFromContent('<p>only p tags here</p>')).toEqual('only p tags here')
  })

  it('Should extract with more p-tags present', () => {
    expect(extractTitleFromContent('<p>Hallo</p><p>Dies ist ein test</p><p>um zu sehen</p><p>ob die titelextraktion</p><p>funktioniert</p>')).toEqual('Hallo')
  })

  it('Should extract with first tag being an h-tag', () => {
    expect(extractTitleFromContent('<h1>Title</h1><p>everything else</p>')).toEqual('Title')
  })
})