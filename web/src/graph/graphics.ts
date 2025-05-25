type TextOptions = {
  text: string;
  loc: { x: number; y: number };
  align?: "center" | "left" | "right";
  vAlign?: "middle" | "top" | "bottom";
  font?: string;
  color?: string;
};

export const graphics = {
  drawPoint: (
    label:string,
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number = 5,
    color: string = "black"
  ) => {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "blue";
    ctx.fillText(label, x, y);
    ctx.restore();
  },

  drawText: (ctx: CanvasRenderingContext2D, {
    text,
    loc,
    align = "center",
    vAlign = "middle",
    font = "16px Arial",
    color = "black"
  }: TextOptions) => {
    ctx.save();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;

    ctx.textBaseline = ((): CanvasTextBaseline => {
      switch (vAlign) {
        case "top": return "top";
        case "bottom": return "bottom";
        default: return "middle";
      }
    })();

    ctx.fillText(text, loc.x, loc.y);
    ctx.restore();
  }
};
