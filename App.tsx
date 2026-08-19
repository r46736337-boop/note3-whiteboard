import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WhiteboardScreen } from './src/screens/WhiteboardScreen';
import { ProjectFileManager } from './src/export/ProjectFileManager';
import { useWhiteboardStore } from './src/state/useWhiteboardStore';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Attempt crash-recovery autosave restore on boot
    ProjectFileManager.loadAutosave().then((savedProject) => {
      if (savedProject) {
        useWhiteboardStore.setState({ project: savedProject });
      }
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <WhiteboardScreen />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e293b',
  },
});
