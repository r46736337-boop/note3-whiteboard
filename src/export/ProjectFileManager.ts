import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { WhiteboardProject } from '../types/whiteboard';

const AUTOSAVE_FILE = `${FileSystem.documentDirectory}note3_autosave.json`;

export class ProjectFileManager {
  static async autosave(project: WhiteboardProject): Promise<void> {
    try {
      const data = JSON.stringify(project);
      await FileSystem.writeAsStringAsync(AUTOSAVE_FILE, data, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    } catch (e) {
      console.error('Autosave error:', e);
    }
  }

  static async loadAutosave(): Promise<WhiteboardProject | null> {
    try {
      const info = await FileSystem.getInfoAsync(AUTOSAVE_FILE);
      if (!info.exists) return null;
      const data = await FileSystem.readAsStringAsync(AUTOSAVE_FILE);
      return JSON.parse(data) as WhiteboardProject;
    } catch (e) {
      console.error('Recovery load error:', e);
      return null;
    }
  }

  static async exportProject(project: WhiteboardProject): Promise<void> {
    const filename = `${project.title.replace(/\s+/g, '_')}_${Date.now()}.note3project`;
    const targetUri = `${FileSystem.documentDirectory}${filename}`;

    await FileSystem.writeAsStringAsync(targetUri, JSON.stringify(project, null, 2));

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(targetUri, {
        mimeType: 'application/json',
        dialogTitle: 'Export Note3 Whiteboard Project',
        UTI: 'public.json',
      });
    }
  }
}
