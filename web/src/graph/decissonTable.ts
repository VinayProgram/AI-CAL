import { mathcustom } from "./math.function";
import dataSample from '../../../data/dataset/features.json';
import { PixelLocation } from "./graphView";

export const descionPrediction = (dataBounds:PixelLocation,pixelBounds:PixelLocation,newPoint:number[],knn:number=10) => {
         const points = dataSample.samples.map((s) => mathcustom.remapPoint(dataBounds, pixelBounds, s.point));
          const indices = mathcustom.getNearest(newPoint, points, knn);
          const nearestSample = indices.map((i) => dataSample.samples[i]);
          const labels = nearestSample.map((s) => s.label);
          const counts: { [key: string]: number } = {}
          for (const label of labels) {
            counts[label] = counts[label] ? counts[label] + 1 : 1;
          }
          const max = Math.max(...Object.values(counts));
          const label = labels.find((l) => counts[l] === max);
          
          return { newPoint, label, nearestSample }
}


