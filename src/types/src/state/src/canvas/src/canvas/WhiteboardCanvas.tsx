import React, { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useWhiteboardStore } from '../state/useWhiteboardStore';
import { Point } from '../types/whiteboard';

export const WhiteboardCanvas: React.FC = () => {
  const {
    project,
    activeColor,
    activeWidth,
    activeOpacity,
    activeTool,
    addObject,
  } = useWhiteboardStore();

  const currentPage = project.pages[project.activePageIndex];
  const [currentPathString, setCurrentPathString] = useState<string | null>(null);
  const strokePoints = useRef<Point[]>([]);

  const convertPointsToSmoothPath = (pts: Point[]): string => {
    if (pts.length === 0) return '';
    const path = Skia.Path.Make();
    path.moveTo(pts[0].x, pts[0].y);

    if (pts.length === 1) {
      path.addCircle(pts[0].x, pts[0].y, 0.5);
      return path.toSVGString();
    }

    for (let i = 1; i < pts.length - 1; i++) {
      const midX = (pts[i].x + pts[i + 1].x) / 2;
      const midY = (pts[i].y + pts[i + 1].y) / 2;
      path.quadTo(pts[i].x, pts[i].y, midX, midY);
    }

    const last = pts[pts.length - 1];
    path.lineTo(last.x, last.y);
    return path.toSVGString();
  };

  const drawGesture = Gesture.Pan()
    .minPointers(1)
    .maxPointers(1)
    .onStart((e) => {
      strokePoints.current = [{ x: e.x, y: e.y }];
      const initialPath = Skia.Path.Make();
      initialPath.moveTo(e.x, e.y);
      setCurrentPathString(initialPath.toSVGString());
    })
    .onUpdate((e) => {
      strokePoints.current.push({ x: e.x, y: e.y });
      const svgPath = convertPointsToSmoothPath(strokePoints.current);
      setCurrentPathString(svgPath);
    })
    .onEnd(() => {
      if (strokePoints.current.length > 0) {
        addObject({
          id: 'stroke_' + Date.now(),
          type: 'stroke',
          tool: activeTool,
          points: [...strokePoints.current],
          color: activeColor,
          width: activeWidth,
          opacity: activeOpacity,
          blendMode: activeTool === 'highlighter' ? 'multiply' : 'srcOver',
          layer: Date.now(),
        });
      }
      strokePoints.current = [];
      setCurrentPathString(null);
    });

  return (
    <GestureDetector gesture={drawGesture}>
      <View style={styles.container}>
        <Canvas style={styles.canvas}>
          {currentPage.objects.map((obj) => {
            if (obj.type === 'stroke') {
              const svg = convertPointsToSmoothPath(obj.points);
              const path = Skia.Path.MakeFromSVGString(svg);
              if (!path) return null;

              return (
                <Path
                  key={obj.id}
                  path={path}
                  color={obj.color}
                  style="stroke"
                  strokeWidth={obj.width}
                  strokeCap="round"
                  strokeJoin="round"
                  opacity={obj.opacity}
                />
              );
            }
            return null;
          })}

          {currentPathString && (
            <Path
              path={Skia.Path.MakeFromSVGString(currentPathString)!}
              color={activeColor}
              style="stroke"
              strokeWidth={activeWidth}
              strokeCap="round"
              strokeJoin="round"
              opacity={activeOpacity}
            />
          )}
        </Canvas>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
});
