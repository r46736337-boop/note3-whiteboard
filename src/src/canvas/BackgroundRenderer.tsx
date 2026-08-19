import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Canvas, Path, Skia, Image, useImage } from '@shopify/react-native-skia';
import { BackgroundType } from '../types/whiteboard';

interface BackgroundProps {
  type: BackgroundType;
  color: string;
  customImageUri?: string;
}

export const BackgroundRenderer: React.FC<BackgroundProps> = ({ type, color, customImageUri }) => {
  const { width, height } = useWindowDimensions();
  const bgImage = useImage(customImageUri || '');

  const renderPattern = () => {
    const path = Skia.Path.Make();

    if (type === 'grid' || type === 'graph_paper') {
      const step = type === 'graph_paper' ? 20 : 40;
      for (let x = 0; x < width; x += step) {
        path.moveTo(x, 0);
        path.lineTo(x, height);
      }
      for (let y = 0; y < height; y += step) {
        path.moveTo(0, y);
        path.lineTo(width, y);
      }
      return (
        <Path
          path={path}
          color={type === 'graph_paper' ? '#cbd5e1' : '#e2e8f0'}
          style="stroke"
          strokeWidth={type === 'graph_paper' ? 0.75 : 1}
        />
      );
    }

    if (type === 'four_line') {
      const groupHeight = 80;
      const lineGap = 16;
      for (let y = 60; y < height; y += groupHeight) {
        path.moveTo(0, y);
        path.lineTo(width, y);
        path.moveTo(0, y + lineGap);
        path.lineTo(width, y + lineGap);
        path.moveTo(0, y + lineGap * 2);
        path.lineTo(width, y + lineGap * 2);
        path.moveTo(0, y + lineGap * 3);
        path.lineTo(width, y + lineGap * 3);
      }
      return (
        <Path
          path={path}
          color="#f87171"
          style="stroke"
          strokeWidth={1.2}
        />
      );
    }

    if (type === 'lines') {
      const lineGap = 32;
      for (let y = lineGap; y < height; y += lineGap) {
        path.moveTo(0, y);
        path.lineTo(width, y);
      }
      return (
        <Path
          path={path}
          color="#94a3b8"
          style="stroke"
          strokeWidth={1}
        />
      );
    }

    if (type === 'dots') {
      const dotSpacing = 30;
      for (let x = dotSpacing; x < width; x += dotSpacing) {
        for (let y = dotSpacing; y < height; y += dotSpacing) {
          path.addCircle(x, y, 1.5);
        }
      }
      return (
        <Path
          path={path}
          color="#64748b"
          style="fill"
        />
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <Canvas style={styles.canvas}>
        {type === 'custom_image' && bgImage && (
          <Image
            image={bgImage}
            fit="cover"
            x={0}
            y={0}
            width={width}
            height={height}
          />
        )}
        {renderPattern()}
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  canvas: {
    flex: 1,
  },
});
