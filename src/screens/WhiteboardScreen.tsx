import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Text } from 'react-native';
import { 
  Pen, 
  Highlighter, 
  Eraser, 
  Square, 
  Undo2, 
  Redo2, 
  Plus, 
  Trash2, 
  Eye, 
  Share2 
} from 'lucide-react-native';
import { WhiteboardCanvas } from '../canvas/WhiteboardCanvas';
import { BackgroundRenderer } from '../canvas/BackgroundRenderer';
import { SubjectToolbar } from '../components/SubjectToolbar';
import { PresentationOverlays } from '../components/PresentationOverlays';
import { useWhiteboardStore } from '../state/useWhiteboardStore';
import { ProjectFileManager } from '../export/ProjectFileManager';

export const WhiteboardScreen: React.FC = () => {
  const store = useWhiteboardStore();
  const { project, activeTool, setActiveTool, undo, redo, addPage, deletePage, setActivePage } = store;
  const currentPage = project.pages[project.activePageIndex];

  useEffect(() => {
    ProjectFileManager.autosave(project);
  }, [project]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Top Subject Toolbar */}
      <SubjectToolbar />

      {/* Main Canvas Area */}
      <View style={styles.canvasContainer}>
        <BackgroundRenderer
          type={currentPage.background.type}
          color={currentPage.background.color}
          customImageUri={currentPage.background.customImageUri}
        />
        <WhiteboardCanvas />
        <PresentationOverlays />
      </View>

      {/* Primary Floating Tool Dock */}
      <View style={styles.floatingDock}>
        <TouchableOpacity
          style={[styles.dockBtn, activeTool === 'pen' && styles.dockBtnActive]}
          onPress={() => setActiveTool('pen')}
        >
          <Pen size={20} color={activeTool === 'pen' ? '#ffffff' : '#334155'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dockBtn, activeTool === 'highlighter' && styles.dockBtnActive]}
          onPress={() => setActiveTool('highlighter')}
        >
          <Highlighter size={20} color={activeTool === 'highlighter' ? '#ffffff' : '#334155'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dockBtn, activeTool === 'eraser_stroke' && styles.dockBtnActive]}
          onPress={() => setActiveTool('eraser_stroke')}
        >
          <Eraser size={20} color={activeTool === 'eraser_stroke' ? '#ffffff' : '#334155'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dockBtn, activeTool === 'shape' && styles.dockBtnActive]}
          onPress={() => setActiveTool('shape')}
        >
          <Square size={20} color={activeTool === 'shape' ? '#ffffff' : '#334155'} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.dockBtn} onPress={undo}>
          <Undo2 size={20} color="#334155" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.dockBtn} onPress={redo}>
          <Redo2 size={20} color="#334155" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.dockBtn} onPress={store.toggleSpotlight}>
          <Eye size={20} color={store.isSpotlightActive ? '#0284c7' : '#334155'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dockBtn}
          onPress={() => ProjectFileManager.exportProject(project)}
        >
          <Share2 size={20} color="#334155" />
        </TouchableOpacity>
      </View>

      {/* Bottom Page Navigation Manager */}
      <View style={styles.pageFooter}>
        <View style={styles.pagePills}>
          {project.pages.map((p, idx) => (
            <TouchableOpacity
              key={p.id}
              style={[styles.pageTab, idx === project.activePageIndex && styles.pageTabActive]}
              onPress={() => setActivePage(idx)}
            >
              <Text style={[styles.pageTabText, idx === project.activePageIndex && styles.pageTabTextActive]}>
                {idx + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.pageControls}>
          <TouchableOpacity style={styles.iconCircleBtn} onPress={addPage}>
            <Plus size={18} color="#ffffff" />
          </TouchableOpacity>
          {project.pages.length > 1 && (
            <TouchableOpacity
              style={[styles.iconCircleBtn, { backgroundColor: '#ef4444' }]}
              onPress={() => deletePage(project.activePageIndex)}
            >
              <Trash2 size={16} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  canvasContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  floatingDock: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    alignItems: 'center',
    gap: 6,
  },
  dockBtn: {
    padding: 8,
    borderRadius: 20,
  },
  dockBtnActive: {
    backgroundColor: '#1e3a8a',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 4,
  },
  pageFooter: {
    height: 48,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  pagePills: {
    flexDirection: 'row',
    gap: 6,
  },
  pageTab: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTabActive: {
    backgroundColor: '#1e3a8a',
  },
  pageTabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
  },
  pageTabTextActive: {
    color: '#ffffff',
  },
  pageControls: {
    flexDirection: 'row',
    gap: 8,
  },
  iconCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0284c7',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
