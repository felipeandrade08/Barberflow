
import React from 'react';
import { Scissors } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 32 }) => {
  return (
    <div className={`flex items-center justify-center relative ${className}`}>
      <div className="relative">
        {/* Decorative circle backdrop */}
        <div 
          className="absolute inset-0 bg-amber-500/20 rounded-full blur-lg" 
          style={{ width: size * 1.5, height: size * 1.5, left: -size * 0.25, top: -size * 0.25 }}
        />
        
        {/* Main Icon */}
        <div className="relative z-10 flex items-center justify-center bg-slate-900 border border-amber-500/30 p-2 rounded-xl shadow-xl">
          <Scissors size={size} className="text-amber-500 transform -rotate-45" strokeWidth={1.5} />
          
          {/* Accent elements */}
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default Logo;
