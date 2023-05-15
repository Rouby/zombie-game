import { Suspense, useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "./renderer";

export function Canvas({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={"initializing webgpu"}>
      <SuspenseCanvas children={children} />
    </Suspense>
  );
}

function SuspenseCanvas({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const initializing = useRef(false);
  const [root, setRoot] = useState<{
    read(): Awaited<ReturnType<typeof createRoot> | undefined>;
  } | null>(null);
  useLayoutEffect(() => {
    if (!root && !initializing.current && canvasRef.current) {
      initializing.current = true;
      setRoot(suspensify(createRoot(canvasRef.current)));
    }
  }, []);

  const renderer = root?.read();
  useLayoutEffect(() => {
    if (renderer) {
      renderer.render(<>{children}</>);
    }
  }, [renderer]);

  // TODO unmount?

  return <canvas ref={canvasRef} />;
}

function suspensify<T>(promise: Promise<T>) {
  let status = "pending";

  let result: T;
  let error: any;
  let suspender = promise.then(
    (res) => {
      status = "success";
      result = res;
    },
    (e) => {
      status = "error";
      error = e;
    }
  );

  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw error;
      } else if (status === "success") {
        return result;
      }
    },
  };
}
