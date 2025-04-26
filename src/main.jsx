import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { useState } from 'react'
import TestAPI from './testAPI.jsx'
import TabellaMeteo from './TabellaMeteo.jsx'
import ProvaComponet from './ProvaComponet.jsx'
import Input2 from './input.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    {/* {console.log(getWeather("padova"))} */}
    {/* <TestAPI city={"Padova"}></TestAPI> */}
    {/* <ProvaComponet /> */}
    {/* <TabellaMeteo city={"Padova"}></TabellaMeteo> */}
    {/* <InputConBottone/> */}
    <Input2></Input2>
  </StrictMode>,
)
