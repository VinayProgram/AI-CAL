import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Draw from './draw/draw'
import { DrawGetSetData } from './draw/drawContext'
import DataVisuale from './data-visualize/datavisualize'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DrawGetSetData>
    <Draw />
    <DataVisuale/>
    </DrawGetSetData>
  </StrictMode>,
)
