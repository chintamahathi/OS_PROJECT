import React from 'react';
import { FileNode } from '../types';
import { cn } from '../lib/utils';
import { Folder, HardDrive, Trash2, PieChart, Info, Settings, Plus, FolderPlus, FilePlus } from 'lucide-react';

interface Props {
  nodes: Record<string, FileNode>;
  currentFolderId: string;
  onNavigate: (id: string) => void;
  onCreate: (type: 'file' | 'folder') => void;
}

export const Sidebar: React.FC<Props> = ({ nodes, currentFolderId, onNavigate, onCreate }) => {
  const rootNode = (Object.values(nodes) as FileNode[]).find(n => n.parentId === null);
  
  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/20">V</div>
          <h1 className="text-sm font-bold tracking-tight uppercase text-zinc-100">VFMS v1.0</h1>
        </div>
        
        <nav className="space-y-6">
          <section>
            <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3 font-bold">Navigation</h3>
            <ul className="space-y-1">
              {rootNode && (
                <NavItem 
                  icon={<Folder className="w-4 h-4" />} 
                  label={rootNode.name} 
                  active={currentFolderId === rootNode.id}
                  onClick={() => onNavigate(rootNode.id)}
                />
              )}
              <NavItem icon={<Trash2 className="w-4 h-4" />} label="Recycle Bin" onClick={() => {}} />
              <NavItem icon={<PieChart className="w-4 h-4" />} label="Usage Stats" onClick={() => {}} />
            </ul>
          </section>

          <section>
            <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3 font-bold">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => onCreate('folder')}
                className="flex flex-col items-center justify-center gap-1.5 p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-all group"
              >
                <FolderPlus className="w-4 h-4 text-zinc-500 group-hover:text-blue-400" />
                <span className="text-[10px] text-zinc-400">Folder</span>
              </button>
              <button 
                onClick={() => onCreate('file')}
                className="flex flex-col items-center justify-center gap-1.5 p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-all group"
              >
                <FilePlus className="w-4 h-4 text-zinc-500 group-hover:text-blue-400" />
                <span className="text-[10px] text-zinc-400">File</span>
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3 font-bold">System Status</h3>
            <div className="bg-zinc-900 rounded-xl p-3 border border-zinc-800 shadow-sm">
              <div className="flex justify-between text-[10px] mb-2">
                <span className="text-zinc-500 uppercase tracking-tighter">Disk Usage</span>
                <span className="text-zinc-200 font-mono">64%</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[64%] shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              </div>
            </div>
          </section>
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-zinc-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
           <Settings className="w-4 h-4 text-zinc-500" />
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-semibold text-zinc-200 truncate">Admin Console</p>
          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tight">Root Access</p>
        </div>
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full px-3 py-2 text-xs font-medium rounded-lg transition-all",
      active 
        ? "bg-blue-600/10 text-blue-400 font-semibold" 
        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
    )}
  >
    {icon}
    {label}
  </button>
);
