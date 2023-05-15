import ReactReconciler, { HostConfig } from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants";

export type Instance = { [key: string]: any };

export type InstanceProps = {};

const HostConfig: HostConfig<
  string,
  InstanceProps,
  void,
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
    let instance: Instance | undefined = undefined;

    switch (type) {
      case "mesh":
        instance = {
          type,
          props,
        };
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
  appendInitialChild(parentInstance, child) {},
  appendChild(parentInstance, child) {},
  removeChild(parentInstance, child) {},
  insertBefore(parentInstance, child, beforeChild) {},
  isPrimaryRenderer: false,
  supportsMutation: true,
  supportsHydration: false,
  supportsPersistence: false,
  noTimeout: -1,
  createTextInstance: handleTextInstance,
  hideTextInstance: handleTextInstance,
  unhideTextInstance: handleTextInstance,
  appendChildToContainer(container, child) {},
  removeChildFromContainer(container, child) {},
  insertInContainerBefore(container, child, beforeChild) {},
  getRootHostContext(rootContainer) {
    return null;
  },
  getChildHostContext(parentHostContext, type, rootContainer) {
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
    return null;
  },
  commitMount(instance, type, props, internalInstanceHandle) {
    console.log("commitMount", instance, type, props, internalInstanceHandle);
  },
  commitUpdate(
    instance,
    updatePayload,
    type,
    prevProps,
    nextProps,
    internalHandle
  ) {},
  getPublicInstance(instance) {
    return instance!;
  },
  prepareForCommit(containerInfo) {
    return null;
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

export const GPURenderer = ReactReconciler(HostConfig);

export const RendererPublicAPI = {
  render(element: React.ReactElement, container: any, callback?: () => void) {
    return GPURenderer.getPublicRootInstance(null);
  },
};

function handleTextInstance() {
  console.warn("Text is not supported in React WebGPU");
}
