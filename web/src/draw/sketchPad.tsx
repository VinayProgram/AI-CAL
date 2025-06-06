import * as React from 'react'
import DrawContext from './drawContext'
const SketchPad = () => {
    const canvasRef=React.useRef<HTMLCanvasElement|null>(null)
    const [isDrawing,setIsDrawing]=React.useState<boolean>()
    const dataContext = React.useContext(DrawContext)
    const paths = dataContext?.paths!
    React.useEffect(()=>{
        const getcontext = canvasRef.current?.getContext('2d')!
        dataContext?.setContext(getcontext)
        dataContext?.reset()
    },[])

  
    const getMouse=(evt:React.MouseEvent<HTMLCanvasElement, MouseEvent>)=>{
        const rect=canvasRef.current?.getBoundingClientRect();
        return [
           Math.round(evt.clientX-rect?.left!),
           Math.round(evt.clientY-rect?.top!)
        ];
    }
    
    const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (isDrawing) {
            const mouse = getMouse(e);
            const lastpath=paths[paths.length-1]?paths[paths.length-1]:[]
            lastpath.push(mouse)
           dataContext?.redraw()
        }
    };


    const onMouseDown=(e:React.MouseEvent<HTMLCanvasElement, MouseEvent>)=>{
        const mouse=getMouse(e)
        dataContext?.setPaths((dp)=>[...dp,[mouse]])
        setIsDrawing(true)
    }

    const onMouseUp=()=>{
        setIsDrawing(false)
        dataContext?.setPaths((dp)=>[...dp])
    }

  return (
    <div>
       <canvas 
       width={400} 
       height={400} 
       style={{backgroundColor:"white",border:"1px solid black"}} 
       ref={canvasRef}
       onMouseMove={onMouseMove}
       onMouseDown={onMouseDown}
       onMouseUp={onMouseUp}
       ></canvas>
    <br/>
    </div>
  )
}

export default SketchPad
