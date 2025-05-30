import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './service-worker-registration.js'
import Temax from './provaLightDark.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Temax></Temax>
  </StrictMode>
)
