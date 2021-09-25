import React, { ChangeEvent, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import {Config, Defaults, IConfig} from './config'


function updateTabs() {
  chrome.tabs.query({}, (tabs: any) => {
    tabs.forEach((tab: any) => {
      chrome.tabs.sendMessage(tab.id, {command: 'update-config'})
    })
  })
}

interface IPatternsEditor {
  whitelist: string[]
}
function PatternsEditor({whitelist}: IPatternsEditor) {
  const [value, setValue] = useState<string>(whitelist.join('\n'))

  function _onChange(e: ChangeEvent<HTMLTextAreaElement>) {
    console.log(e.target.value.split('\n'))
    setValue(e.target.value)
  }

  function onBlur() {
    Config.set({whitelist: value.split('\n')})
    updateTabs()
  }

  return (
    <textarea
      value={value}
      cols={50}
      rows={10}
      onChange={_onChange}
      onBlur={onBlur}
    />)
}


function Options(config: IConfig) {
  const [timeout, setTimeout] = useState<number>(config.timeout)
  const [clipboard, setClipboard] = useState<boolean>(config.clipboard)
  const [wordPattern, setWordPattern] = useState<string>(config.wordPattern)

  useEffect(() => {
    Config.set({timeout, clipboard, wordPattern})
    updateTabs()
  }, [timeout, clipboard, wordPattern])

  return (
    <>
      <h1>2s2c Options</h1>

      <h2>White list</h2>
      <p>e.g. `https://example.com/*`</p>
      <PatternsEditor whitelist={config.whitelist} />

      <h2>Misc</h2>

      <p>
        <label>Timeout</label>
        &nbsp;
        <input type="number" value={timeout} onChange={(e: ChangeEvent<HTMLInputElement>) => setTimeout(parseInt(e.target.value))} />
        <label> (msec)</label>
      </p>

      <p>
        <input
          id="clipboard"
          type="checkbox"
          checked={clipboard}
          onChange={(e: ChangeEvent<HTMLInputElement>) => { setClipboard(e.target.checked) }}
        />
        <label htmlFor="clipboard">Copy to clipboard</label>
      </p>

      <p>
        <label>Word is </label>
        &nbsp;
        <input type="text" value={wordPattern} onChange={(e: ChangeEvent<HTMLInputElement>) => setWordPattern(e.target.value)} />
        <label> (Regular expression)</label>
      </p>

    </>
  )
}

function Main() {
  const [config, setConfig] = useState<null|IConfig>(null)

  useEffect(() => { Config.get(Defaults).then(setConfig) }, [])

  if (config === null)
    return (<>Loading</>)

  return (<Options {...config} />)
}

const domContainer = document.querySelector('#app')
ReactDOM.render(<Main />, domContainer)
