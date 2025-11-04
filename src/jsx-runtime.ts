// Type definitions for our JSX runtime

// VNode represents a virtual DOM node
export interface VNode {
  type: string | ComponentFunction;
  props: Record<string, any>;
  children: (VNode | string | number)[];
}

// ComponentProps allows components to receive children and other props
// Children can be a single item or an array
export interface ComponentProps {
  children?: VNode | string | number | (VNode | string | number)[];
  [key: string]: any;
}

// ComponentFunction is a function that takes props and returns a VNode
export type ComponentFunction = (props: ComponentProps) => VNode;

// State management for our simple useState hook
let currentComponent: ComponentInstance | null = null;
let currentHookIndex = 0;

interface ComponentInstance {
  hooks: any[];
  vnode: VNode;
  container: HTMLElement | null;
  render: () => void;
}

// Helper to normalize children to array
function normalizeChildren(children: VNode | string | number | (VNode | string | number)[] | undefined): (VNode | string | number)[] {
  if (children === undefined) return [];
  if (Array.isArray(children)) return children;
  return [children];
}

/**
 * createElement - The heart of JSX
 * This function is called for every JSX element like <div>Hello</div>
 */
export function createElement(
  type: string | ComponentFunction,
  props: Record<string, any> | null,
  ...children: (VNode | string | number | boolean | null | undefined)[]
): VNode {
  // Handle props (use empty object if null)
  const finalProps = props || {};
  
  // Flatten and filter children (remove null/undefined/false/true)
  const flatChildren = children
    .flat(Infinity)
    .filter(child => {
      // Remove falsy values except 0
      if (child === null || child === undefined || child === false || child === true) {
        return false;
      }
      return true;
    }) as (VNode | string | number)[];
  
  // Return VNode object
  return {
    type,
    props: finalProps,
    children: flatChildren
  };
}

/**
 * createFragment - Allows grouping elements without extra wrapper
 * Fragments allow grouping elements without adding an extra DOM node
 */
export function createFragment(
  props: Record<string, any> | null,
  ...children: (VNode | string | number | boolean | null | undefined)[]
): VNode {
  return createElement('fragment', props, ...children);
}

/**
 * renderToDOM - Converts VNode objects to actual DOM elements
 */
export function renderToDOM(vnode: VNode | string | number): Node {
  // STEP 1: Handle text nodes (strings and numbers)
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }
  
  // STEP 2: Handle fragments
  if (vnode.type === 'fragment') {
    const fragment = document.createDocumentFragment();
    vnode.children.forEach(child => {
      fragment.appendChild(renderToDOM(child));
    });
    return fragment;
  }
  
  // STEP 3: Handle component functions
  if (typeof vnode.type === 'function') {
    // Set up component instance for hooks
    const componentInstance: ComponentInstance = {
      hooks: [],
      vnode,
      container: null,
      render: () => {}
    };
    
    currentComponent = componentInstance;
    currentHookIndex = 0;
    
    // Call the function with props and children
    const props = { ...vnode.props, children: vnode.children.length === 1 ? vnode.children[0] : vnode.children };
    const componentFunction = vnode.type as ComponentFunction;
    const resultVNode = componentFunction(props);
    
    // Render the result
    const dom = renderToDOM(resultVNode);
    
    // Store render function for re-renders
    componentInstance.render = () => {
      if (componentInstance.container) {
        currentComponent = componentInstance;
        currentHookIndex = 0;
        const newVNode = componentFunction(props);
        const newDom = renderToDOM(newVNode);
        componentInstance.container.innerHTML = '';
        componentInstance.container.appendChild(newDom);
        currentComponent = null;
      }
    };
    
    currentComponent = null;
    return dom;
  }
  
  // STEP 4: Handle regular HTML elements
  const element = document.createElement(vnode.type as string);
  
  // Set attributes and properties
  Object.keys(vnode.props).forEach(key => {
    const value = vnode.props[key];
    
    // Handle event listeners (onClick, onInput, etc.)
    if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.substring(2).toLowerCase();
      element.addEventListener(eventName, value);
    }
    // Handle className
    else if (key === 'className') {
      element.className = value;
    }
    // Handle style object
    else if (key === 'style' && typeof value === 'object') {
      Object.keys(value).forEach(styleKey => {
        (element.style as any)[styleKey] = value[styleKey];
      });
    }
    // Handle ref callback
    else if (key === 'ref' && typeof value === 'function') {
      value(element);
    }
    // Handle boolean attributes
    else if (typeof value === 'boolean') {
      if (value) {
        element.setAttribute(key, '');
      }
    }
    // Handle regular attributes
    else if (key !== 'children' && value !== undefined && value !== null) {
      element.setAttribute(key, String(value));
    }
  });
  
  // Append children
  vnode.children.forEach(child => {
    element.appendChild(renderToDOM(child));
  });
  
  return element;
}

/**
 * mount - Attaches a VNode to a real DOM container
 */
export function mount(vnode: VNode, container: HTMLElement): void {
  // Clear container
  container.innerHTML = '';
  
  // Convert VNode to DOM and append to container
  const dom = renderToDOM(vnode);
  container.appendChild(dom);
  
  // Store container reference for re-renders
  if (currentComponent) {
    currentComponent.container = container;
  }
}

/**
 * useState - Simple state management hook
 * This is a minimal version of React's useState
 */
export function useState<T>(initialValue: T): [() => T, (newValue: T | ((prev: T) => T)) => void] {
  // Get current component and hook index
  if (!currentComponent) {
    throw new Error('useState must be called within a component');
  }
  
  const component = currentComponent;
  const hookIndex = currentHookIndex++;
  
  // Initialize hook if it doesn't exist
  if (component.hooks[hookIndex] === undefined) {
    component.hooks[hookIndex] = initialValue;
  }
  
  // Getter function
  const getValue = (): T => {
    return component.hooks[hookIndex];
  };
  
  // Setter function
  const setValue = (newValue: T | ((prev: T) => T)): void => {
    const value = typeof newValue === 'function' 
      ? (newValue as (prev: T) => T)(component.hooks[hookIndex])
      : newValue;
    
    component.hooks[hookIndex] = value;
    
    // Trigger re-render
    component.render();
  };
  
  return [getValue, setValue];
}