import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import './service-worker-registration.js'
import Input2 from './input.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Input2></Input2>
  </StrictMode>,
)
