import { useLayoutEffect, useRef } from "react";
import { createRoot } from "./fiber";

export function Canvas({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const root = useRef<ReturnType<typeof createRoot> | null>(null);
  useLayoutEffect(() => {
    if (!root.current) {
      root.current = createRoot(canvasRef.current!);
    }
    root.current.render(<>{children}</>);
  });

  return <canvas ref={canvasRef} />;
}
