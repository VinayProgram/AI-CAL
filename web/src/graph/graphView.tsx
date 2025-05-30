import React, { MouseEventHandler } from "react";
import { samplestype } from "./Graphtable";
import { mathcustom } from "./math.function";
import { graphics } from "./graphics";

interface GraphViewProps {
  samples: samplestype[],
  options: {
    size: number
    margin?: number
    transperency?: number
    labels?: string[]
  },
  dyanamicPoint:[number,number]
}

const GraphView = ({ samples, options: initialOptions,dyanamicPoint }: GraphViewProps) => {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);
  const [dataPanOffset, setDataPanOffset] = React.useState<{
    offset: number[],
    scale: number
  }>({
    offset: [0, 0],
    scale: 1,
  });
  const [dragInfo, setDragInfo] = React.useState<{
    isDragging: boolean,
    start: number[],
    end: number[],
    offset: number[]
  }>({
    isDragging: false,
    start: [] as number[],
    end: [] as number[],
    offset: dataPanOffset.offset,
  })
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
    if (ctx) {
      draw();
    }
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

  const [currentDataBounds, SetCurrentDataBounds] = React.useState<PixelLocation>(getDataBounds());
  const draw = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, options.size, options.size);
    ctx.globalAlpha = options.transperency!;
    drawAxes();
    drawSamples();
    ctx.globalAlpha = 1;
  };


  const getMouse = (event: React.MouseEvent<HTMLCanvasElement>, dataSpace: Boolean = false) => {
    const rect = ref.current?.getBoundingClientRect();
    const pixelLocation = [
      event.clientX - (rect?.left || 0),
      event.clientY - (rect?.top || 0)
    ]
    if (dataSpace) {
      const dataLocation = mathcustom.remapPoint(getPixelBounds(), getDataBounds(), pixelLocation);
      return dataLocation;
    }
    return pixelLocation;
  }
  const drawSamples = () => {
    if (!ctx) return;

    const dataBounds = currentDataBounds;
    const pixelBounds = getPixelBounds();
    for (const sample of samples) {
      const point = sample.point;
      const pixelLocation = mathcustom.remapPoint(dataBounds, pixelBounds, point);
      graphics.drawPoint(sample.label, ctx, pixelLocation[0], pixelLocation[1], 5);
    }
  };


  const drawAxes = () => {
    if (!ctx) return;

    const pixelBounds = getPixelBounds();
    const dataBounds = currentDataBounds
    const dataMinimum = mathcustom.remapPoint(pixelBounds, dataBounds, [pixelBounds.minY, pixelBounds.maxY]);
    const dataMax = mathcustom.remapPoint(pixelBounds, dataBounds, [pixelBounds.maxY, pixelBounds.minY]);
    // Clear margins
    ctx.clearRect(0, 0, options.size, options.margin); // Top
    ctx.clearRect(0, 0, options.margin, options.size); // Left
    ctx.clearRect(options.size - options.margin, 0, options.margin, options.size); // Right
    ctx.clearRect(0, options.size - options.margin, options.size, options.margin); // Bottom

    // X-axis label
    graphics.drawText(ctx, {
      loc: { x: mathcustom.lerp(pixelBounds.maxX, pixelBounds.minX, 0.5), y: pixelBounds.maxY + options.margin / 2 },
      text: options.labels?.[0] || "km",
    });
  
    // Y-axis label
    ctx.save();
    ctx.translate(pixelBounds.minX - options.margin / 2, options.size / 2);
    ctx.rotate(-Math.PI / 2);

    graphics.drawText(ctx, {
      loc: { x: 0, y: 0 },
      text: options.labels?.[1] || "price",
    });
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(pixelBounds.minX, pixelBounds.minY);
    ctx.lineTo(pixelBounds.minX, pixelBounds.maxY);
    ctx.lineTo(pixelBounds.maxX, pixelBounds.maxY);
    ctx.setLineDash([5, 4]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.setLineDash([]);

    graphics.drawText(ctx, {
      text: mathcustom.formatNumber(dataMinimum[0], 2),
      loc: {
        x: pixelBounds.minX,
        y: pixelBounds.maxY + options.margin * 0.3
      },
      align: "left",
      vAlign: "top"
    });

    graphics.drawText(ctx, {
      text: mathcustom.formatNumber(dataMinimum[1], 0),
      loc: {
        x: pixelBounds.minX - options.margin * 0.7,
        y: pixelBounds.maxX - options.margin * 0.4
      },
      align: "left",
      vAlign: "top"
    });

    graphics.drawText(ctx, {
      text: mathcustom.formatNumber(dataMax[0], 2),
      loc: {
        x: pixelBounds.maxX,
        y: pixelBounds.maxY + options.margin * 0.3
      },
      align: "left",
      vAlign: "top"
    });

    graphics.drawText(ctx, {
      text: mathcustom.formatNumber(dataMax[1], 2),
      loc: {
        x: 0,
        y: pixelBounds.minX + options.margin * 0.3
      },
      align: "left",
      vAlign: "top"
    });
  };

  const onMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragInfo.isDragging) {
      const mousePosition = getMouse(event, true);
      const newOffset = mathcustom.subtract(mousePosition, dragInfo.start);
      const updatedPanOffset = {
        ...dataPanOffset,
        offset: mathcustom.add(dataPanOffset.offset, newOffset)
      };

      setDataPanOffset(updatedPanOffset);
      setDragInfo({
        ...dragInfo,
        offset: newOffset,
        end: mousePosition
      });

      const newDataBounds = getDataBounds();
      SetCurrentDataBounds({
        maxX: newDataBounds.maxX - dataPanOffset.offset[0],
        maxY: newDataBounds.maxY - dataPanOffset.offset[1],
        minX: newDataBounds.minX - dataPanOffset.offset[0],
        minY: newDataBounds.minY - dataPanOffset.offset[1]
      });


      draw(); // Redraw with updated bounds
    }
  }
  return (
    <div>
      <canvas
        onMouseDown={(e) => {
          const mousePosition = getMouse(e, true);
          setDragInfo({
            isDragging: true,
            start: mousePosition,
            end: mousePosition,
            offset: [0, 0],
          });
        }}

        onMouseMove={onMouseMove}
        onMouseUp={(e) => {
          const mousePosition = getMouse(e, true);
          setDragInfo({
            isDragging: false,
            start: mousePosition,
            end: mousePosition,
            offset: [0, 0],
          });
        }}
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
