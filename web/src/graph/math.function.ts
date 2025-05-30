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
}