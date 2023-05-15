import { ConcurrentRoot } from "react-reconciler/constants";
import { GPURenderer } from "./renderer";

export function createRoot(canvas: HTMLCanvasElement) {
  // Create renderer
  const fiber = GPURenderer.createContainer(
    void 0,
    ConcurrentRoot,
    null,
    false,
    null,
    "",
    console.error,
    null
  );

  return {
    render(children: React.ReactNode) {
      GPURenderer.updateContainer(
        <>{children}</>,
        fiber,
        null,
        () => undefined
      );
    },
  };
}
