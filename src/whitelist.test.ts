import { matchPatternWithConfig, presets } from 'browser-extension-url-match'

const matchPattern = matchPatternWithConfig(presets.firefox)


function mm(pattern: string, url: string): boolean {
  return matchPattern(pattern).match(url)
}

test('matchPattern.**', () => {
  expect(mm('*://*', 'https://example.com')).toBe(false)
})

test('matchPattern.**/', () => {
  expect(mm('*://*/', 'https://example.com')).toBe(true)
  expect(mm('*://*/', 'https://example.com/foo')).toBe(false)
  expect(mm('*://*/', 'https://example.com/foo/bar.jpg')).toBe(false)
  expect(mm('*://*/', 'https://example.com/foo/bar.jpg?cat=1#123')).toBe(false)
})

test('matchPattern.**/*', () => {
  expect(mm('*://*/*', 'https://example.com/foo')).toBe(true)
  expect(mm('*://*/*', 'https://example.com/foo/bar.jpg')).toBe(true)
  expect(mm('*://*/*', 'https://example.com/foo/bar.jpg?cat=1#123')).toBe(true)
})
