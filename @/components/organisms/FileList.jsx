import React from 'react';
import { AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import FileCard from '@/components/molecules/FileCard';
import FileListItem from '@/components/molecules/FileListItem';

const FileList = ({ filteredFiles, viewMode, error, searchTerm, onPreviewFile, onDeleteFile, formatFileSize, loading }) => {
    if (error) {
        return (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
        );
    }

    if (filteredFiles.length === 0 && !loading) {
        return (
            <div className="text-center py-12">
                <ApperIcon name="FileX" size={48} className="mx-auto text-surface-400 mb-4" />
                <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">
                    {searchTerm ? 'No files found' : 'No files uploaded yet'}
                </h3>
                <p className="text-surface-500 dark:text-surface-400">
                    {searchTerm ? 'Try adjusting your search terms' : 'Upload your first file to get started'}
                </p>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <div className={`${
                viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                    : 'space-y-2'
            }`}>
                <AnimatePresence>
                    {filteredFiles.map((file) => (
                        viewMode === 'grid' ? (
                            <FileCard 
                                key={file.id}
                                file={file} 
                                onClick={onPreviewFile} 
                                formatFileSize={formatFileSize} 
                            />
                        ) : (
                            <FileListItem 
                                key={file.id}
                                file={file} 
                                onClick={onPreviewFile} 
                                onDelete={onDeleteFile}
                                formatFileSize={formatFileSize}
                            />
                        )
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FileList;