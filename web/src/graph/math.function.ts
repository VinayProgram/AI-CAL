import { PixelLocation } from "./graphView";

export const mathcustom = {
  lerp: (a: number, b: number, t: number) => {
    return a + (b - a) * t;
  },
  formatNumber: (n: number, dec = 0) => {
    return n.toFixed(dec);
  },
  invlerp: (a: number, b: number, v: number) => {
    return (v - a) / (b - a);
  },
  remap: (oldboundsA: number, oldboundsB: number, newBoundsA: number, newBoundsB: number, v: number) => {
    const t = mathcustom.invlerp(oldboundsA, oldboundsB, v);
    return mathcustom.lerp(newBoundsA, newBoundsB, t);
  },
  remapPoint: (
    from: PixelLocation,
    to: PixelLocation,
    point: number[]
  ): number[] => {
    return [
      mathcustom.remap(from.minX, from.maxX, to.minX, to.maxX, point[0]),
      mathcustom.remap(from.minY, from.maxY, to.maxY, to.minY, point[1])
    ];
  },

  add: (a: number[], b: number[]) => {
    return [a[0] + b[0], a[1] + b[1]];
  },
  subtract: (a: number[], b: number[]) => {
    return [a[0] - b[0], a[1] - b[1]];
  },
  distnace: (p1: number[], p2: number[]) => {
     return Math.sqrt(
      (p1[0]-p2[0])**2+
      (p1[1]-p2[1])**2
   );
  },
  getNearest: (loc: number[], points: number[][]) => {
   let minDist=Number.MAX_SAFE_INTEGER;
   let nearestIndex=0;

   for(let i=0;i<points.length;i++){
      const point=points[i];
      const d=mathcustom.distnace(loc,point);
      if(d<minDist){
         minDist=d;
         nearestIndex=i;
      }
   }
   return nearestIndex;
    }
}

