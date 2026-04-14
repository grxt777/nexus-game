export type FileType = 'file' | 'directory';

export interface VirtualFile {
  name: string;
  type: FileType;
  content?: string;
  children?: Record<string, VirtualFile>;
  locked?: boolean;
  password?: string;
  encrypted?: boolean;
  encryptionKey?: string;
  hidden?: boolean;
  restorable?: boolean;
}

export interface GameState {
  currentPath: string[];
  history: string[];
  unlockedPaths: Set<string>;
  restoredFiles: Set<string>;
  decryptedFiles: Set<string>;
  storyAct: number;
  n17Active: boolean;
  discoveredNodes: Set<string>;
  lastCommandTime: number;
}

export interface CommandResponse {
  output: string;
  error?: boolean;
  systemMessage?: boolean;
}
