import React from "react";
import { samplestype } from "./Graphtable";
import { mathcustom } from "./math.function";
import { graphics } from "./graphics";

interface GraphViewProps {
  samples: samplestype[],
  options: {
    size: number
    margin?: number
    transperency?: number
    labels?:string[]
  }
}

const GraphView = ({ samples, options: initialOptions }: GraphViewProps) => {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);

  const options = {
    ...initialOptions,
    margin: initialOptions.size * 0.1,
    transperency: initialOptions.transperency || 0.5
  };

  React.useEffect(() => {
    if (ref.current) {
      ref.current.width = initialOptions.size;
      ref.current.height = initialOptions.size;
      const context = ref.current.getContext("2d");
      if (context) setCtx(context);
    }
  }, [initialOptions.size]);

  React.useEffect(() => {
    if (ctx) draw();
  }, [ctx, samples, initialOptions]);

 const getPixelBounds = (): PixelLocation => {
  return {
    minX: options.margin!,
    maxX: options.size - options.margin!,
    minY: options.margin!,
    maxY: options.size - options.margin!
  };
};


 const getDataBounds = (): PixelLocation => {
  const x = samples.map((s) => s.point[0]);
  const y = samples.map((s) => s.point[1]);
  return {
    minX: Math.min(...x),
    maxX: Math.max(...x),
    minY: Math.min(...y),
    maxY: Math.max(...y)
  };
};


  const draw = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, options.size, options.size);
    ctx.globalAlpha = options.transperency!;
    drawAxes();
    drawSamples();
    ctx.globalAlpha = 1;
  };

 const drawSamples = () => {
  if (!ctx) return;

  const dataBounds = getDataBounds();
  const pixelBounds = getPixelBounds();
  for (const sample of samples) {
    const point = sample.point;
    const pixelLocation = mathcustom.remapPoint(dataBounds, pixelBounds, point);
    graphics.drawPoint(sample.label,ctx, pixelLocation[0], pixelLocation[1], 5);
  }
};


const drawAxes = () => {
  if (!ctx) return;

  const pixelBounds = getPixelBounds();
  const dataBounds = getDataBounds();


};

  return (
    <div>
      <canvas
        id="chartContainer"
        ref={ref}
        style={{ backgroundColor: 'white' }}
      />
    </div>
  );
};

export type PixelLocation = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export default GraphView;
