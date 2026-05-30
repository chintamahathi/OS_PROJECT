/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NodeType = 'file' | 'folder';

export interface Permissions {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export interface FileNode {
  id: string;
  name: string;
  type: NodeType;
  parentId: string | null;
  size: number; // Size in blocks
  extension?: string;
  content?: string;
  createdAt: number;
  permissions: Permissions;
  startBlock?: number;
}

export interface DiskBlock {
  id: number;
  isOccupied: boolean;
  fileId: string | null;
}

export interface FileSystemState {
  nodes: Record<string, FileNode>;
  rootId: string;
  diskBlocks: DiskBlock[];
  totalBlocks: number;
}
