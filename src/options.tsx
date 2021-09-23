import React, { ChangeEvent, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import Config from './config'


interface IPatternsEditor {
}
function PatternsEditor({}: IPatternsEditor) {
  const [value, setValue] = useState<string|null>(null)

  function _onChange(e: ChangeEvent<HTMLTextAreaElement>) {
    console.log(e.target.value.split('\n'))
    setValue(e.target.value)
  }

  function onBlur() {
    Config.set({whitelist: value.split('\n')})
  }

  useEffect(() => {
    Config.get({whitelist: []}).then(({whitelist}) => {
      setValue(whitelist.join('\n'))
    })
  }, [])

  if (value === null)
    return (<>Loading</>)

  return (
    <textarea
      value={value}
      cols={100}
      rows={10}
      onChange={_onChange}
      onBlur={onBlur}
    />)
}


function Options({}) {

  return (
    <>
      <h1>2s2c Options</h1>

      <h2>White list</h2>
      <p>e.g. `https://example.com/*`</p>
      <PatternsEditor />
    </>
  )
}

const domContainer = document.querySelector('#app')
ReactDOM.render(<Options />, domContainer)
