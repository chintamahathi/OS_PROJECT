import React from 'react';
import { FileNode } from '../types';
import { cn } from '../lib/utils';
import { Folder, File, Shield, Trash2, Edit3, MoreVertical, Search, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  currentFolderId: string;
  nodes: Record<string, FileNode>;
  searchQuery: string;
  onNavigate: (id: string) => void;
  onAction: (action: 'delete' | 'rename' | 'permissions', id: string) => void;
  onSearch: (q: string) => void;
}

export const FileBrowser: React.FC<Props> = ({ 
  currentFolderId, 
  nodes, 
  searchQuery, 
  onNavigate, 
  onAction,
  onSearch 
}) => {
  const currentFolder = nodes[currentFolderId];
  const children = (Object.values(nodes) as FileNode[]).filter(n => 
    searchQuery 
      ? n.name.toLowerCase().includes(searchQuery.toLowerCase()) && n.type === 'file'
      : n.parentId === currentFolderId
  );

  const getBreadcrumbs = () => {
    const list: FileNode[] = [];
    let current: FileNode | undefined = nodes[currentFolderId];
    while (current) {
      list.unshift(current);
      current = current.parentId ? nodes[current.parentId] : undefined;
    }
    return list;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          File Explorer 
          <span className="text-zinc-500 font-normal text-sm">
            /{getBreadcrumbs().map(c => c.name).join('/')}
          </span>
        </h2>
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-zinc-800 rounded text-[10px] uppercase font-bold text-zinc-500 tracking-tight">
            Sequential Allocation Active
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-zinc-500 border-b border-zinc-800 uppercase text-[10px] font-bold tracking-wider">
            <tr>
              <th className="pb-3 px-2">Name</th>
              <th className="pb-3 px-2">Type</th>
              <th className="pb-3 px-2 text-right">Size (Blocks)</th>
              <th className="pb-3 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-zinc-300">
            <AnimatePresence mode="popLayout">
              {children.map((node) => (
                <motion.tr
                  key={node.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onDoubleClick={() => node.type === 'folder' && onNavigate(node.id)}
                  className="hover:bg-zinc-800/30 transition-colors group cursor-pointer border-b border-zinc-800/50"
                >
                  <td className="py-3 px-2 flex items-center gap-2">
                    <span className={cn(
                      "text-lg",
                      node.type === 'folder' ? "text-blue-400" : "text-zinc-400"
                    )}>
                      {node.type === 'folder' ? <Folder className="w-4 h-4" /> : <File className="w-4 h-4" />}
                    </span>
                    <span className="font-medium">{node.name}</span>
                  </td>
                  <td className="py-3 px-2 text-zinc-500 font-mono text-xs">
                    {node.type === 'folder' ? 'DIRECTORY' : node.name.split('.').pop()?.toUpperCase() || 'FILE'}
                  </td>
                  <td className="py-3 px-2 text-right font-mono text-xs text-zinc-400">
                    {node.type === 'folder' ? '-' : node.size}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onAction('permissions', node.id); }}
                        className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-500 hover:text-blue-400"
                      >
                        <Shield className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onAction('delete', node.id); }}
                        className="p-1.5 hover:bg-red-500/10 rounded-md text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};
