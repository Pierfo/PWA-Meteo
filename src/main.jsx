/**
 * Avvia il rendering dell'app e la registrazione del service worker
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './service-worker-registration.js'
import Temax from './theme.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Temax></Temax>
  </StrictMode>
)
