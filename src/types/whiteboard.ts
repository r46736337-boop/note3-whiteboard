export type SubjectMode = 'general' | 'english' | 'math' | 'physics' | 'chemistry';

export type ToolType = 
  | 'pen' 
  | 'hardPen' 
  | 'softPen' 
  | 'marker' 
  | 'highlighter' 
  | 'pencil'
  | 'eraser_stroke' 
  | 'eraser_object' 
  | 'shape' 
  | 'text' 
  | 'select'
  | 'spotlight' 
  | 'cover' 
  | 'magnifier' 
  | 'ruler' 
  | 'protractor';

export type ShapeKind = 'line' | 'arrow' | 'rect' | 'circle' | 'triangle' | 'polygon';

export interface Point {
  x: number;
  y: number;
  pressure?: number;
}

export interface StrokeObject {
  id: string;
  type: 'stroke';
  tool: ToolType;
  points: Point[];
  color: string;
  width: number;
  opacity: number;
  blendMode: 'srcOver' | 'multiply';
  layer: number;
}

export interface ShapeObject {
  id: string;
  type: 'shape';
  shapeKind: ShapeKind;
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  fillColor?: string;
  strokeWidth: number;
  rotation: number;
  layer: number;
}

export interface TextObject {
  id: string;
  type: 'text';
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  layer: number;
}

export interface ImageObject {
  id: string;
  type: 'image';
  uri: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  layer: number;
}

export type WhiteboardObject = StrokeObject | ShapeObject | TextObject | ImageObject;

export type BackgroundType = 
  | 'plain_white' 
  | 'plain_black' 
  | 'grid' 
  | 'dots' 
  | 'lines' 
  | 'four_line' 
  | 'graph_paper' 
  | 'custom_image';

export interface WhiteboardPage {
  id: string;
  title: string;
  background: {
    type: BackgroundType;
    color: string;
    customImageUri?: string;
  };
  objects: WhiteboardObject[];
}

export interface WhiteboardProject {
  version: '1.0.0';
  id: string;
  title: string;
  subjectMode: SubjectMode;
  pages: WhiteboardPage[];
  activePageIndex: number;
  }
