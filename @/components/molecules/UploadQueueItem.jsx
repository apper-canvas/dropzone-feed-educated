import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const UploadQueueItem = ({ session, formatFileSize }) => {
    return (
        <div className="p-3 bg-surface-50 dark:bg-surface-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-surface-900 dark:text-white">
                    Session {session.id?.slice(-6)}
                </span>
                <span className="text-xs text-surface-500 dark:text-surface-400">
                    {session.files?.length || 0} files
                </span>
            </div>
            <div className="w-full bg-surface-200 dark:bg-surface-600 rounded-full h-2 mb-2">
                <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ 
                        width: `${((session.completedSize || 0) / (session.totalSize || 1)) * 100}%` 
                    }}
                />
            </div>
            <p className="text-xs text-surface-500 dark:text-surface-400">
                {formatFileSize(session.completedSize || 0)} / {formatFileSize(session.totalSize || 0)}
            </p>
        </div>
    );
};

export default UploadQueueItem;