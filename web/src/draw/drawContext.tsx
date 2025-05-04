import React, { createContext, useState } from 'react';

// 1. Define a type for the context value
type DrawContextType = {
  paths: number[][][];
  setPaths: React.Dispatch<React.SetStateAction<number[][][]>>;
  context:CanvasRenderingContext2D|null|undefined;
  setContext: React.Dispatch<CanvasRenderingContext2D|null>;
  drawPaths:()=>void
  redraw:()=>void
  reset:()=>void

};

// 2. Create context with the correct type (initial value is null or DrawContextType)
const DrawContext = createContext<DrawContextType | null>(null);

// 3. Create provider component
const DrawGetSetData = (props: React.PropsWithChildren) => {
  const [paths, setPaths] = useState<number[][][]>([]);
  const [context,setContext]=React.useState<CanvasRenderingContext2D|null >()

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
      for (const element of paths!) {
        drawPath(element)
      }  
    }

  const redraw=()=>{
      context?.clearRect(0,0,400,400)
      drawPaths()
  }
  
  const reset=()=>{
    setPaths(()=>[]);
    redraw();
  }

  return (
    <DrawContext.Provider value={{ paths, setPaths, context,setContext,drawPaths,redraw,reset }}>
      {props.children}
    </DrawContext.Provider>
  );
};

export { DrawGetSetData };
export default DrawContext;
