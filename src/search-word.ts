
export interface Found {
  word: string
  left: number
  right: number
}


export function searchWord(s: string, offset: number, pattern: RegExp): Found | null {
  let rest = s
  let base = 0

  while (0 < rest.length) {
    let m = rest.match(pattern)
    if (m === null)
      return null

    let left = base + m.index
    let right = base + m.index + m[0].length - 1

    // console.log({left, right, offset})

    if (offset < left)
      return null
    if (left <= offset && offset <= right)
      return {word: s.slice(left, right + 1), left, right}

    rest = s.slice(right + 1)
    base = right + 1
  }
  return null
}
