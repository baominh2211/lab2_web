// JSX type definitions for TypeScript
import { ComponentProps, VNode } from './jsx-runtime';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    
    interface ElementChildrenAttribute {
      children: {};
    }
    
    type Element = VNode;
  }
}