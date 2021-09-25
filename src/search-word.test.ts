
import { searchWord as s } from './search-word'

test('search-word', () => {
  //        01234567890
  expect(s('foo bar baz', 0)).toStrictEqual({word: 'foo', left: 0, right: 2})
  expect(s('foo bar baz', 1)).toStrictEqual({word: 'foo', left: 0, right: 2})
  expect(s('foo bar baz', 2)).toStrictEqual({word: 'foo', left: 0, right: 2})

  //        01234567890
  expect(s('foo bar baz', 4)).toStrictEqual({word: 'bar', left: 4, right: 6})
  expect(s('foo bar baz', 5)).toStrictEqual({word: 'bar', left: 4, right: 6})
  expect(s('foo bar baz', 6)).toStrictEqual({word: 'bar', left: 4, right: 6})

  //        01234567890
  expect(s('foo bar baz', 8)).toStrictEqual({word: 'baz', left: 8, right: 10})
  expect(s('foo bar baz', 9)).toStrictEqual({word: 'baz', left: 8, right: 10})
  expect(s('foo bar baz', 10)).toStrictEqual({word: 'baz', left: 8, right: 10})

  //        01234567890
  expect(s('foo bar baz', 11)).toStrictEqual(null)

  //        01234567890
  expect(s('foo bar baz', 3)).toStrictEqual(null)
  expect(s('foo bar baz', 7)).toStrictEqual(null)

  //        0 1 2 3 4 5678
  expect(s('あいうえお abc', 6)).toStrictEqual({word: 'abc', left: 6, right: 8})
  expect(s('あいうえお abc', 7)).toStrictEqual({word: 'abc', left: 6, right: 8})
  expect(s('あいうえお abc', 8)).toStrictEqual({word: 'abc', left: 6, right: 8})

  //        0 1 2 3 4 5678
  expect(s('あいうえお abc', 3)).toStrictEqual(null)

  //        01234567890
  expect(s('i am a cat.', 8)).toStrictEqual({word: 'cat.', left: 7, right: 10})

  //        0 1 2 3 4 5678
  expect(s('あいうえお かきくけこ', 3)).toStrictEqual(null)
})
