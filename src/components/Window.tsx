import { ReactNode } from 'react';
import { Minus, X } from 'lucide-react';

interface WindowProps {
  id: string;
  title: string;
  icon: ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  children: ReactNode;
  width?: number;
  height?: number;
}

export const Window = ({ 
  id, 
  title, 
  icon, 
  isOpen, 
  isMinimized, 
  zIndex, 
  onClose, 
  onMinimize, 
  onFocus,
  children,
  width = 800,
  height = 600
}: WindowProps) => {
  if (!isOpen) return null;

  return (
    <div
      className={`
        fixed bg-card border border-border rounded-lg shadow-2xl
        ${isMinimized ? 'hidden' : 'block'}
      `}
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: Math.min(width, window.innerWidth - 40),
        height: Math.min(height, window.innerHeight - 40),
        zIndex: zIndex,
        maxWidth: '95vw',
        maxHeight: '95vh'
      }}
      onClick={onFocus}
    >
      {/* Title Bar */}
      <div className="flex items-center justify-between bg-gradient-to-r from-primary/80 to-primary-glow/80 text-primary-foreground px-3 py-2 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4">
            {icon}
          </div>
          <span className="font-medium text-sm">{title}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="w-6 h-6 bg-yellow-500 hover:bg-yellow-600 rounded-sm flex items-center justify-center transition-colors"
          >
            <Minus className="w-3 h-3 text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-6 h-6 bg-red-500 hover:bg-red-600 rounded-sm flex items-center justify-center transition-colors"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="h-full bg-background rounded-b-lg overflow-hidden">
        <div className="h-full overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};