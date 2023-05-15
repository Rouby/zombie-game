export interface WebGPUElements {
  mesh: {};
  vertexBuffer: {
    attributes: GPUVertexAttribute[];
    arrayStride: number;
    vertexCount: number;
    stepMode: GPUVertexStepMode;
    vertices: () => Float32Array;
  };
  shaders: { code: string };
}

declare global {
  namespace JSX {
    interface IntrinsicElements extends WebGPUElements {}
  }
}
