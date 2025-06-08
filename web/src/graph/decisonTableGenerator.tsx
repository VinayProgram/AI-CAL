import React, { useRef, useEffect, useMemo } from "react";
import { descionPrediction } from "./decissonTable";
import { PixelLocation } from "./graphView";
import { mathcustom } from "./math.function";

const getColorForLabel = (label: string): [number, number, number] => {
  const colors: { [key: string]: [number, number, number] } = {
    "0": [0, 255, 0],
    "1": [255, 165, 0],
    "2": [0, 0, 255],
    "3": [165, 42, 42],
    "4": [255, 192, 203],
    "5": [255, 0, 0],
    "6": [255, 255, 0],
    "7": [128, 0, 128],
    "8": [255, 0, 255],
    "9": [0, 255, 255],
    "10": [0, 0, 0]
  };
  return colors[label] || [150, 150, 150];
};

interface DecisionBoundaryCanvasProps {
  dataBounds: PixelLocation;
  pixelBounds: PixelLocation;
  width: number;
  height: number;
  knn: number;
}

const DecisionBoundaryCanvas: React.FC<DecisionBoundaryCanvasProps> = ({
  dataBounds,
  pixelBounds,
  width,
  height,
  knn,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    const predictionCache = new Map<string, string>();

    let index = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const normPoint = [x / width, 1 - y / height];
        const cacheKey = `${normPoint[0].toFixed(4)},${normPoint[1].toFixed(4)}`;

        let label: string;
        if (predictionCache.has(cacheKey)) {
          label = predictionCache.get(cacheKey)!;
        } else {
          const newPoint = mathcustom.remapPoint(dataBounds, pixelBounds, normPoint);
          const result = descionPrediction(dataBounds, pixelBounds, newPoint, knn);
          label = result.label || "";
          predictionCache.set(cacheKey, label);
        }

        const [r, g, b] = getColorForLabel(label);
        data[index++] = r;
        data[index++] = g;
        data[index++] = b;
        data[index++] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [dataBounds, pixelBounds, width, height, knn]);

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "decision-boundary.png";
    link.href = imageURL;
    link.click();
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ border: "1px solid #ccc" }}
      />
      <button onClick={handleSave} style={{ marginTop: "8px" }}>
        Save Image
      </button>
    </div>
  );
};

export default DecisionBoundaryCanvas;
