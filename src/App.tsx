/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { FileBrowser } from './components/FileBrowser';
import { DiskVisualizer } from './components/DiskVisualizer';
import { PermissionsModal } from './components/PermissionsModal';
import { UsageStats } from './components/UsageStats';
import { FileNode, DiskBlock, Permissions } from './types';
import { motion, AnimatePresence } from 'motion/react';

const TOTAL_BLOCKS = 1024;

export default function App() {
  const [nodes, setNodes] = useState<Record<string, FileNode>>({
    'root': {
      id: 'root',
      name: 'System Root',
      type: 'folder',
      parentId: null,
      size: 0,
      createdAt: Date.now(),
      permissions: { read: true, write: true, execute: true }
    }
  });

  const [diskBlocks, setDiskBlocks] = useState<DiskBlock[]>(
    Array.from({ length: TOTAL_BLOCKS }, (_, i) => ({
      id: i,
      isOccupied: false,
      fileId: null
    }))
  );

  const [currentFolderId, setCurrentFolderId] = useState('root');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalId, setActiveModalId] = useState<string | null>(null);

  // Sequential Allocation Finder
  const findSequentialBlocks = (size: number): number | null => {
    let count = 0;
    let startFound = null;

    for (let i = 0; i < TOTAL_BLOCKS; i++) {
      if (!diskBlocks[i].isOccupied) {
        if (count === 0) startFound = i;
        count++;
        if (count === size) return startFound;
      } else {
        count = 0;
        startFound = null;
      }
    }
    return null;
  };

  const handleCreateNode = (type: 'file' | 'folder') => {
    const name = prompt(`Enter ${type} name:`);
    if (!name) return;

    const size = type === 'file' ? Math.floor(Math.random() * 20) + 5 : 0;
    let startBlock: number | undefined;

    if (type === 'file') {
      const start = findSequentialBlocks(size);
      if (start === null) {
        alert("Error: Insufficient contiguous disk space (External Fragmentation)");
        return;
      }
      startBlock = start;
    }

    const newNode: FileNode = {
      id: Math.random().toString(36).substr(2, 9),
      name: type === 'file' && !name.includes('.') ? `${name}.txt` : name,
      type,
      parentId: currentFolderId,
      size,
      createdAt: Date.now(),
      permissions: { read: true, write: true, execute: false },
      startBlock
    };

    setNodes(prev => ({ ...prev, [newNode.id]: newNode }));

    if (type === 'file' && startBlock !== undefined) {
      setDiskBlocks(prev => {
        const next = [...prev];
        for (let i = startBlock as number; i < (startBlock as number) + size; i++) {
          next[i] = { ...next[i], isOccupied: true, fileId: newNode.id };
        }
        return next;
      });
    }
  };

  const handleDeleteNode = (id: string) => {
    const node = nodes[id];
    if (id === 'root') return;

    // Recursive delete for folders
    const idsToDelete = [id];
    if (node.type === 'folder') {
      (Object.values(nodes) as FileNode[]).forEach(n => {
        if (n.parentId === id) idsToDelete.push(n.id);
      });
    }

    setNodes(prev => {
      const next = { ...prev };
      idsToDelete.forEach(toId => delete next[toId]);
      return next;
    });

    setDiskBlocks(prev => prev.map(block => 
      idsToDelete.includes(block.fileId || '') ? { ...block, isOccupied: false, fileId: null } : block
    ));
  };

  const handleUpdatePermissions = (id: string, perms: Permissions) => {
    setNodes(prev => ({
      ...prev,
      [id]: { ...prev[id], permissions: perms }
    }));
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-100 font-sans overflow-hidden">
      <Sidebar 
        nodes={nodes} 
        currentFolderId={currentFolderId} 
        onNavigate={(id) => {
          setCurrentFolderId(id);
        }}
        onCreate={handleCreateNode}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur shrink-0">
          <div className="flex-1 max-w-md relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">🔍</span>
            <input 
              type="text" 
              placeholder="Search files by name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-1.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-300"
            />
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleCreateNode('file')}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-md font-medium transition-colors"
            >
              + New File
            </button>
            <button 
              onClick={() => handleCreateNode('folder')}
              className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs px-4 py-2 rounded-md font-medium transition-colors"
            >
              + New Folder
            </button>
          </div>
        </header>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-12 grid-rows-6 gap-4 p-6 flex-1 overflow-hidden">
          
          {/* File Explorer (Primary) */}
          <div className="col-span-8 row-span-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col overflow-hidden">
            <FileBrowser 
              nodes={nodes}
              currentFolderId={currentFolderId}
              searchQuery={searchQuery}
              onSearch={setSearchQuery}
              onNavigate={setCurrentFolderId}
              onAction={(action, id) => {
                if (action === 'delete') handleDeleteNode(id);
                if (action === 'permissions') setActiveModalId(id);
              }}
            />
          </div>

          {/* Sequential Allocation Map (Visual) */}
          <div className="col-span-4 row-span-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col overflow-hidden">
            <DiskVisualizer 
              blocks={diskBlocks}
              nodes={nodes}
              onBlockClick={(id) => setActiveModalId(id)}
            />
          </div>

          {/* Storage Stats Box 1 */}
          <div className="col-span-6 row-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 overflow-hidden">
            <UsageStats nodes={nodes} totalBlocks={TOTAL_BLOCKS} />
          </div>

          {/* Feature Highlight Box / Total Count Card */}
          <div className="col-span-6 row-span-2 bg-blue-600 border border-blue-500 rounded-2xl p-6 flex items-center justify-between overflow-hidden relative shadow-2xl shadow-blue-900/20">
            <div className="relative z-10">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-100">Total File Count</h2>
              <div className="text-5xl font-black mt-2 tracking-tighter">
                {(Object.values(nodes) as FileNode[]).filter(n => n.type === 'file').length}
              </div>
              <p className="text-xs text-blue-200 mt-1 opacity-80">Simulation Active: Sequential Mode</p>
            </div>
            <div className="absolute -right-4 top-0 h-full w-1/3 opacity-20 transform skew-x-12 bg-white"></div>
            <div className="w-24 h-24 rounded-full border-8 border-blue-400 opacity-20 absolute -bottom-8 -right-8"></div>
          </div>

        </div>
      </main>

      {activeModalId && nodes[activeModalId] && (
        <PermissionsModal 
          node={nodes[activeModalId]}
          onUpdate={handleUpdatePermissions}
          onClose={() => setActiveModalId(null)}
        />
      )}
    </div>
  );
}

