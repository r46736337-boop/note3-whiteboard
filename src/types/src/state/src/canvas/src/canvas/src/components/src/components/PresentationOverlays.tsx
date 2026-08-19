import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Canvas, Path, Skia, Rect } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useWhiteboardStore } from '../state/useWhiteboardStore';

export const PresentationOverlays: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const {
    isSpotlightActive,
    spotlightRadius,
    spotlightCenter,
    setSpotlightCenter,
    isCoverActive,
    coverPosition,
    setCoverPosition,
  } = useWhiteboardStore();

  const spotlightPan = Gesture.Pan().onUpdate((e) => {
    setSpotlightCenter({ x: e.x, y: e.y });
  });

  const coverPan = Gesture.Pan().onUpdate((e) => {
    setCoverPosition({ top: 0, bottom: Math.max(100, Math.min(height - 50, e.y)) });
  });

  if (!isSpotlightActive && !isCoverActive) return null;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      {isSpotlightActive && (
        <GestureDetector gesture={spotlightPan}>
          <Canvas style={StyleSheet.absoluteFillObject}>
            {(() => {
              const fullPath = Skia.Path.Make();
              fullPath.addRect({ x: 0, y: 0, width, height });
              const hole = Skia.Path.Make();
              hole.addCircle(spotlightCenter.x, spotlightCenter.y, spotlightRadius);
              fullPath.op(hole, Skia.PathOp.Difference);

              return (
                <Path
                  path={fullPath}
                  color="rgba(0, 0, 0, 0.78)"
                  style="fill"
                />
              );
            })()}
          </Canvas>
        </GestureDetector>
      )}

      {isCoverActive && (
        <GestureDetector gesture={coverPan}>
          <Canvas style={StyleSheet.absoluteFillObject}>
            <Rect
              x={0}
              y={0}
              width={width}
              height={coverPosition.bottom}
              color="rgba(15, 23, 42, 0.96)"
            />
            <Rect
              x={width / 2 - 40}
              y={coverPosition.bottom - 8}
              width={80}
              height={6}
              color="#38bdf8"
            />
          </Canvas>
        </GestureDetector>
      )}
    </View>
  );
};
