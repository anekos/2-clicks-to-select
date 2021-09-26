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
      style={{width: '100%'}}
      rows={10}
      onChange={_onChange}
      onBlur={onBlur}
    />)
}

interface IField {
  title: string
  children: React.ReactNode
}
function Field({title, children}: IField) {
  return (<>
    <h2>{title}</h2>
    { children }
  </>)
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

      <Field title="White list">
        <p>e.g. `https://example.com/*`</p>
        <PatternsEditor whitelist={config.whitelist} />
      </Field>

      <Field title="Timeout">
        <input
          type="number"
          value={timeout}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTimeout(parseInt(e.target.value))} />
        <label> (msec)</label>
      </Field>

      <Field title="Clipboard">
        <input
          id="clipboard"
          type="checkbox"
          checked={clipboard}
          onChange={(e: ChangeEvent<HTMLInputElement>) => { setClipboard(e.target.checked) }}
        />
        <label htmlFor="clipboard">Copy to clipboard</label>
      </Field>

      <Field title="Word definition">
        <label>`Word` is </label>
        <p>
          <input
            type="text"
            value={wordPattern}
            style={{width: '100%'}}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setWordPattern(e.target.value)} />
        </p>
        <em>(<a href="https://regexr.com/" target="_blank">Regular expression</a>)</em>
      </Field>

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
