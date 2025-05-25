import React from "react";
import { samplestype } from "./Graphtable";
interface GraphViewProps {
  samples:samplestype[],
  options: {
    size:number
    margin?:number
  }
}
const GraphView = ({...props}:GraphViewProps) => {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);
  const [options, setOptions] = React.useState<GraphViewProps['options']>(props.options);
  React.useEffect(() => {
    if(ref.current === null) return;
    const canvas = ref.current;
    const ctxd = canvas.getContext('2d');
    setCtx(ctxd);
    canvas.width = props.options.size;
    canvas.height = props.options.size;
    setOptions({
      ...props.options,
      margin:props.options.size * 0.1
    });
    const pixelBounds = getDataBounds()
    const dataBounds =  getPixelBounds() 
    
  }, []);

  const getPixelBounds=()=>{
    if(!options.margin)return
    const bounds = {
      left:options.margin,
      right:options.size - options.margin,
      top:options.margin,
      bottom:options.size - options.margin
    }
    return bounds;
  }
  const getDataBounds=()=>{
    const x = props.samples.map((s) => s.point[0]);
    const y = props.samples.map((s) => s.point[1]);
    const minX = Math.min(...x);
    const maxX = Math.max(...x);
    const minY = Math.min(...y);
    const maxY = Math.max(...y);
    const bounds = {
      left: minX,
      right: maxX,
      top: minY,
      bottom: maxY
    }
    return bounds;
  }

  const draw = () => {
    ctx?.clearRect(0, 0, options.size, options.size);
  }
  return (
    <div>
    <canvas id="chartContainer" ref={ref} style={{backgroundColor:'white'}}></canvas>      
    </div>
  )
}

export default GraphView
