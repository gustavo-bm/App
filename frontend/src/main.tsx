// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  // disabling StrictMode because it causes duplication on the fecthing of events
  // <StrictMode>
    <App />
  // </StrictMode>,
)
