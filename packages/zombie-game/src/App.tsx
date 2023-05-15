import { Canvas } from "@rouby/react-webgpu";
import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Canvas>
          <mesh>
            <vertexBuffer
              attributes={[
                {
                  shaderLocation: 0, // position
                  offset: 0,
                  format: "float32x4",
                },
                {
                  shaderLocation: 1, // color
                  offset: 16,
                  format: "float32x4",
                },
              ]}
              arrayStride={32}
              stepMode="vertex"
              vertexCount={3}
              vertices={() =>
                // prettier-ignore
                new Float32Array([
                  0.0, 0.6, 0, 1, 1, 0, 0, 1,
                  -0.5, -0.6, 0, 1, 0, 1, 0, 1,
                  0.5,-0.6, 0, 1, 0, 0, 1, 1,
                ])
              }
            />
            <shaders
              code={`
struct VertexOut {
  @builtin(position) position : vec4f,
  @location(0) color : vec4f
}

@vertex
fn vertex_main(@location(0) position: vec4f,
               @location(1) color: vec4f) -> VertexOut
{
  var output : VertexOut;
  output.position = position;
  output.color = color;
  return output;
}

@fragment
fn fragment_main(fragData: VertexOut) -> @location(0) vec4f
{
  return fragData.color;
}
`}
            />
          </mesh>
        </Canvas>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
