import { matchPatternWithConfig, presets } from 'browser-extension-url-match'

import {Config, Defaults, IConfig} from './config'
import { searchWord } from './search-word'

const matchPattern = matchPatternWithConfig(presets.firefox)

let config = Defaults
let tryedToInstall = false


async function updateConfig() {
  config = await Config.get(Defaults)
  console.log('Config updated', config)
}

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

  let found = searchWord(text, offset)
  if (found === null)
    return null

  return Object.assign(found, {offset, node})
}

const select = (() => {
  let prev: Previous | null = null

  return (c: ClickedWord) => {
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
    range.setEnd(c.node, c.right + 1)

    if (range.startContainer === range.endContainer && range.startOffset === range.endOffset) {
      range.setStart(c.node, c.left)
      range.setEnd(prev.clicked.node, prev.clicked.right + 1)
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

function install(): void {
  if (!(document as any).caretPositionFromPoint) {
    console.error('`caretPositionFromPoint` is not found')
    return null
  }

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

  console.log('2c2s', 'Installed')
}

async function tryToInstall() {
  if (tryedToInstall)
    return true

  tryedToInstall = true

  const url = document.location.href

  const matched = config.whitelist.some(it => {
    const matcher = matchPattern(it)
    return matcher.match(url)
  })

  if (matched)
    install()
}

(async () => {
  // https://www.npmjs.com/package/@extend-chrome/storage
  // https://www.npmjs.com/package/browser-extension-url-match
  chrome.runtime.onMessage.addListener((message: string, sender: any, callback: any) => {
    updateConfig()
    return Promise.resolve({response: 'ok'})
  })

  await updateConfig()

  tryToInstall()
})()
