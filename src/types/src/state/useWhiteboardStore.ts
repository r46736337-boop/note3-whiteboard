import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { 
  SubjectMode, 
  ToolType, 
  ShapeKind, 
  WhiteboardObject, 
  WhiteboardPage, 
  WhiteboardProject,
  BackgroundType 
} from '../types/whiteboard';

interface HistoryCommand {
  undo: (state: WhiteboardState) => void;
  redo: (state: WhiteboardState) => void;
}

interface WhiteboardState {
  project: WhiteboardProject;
  activeTool: ToolType;
  activeColor: string;
  activeWidth: number;
  activeOpacity: number;
  activeShapeKind: ShapeKind;
  selectedObjectId: string | null;
  
  undoStack: HistoryCommand[];
  redoStack: HistoryCommand[];
  
  isSpotlightActive: boolean;
  spotlightRadius: number;
  spotlightCenter: { x: number; y: number };
  isCoverActive: boolean;
  coverPosition: { top: number; bottom: number };
  isMagnifierActive: boolean;
  magnifierCenter: { x: number; y: number };

  setSubjectMode: (mode: SubjectMode) => void;
  setActiveTool: (tool: ToolType) => void;
  setActiveColor: (color: string) => void;
  setActiveWidth: (width: number) => void;
  setActiveShapeKind: (kind: ShapeKind) => void;
  setSelectedObjectId: (id: string | null) => void;
  
  addObject: (obj: WhiteboardObject) => void;
  updateObject: (id: string, partial: Partial<WhiteboardObject>) => void;
  deleteObject: (id: string) => void;
  clearCurrentPage: () => void;
  
  addPage: () => void;
  deletePage: (index: number) => void;
  duplicatePage: (index: number) => void;
  setActivePage: (index: number) => void;
  setPageBackground: (type: BackgroundType, color: string, customImageUri?: string) => void;
  
  undo: () => void;
  redo: () => void;
  
  toggleSpotlight: () => void;
  setSpotlightCenter: (pos: { x: number; y: number }) => void;
  toggleCover: () => void;
  setCoverPosition: (pos: { top: number; bottom: number }) => void;
  toggleMagnifier: () => void;
  setMagnifierCenter: (pos: { x: number; y: number }) => void;
}

const createDefaultPage = (id: string, title: string): WhiteboardPage => ({
  id,
  title,
  background: {
    type: 'plain_white',
    color: '#FFFFFF',
  },
  objects: [],
});

export const useWhiteboardStore = create<WhiteboardState>()(
  immer((set, get) => ({
    project: {
      version: '1.0.0',
      id: 'proj_' + Date.now(),
      title: 'New Note3 Board',
      subjectMode: 'general',
      pages: [createDefaultPage('page_1', 'Page 1')],
      activePageIndex: 0,
    },
    activeTool: 'pen',
    activeColor: '#0f172a',
    activeWidth: 4,
    activeOpacity: 1.0,
    activeShapeKind: 'rect',
    selectedObjectId: null,
    
    undoStack: [],
    redoStack: [],
    
    isSpotlightActive: false,
    spotlightRadius: 100,
    spotlightCenter: { x: 200, y: 300 },
    isCoverActive: false,
    coverPosition: { top: 0, bottom: 200 },
    isMagnifierActive: false,
    magnifierCenter: { x: 200, y: 300 },

    setSubjectMode: (mode) =>
      set((state) => {
        state.project.subjectMode = mode;
      }),

    setActiveTool: (tool) =>
      set((state) => {
        state.activeTool = tool;
        if (tool === 'highlighter') {
          state.activeOpacity = 0.35;
          state.activeWidth = 24;
        } else if (tool === 'pencil') {
          state.activeOpacity = 0.7;
          state.activeWidth = 2;
        } else if (tool === 'marker') {
          state.activeOpacity = 1.0;
          state.activeWidth = 10;
        } else if (tool === 'pen' || tool === 'hardPen' || tool === 'softPen') {
          state.activeOpacity = 1.0;
          state.activeWidth = 4;
        }
      }),

    setActiveColor: (color) =>
      set((state) => {
        state.activeColor = color;
      }),

    setActiveWidth: (width) =>
      set((state) => {
        state.activeWidth = width;
      }),

    setActiveShapeKind: (kind) =>
      set((state) => {
        state.activeShapeKind = kind;
        state.activeTool = 'shape';
      }),

    setSelectedObjectId: (id) =>
      set((state) => {
        state.selectedObjectId = id;
      }),

    addObject: (obj) => {
      const activeIdx = get().project.activePageIndex;
      const targetObj = { ...obj };

      set((state) => {
        state.project.pages[activeIdx].objects.push(targetObj);
        state.redoStack = [];
      });

      const cmd: HistoryCommand = {
        undo: (s) => {
          const p = s.project.pages[activeIdx];
          p.objects = p.objects.filter((o) => o.id !== targetObj.id);
        },
        redo: (s) => {
          s.project.pages[activeIdx].objects.push(targetObj);
        },
      };

      set((state) => {
        state.undoStack.push(cmd);
      });
    },

    updateObject: (id, partial) => {
      const activeIdx = get().project.activePageIndex;
      const prevObj = get().project.pages[activeIdx].objects.find((o) => o.id === id);
      if (!prevObj) return;

      const oldSnapshot = { ...prevObj };

      set((state) => {
        const obj = state.project.pages[activeIdx].objects.find((o) => o.id === id);
        if (obj) {
          Object.assign(obj, partial);
        }
      });

      const cmd: HistoryCommand = {
        undo: (s) => {
          const obj = s.project.pages[activeIdx].objects.find((o) => o.id === id);
          if (obj) Object.assign(obj, oldSnapshot);
        },
        redo: (s) => {
          const obj = s.project.pages[activeIdx].objects.find((o) => o.id === id);
          if (obj) Object.assign(obj, partial);
        },
      };

      set((state) => {
        state.undoStack.push(cmd);
        state.redoStack = [];
      });
    },

    deleteObject: (id) => {
      const activeIdx = get().project.activePageIndex;
      const prevObj = get().project.pages[activeIdx].objects.find((o) => o.id === id);
      if (!prevObj) return;

      const oldSnapshot = { ...prevObj };

      set((state) => {
        state.project.pages[activeIdx].objects = state.project.pages[activeIdx].objects.filter((o) => o.id !== id);
        if (state.selectedObjectId === id) state.selectedObjectId = null;
      });

      const cmd: HistoryCommand = {
        undo: (s) => {
          s.project.pages[activeIdx].objects.push(oldSnapshot);
        },
        redo: (s) => {
          s.project.pages[activeIdx].objects = s.project.pages[activeIdx].objects.filter((o) => o.id !== id);
        },
      };

      set((state) => {
        state.undoStack.push(cmd);
        state.redoStack = [];
      });
    },

    clearCurrentPage: () => {
      const activeIdx = get().project.activePageIndex;
      const oldObjects = [...get().project.pages[activeIdx].objects];
      if (oldObjects.length === 0) return;

      set((state) => {
        state.project.pages[activeIdx].objects = [];
        state.selectedObjectId = null;
      });

      const cmd: HistoryCommand = {
        undo: (s) => {
          s.project.pages[activeIdx].objects = [...oldObjects];
        },
        redo: (s) => {
          s.project.pages[activeIdx].objects = [];
        },
      };

      set((state) => {
        state.undoStack.push(cmd);
        state.redoStack = [];
      });
    },

    addPage: () =>
      set((state) => {
        const newCount = state.project.pages.length + 1;
        const newPage = createDefaultPage('page_' + Date.now(), `Page ${newCount}`);
        state.project.pages.push(newPage);
        state.project.activePageIndex = state.project.pages.length - 1;
      }),

    deletePage: (index) =>
      set((state) => {
        if (state.project.pages.length <= 1) return;
        state.project.pages.splice(index, 1);
        if (state.project.activePageIndex >= state.project.pages.length) {
          state.project.activePageIndex = state.project.pages.length - 1;
        }
      }),

    duplicatePage: (index) =>
      set((state) => {
        const source = state.project.pages[index];
        const cloned: WhiteboardPage = {
          ...source,
          id: 'page_' + Date.now(),
          title: `${source.title} (Copy)`,
          objects: JSON.parse(JSON.stringify(source.objects)),
        };
        state.project.pages.splice(index + 1, 0, cloned);
        state.project.activePageIndex = index + 1;
      }),

    setActivePage: (index) =>
      set((state) => {
        if (index >= 0 && index < state.project.pages.length) {
          state.project.activePageIndex = index;
          state.selectedObjectId = null;
        }
      }),

    setPageBackground: (type, color, customImageUri) =>
      set((state) => {
        const activeIdx = state.project.activePageIndex;
        state.project.pages[activeIdx].background = {
          type,
          color,
          customImageUri,
        };
      }),

    undo: () => {
      const lastCmd = get().undoStack[get().undoStack.length - 1];
      if (!lastCmd) return;

      set((state) => {
        state.undoStack.pop();
        lastCmd.undo(state);
        state.redoStack.push(lastCmd);
      });
    },

    redo: () => {
      const nextCmd = get().redoStack[get().redoStack.length - 1];
      if (!nextCmd) return;

      set((state) => {
        state.redoStack.pop();
        nextCmd.redo(state);
        state.undoStack.push(nextCmd);
      });
    },

    toggleSpotlight: () => set((state) => { state.isSpotlightActive = !state.isSpotlightActive; }),
    setSpotlightCenter: (pos) => set((state) => { state.spotlightCenter = pos; }),
    toggleCover: () => set((state) => { state.isCoverActive = !state.isCoverActive; }),
    setCoverPosition: (pos) => set((state) => { state.coverPosition = pos; }),
    toggleMagnifier: () => set((state) => { state.isMagnifierActive = !state.isMagnifierActive; }),
    setMagnifierCenter: (pos) => set((state) => { state.magnifierCenter = pos; }),
  }))
);
          
