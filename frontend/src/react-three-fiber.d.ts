// Type declarations for React Three Fiber
// This file extends JSX to include Three.js elements

import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.Ref<any>;
        position?: [number, number, number] | [number, number] | number;
        rotation?: [number, number, number] | [number, number] | number;
        scale?: [number, number, number] | [number, number] | number;
      };
      group: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.Ref<any>;
        position?: [number, number, number] | [number, number] | number;
      };
      sphereGeometry: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        args?: any[];
      };
      meshStandardMaterial: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        color?: string;
        emissive?: string;
        emissiveIntensity?: number;
        transparent?: boolean;
        opacity?: number;
      };
      ambientLight: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        intensity?: number;
        color?: string;
      };
      pointLight: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        position?: [number, number, number] | [number, number] | number;
        intensity?: number;
        color?: string;
      };
      canvas: React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement> & {
        camera?: any;
        gl?: any;
        dpr?: number | [number, number];
      };
    }
  }
}

export {};
