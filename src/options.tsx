import React, { ChangeEvent, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import {Config, Defaults, IConfig} from './config'


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

  function onBlur() {
    Config.set({timeout})
  }

  return (
    <>
      <h1>2s2c Options</h1>

      <h2>White list</h2>
      <p>e.g. `https://example.com/*`</p>
      <PatternsEditor whitelist={config.whitelist} />

      <h2>Misc</h2>

      <label>Timeout (msec)</label>
      <input type="number" value={timeout} onChange={(e: ChangeEvent<HTMLInputElement>) => setTimeout(parseInt(e.target.value))} onBlur={onBlur}/>
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
