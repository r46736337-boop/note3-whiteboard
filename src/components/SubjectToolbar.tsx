import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { 
  Compass, 
  PenTool, 
  Atom, 
  FlaskConical 
} from 'lucide-react-native';
import { useWhiteboardStore } from '../state/useWhiteboardStore';
import { SubjectMode } from '../types/whiteboard';

export const SubjectToolbar: React.FC = () => {
  const { project, setSubjectMode, setActiveTool, setPageBackground } = useWhiteboardStore();
  const currentMode = project.subjectMode;

  const handleSubjectChange = (mode: SubjectMode) => {
    setSubjectMode(mode);
    if (mode === 'english') {
      setPageBackground('four_line', '#fdfbf7');
    } else if (mode === 'math') {
      setPageBackground('graph_paper', '#ffffff');
    } else {
      setPageBackground('plain_white', '#ffffff');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Subject Mode Selector */}
        <View style={styles.pillGroup}>
          {(['general', 'english', 'math', 'physics', 'chemistry'] as SubjectMode[]).map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[styles.modeButton, currentMode === mode && styles.modeButtonActive]}
              onPress={() => handleSubjectChange(mode)}
            >
              <Text style={[styles.modeText, currentMode === mode && styles.modeTextActive]}>
                {mode.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dynamic Subject Quick Tools */}
        {currentMode === 'math' && (
          <View style={styles.toolSection}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => setActiveTool('ruler')}>
              <PenTool size={18} color="#0284c7" />
              <Text style={styles.btnText}>Ruler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => setActiveTool('protractor')}>
              <Compass size={18} color="#0284c7" />
              <Text style={styles.btnText}>Protractor</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentMode === 'chemistry' && (
          <View style={styles.toolSection}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => setActiveTool('shape')}>
              <FlaskConical size={18} color="#059669" />
              <Text style={styles.btnText}>Hexagon Ring</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentMode === 'physics' && (
          <View style={styles.toolSection}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => setActiveTool('shape')}>
              <Atom size={18} color="#7c3aed" />
              <Text style={styles.btnText}>Circuit & Vectors</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  scroll: {
    alignItems: 'center',
  },
  pillGroup: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 3,
    marginRight: 12,
  },
  modeButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  modeButtonActive: {
    backgroundColor: '#1e3a8a',
  },
  modeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  modeTextActive: {
    color: '#ffffff',
  },
  toolSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    gap: 4,
  },
  btnText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#334155',
  },
});
