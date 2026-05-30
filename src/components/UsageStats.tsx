import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FileNode } from '../types';

interface Props {
  nodes: Record<string, FileNode>;
  totalBlocks: number;
}

export const UsageStats: React.FC<Props> = ({ nodes, totalBlocks }) => {
  const fileNodes = (Object.values(nodes) as FileNode[]).filter(n => n.type === 'file');
  const usedBlocks = fileNodes.reduce((acc, n) => acc + n.size, 0);
  const freeBlocks = totalBlocks - usedBlocks;

  const data = [
    { name: 'Allocated', value: usedBlocks, color: '#2563eb' },
    { name: 'Available', value: freeBlocks, color: '#27272a' }
  ];
  
  const typeDistribution = fileNodes.reduce((acc: Record<string, number>, node) => {
    const ext = node.name.split('.').pop() || 'unknown';
    acc[ext] = (acc[ext] || 0) + node.size;
    return acc;
  }, {});

  const distributionData = Object.entries(typeDistribution).map(([name, value]) => ({
    name: name.toUpperCase(),
    value
  }));

  const COLORS = ['#2563eb', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="grid grid-cols-2 gap-6 h-full items-center">
      <div className="h-full flex flex-col">
        <h4 className="text-[10px] font-bold uppercase text-zinc-500 mb-4 tracking-widest">Storage Map</h4>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={45}
                outerRadius={60}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', borderRadius: '8px', border: '1px solid #27272a', fontSize: '10px' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="h-full flex flex-col">
        <h4 className="text-[10px] font-bold uppercase text-zinc-500 mb-4 tracking-widest">Data Distribution</h4>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                stroke="none"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ backgroundColor: '#09090b', borderRadius: '8px', border: '1px solid #27272a', fontSize: '10px' }}
                 itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
