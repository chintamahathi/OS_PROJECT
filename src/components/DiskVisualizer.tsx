import React from 'react';
import { DiskBlock, FileNode } from '../types';
import { cn } from '../lib/utils';
import { Database } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  blocks: DiskBlock[];
  nodes: Record<string, FileNode>;
  onBlockClick: (fileId: string) => void;
}

export const DiskVisualizer: React.FC<Props> = ({ blocks, nodes, onBlockClick }) => {
  const getFileColor = (fileId: string | null) => {
    if (!fileId) return 'bg-zinc-800/50';
    const colors = [
      'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 
      'bg-amber-500', 'bg-rose-500', 'bg-cyan-500',
      'bg-indigo-500', 'bg-orange-500'
    ];
    const index = fileId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Disk Allocation Simulation
        </h3>
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-tighter text-zinc-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-zinc-800 rounded-sm" />
            <span>Free</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-sm" />
            <span>Allocated</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto scrollbar-hide">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(10px,1fr))] gap-1 p-0.5">
          {blocks.map((block) => {
            const fileName = block.fileId ? nodes[block.fileId]?.name : null;
            return (
              <motion.div
                key={block.id}
                layoutId={`block-${block.id}`}
                className={cn(
                  "aspect-square rounded-[1px] transition-all cursor-help relative group",
                  getFileColor(block.fileId)
                )}
                onClick={() => block.fileId && onBlockClick(block.fileId)}
                whileHover={{ scale: 1.8, zIndex: 10, borderRadius: '2px' }}
              >
                {block.fileId && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-950 text-white text-[9px] rounded border border-zinc-800 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20 shadow-2xl">
                    {fileName} (Block {block.id})
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-800 shrink-0">
        <div className="flex justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
          <span>Simulation Header</span>
          <span className="font-mono text-zinc-400">1024 Blocks Total</span>
        </div>
      </div>
    </div>
  );
};
