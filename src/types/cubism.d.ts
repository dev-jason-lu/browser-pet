declare module 'cubism-sdk' {
  export class CubismModel {
    constructor(buffer: ArrayBuffer);
    destroy(): void;
    getDrawableCount(): number;
    setParameterValueById(id: string, value: number): void;
    update(): void;
  }
  
  export class WebGLRenderer {
    constructor(canvas: HTMLCanvasElement);
    setModel(model: CubismModel): void;
    render(): void;
  }
  
  export function initialize(): Promise<void>;
  export function loadModel(setting: any): Promise<CubismModel>;
}