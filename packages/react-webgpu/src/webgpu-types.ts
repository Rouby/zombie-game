export interface WebGPUElements {
  mesh: {};
}

declare global {
  namespace JSX {
    interface IntrinsicElements extends WebGPUElements {}
  }
}
