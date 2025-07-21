import { useState, useEffect } from 'react';
import { useGameData } from '../../hooks/useGameData';
import { useWindowManagerContext } from '../../contexts/WindowManagerContext';
import { generateClipTitle } from '../../data/streamers';
import { Edit, FolderOpen, Scissors, Sparkles, Volume2, Type, Play, Save } from 'lucide-react';

export const CapCutApp = () => {
  const { gameState, addClip, updateGameState } = useGameData();
  const { openWindow } = useWindowManagerContext();
  const { currentStreamer, currentClip } = gameState;
  
  const [selectedVideoFile, setSelectedVideoFile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMode, setEditingMode] = useState<'trim' | 'effects' | 'audio' | 'text' | null>(null);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);
  const [appliedEffects, setAppliedEffects] = useState<string[]>([]);
  const [audioLevel, setAudioLevel] = useState(50);
  const [textOverlays, setTextOverlays] = useState<Array<{id: string, text: string, position: number}>>([]);

  useEffect(() => {
    if (currentClip && !selectedVideoFile) {
      setSelectedVideoFile({
        id: currentClip.id,
        name: currentClip.title,
        duration: currentClip.duration
      });
      setIsEditing(true);
    }
  }, [currentClip]);

  const handleBrowseFiles = () => {
    openWindow('fileexplorer');
    
    // Listen for file selection from FileExplorer
    const handleFileSelection = (event: any) => {
      const file = event.detail;
      if (file && file.type === 'video') {
        setSelectedVideoFile(file);
        setIsEditing(true);
        // Close file explorer
        // Note: This would be handled by parent window manager
      }
    };
    
    window.addEventListener('fileSelected', handleFileSelection);
    return () => window.removeEventListener('fileSelected', handleFileSelection);
  };

  const handleFinishEditing = () => {
    if (selectedVideoFile && isEditing) {
      // Update the clip with editing info
      updateGameState(prev => ({
        ...prev,
        currentClip: prev.currentClip ? {
          ...prev.currentClip,
          title: `Edited: ${prev.currentClip.title}`,
          quality: 'high' as const
        } : null
      }));
      
      // Open TikTok
      openWindow('tiktok');
    }
  };

  const applyEffect = (effect: string) => {
    if (!appliedEffects.includes(effect)) {
      setAppliedEffects(prev => [...prev, effect]);
    }
  };

  const addTextOverlay = () => {
    const newText = {
      id: `text_${Date.now()}`,
      text: 'Your text here',
      position: Math.random() * 80 + 10
    };
    setTextOverlays(prev => [...prev, newText]);
  };

  if (!selectedVideoFile && !currentClip) {
    return (
      <div className="h-full bg-background">
        <div className="p-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Edit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-pink-400">CapCut</h1>
              <p className="text-sm text-muted-foreground">Professional video editing</p>
            </div>
          </div>

          <div className="card-gaming text-center">
            <div className="app-icon bg-gradient-to-r from-pink-500 to-pink-600 mx-auto mb-4">
              <Edit className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold mb-4">Get Started</h2>
            
            <div className="space-y-3">
              <button 
                onClick={handleBrowseFiles}
                className="w-full btn-gaming flex items-center justify-center space-x-2"
              >
                <FolderOpen className="w-5 h-5" />
                <span>Browse Videos</span>
              </button>
              
              <p className="text-sm text-muted-foreground">
                Or create a clip from Twitch first
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Edit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-pink-400">CapCut</h1>
              <p className="text-sm text-muted-foreground">
                Editing: {selectedVideoFile?.name || currentClip?.title}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setSelectedVideoFile(null)}
              className="btn-gaming text-sm"
            >
              New Project
            </button>
            <button 
              onClick={handleFinishEditing}
              className="btn-viral text-sm flex items-center space-x-1"
            >
              <Save className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Editing Interface */}
      <div className="flex-1 flex">
        {/* Video Preview */}
        <div className="flex-1 p-4">
          <div className="bg-black rounded-xl aspect-video mb-4 flex items-center justify-center relative overflow-hidden">
            {currentStreamer && (
              <img 
                src={currentStreamer.avatar} 
                alt={currentStreamer.displayName}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-2" />
                <p className="text-lg font-semibold">Video Preview</p>
                <p className="text-sm opacity-80">
                  Duration: {selectedVideoFile?.duration || currentClip?.duration || 30}s
                </p>
              </div>
            </div>
            
            {/* Text Overlays Preview */}
            {textOverlays.map((overlay) => (
              <div 
                key={overlay.id}
                className="absolute text-white font-bold text-lg"
                style={{
                  top: `${overlay.position}%`,
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}
              >
                {overlay.text}
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="card-gaming">
            <h3 className="font-semibold mb-3">Timeline</h3>
            <div className="space-y-3">
              {/* Trim Controls */}
              {editingMode === 'trim' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trim Start: {trimStart}%</label>
                  <input 
                    type="range" 
                    value={trimStart} 
                    onChange={(e) => setTrimStart(Number(e.target.value))}
                    max={trimEnd - 5}
                    className="w-full"
                  />
                  <label className="text-sm font-medium">Trim End: {trimEnd}%</label>
                  <input 
                    type="range" 
                    value={trimEnd} 
                    onChange={(e) => setTrimEnd(Number(e.target.value))}
                    min={trimStart + 5}
                    className="w-full"
                  />
                </div>
              )}

              {/* Audio Controls */}
              {editingMode === 'audio' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Audio Level: {audioLevel}%</label>
                  <input 
                    type="range" 
                    value={audioLevel} 
                    onChange={(e) => setAudioLevel(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex space-x-2">
                    <button className="btn-gaming text-sm">Add Music</button>
                    <button className="btn-gaming text-sm">Remove Audio</button>
                  </div>
                </div>
              )}

              {/* Video Timeline Bar */}
              <div className="relative w-full h-16 bg-muted rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded mx-2">
                    <div className="h-full flex items-center justify-center text-white text-xs font-medium">
                      Video Track
                    </div>
                  </div>
                </div>
                
                {/* Trim indicators */}
                <div 
                  className="absolute top-0 h-full w-1 bg-yellow-400"
                  style={{ left: `${trimStart}%` }}
                />
                <div 
                  className="absolute top-0 h-full w-1 bg-yellow-400"
                  style={{ left: `${trimEnd}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Editing Tools Sidebar */}
        <div className="w-80 border-l border-border bg-muted/20 p-4">
          <h3 className="font-semibold mb-4">Editing Tools</h3>
          
          <div className="space-y-3">
            {/* Trim Tool */}
            <button 
              onClick={() => setEditingMode(editingMode === 'trim' ? null : 'trim')}
              className={`w-full p-4 rounded-xl transition-all ${
                editingMode === 'trim' 
                  ? 'bg-primary/20 border-primary/30 border' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Scissors className="w-6 h-6 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Trim</p>
                  <p className="text-sm text-muted-foreground">Cut video length</p>
                </div>
              </div>
            </button>

            {/* Effects Tool */}
            <button 
              onClick={() => setEditingMode(editingMode === 'effects' ? null : 'effects')}
              className={`w-full p-4 rounded-xl transition-all ${
                editingMode === 'effects' 
                  ? 'bg-primary/20 border-primary/30 border' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <div className="text-left">
                  <p className="font-medium">Effects</p>
                  <p className="text-sm text-muted-foreground">Add visual effects</p>
                </div>
              </div>
            </button>

            {/* Effects Panel */}
            {editingMode === 'effects' && (
              <div className="ml-4 space-y-2">
                {['Blur', 'Slow Motion', 'Speed Up', 'Color Filter'].map((effect) => (
                  <button 
                    key={effect}
                    onClick={() => applyEffect(effect)}
                    className={`w-full p-2 text-sm rounded-lg transition-all ${
                      appliedEffects.includes(effect)
                        ? 'bg-success/20 text-success'
                        : 'bg-background hover:bg-muted'
                    }`}
                  >
                    {effect} {appliedEffects.includes(effect) ? '✓' : ''}
                  </button>
                ))}
              </div>
            )}

            {/* Audio Tool */}
            <button 
              onClick={() => setEditingMode(editingMode === 'audio' ? null : 'audio')}
              className={`w-full p-4 rounded-xl transition-all ${
                editingMode === 'audio' 
                  ? 'bg-primary/20 border-primary/30 border' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Volume2 className="w-6 h-6 text-green-400" />
                <div className="text-left">
                  <p className="font-medium">Audio</p>
                  <p className="text-sm text-muted-foreground">Edit sound</p>
                </div>
              </div>
            </button>

            {/* Text Tool */}
            <button 
              onClick={() => setEditingMode(editingMode === 'text' ? null : 'text')}
              className={`w-full p-4 rounded-xl transition-all ${
                editingMode === 'text' 
                  ? 'bg-primary/20 border-primary/30 border' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Type className="w-6 h-6 text-yellow-400" />
                <div className="text-left">
                  <p className="font-medium">Text</p>
                  <p className="text-sm text-muted-foreground">Add captions</p>
                </div>
              </div>
            </button>

            {/* Text Panel */}
            {editingMode === 'text' && (
              <div className="ml-4 space-y-2">
                <button 
                  onClick={addTextOverlay}
                  className="w-full p-2 bg-primary/20 text-primary rounded-lg text-sm"
                >
                  + Add Text
                </button>
                {textOverlays.map((overlay) => (
                  <div key={overlay.id} className="p-2 bg-background rounded text-sm">
                    <input 
                      type="text" 
                      value={overlay.text}
                      onChange={(e) => setTextOverlays(prev => 
                        prev.map(t => t.id === overlay.id ? {...t, text: e.target.value} : t)
                      )}
                      className="w-full p-1 bg-muted rounded text-xs"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Applied Effects Summary */}
          {appliedEffects.length > 0 && (
            <div className="mt-6 p-3 bg-success/10 border border-success/30 rounded-lg">
              <h4 className="font-medium text-success mb-2">Applied Effects:</h4>
              <div className="space-y-1">
                {appliedEffects.map((effect, index) => (
                  <div key={index} className="text-sm text-success">• {effect}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};