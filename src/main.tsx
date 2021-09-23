import { matchPatternWithConfig, presets } from 'browser-extension-url-match'

import {Config, Defaults, IConfig} from './config'


const matchPattern = matchPatternWithConfig(presets.firefox)

function isWord(c: string): boolean {
  return c.match(/\w/) !== null
}

interface Previous {
  at: number
  clicked: ClickedWord
}

interface ClickedWord {
  word: string
  offset: number
  left: number
  right: number
  node: HTMLElement
}

function getClickedWord(e: any): ClickedWord | null{
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
}

const select = (() => {
  let prev: Previous | null = null

  return (c: ClickedWord, config: IConfig) => {
    let range = document.createRange()

    const at = new Date().getTime()

    if (prev !== null) {
      let delta = at - prev.at
      if (config.timeout < delta)
        prev = null
    }

    if (prev === null) {
      prev = {clicked: c, at}
      return
    }

    range.setStart(prev.clicked.node, prev.clicked.left)
    range.setEnd(c.node, c.right)

    if (range.startContainer === range.endContainer && range.startOffset === range.endOffset) {
      range.setStart(c.node, c.left)
      range.setEnd(prev.clicked.node, prev.clicked.right)
    }

    prev = null

    const selection = window.getSelection()
    if (selection === null)
      return
    selection.removeAllRanges()
    selection.addRange(range)
    if (config.clipboard)
      document.execCommand('copy')
  }
})()

function install(config: IConfig): void {
  if (!(document as any).caretPositionFromPoint) {
    console.error('`caretPositionFromPoint` is not found')
    return null
  }

  document.body.addEventListener(
    'click',
    (e: any) => {
      console.log('2c2s', 'click')
      const c = getClickedWord(e)
      if (!c)
        return
      select(c, config)
    },
    false
  )
  console.log('2c2s', 'Installed')
}

(async () => {
  // https://www.npmjs.com/package/@extend-chrome/storage
  // https://www.npmjs.com/package/browser-extension-url-match

  const config = (await Config.get(Defaults))

  const url = document.location.href

  const matched = config.whitelist.some(it => {
    const matcher = matchPattern(it)
    return matcher.match(url)
  })

  if (matched)
    install(config)

})()
