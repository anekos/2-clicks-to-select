
import { Defaults } from './config'
import { searchWord as s } from './search-word'

test('search-word', () => {
  const p = new RegExp('[-_.,\\w]+', 'i')

  //        01234567890
  expect(s('foo bar baz', 0, p)).toStrictEqual({word: 'foo', left: 0, right: 2})
  expect(s('foo bar baz', 1, p)).toStrictEqual({word: 'foo', left: 0, right: 2})
  expect(s('foo bar baz', 2, p)).toStrictEqual({word: 'foo', left: 0, right: 2})

  //        01234567890
  expect(s('foo bar baz', 4, p)).toStrictEqual({word: 'bar', left: 4, right: 6})
  expect(s('foo bar baz', 5, p)).toStrictEqual({word: 'bar', left: 4, right: 6})
  expect(s('foo bar baz', 6, p)).toStrictEqual({word: 'bar', left: 4, right: 6})

  //        01234567890
  expect(s('foo bar baz', 8, p)).toStrictEqual({word: 'baz', left: 8, right: 10})
  expect(s('foo bar baz', 9, p)).toStrictEqual({word: 'baz', left: 8, right: 10})
  expect(s('foo bar baz', 10, p)).toStrictEqual({word: 'baz', left: 8, right: 10})

  //        01234567890
  expect(s('foo bar baz', 11, p)).toStrictEqual(null)

  //        01234567890
  expect(s('foo bar baz', 3, p)).toStrictEqual(null)
  expect(s('foo bar baz', 7, p)).toStrictEqual(null)

  //        0 1 2 3 4 5678
  expect(s('あいうえお abc', 6, p)).toStrictEqual({word: 'abc', left: 6, right: 8})
  expect(s('あいうえお abc', 7, p)).toStrictEqual({word: 'abc', left: 6, right: 8})
  expect(s('あいうえお abc', 8, p)).toStrictEqual({word: 'abc', left: 6, right: 8})

  //        0 1 2 3 4 5678
  expect(s('あいうえお abc', 3, p)).toStrictEqual(null)

  //        01234567890
  expect(s('i am a cat.', 8, p)).toStrictEqual({word: 'cat.', left: 7, right: 10})

  //        0 1 2 3 4 5678
  expect(s('あいうえお かきくけこ', 3, p)).toStrictEqual(null)
})
