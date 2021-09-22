function isWord(c: string): boolean {
  return c.match(/\w/) !== null
}

interface ClickedWord {
  word: string
  offset: number
  left: number
  right: number
  node: HTMLElement
}

function getClickedWord(e: any): ClickedWord | null{
  try {
  if (!(document as any).caretPositionFromPoint)
    return null

  let range = (document as any).caretPositionFromPoint(e.clientX, e.clientY)
  if (range === null)
    return null

  let node = range.offsetNode
  let offset = range.offset
  let text = node.textContent
  let left = 0
  let right = text.length - 1

  if (offset === text.length)
    offset = text.length - 1

  if (!isWord(text[offset])) {
    if (0 < offset) {
      offset--
    } else if (offset < text.length - 1) {
      offset++
    }
  }

  for (let p = offset; 0 <= p && isWord(text[p]); p--)
    left = p

  for (let p = offset; p < text.length && isWord(text[p]); p++)
    right = p + 1

  let word = text.slice(left, right)

  return {left, offset, right, word, node}
  } catch (e) {
    console.log(e)
    throw e
  }
}

const select = (() => {
  let prev: ClickedWord | null = null

  return (c: ClickedWord) => {
    let range = document.createRange()

    if (prev === null) {
      prev = c
      return
    }

    range.setStart(prev.node, prev.left)
    range.setEnd(c.node, c.right)

    if (range.startContainer === range.endContainer && range.startOffset === range.endOffset) {
      range.setStart(c.node, c.left)
      range.setEnd(prev.node, prev.right)
    }

    prev = null

    const selection = window.getSelection()
    if (selection === null)
      return
    selection.removeAllRanges()
    selection.addRange(range)
  }
})()


document.body.addEventListener(
  'click',
  (e: any) => {
    const c = getClickedWord(e)
    if (!c)
      return
    select(c)
  },
  false
)
