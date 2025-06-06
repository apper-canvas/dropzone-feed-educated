import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { fileService } from '@/services';
import AppHeader from '@/components/organisms/AppHeader';
import UploadZone from '@/components/organisms/UploadZone';
import UploadStats from '@/components/organisms/UploadStats';
import FileList from '@/components/organisms/FileList';
import UploadQueueSidebar from '@/components/organisms/UploadQueueSidebar';
import FilePreviewModal from '@/components/organisms/FilePreviewModal';

function HomePage({ darkMode, setDarkMode }) {
  const [files, setFiles] = useState([]);
  const [uploadSessions, setUploadSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const loadFiles = async () => {
      setLoading(true);
      try {
        const result = await fileService.getAll();
        setFiles(result || []);
      } catch (err) {
        setError(err.message);
        toast.error('Failed to load files');
      } finally {
        setLoading(false);
      }
    };
    loadFiles();
  }, []);

  const filteredFiles = files.filter(file => 
    file?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || ''
  );

  const handleDeleteFile = useCallback(async (fileId) => {
    try {
      await fileService.delete(fileId);
      setFiles(prev => prev.filter(f => f.id !== fileId));
      toast.success('File deleted successfully');
      setShowPreview(false);
    } catch (err) {
      toast.error('Failed to delete file');
    }
  }, []);

  const handlePreviewFile = useCallback((file) => {
    setSelectedFile(file);
    setShowPreview(true);
  }, []);

  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const createParticles = useCallback((element) => {
    const rect = element.getBoundingClientRect();
    const particles = [];
    
    for (let i = 0; i < 10; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle'; // Ensure this CSS class is defined in your global CSS
      particle.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 100}px`;
      particle.style.top = `${rect.top + rect.height / 2 + (Math.random() - 0.5) * 100}px`;
      document.body.appendChild(particle);
      particles.push(particle);
      
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 2000);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-surface-600 dark:text-surface-300">Loading files...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      <AppHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <UploadZone
              setFiles={setFiles}
              setUploadSessions={setUploadSessions}
              files={files} 
              uploadSessions={uploadSessions}
              createParticles={createParticles}
            />
            <UploadStats files={files} />
            <FileList
              filteredFiles={filteredFiles}
              viewMode={viewMode}
              error={error}
              searchTerm={searchTerm}
              onPreviewFile={handlePreviewFile}
              onDeleteFile={handleDeleteFile}
              formatFileSize={formatFileSize}
              loading={loading}
            />
          </div>

          <div className="lg:col-span-1">
            <UploadQueueSidebar
              uploadSessions={uploadSessions}
              formatFileSize={formatFileSize}
            />
          </div>
        </div>
      </main>

      <FilePreviewModal
        selectedFile={selectedFile}
        showPreview={showPreview}
        onClose={() => setShowPreview(false)}
        onDeleteFile={handleDeleteFile}
        formatFileSize={formatFileSize}
      />
    </div>
  );
}

export default HomePage;