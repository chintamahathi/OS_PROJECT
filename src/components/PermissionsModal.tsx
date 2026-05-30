import React from 'react';
import { FileNode, Permissions } from '../types';
import { X, Shield, Lock, Eye, Edit2, Play } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  node: FileNode;
  onUpdate: (id: string, perms: Permissions) => void;
  onClose: () => void;
}

export const PermissionsModal: React.FC<Props> = ({ node, onUpdate, onClose }) => {
  const togglePerm = (key: keyof Permissions) => {
    onUpdate(node.id, {
      ...node.permissions,
      [key]: !node.permissions[key]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-950 w-full max-w-md rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/10 text-blue-400 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-100">File Permissions</h3>
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{node.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-full transition-colors">
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        <div className="p-8 space-y-3">
          <PermToggle 
            icon={<Eye className="w-4 h-4" />}
            label="Read Access"
            description="View contents and metadata"
            active={node.permissions.read}
            onClick={() => togglePerm('read')}
          />
          <PermToggle 
            icon={<Edit2 className="w-4 h-4" />}
            label="Write Access"
            description="Modify, rename, or delete"
            active={node.permissions.write}
            onClick={() => togglePerm('write')}
          />
          <PermToggle 
            icon={<Play className="w-4 h-4" />}
            label="Execute Access"
            description="Run as system process"
            active={node.permissions.execute}
            onClick={() => togglePerm('execute')}
          />
        </div>

        <div className="p-6 bg-zinc-900/50 border-t border-zinc-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-2.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-blue-500 shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

const PermToggle = ({ icon, label, description, active, onClick }: { icon: React.ReactNode, label: string, description: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left group",
      active 
        ? "border-blue-500/50 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.05)]" 
        : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700"
    )}
  >
    <div className="flex items-center gap-4">
      <div className={cn(
        "p-2 rounded-lg transition-colors",
        active ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-500 group-hover:text-zinc-300"
      )}>
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-zinc-200">{label}</h4>
        <p className="text-[11px] text-zinc-500 leading-tight pr-4">{description}</p>
      </div>
    </div>
    <div className={cn(
      "w-8 h-4 rounded-full relative transition-colors p-0.5",
      active ? "bg-blue-600" : "bg-zinc-800"
    )}>
      <div className={cn(
        "bg-white w-3 h-3 rounded-full transition-transform shadow-sm",
        active ? "translate-x-4" : "translate-x-0"
      )} />
    </div>
  </button>
);
