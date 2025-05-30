import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { DrawGetSetData } from './draw/drawContext'
import AppUiContainer from './container/applicationUiContainer'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DrawGetSetData>
      <AppUiContainer/>
    </DrawGetSetData>
  </StrictMode>,
)
