
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, trend, color = 'amber' }) => {
  return (
    <div className="glass p-6 rounded-3xl border border-slate-700 relative overflow-hidden group">
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${color}-500/10 rounded-full blur-2xl group-hover:bg-${color}-500/20 transition-all`} />
      
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wide">{label}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          {trend && (
            <p className="text-xs text-emerald-400 mt-2 flex items-center">
              <span>{trend}</span>
            </p>
          )}
        </div>
        <div className={`p-3 bg-${color}-500/20 text-${color}-500 rounded-2xl`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
