const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 140;
const BRAND_COLOR = "#1a1a2e";
const ACCENT_COLOR = "#4a4a6a";

export function generateDefaultLogo(): string {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context not available");

  ctx.fillStyle = BRAND_COLOR;
  ctx.font = "bold 52px 'Helvetica Neue', Helvetica, Arial, sans-serif";
  ctx.letterSpacing = "6px";
  ctx.fillText("WAYNE", 16, 58);

  ctx.fillStyle = ACCENT_COLOR;
  ctx.font = "300 28px 'Helvetica Neue', Helvetica, Arial, sans-serif";
  ctx.letterSpacing = "10px";
  ctx.fillText("INDUSTRIES", 18, 100);

  // Underline accent
  ctx.strokeStyle = BRAND_COLOR;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(16, 68);
  ctx.lineTo(280, 68);
  ctx.stroke();

  return canvas.toDataURL("image/png");
}
