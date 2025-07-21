import { useState } from 'react';
import { useGameData } from '../../hooks/useGameData';
import { STREAMERS } from '../../data/streamers';
import { Folder, Video, FileText, Image, Search, ArrowLeft } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'video' | 'document' | 'image';
  size?: string;
  dateModified: string;
  thumbnail?: string;
  clipId?: string;
}

export const FileExplorerApp = () => {
  const { gameState } = useGameData();
  const { clips, posts } = gameState;
  const [currentPath, setCurrentPath] = useState<string[]>(['My Computer']);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [onSelectCallback, setOnSelectCallback] = useState<((file: FileItem) => void) | null>(null);

  // Generate file structure based on game data
  const generateFiles = (): FileItem[] => {
    const currentFolder = currentPath[currentPath.length - 1];
    
    if (currentFolder === 'My Computer') {
      return [
        {
          id: 'videos',
          name: 'Videos',
          type: 'folder',
          dateModified: new Date().toLocaleDateString()
        },
        {
          id: 'documents',
          name: 'Documents',
          type: 'folder',
          dateModified: new Date().toLocaleDateString()
        }
      ];
    }
    
    if (currentFolder === 'Videos') {
      const videoFiles: FileItem[] = [];
      
      // Add raw clips
      clips.forEach((clip, index) => {
        const streamer = STREAMERS.find(s => s.id === clip.streamerId);
        videoFiles.push({
          id: `clip_${clip.id}`,
          name: `${streamer?.displayName || 'Unknown'} Clip ${index + 1}.mp4`,
          type: 'video',
          size: `${Math.floor(Math.random() * 100 + 50)}MB`,
          dateModified: new Date(clip.timestamp).toLocaleDateString(),
          thumbnail: streamer?.avatar,
          clipId: clip.id
        });
      });
      
      // Add edited/posted videos
      posts.forEach((post, index) => {
        const clip = clips.find(c => c.id === post.clipId);
        const streamer = STREAMERS.find(s => s.id === clip?.streamerId);
        videoFiles.push({
          id: `edited_${post.id}`,
          name: `${streamer?.displayName || 'Unknown'} Edited ${index + 1}.mp4`,
          type: 'video',
          size: `${Math.floor(Math.random() * 80 + 30)}MB`,
          dateModified: new Date(post.timestamp).toLocaleDateString(),
          thumbnail: streamer?.avatar,
          clipId: clip?.id
        });
      });
      
      return videoFiles;
    }
    
    if (currentFolder === 'Documents') {
      return [
        {
          id: 'readme',
          name: 'Clip It Tycoon Guide.txt',
          type: 'document',
          size: '2KB',
          dateModified: new Date().toLocaleDateString()
        }
      ];
    }
    
    return [];
  };

  const handleNavigate = (folderName: string) => {
    setCurrentPath(prev => [...prev, folderName]);
  };

  const handleBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(prev => prev.slice(0, -1));
    }
  };

  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file);
    if (onSelectCallback && file.type === 'video') {
      onSelectCallback(file);
    }
  };

  const files = generateFiles();

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'folder':
        return <Folder className="w-8 h-8 text-blue-400" />;
      case 'video':
        return <Video className="w-8 h-8 text-red-400" />;
      case 'document':
        return <FileText className="w-8 h-8 text-green-400" />;
      case 'image':
        return <Image className="w-8 h-8 text-purple-400" />;
      default:
        return <FileText className="w-8 h-8 text-muted-foreground" />;
    }
  };

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Toolbar */}
      <div className="p-3 border-b border-border bg-muted/20">
        <div className="flex items-center space-x-3 mb-3">
          <button 
            onClick={handleBack}
            disabled={currentPath.length <= 1}
            className="p-1 hover:bg-muted rounded disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-1 text-sm">
            {currentPath.map((path, index) => (
              <span key={index} className="flex items-center">
                {index > 0 && <span className="mx-1">/</span>}
                <span className={index === currentPath.length - 1 ? 'font-medium' : 'text-muted-foreground'}>
                  {path}
                </span>
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search files..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 p-4">
        {files.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">This folder is empty</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create some clips to see them here!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                onClick={() => file.type === 'folder' ? handleNavigate(file.name) : handleFileSelect(file)}
                className={`
                  flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all
                  hover:bg-muted/50 
                  ${selectedFile?.id === file.id ? 'bg-primary/20 border border-primary/30' : ''}
                `}
              >
                {/* File Icon/Thumbnail */}
                <div className="relative">
                  {file.thumbnail ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                      <img 
                        src={file.thumbnail} 
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Video className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{file.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Modified: {file.dateModified}</span>
                    {file.size && <span>Size: {file.size}</span>}
                  </div>
                </div>

                {/* File Type Badge */}
                <div className="text-xs px-2 py-1 bg-muted rounded-full">
                  {file.type.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="p-2 border-t border-border bg-muted/20 text-xs text-muted-foreground">
        {files.length} item{files.length !== 1 ? 's' : ''} 
        {selectedFile && ` • Selected: ${selectedFile.name}`}
      </div>
    </div>
  );

  // Expose method for CapCut to use
  (window as any).openFileExplorer = (callback: (file: FileItem) => void) => {
    setOnSelectCallback(() => callback);
  };
};