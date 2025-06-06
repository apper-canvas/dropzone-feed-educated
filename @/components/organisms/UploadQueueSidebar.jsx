import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import UploadQueueItem from '@/components/molecules/UploadQueueItem';

const UploadQueueSidebar = ({ uploadSessions, formatFileSize }) => {
    return (
        <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-card sticky top-24">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
                Upload Queue
            </h3>
            {uploadSessions.length === 0 ? (
                <div className="text-center py-8">
                    <ApperIcon name="Upload" size={32} className="mx-auto text-surface-400 mb-2" />
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                        No active uploads
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {uploadSessions.map((session) => (
                        <UploadQueueItem 
                            key={session.id} 
                            session={session} 
                            formatFileSize={formatFileSize} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default UploadQueueSidebar;