import * as React from 'react'
import DrawContext from './drawContext'
const SketchPad = () => {
    const canvasRef=React.useRef<HTMLCanvasElement|null>(null)
    const [isDrawing,setIsDrawing]=React.useState<boolean>()
    const dataContext = React.useContext(DrawContext)
    const paths = dataContext?.paths!
    const context = dataContext?.context!
    React.useEffect(()=>{
        const getcontext = canvasRef.current?.getContext('2d')!
        dataContext?.setContext(getcontext)
    },[context,isDrawing])

    const drawPath=(path:number[][])=>{
        if(context){
            context.strokeStyle='black';
            context.lineWidth=3;
            context.beginPath();
            context.moveTo(...path[0] as [number,number] );
            for(let i=1;i<path.length;i++){
                context.lineTo(...path[i]as [number,number]);
             }
             context.lineCap="round";
             context.lineJoin="round";
             context.stroke();
        }
    }

    const drawPaths=()=>{
      for (const element of dataContext?.paths!) {
        drawPath(element)
      }  
    }
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
            console.log(dataContext?.paths)
            redraw()
        }
    };


    const onMouseDown=(e:React.MouseEvent<HTMLCanvasElement, MouseEvent>)=>{
        const mouse=getMouse(e)
        dataContext?.setPaths((dp)=>[...dp,[mouse]])
        setIsDrawing(true)
    }



    const redraw=()=>{
        context?.clearRect(0,0,400,400)
        drawPaths()
    }

  return (
    <div>
       <canvas 
       width={400} 
       height={400} 
       style={{backgroundColor:"white"}} 
       ref={canvasRef}
       onMouseMove={onMouseMove}
       onMouseDown={onMouseDown}
       onMouseUp={()=>{
        setIsDrawing(false)}}
       ></canvas>
    <br/>
    <button onClick={()=>''}>save</button>
    </div>
  )
}

export default SketchPad
