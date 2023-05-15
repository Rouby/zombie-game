/// <reference types="@webgpu/types" />

import ReactReconciler, { HostConfig } from "react-reconciler";
import {
  ConcurrentRoot,
  DefaultEventPriority,
} from "react-reconciler/constants";
import { WebGPUElements } from "./webgpu-types";

type MeshInstance = {
  type: "mesh";
  props: WebGPUElements["mesh"];
  device: GPUDevice;
  context: GPUCanvasContext;
  vertexBuffers: {
    buffer: GPUBuffer;
    layout: GPUVertexBufferLayout;
    vertexCount: number;
  }[];
  shaderModule?: GPUShaderModule;
};

type VertexBufferInstance = {
  type: "vertexBuffer";
  props: WebGPUElements["vertexBuffer"];
  device: GPUDevice;
  context: GPUCanvasContext;
};

type ShadersInstance = {
  type: "shaders";
  props: WebGPUElements["shaders"];
  device: GPUDevice;
  context: GPUCanvasContext;
};

type Instance = MeshInstance | VertexBufferInstance | ShadersInstance;

type InstanceProps = any;

const HostConfig: HostConfig<
  Instance["type"],
  InstanceProps,
  { device: GPUDevice; context: GPUCanvasContext },
  Instance,
  void,
  Instance,
  Instance,
  Instance,
  never,
  (boolean | number)[],
  never,
  number | undefined,
  -1
> = {
  createInstance(type, props, rootContainer, hostContext, internalHandle) {
    console.trace("createInstance", {
      type,
      props,
      rootContainer,
      hostContext,
      internalHandle,
    });

    let instance: Instance | undefined = undefined;

    switch (type) {
      case "mesh": {
        instance = {
          type,
          props,
          device: rootContainer.device,
          context: rootContainer.context,
          vertexBuffers: [],
        };
        break;
      }
      case "vertexBuffer": {
        instance = {
          type,
          props,
          device: rootContainer.device,
          context: rootContainer.context,
        };
        break;
      }
      case "shaders": {
        instance = {
          type,
          props,
          device: rootContainer.device,
          context: rootContainer.context,
        };
        break;
      }
    }

    if (!instance) {
      throw new Error(`ReactWebGPU does not support the type "${type}"`);
    }

    return instance;
  },
  getInstanceFromNode(node) {
    return node;
  },
  prepareScopeUpdate(scopeInstance, instance) {},
  getInstanceFromScope(scopeInstance) {
    return scopeInstance;
  },
  appendInitialChild: handleAppendChild,
  appendChild: handleAppendChild,
  removeChild(parentInstance, child) {
    console.trace("removeChild", { parentInstance, child });
  },
  insertBefore(parentInstance, child, beforeChild) {
    console.trace("insertBefore", { parentInstance, child, beforeChild });
  },
  isPrimaryRenderer: false,
  supportsMutation: true,
  supportsHydration: false,
  supportsPersistence: false,
  noTimeout: -1,
  createTextInstance: handleTextInstance,
  hideTextInstance: handleTextInstance,
  unhideTextInstance: handleTextInstance,
  appendChildToContainer(container, child) {
    console.trace("appendChildToContainer", { container, child });
  },
  removeChildFromContainer(container, child) {
    console.trace("removeChildFromContainer", { container, child });
  },
  insertInContainerBefore(container, child, beforeChild) {
    console.trace("insertInContainerBefore", { container, child, beforeChild });
  },
  getRootHostContext(rootContainer) {
    console.trace("getRootHostContext", { rootContainer });

    return null;
  },
  getChildHostContext(parentHostContext, type, rootContainer) {
    console.trace("getChildHostContext", {
      parentHostContext,
      type,
      rootContainer,
    });

    return parentHostContext;
  },
  finalizeInitialChildren(instance, type, props, rootContainer, hostContext) {
    return true;
  },
  prepareUpdate(
    instance,
    type,
    oldProps,
    newProps,
    rootContainer,
    hostContext
  ) {
    console.trace("prepareUpdate", {
      instance,
      type,
      oldProps,
      newProps,
      rootContainer,
      hostContext,
    });

    return null;
  },
  prepareForCommit(containerInfo) {
    console.trace("prepareForCommit", { containerInfo });

    return null;
  },
  commitMount(instance, type, props, internalInstanceHandle) {
    console.trace("commitMount", {
      instance,
      type,
      props,
      internalInstanceHandle,
    });

    switch (instance.type) {
      case "mesh": {
        if (!instance.shaderModule) {
          throw new Error("Mesh must have shaders");
        }

        const renderPipeline = instance.device.createRenderPipeline({
          vertex: {
            module: instance.shaderModule,
            entryPoint: "vertex_main",
            buffers: instance.vertexBuffers.map((vb) => vb.layout),
          },
          fragment: {
            module: instance.shaderModule,
            entryPoint: "fragment_main",
            targets: [
              {
                format: navigator.gpu.getPreferredCanvasFormat(),
              },
            ],
          },
          primitive: {
            topology: "triangle-list",
          },
          layout: "auto",
        });

        const commandEncoder = instance.device.createCommandEncoder();
        const passEncoder = commandEncoder.beginRenderPass({
          colorAttachments: [
            {
              clearValue: { r: 0.0, g: 0.5, b: 1.0, a: 1.0 },
              loadOp: "clear",
              storeOp: "store",
              view: instance.context.getCurrentTexture().createView(),
            },
          ],
        });

        passEncoder.setPipeline(renderPipeline);
        passEncoder.setVertexBuffer(
          0,
          instance.vertexBuffers.map((vb) => vb.buffer)[0]
        );
        passEncoder.draw(instance.vertexBuffers.map((vb) => vb.vertexCount)[0]);

        passEncoder.end();

        instance.device.queue.submit([commandEncoder.finish()]);
      }
    }
  },
  commitUpdate(
    instance,
    updatePayload,
    type,
    prevProps,
    nextProps,
    internalHandle
  ) {
    console.trace("commitUpdate", {
      instance,
      updatePayload,
      type,
      prevProps,
      nextProps,
      internalHandle,
    });
  },
  getPublicInstance(instance) {
    return instance!;
  },
  preparePortalMount(containerInfo) {},
  resetAfterCommit(containerInfo) {},
  shouldSetTextContent(type, props) {
    return false;
  },
  clearContainer(container) {},
  hideInstance(instance) {},
  unhideInstance(instance, props) {},
  getCurrentEventPriority() {
    return DefaultEventPriority;
  },
  beforeActiveInstanceBlur() {},
  afterActiveInstanceBlur() {},
  detachDeletedInstance(node) {},
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
};

const GPURenderer = ReactReconciler(HostConfig);

function handleTextInstance() {
  throw new Error("Text is not supported in React WebGPU");
}

function handleAppendChild(parentInstance: Instance, child: Instance) {
  console.trace("appendChild", { parentInstance, child });

  switch (parentInstance.type) {
    case "mesh": {
      switch (child.type) {
        case "vertexBuffer":
          const vertices = child.props.vertices();
          const vertexBuffer = child.device.createBuffer({
            size: vertices.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
          });
          child.device.queue.writeBuffer(
            vertexBuffer,
            0,
            vertices,
            0,
            vertices.length
          );
          parentInstance.vertexBuffers.push({
            buffer: vertexBuffer,
            layout: {
              attributes: child.props.attributes,
              arrayStride: child.props.arrayStride,
              stepMode: child.props.stepMode,
            },
            vertexCount: child.props.vertexCount,
          });
          break;
        case "shaders": {
          const shaderModule = child.device.createShaderModule({
            code: child.props.code,
          });
          parentInstance.shaderModule = shaderModule;
          break;
        }
        default:
          throw new Error(
            `ReactWebGPU does not support the child type "${child.type}" for the parent type "${parentInstance.type}"`
          );
      }
    }
  }
}

export async function createRoot(canvas: HTMLCanvasElement) {
  console.trace("createRoot", { canvas });

  if (!navigator.gpu) {
    throw new Error("WebGPU is not supported in this browser");
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw Error("Couldn't request WebGPU adapter.");
  }

  const device = await adapter.requestDevice();

  const context = canvas.getContext("webgpu");

  if (!context) {
    throw Error("Couldn't request WebGPU context.");
  }

  context.configure({
    device,
    format: navigator.gpu.getPreferredCanvasFormat(),
    alphaMode: "premultiplied",
  });

  const container = GPURenderer.createContainer(
    { device, context },
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
        container,
        null,
        () => undefined
      );
    },
  };
}
